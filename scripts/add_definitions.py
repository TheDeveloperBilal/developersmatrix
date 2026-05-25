import os

# Definition blocks for each research page
DEFINITIONS = {
    'developer-salary-guide-2026': {
        'title': 'Key Compensation Terms Defined',
        'terms': [
            ('Total Compensation (TC)', 'The complete value of an employment offer including base salary, annual bonus, stock grants (RSUs or options), signing bonus, and benefits. For senior developers at public tech companies, TC often exceeds base salary by 40-80% due to equity. Always negotiate and evaluate offers based on TC, not base salary alone.'),
            ('Restricted Stock Unit (RSU)', 'A form of equity compensation where the employer grants shares that vest over time. At vesting, the shares are taxed as ordinary income. Most tech companies use 4-year vesting schedules with a 1-year cliff (no vesting in year 1, then quarterly or monthly vesting after).'),
            ('Sign-on Bonus', 'A one-time cash payment offered to new hires, typically $10,000-$50,000 for senior developers. Often negotiable and can offset unvested equity from a previous employer. Usually has a clawback provision requiring repayment if you leave within 12-24 months.'),
            ('Base Salary', 'The fixed annual cash component of compensation, paid in regular paychecks. In 2026, senior software engineer base salaries range from $130,000 in secondary markets to $220,000+ in San Francisco and Seattle. Base salary is the most predictable component of TC.'),
            ('Stock Refreshers', 'Additional equity grants given to existing employees, typically annually or at promotion. Refreshers extend the vesting timeline beyond the initial 4-year grant, preventing a "cliff" where total compensation drops sharply after year 4. Top performers at FAANG companies may receive refreshers worth 50-100% of their initial grant.')
        ]
    },
    'ats-resume-optimization-guide-2026': {
        'title': 'Key Resume and ATS Terms Defined',
        'terms': [
            ('Applicant Tracking System (ATS)', 'Software used by employers to collect, sort, scan, and rank job applications. Over 95% of Fortune 500 companies use ATS platforms (Workday, Greenhouse, Lever, Taleo). ATS parsers extract text from resumes and match it against job descriptions before a human ever sees the application.'),
            ('ATS Parsing', 'The process by which an ATS converts a resume into structured data fields (name, email, work experience, skills, education). Parsing accuracy varies significantly by file format and layout. Text-based .docx files achieve 98-99% parsing accuracy, while image-based PDFs and multi-column layouts drop to 40-60%.'),
            ('Keyword Matching', 'The primary screening mechanism in ATS systems. Recruiters configure keywords from the job description, and the ATS scores applications based on keyword frequency and placement. Exact keyword matches score higher than synonyms. Both acronyms and full terms should be included (e.g., "AWS" and "Amazon Web Services").'),
            ('Resume Parsing Failure', 'Occurs when an ATS cannot correctly extract text from a resume due to formatting issues. Common causes: tables, multi-column layouts, headers/footers, images, unusual fonts, and complex graphics. A parsing failure means your application may not appear in recruiter searches even if you are fully qualified.'),
            ('STAR Method', 'A structured format for describing accomplishments: Situation (context), Task (your responsibility), Action (what you did), Result (quantified outcome). The STAR method produces scannable bullet points that both ATS systems and human recruiters prefer. Example: "Improved API response time by 40% (Result) by implementing Redis caching (Action) for the checkout microservice (Task) during peak holiday traffic (Situation)."')
        ]
    },
    'developer-habits-productivity-guide-2026': {
        'title': 'Key Productivity Terms Defined',
        'terms': [
            ('Deep Work', 'A state of uninterrupted, cognitively demanding focus on a single task. Coined by Cal Newport, deep work produces higher-quality output in less time than fragmented multitasking. For developers, deep work typically requires 90-120 minute blocks with no meetings, notifications, or context switches.'),
            ('Ultradian Rhythm', 'A biological cycle of 90-120 minutes that governs human cognitive performance. Each cycle consists of a high-frequency brain activity period (alertness, problem-solving) followed by a recovery period. Scheduling deep work to align with ultradian rhythms improves output quality by 20-40%.'),
            ('Flow State', 'A mental state of complete immersion in a task where time perception distorts and output feels effortless. For developers, entering flow typically requires 10-15 minutes of warm-up. Flow states produce 2-5x more output than normal working conditions but are fragile — a single Slack notification can destroy accumulated flow.'),
            ('Context Switching Cost', 'The cognitive penalty paid when shifting attention between different tasks. Research by Gloria Mark found that knowledge workers take an average of 23 minutes to return to a task after an interruption. For developers, context switching is particularly costly because programming requires maintaining complex mental models of system state.'),
            ('Keystone Habit', 'A single habit that triggers positive ripple effects across multiple areas of life. For developers, common keystone habits include consistent sleep schedules, morning exercise, and protected deep work blocks. Research shows that establishing one keystone habit increases the probability of adopting additional positive habits by 35%.')
        ]
    },
    'developer-financial-planning-guide-2026': {
        'title': 'Key Financial Terms Defined',
        'terms': [
            ('Financial Independence (FI)', 'The state of having sufficient invested assets to cover living expenses indefinitely without requiring employment income. The standard benchmark is 25x annual expenses (4% rule). For a developer spending $60,000/year, FI requires approximately $1.5M invested at a 4% safe withdrawal rate.'),
            ('4% Rule', 'A guideline for sustainable retirement withdrawals stating that withdrawing 4% of a diversified portfolio annually (adjusted for inflation) has historically sustained 30-year retirements in 95% of historical scenarios. Based on the Trinity Study by Cooley, Hubbard, and Walz (1998).'),
            ('Mega Backdoor Roth', 'An advanced retirement strategy allowing after-tax 401k contributions beyond the standard $23,500 limit, up to a total of $70,000 (including employer match). These after-tax contributions can be converted to Roth, enabling up to $50,000+ in annual tax-free retirement savings. Requires employer plan support.'),
            ('Self-Employment Tax', 'The combined employer and employee portions of Social Security and Medicare taxes (15.3% on 92.35% of net earnings) paid by 1099 contractors and freelancers. W-2 employees pay only the employee portion (7.65%), with employers covering the other half. This is why 1099 income requires setting aside 25-30% for taxes.'),
            ('HSA (Health Savings Account)', 'A triple tax-advantaged account available to individuals with high-deductible health plans. Contributions are tax-deductible, growth is tax-free, and withdrawals for qualified medical expenses are tax-free. After age 65, non-medical withdrawals are taxed as ordinary income (like a Traditional 401k), making HSAs powerful stealth retirement accounts.')
        ]
    }
}

for page_id, config in DEFINITIONS.items():
    path = 'src/app/research/' + page_id + '/page.tsx'
    if not os.path.exists(path):
        print('SKIP: ' + path + ' does not exist')
        continue
    
    with open(path, 'r') as f:
        content = f.read()
    
    # Build definition block HTML
    terms_html = '\n'.join([
        '              <div>\n                <dt className="font-semibold text-gray-900 dark:text-white">' + term[0] + '</dt>\n                <dd className="text-gray-600 dark:text-gray-400 text-sm mt-1">\n                  ' + term[1] + '\n                </dd>\n              </div>'
        for term in config['terms']
    ])
    
    definition_block = '          {/* Key Definitions */}\n          <section className="mb-12 bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">\n            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">\n              ' + config['title'] + '\n            </h2>\n            <dl className="space-y-4">\n' + terms_html + '\n            </dl>\n          </section>\n\n          <InContentAd />'
    
    # Find the first <InContentAd /> after Sources section and insert before it
    sources_section = content.find('{/* Sources */}')
    if sources_section == -1:
        sources_section = content.find('{/* Sources and References */}')
    
    if sources_section != -1:
        # Find the next InContentAd after Sources
        next_ad = content.find('<InContentAd />', sources_section)
        if next_ad != -1:
            # Insert before this InContentAd
            content = content[:next_ad] + definition_block + '\n\n          ' + content[next_ad:]
            print('Inserted definitions before InContentAd in ' + page_id)
        else:
            # Find CTA section and insert before it
            cta = content.find('{/* CTA */}')
            if cta != -1:
                content = content[:cta] + definition_block + '\n\n          ' + content[cta:]
                print('Inserted definitions before CTA in ' + page_id)
            else:
                print('Could not find insertion point in ' + page_id)
                continue
    else:
        print('Could not find Sources section in ' + page_id)
        continue
    
    with open(path, 'w') as f:
        f.write(content)

print('Done!')
