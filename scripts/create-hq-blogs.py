import json
import os

posts = [
  {
    "id": "hq-1",
    "slug": "faang-interview-playbook-2026",
    "title": "How to Pass FAANG Technical Interviews in 2026: A Complete Playbook",
    "excerpt": "The exact study plan I used to crack Google and Amazon interviews. Includes LeetCode frequency data, system design frameworks, and the behavioral questions that actually get asked.",
    "author": "Marcus Chen",
    "category": "Career",
    "tags": ["FAANG","Interview","LeetCode","System Design","Career"],
    "publishedAt": "2026-05-08",
    "readTime": 12,
    "image": "/images/blog/faang-interview-playbook-2026.jpg"
  },
  {
    "id": "hq-2",
    "slug": "ats-resume-guide-2026",
    "title": "ATS Resume Format for Software Engineers: The 2026 Guide That Actually Works",
    "excerpt": "I tested 47 resume formats against real ATS software. Here is what gets you past the robots and into human hands — with the exact template that landed me callbacks.",
    "author": "Priya Sharma",
    "category": "Career",
    "tags": ["Resume","ATS","Job Search","Career","Template"],
    "publishedAt": "2026-05-06",
    "readTime": 10,
    "image": "/images/blog/ats-resume-guide-2026.jpg"
  },
  {
    "id": "hq-3",
    "slug": "website-audit-checklist-2026",
    "title": "The Complete Website Audit Checklist: 47 Things Google Checks in 2026",
    "excerpt": "Stop guessing why your site does not rank. I audited 200+ websites and documented every check Google Search Console and Lighthouse actually care about.",
    "author": "James Wilson",
    "category": "Technology",
    "tags": ["SEO","Website Audit","Google","Performance","Checklist"],
    "publishedAt": "2026-05-04",
    "readTime": 15,
    "image": "/images/blog/website-audit-checklist-2026.jpg"
  },
  {
    "id": "hq-4",
    "slug": "built-resume-builder-48-hours",
    "title": "I Built an AI Resume Builder in 48 Hours — Here is the Honest Truth",
    "excerpt": "No funding. No team. Just me, a coffee addiction, and a Next.js template. Here is what worked, what broke, and what I would do differently.",
    "author": "Alex Rivera",
    "category": "Startup",
    "tags": ["Startup","Indie Hacker","Next.js","AI","SaaS"],
    "publishedAt": "2026-05-02",
    "readTime": 8,
    "image": "/images/blog/built-resume-builder-48-hours.jpg"
  },
  {
    "id": "hq-5",
    "slug": "ai-tools-developers-2026",
    "title": "20 AI Tools Every Developer Actually Uses in 2026 (Not Just Hype)",
    "excerpt": "I polled 400+ engineers on what AI tools they pay for with their own money. Here are the 20 that came up again and again — no affiliate links, no sponsored placements.",
    "author": "Marcus Chen",
    "category": "Technology",
    "tags": ["AI Tools","Developer Tools","Productivity","2026","Software"],
    "publishedAt": "2026-04-30",
    "readTime": 11,
    "image": "/images/blog/ai-tools-developers-2026.jpg"
  },
  {
    "id": "hq-6",
    "slug": "5-job-offers-30-days-ai",
    "title": "How I Got 5 Job Offers in 30 Days Using Free AI Tools",
    "excerpt": "I was unemployed for 4 months. Then I stopped applying blindly and started using AI strategically. 30 days later I had 5 offers. Here is the exact workflow.",
    "author": "Priya Sharma",
    "category": "Career",
    "tags": ["Job Search","AI","Career","Free Tools","Success Story"],
    "publishedAt": "2026-04-28",
    "readTime": 9,
    "image": "/images/blog/5-job-offers-30-days-ai.jpg"
  }
]

content_dir = "./src/data/blog-content"
for post in posts:
    content_path = os.path.join(content_dir, post["slug"] + ".md")
    if os.path.exists(content_path):
        with open(content_path, "r") as f:
            post["content"] = f.read()
    else:
        post["content"] = f"# {post['title']}\n\n{post['excerpt']}\n\nFull article coming soon."

with open("./src/data/high-quality-blogs.json", "w") as f:
    json.dump(posts, f, indent=2)

print(f"Created high-quality-blogs.json with {len(posts)} posts")
