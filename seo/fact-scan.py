import json,re,os,sys

STAT = re.compile(r'(?<![\w$])(?:\d{1,3}(?:\.\d+)?\s?(?:%|percent)\b|\$\s?\d[\d,]*(?:\.\d+)?\s?(?:billion|million|trillion|B|M|K)\b|\d+(?:\.\d+)?x\s+(?:higher|more|faster|better|greater|increase)|\b\d{1,3}(?:\.\d+)?\s?(?:percent)\b)')
# named research orgs commonly cited
ORGS = r'(IBM|Gartner|Forrester|McKinsey|Verizon|Deloitte|PwC|Accenture|Statista|Grand View|MarketsandMarkets|Nucleus|Salesforce|Upwork|CrowdStrike|SlashNext|KnowBe4|Census Bureau|Stack Overflow|GitHub|Pew|Nielsen|HubSpot|Ahrefs|Semrush|Moz|Google|Microsoft|OpenAI|Anthropic|IDC|Bain|BCG|EY|KPMG|WEF|World Economic Forum|LinkedIn|Indeed|Glassdoor|Levels\.fyi|Verified Market|Precedence|Fortune Business|Mordor)'
NAMED = re.compile(ORGS, re.I)
LINK  = re.compile(r'\]\((https?://[^)]+)\)')
FAKESRC = re.compile(r'Source:[^\n]*?(aggregate|directional|estimate|estimated|community report|practitioner|internal analysis|industry observation|composite|illustrative|approximation|rather than precise)', re.I)
YEARREF = re.compile(r'\b(20(1\d|2[0-4]))\b\s*(DBIR|report|survey|study|index|research)', re.I)
YEARREF2= re.compile(r'(Report|Survey|Study|Index|DBIR)\s*,?\s*\b(20(1\d|2[0-4]))\b', re.I)

def analyse(name, text, url=None):
    ext=[u for u in LINK.findall(text) if 'developersmatrix' not in u]
    stats=STAT.findall(text)
    # stats that sit in a sentence with no link and no named org
    orphan=[]
    for m in STAT.finditer(text):
        s=max(0,m.start()-260); e=min(len(text),m.end()+160)
        w=text[s:e]
        if not LINK.search(w) and not NAMED.search(w):
            sent=re.split(r'(?<=[.!?])\s',text[max(0,m.start()-200):m.end()+120])
            frag=next((x for x in sent if m.group(0) in x), w)
            orphan.append(frag.strip()[:175])
    fake=[m.group(0)[:150] for m in FAKESRC.finditer(text)]
    stale=sorted({(m.group(0)).strip() for m in YEARREF.finditer(text)} | {(m.group(0)).strip() for m in YEARREF2.finditer(text)})
    named_unlinked = len(NAMED.findall(text))>0 and len(ext)==0
    score = len(orphan)*2 + len(fake)*8 + len(stale)*3 + (4 if named_unlinked else 0)
    return dict(name=name,url=url,words=len(text.split()),stats=len(stats),ext=len(ext),
                orphan=orphan,fake=fake,stale=stale,named_unlinked=named_unlinked,score=score)

rows=[]
for f,base in [('src/data/high-quality-blogs.json','/blog/'),('src/data/generated-blogs.json','/blog/')]:
    for p in json.load(open(f,encoding='utf-8')):
        rows.append(analyse(p['slug'], p.get('content',''), base+p['slug']))

ts=open('src/data/trends-data.ts',encoding='utf-8').read()
for m in re.finditer(r"slug:\s*'([a-z0-9-]+)'", ts):
    slug=m.group(1); s=m.end(); e=ts.find("slug: '", s)
    rows.append(analyse(slug, ts[s: e if e>0 else min(len(ts), s+60000)], '/trends/'+slug))

rows.sort(key=lambda r:-r['score'])
json.dump(rows,open('/tmp/claude-0/-home-claude/410b5072-91cb-563c-ab47-dc8ad787619d/scratchpad/scan.json','w'),indent=1)
print(f"{'SCORE':>5}  {'STATS':>5} {'LINKS':>5}  {'ORPH':>4} {'FAKE':>4} {'STALE':>5}  PAGE")
for r in rows[:30]:
    print(f"{r['score']:>5}  {r['stats']:>5} {r['ext']:>5}  {len(r['orphan']):>4} {len(r['fake']):>4} {len(r['stale']):>5}  {r['url']}")
print()
print("total pages scanned:",len(rows))
print("pages with score >= 20:",sum(1 for r in rows if r['score']>=20))
print("pages with zero external sources but numeric claims:",sum(1 for r in rows if r['ext']==0 and r['stats']>=5))
