# GA4 setup: 15 minutes, do this before the code goes live

Right now your GA property records your own laptop, your Vercel previews and
a large amount of traffic that is not human. Until that is fixed, every
number either of us looks at is wrong.

---

## 1. Exclude internal traffic (5 min)

**Admin > Data collection and modification > Data streams >** click your web
stream **> Configure tag settings > Show more > Define internal traffic**

Create a rule:
- Rule name: `Internal`
- traffic_type value: `internal`
- Match type: `IP address equals`
- Value: your home or office IP. Search "what is my ip" to get it.

Then **Admin > Data collection and modification > Data filters > Create filter**
- Filter name: `Exclude internal`
- Filter type: `Internal traffic`
- Filter state: **Testing** for one week, then switch to **Active**

Leave it on Testing first. Active filters are permanent and cannot be
reprocessed over old data.

## 2. Exclude your preview and dev domains (3 min)

Same screen: **Configure tag settings > List unwanted referrals**

Add, one per line:
```
localhost
vercel.app
developersmatrix.com
```

The third one stops your own internal navigation being counted as a referral.

GA already flagged `localhost:3000` in your acquisition data, so this is
confirmed, not theoretical.

## 3. Mark the key events (5 min)

The code now sends four events. They appear in GA within 24 hours of the
first real one firing.

**Admin > Data display > Events**, then toggle "Mark as key event" for:

| Event | Mark as key event | Why |
|---|---|---|
| `audit_completed` | **Yes** | Somebody used the product |
| `report_exported` | **Yes** | Strong intent, they kept the output |
| `tool_used` | **Yes** | Any tool, actually used |
| `audit_failed` | No | Diagnostic only. Watch the rate |

## 4. Register the custom dimensions (2 min)

Without this the event parameters arrive but you cannot report on them.

**Admin > Data display > Custom definitions > Create custom dimension**

| Dimension name | Scope | Event parameter |
|---|---|---|
| Target host | Event | `target_host` |
| Score bucket | Event | `score_bucket` |
| Duration bucket | Event | `duration_bucket` |
| Export format | Event | `format` |
| Tool | Event | `tool` |

---

## What you will be able to answer in a week

Things that are currently unanswerable:

- How many audits actually ran
- What people are auditing, by domain, so you learn who your audience is
- What scores they get, which tells you whether the tool is too harsh
- How many exported the report, which is the real intent signal
- Whether the audit API is failing, and how often

## One caution

`target_host` records the domain someone audited. That is business data, not
personal data, and it is the single most useful thing you will learn from
this. Full URLs are deliberately stripped to the hostname in the code before
anything is sent, because query strings can carry personal information and
GA must never receive it.
