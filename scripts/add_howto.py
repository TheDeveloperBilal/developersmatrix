import os
import re

# Tool configurations
TOOLS = {
    'productivity-planner': {
        'name': 'How to Use the Productivity Planner for Maximum Output',
        'description': 'Step-by-step guide to planning your day, prioritizing tasks, and tracking productivity using the DevelopersMatrix Productivity Planner.',
        'totalTime': 'PT10M',
        'tool': ['Web browser', 'Productivity Planner', 'Calendar'],
        'steps': [
            {'name': 'Start with a brain dump', 'text': 'Spend 2 minutes writing down every task, idea, and commitment on your mind. Do not organize yet — just capture everything. Research shows that uncompleted tasks occupy working memory, reducing cognitive capacity for actual work. Externalizing them frees mental resources.'},
            {'name': 'Identify your MIT', 'text': 'Select 1-3 Most Important Tasks (MITs) for the day. These are the tasks that, if completed, make the day a success regardless of what else happens. Criteria: moves a major project forward, has a deadline within 48 hours, or has been procrastinated for over a week. Write these at the top of your planner.'},
            {'name': 'Time-block your schedule', 'text': 'Assign specific time blocks to each MIT. Use 90-minute blocks for deep work tasks and 25-50 minute blocks for administrative tasks. Buffer 15-30 minutes between blocks for unexpected issues and transition time. Be realistic — most people underestimate task duration by 40%.'},
            {'name': 'Batch shallow work', 'text': 'Group all shallow tasks (email, Slack, quick calls, expense reports) into a single 60-90 minute block. Do not intersperse these throughout the day — each switch costs 5-15 minutes of recovery time. Process shallow work once or twice daily, not continuously.'},
            {'name': 'Review and adjust', 'text': 'At day end, spend 5 minutes reviewing what was completed, what was not, and why. Carry unfinished MITs to tomorrow with a specific plan for when they will be addressed. Track your completion rate over weeks — a rate below 60% means your plans are too ambitious; above 90% means you are not challenging yourself enough.'}
        ]
    },
    'startup-idea-generator': {
        'name': 'How to Generate and Validate Startup Ideas Using AI',
        'description': 'Step-by-step guide to using the DevelopersMatrix Startup Idea Generator to brainstorm, evaluate, and refine business ideas based on market trends and pain points.',
        'totalTime': 'PT15M',
        'tool': ['Web browser', 'Startup Idea Generator', 'Notebook'],
        'steps': [
            {'name': 'Select a problem domain', 'text': 'Choose an industry or pain point you have personal experience with — healthcare, education, fintech, SaaS, developer tools, e-commerce, or sustainability. Domain expertise is the single strongest predictor of startup success. Ideas generated outside your expertise require validating with experts, which slows momentum.'},
            {'name': 'Generate initial ideas', 'text': 'Use the Startup Idea Generator to produce 10-20 ideas in your selected domain. The tool combines market trend data, emerging technology capabilities, and known pain points to suggest opportunities. Do not evaluate yet — quantity first, quality second. Research on creativity shows that the best ideas often emerge after 15-20 mediocre ones.'},
            {'name': 'Screen for feasibility', 'text': 'Apply three quick filters to each idea: (1) Can you build an MVP in 3 months or less? (2) Does the target customer have budget and willingness to pay? (3) Is the market large enough to support a $1M+ annual revenue business within 3 years? Ideas that fail any filter are not necessarily bad — they may just be premature or require more resources than you currently have.'},
            {'name': 'Map the competitive landscape', 'text': 'For your top 3 ideas, research existing solutions. The presence of competitors is validation that a market exists. No competitors often means no market, not an undiscovered opportunity. Identify what incumbent solutions do poorly — pricing, UX, speed, customization, support. Your entry point is typically doing one thing 10x better, not doing everything differently.'},
            {'name': 'Validate with real customers', 'text': 'Before building, validate demand through customer discovery interviews. Target 10-15 conversations with potential users. Ask about their current workflow, pain points, and what they have already tried to solve the problem. If 3+ people offer to pay for a solution before it exists, you have strong validation. If nobody commits, the idea needs refinement or the problem is not painful enough.'}
        ]
    },
    'can-you-run-it': {
        'name': 'How to Check If Your PC Can Run Games and Software',
        'description': 'Step-by-step guide to using the Can You Run It tool to compare your system specifications against game and software requirements.',
        'totalTime': 'PT3M',
        'tool': ['Web browser', 'Can You Run It', 'System information'],
        'steps': [
            {'name': 'Detect your system specs automatically', 'text': 'The tool can automatically detect your CPU, GPU, RAM, and storage specifications using browser-based APIs. Allow the detection when prompted. If automatic detection fails, you can manually enter your specs from System Information (Windows) or About This Mac (macOS).' },
            {'name': 'Search for your target game or software', 'text': 'Enter the name of the game or application you want to run. The tool maintains a database of 5,000+ games and 1,000+ professional applications with official minimum and recommended requirements.'},
            {'name': 'Compare your specs against requirements', 'text': 'The tool compares each component (CPU, GPU, RAM, storage, OS) against both minimum and recommended requirements. Results show: Green (meets recommended), Yellow (meets minimum but not recommended), or Red (does not meet minimum). Pay attention to the weakest component — a system is only as strong as its bottleneck.'},
            {'name': 'Review performance predictions', 'text': 'Based on your specs and the game requirements, the tool estimates expected performance at different resolution and quality settings: 720p Low, 1080p Medium, 1440p High, and 4K Ultra. These estimates are based on benchmark data from thousands of real systems.'},
            {'name': 'Get upgrade recommendations', 'text': 'If your system falls below requirements, the tool suggests specific upgrade paths ranked by performance-per-dollar. Upgrades are categorized as: essential (must upgrade to run at all), recommended (upgrade for smooth gameplay), and optional (upgrade for maximum quality). Each recommendation includes estimated cost and compatible alternatives.'}
        ]
    },
    'link-manager': {
        'name': 'How to Organize and Manage Your Developer Links',
        'description': 'Step-by-step guide to using the Link Manager to organize bookmarks, resources, documentation, and references for developers.',
        'totalTime': 'PT5M',
        'tool': ['Web browser', 'Link Manager', 'Bookmarks'],
        'steps': [
            {'name': 'Import existing bookmarks', 'text': 'Export your browser bookmarks as an HTML file and import them into the Link Manager. The tool parses folders, titles, and URLs automatically. Alternatively, add links one by one using the quick-add feature. Start with your most frequently accessed 20-30 links.'},
            {'name': 'Create categories and tags', 'text': 'Organize links into categories: Documentation, Tutorials, Tools, APIs, GitHub Repos, Articles, Videos, and Personal. Add 2-3 descriptive tags to each link for cross-category filtering. A link can belong to one category but have multiple tags, enabling flexible retrieval.'},
            {'name': 'Add notes and descriptions', 'text': 'Write a 1-2 sentence description for each link explaining what it contains and when you last used it. This transforms a passive bookmark list into an active knowledge base. When you return to a link after 6 months, the description reminds you why you saved it and whether it is still relevant.'},
            {'name': 'Use search and filters', 'text': 'The search bar supports full-text search across titles, URLs, descriptions, and tags. Filters let you narrow by category, date added, or usage frequency. Use search when you know roughly what you need; use filters when browsing for inspiration or rediscovering forgotten resources.'},
            {'name': 'Export and share collections', 'text': 'Export any category or tag collection as a shareable link. This is useful for sharing resource lists with team members, publishing curated links on social media, or backing up your data. Collections update automatically when you add or remove links within the filtered view.'}
        ]
    }
}

for tool_id, config in TOOLS.items():
    path = f'src/app/tools/{tool_id}/page.tsx'
    if not os.path.exists(path):
        print(f'SKIP: {path} does not exist')
        continue
    
    with open(path, 'r') as f:
        content = f.read()
    
    # Add HowToSchema to imports
    if 'HowToSchema' not in content:
        content = content.replace(
            'import { FAQSchema, BreadcrumbSchema, SoftwareApplicationSchema } from "@/components/seo/SchemaMarkup";',
            'import { FAQSchema, BreadcrumbSchema, SoftwareApplicationSchema, HowToSchema } from "@/components/seo/SchemaMarkup";'
        )
    
    # Build HowToSchema component
    steps_str = ',\n          '.join([
        f"{{\n            name: \"{s['name']}\",\n            text: \"{s['text']}\"\n          }}" 
        for s in config['steps']
    ])
    
    howto = f'''      <HowToSchema
        name="{config['name']}"
        description="{config['description']}"
        url="{{`${{siteConfig.url}}/tools/{tool_id}`}}"
        totalTime="{config['totalTime']}"
        estimatedCost={{{{ currency: 'USD', value: '0' }}}}
        tool={{{config['tool']}}}
        step={{
          {steps_str}
        }}
      />'''
    
    # Insert after FAQSchema
    if 'HowToSchema' not in content or 'HowToSchema' not in content.split('FAQSchema')[1] if 'FAQSchema' in content else False:
        content = content.replace(
            '<FAQSchema faqs={toolFaqs} />',
            f'<FAQSchema faqs={{toolFaqs}} />\n\n      {howto}'
        )
        # Also try alternative pattern
        if 'HowToSchema' not in content:
            content = content.replace(
                '<FAQSchema faqs={toolFaqsForSchema} />',
                f'<FAQSchema faqs={{toolFaqsForSchema}} />\n\n      {howto}'
            )
    
    with open(path, 'w') as f:
        f.write(content)
    
    print(f'Updated {tool_id}')

print('Done!')
