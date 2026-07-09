import { Metadata } from "next";
import Image from "next/image";
import {
  Sparkles, Target, Users, Heart, Shield, Zap,
  BookOpen, RefreshCw, CheckCircle, Award,
  GraduationCap, Briefcase, Globe, Rocket, Lightbulb,
  TrendingUp, Code, Mail
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InContentAd } from "@/components/ads/AdBanner";
import { OrganizationSchema, BreadcrumbSchema, PersonSchema, FAQSchema } from "@/components/seo/SchemaMarkup";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/data/config";
import { siteAuthor } from "@/data/authors";

export const metadata: Metadata = generatePageMetadata({
  title: 'About Syed Bilal Shah — Founder of DevelopersMatrix',
  description: 'Meet Syed Bilal Shah, founder of DevelopersMatrix and co-founder of OviTech Global. Read his journey from intern to entrepreneur, and learn the mission behind making AI tools free for everyone.',
  path: '/about',
});

const aboutFaqs = [
  {
    question: "Who founded DevelopersMatrix?",
    answer: "DevelopersMatrix was founded by Syed Bilal Shah, a full-stack developer with 7+ years of experience across web development, SEO, and digital marketing. He is also the co-founder of OviTech Global, a software company with 20+ team members serving clients worldwide."
  },
  {
    question: "Are the tools on DevelopersMatrix really free?",
    answer: "Yes, all core features of every tool are completely free with no signup required. No credit cards, no trial periods, no usage limits. The platform was built specifically because Bilal saw how expensive subscriptions lock out freelancers, students, and small businesses from professional tools."
  },
  {
    question: "What is OviTech Global?",
    answer: "OviTech Global is a software and digital solutions company co-founded by Syed Bilal Shah in 2023. With a team of 20+ professionals including developers, designers, SEO specialists, and digital marketers, OviTech helps businesses build modern websites, improve online visibility, and generate sustainable organic traffic."
  },
  {
    question: "Is my data private when using DevelopersMatrix tools?",
    answer: "Yes. Most tools operate entirely client-side in your browser. Resume data, budget information, email drafts, and audit targets are never transmitted to our servers. We do not store, sell, or share your personal information. For tools that require server processing, data is handled temporarily and never retained."
  }
];

// Timeline milestones from the journey
const milestones = [
  {
    year: "2018",
    title: "The Beginning",
    description: "Started career as a web developer intern while completing a Diploma in Software Engineering. Learned the basics and embraced every challenge as an opportunity.",
    icon: <Code className="w-5 h-5" />
  },
  {
    year: "2018–2023",
    title: "Building Experience",
    description: "Worked with three software companies, expanded skills to WordPress, Shopify, Magento, and modern frameworks. Worked with local and international clients across industries.",
    icon: <Briefcase className="w-5 h-5" />
  },
  {
    year: "2018–2023",
    title: "Freelancing & Experimenting",
    description: "Started freelancing with global clients. Launched Leather Craftly — a leather products brand that ultimately failed but became the greatest learning experience. Became obsessed with SEO and digital marketing.",
    icon: <Lightbulb className="w-5 h-5" />
  },
  {
    year: "2023",
    title: "OviTech Global",
    description: "Co-founded OviTech Global with a business partner. Started with a small team and a clear vision. Today, the company has grown to 20+ professionals serving clients worldwide.",
    icon: <Rocket className="w-5 h-5" />
  },
  {
    year: "2024",
    title: "DevelopersMatrix",
    description: "Built DevelopersMatrix to give developers, freelancers, students, and business owners access to powerful AI tools without expensive paywalls. A platform born from real-world experience.",
    icon: <Globe className="w-5 h-5" />
  }
];

export default function AboutPage() {
  return (
    <>
      <OrganizationSchema
        name={siteConfig.name}
        url={siteConfig.url}
        description={siteConfig.description}
        logo={siteConfig.ogImage}
        founder={siteAuthor.name}
        employees="20+"
        knowsAbout={siteAuthor.knowsAbout}
        sameAs={[
          siteConfig.links.facebook,
          siteConfig.links.instagram,
          siteConfig.links.pinterest
        ]}
      />
      <PersonSchema
        name={siteAuthor.name}
        url={`${siteConfig.url}/about`}
        image={`${siteConfig.url}${siteAuthor.image}`}
        jobTitle={siteAuthor.jobTitle}
        worksFor={siteConfig.name}
        description={siteAuthor.bio}
        knowsAbout={siteAuthor.knowsAbout}
        sameAs={siteAuthor.sameAs}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "About", url: `${siteConfig.url}/about` }
        ]}
      />
      <FAQSchema faqs={aboutFaqs} />

      {/* Hero Section — Founder Spotlight */}
      <section className="hero-gradient py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Photo Grid */}
            <div className="w-full lg:w-2/5">
              <div className="relative">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <Image
                      src="/images/about/bilal-1.jpg"
                      alt="Syed Bilal Shah — Founder of DevelopersMatrix"
                      width={600}
                      height={400}
                      className="w-full h-64 object-cover rounded-2xl shadow-lg"
                      priority
                    />
                  </div>
                  <Image
                    src="/images/about/bilal-2.jpg"
                    alt="Syed Bilal Shah"
                    width={300}
                    height={200}
                    className="w-full h-40 object-cover rounded-xl shadow-md"
                  />
                  <Image
                    src="/images/about/bilal-3.jpg"
                    alt="Syed Bilal Shah"
                    width={300}
                    height={200}
                    className="w-full h-40 object-cover rounded-xl shadow-md"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 shadow-lg border border-gray-100 dark:border-gray-700">
                  <p className="text-2xl font-bold gradient-text">7+</p>
                  <p className="text-xs text-muted-foreground">Years Experience</p>
                </div>
              </div>
            </div>

            {/* Founder Info */}
            <div className="w-full lg:w-3/5 text-center lg:text-left">
              <Badge className="mb-4 px-4 py-2 border-violet-500/30 bg-violet-500/10">
                <Sparkles className="w-3.5 h-3.5 mr-2 text-violet-500" />
                <span className="text-violet-600 dark:text-violet-400">Founder &amp; Lead Developer</span>
              </Badge>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                Syed Bilal <span className="gradient-text">Shah</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-6 max-w-xl">
                Founder of <strong>DevelopersMatrix</strong> and co-founder of <strong>OviTech Global</strong>.
                A developer who believes essential tools should never be locked behind paywalls.
              </p>

              {/* Credentials */}
              <div className="flex flex-wrap gap-2 mb-6 justify-center lg:justify-start">
                {siteAuthor.credentials.map((cred, i) => (
                  <span key={i} className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-500/20">
                    <GraduationCap className="w-3 h-3" />
                    {cred}
                  </span>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <a
                  href="https://www.linkedin.com/in/thedeveloperbilal/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0077b5] text-white text-sm font-medium hover:bg-[#006396] transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </a>
                <a
                  href="https://github.com/TheDeveloperBilal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.235-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.233 1.911 1.233 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  GitHub
                </a>
                <a
                  href="https://x.com/Developer_Bilal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  X / Twitter
                </a>
                <a
                  href="https://www.behance.net/thedeveloperbilal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1769ff] text-white text-sm font-medium hover:bg-[#0057e7] transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 1.905.982 2.576 2.436 2.576 1.215 0 1.88-.504 2.202-1.25h2.747zm-7.127-3.5h4.468c-.093-1.233-.774-1.832-1.88-1.832-1.146 0-1.908.625-2.588 1.832zM9.135 17.09c1.138 0 2.04-.388 2.653-1.07v.84h2.89v-7.546c0-2.403-1.668-3.84-4.687-3.84-2.797 0-4.77 1.378-4.91 3.613h2.75c.13-.746.746-1.17 1.748-1.17 1.074 0 1.73.478 1.73 1.34v.616l-2.558.16c-2.688.17-4.12 1.32-4.12 3.22 0 1.92 1.37 3.037 3.504 3.037zm.71-2.264c-.883 0-1.418-.445-1.418-1.13 0-.72.517-1.112 1.608-1.216l1.69-.134v.84c0 .924-.802 1.64-1.88 1.64zM2 20h5.65v-2.266H4.706v-3.065H7.33v-2.264H4.706V9.34H7.65V7.075H2V20z"/></svg>
                  Portfolio
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* My Journey Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-4 py-2 border-violet-500/30 bg-violet-500/10">
              <BookOpen className="w-3.5 h-3.5 mr-2 text-violet-500" />
              <span className="text-violet-600 dark:text-violet-400">My Journey</span>
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">From Intern to Entrepreneur</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              This is the real story of how DevelopersMatrix came to be — told without the polished startup narrative.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/50 via-violet-500/20 to-transparent hidden sm:block" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative flex flex-col sm:flex-row gap-6 sm:gap-8">
                  {/* Timeline dot */}
                  <div className="hidden sm:flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-lg shrink-0">
                      {milestone.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="sm:hidden w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm">
                        {milestone.icon}
                      </span>
                      <Badge variant="outline" className="text-xs font-mono">{milestone.year}</Badge>
                      <h3 className="text-lg font-semibold">{milestone.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <InContentAd />

      {/* The Full Story */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-4 py-2 border-violet-500/30 bg-violet-500/10">
              <Heart className="w-3.5 h-3.5 mr-2 text-violet-500" />
              <span className="text-violet-600 dark:text-violet-400">The Full Story</span>
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Why I Built DevelopersMatrix</h2>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed text-lg">
              I started my career in 2018 while I was still completing my Diploma in Software Engineering. During that time, I joined my first internship as a web developer. Like many beginners, I knew the basics, but I had a lot to learn. Every project introduced me to something new, and every challenge became an opportunity to improve.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              As I gained experience, I moved into frontend development and began working with modern web technologies. Over the next few years, I expanded my skill set by learning WordPress, Shopify, Magento, and several frontend frameworks. I worked on everything from small business websites to large ecommerce stores, constantly pushing myself to understand not just how to build websites, but how to build products that solved real business problems.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              Between 2018 and 2023, I worked with three different software companies. Each company gave me a different perspective on development, teamwork, project management, and client communication. I had the opportunity to work with local businesses as well as international clients from different industries. Those experiences taught me that writing code is only one part of building successful digital products. Understanding users, solving business problems, and delivering measurable results are equally important.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              Outside my full-time job, I was always experimenting. I started freelancing and worked with clients from around the world. Every freelance project challenged me to become more independent. I learned how to communicate with clients, manage deadlines, understand business requirements, and deliver quality work without relying on a large team.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              Like many entrepreneurs, I also wanted to build something of my own. One of my earliest ventures was a leather products brand called <strong>Leather Craftly</strong>. I invested a lot of time and energy into the business, but it eventually failed. Looking back, the failure wasn't because the products were bad. It was because I lacked experience in branding, digital marketing, customer acquisition, and business operations.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              Although the business didn't succeed, it became one of my greatest learning experiences. Instead of giving up, I became obsessed with learning digital marketing and search engine optimization.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              I launched my own content website and decided to handle everything myself. I wrote the articles, designed the website, optimized every page for SEO, built internal links, improved page speed, and continuously learned from Google Search Console and Analytics. For a while, the website performed exceptionally well and attracted consistent organic traffic. Eventually, the traffic declined. The biggest lesson I learned was that <strong>SEO is never a one-time task</strong>. Search engines evolve constantly. User behavior changes. Competitors improve their content. What works today may not work next year.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              In 2023, I took the biggest step of my career. Together with my business partner, I co-founded <strong>OviTech Global</strong>, a software and digital solutions company. We started with a small team, limited resources, and a clear vision to help businesses grow through technology. The journey was far from easy. We worked long hours, solved complex client challenges, and continuously improved our processes. Today, OviTech Global has grown into a team of more than 20 talented professionals.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              Working closely with clients gave me another important realization. Many businesses spend thousands of dollars on websites but struggle to generate traffic because they don't have access to professional SEO tools or actionable insights. Almost every platform had the same limitation — the free version only showed basic information. The features that actually solved problems were locked behind expensive subscriptions.
            </p>

            <div className="my-8 p-6 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border border-violet-200 dark:border-violet-800/50">
              <p className="text-lg font-semibold text-violet-900 dark:text-violet-300 mb-2">
                "Why should essential tools only be available to people who can afford expensive monthly plans?"
              </p>
              <p className="text-sm text-violet-700 dark:text-violet-400">
                That question became the foundation of DevelopersMatrix.
              </p>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              I wanted to create a platform that gives developers, freelancers, students, job seekers, entrepreneurs, marketers, and business owners access to powerful tools without unnecessary paywalls. DevelopersMatrix is more than a collection of AI tools. It is a platform built from years of real-world experience, countless client projects, failed experiments, successful businesses, and continuous learning.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              Every tool on the platform is designed to solve a practical problem. Whether it's auditing a website, generating a professional resume, creating an effective cover letter, improving content quality, discovering AI prompts, or exploring the latest technology trends — my goal is simple: build tools that are genuinely useful, accessible, and free for everyone.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              I also believe that knowledge should be shared openly. That is why DevelopersMatrix includes educational guides, industry research, technical tutorials, comparison articles, and trend analysis alongside its tools. My goal is not just to provide software but to help people understand how to use technology to grow their careers, businesses, and ideas.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              This journey has taught me one important lesson: <strong>there is no shortcut to success</strong>. Every failed project, every difficult client, every Google algorithm update, every late night debugging session, and every business challenge has contributed to where I am today.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              DevelopersMatrix is the result of that journey, and this is only the beginning. I am committed to continuously improving the platform, building better tools, publishing more valuable content, and helping millions of people solve real problems through technology.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              If DevelopersMatrix helps you save time, learn something new, improve your website, land your dream job, or grow your business, then every step of this journey has been worth it.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Drives DevelopersMatrix</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide every decision we make
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-violet-500/10 group-hover:bg-violet-500/20 transition-colors">
                    <Heart className="w-5 h-5 text-violet-500" />
                  </div>
                  Accessibility First
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Professional tools shouldn't require a credit card. Every feature that matters is free, 
                  because we believe talent and ambition shouldn't be limited by budget.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                    <Shield className="w-5 h-5 text-green-500" />
                  </div>
                  Privacy by Design
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your data is yours. Most tools run entirely in your browser. No tracking, no selling, 
                  no storing. We couldn't read your data even if we wanted to.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                    <Zap className="w-5 h-5 text-blue-500" />
                  </div>
                  Real-World Utility
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Every tool solves a problem we've actually faced. No vanity features, no bloat. 
          If it doesn't help someone get hired, optimize their site, or grow their business, we don't build it.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <InContentAd />

      {/* Impact Stats */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Impact in Numbers</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 rounded-2xl bg-card border border-border/50">
              <p className="text-4xl font-bold gradient-text">14</p>
              <p className="text-muted-foreground mt-2">Free AI Tools</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border/50">
              <p className="text-4xl font-bold gradient-text">$0</p>
              <p className="text-muted-foreground mt-2">Forever Free</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border/50">
              <p className="text-4xl font-bold gradient-text">20+</p>
              <p className="text-muted-foreground mt-2">Team at OviTech</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border/50">
              <p className="text-4xl font-bold gradient-text">7+</p>
              <p className="text-muted-foreground mt-2">Years Building</p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Profiles */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Follow DevelopersMatrix</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            We post 3 times a week across our social channels with the latest tools, trends, and insights.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://www.facebook.com/developersmatrix/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1877F2] text-white font-medium hover:bg-[#166fe5] transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </a>
            <a
              href="https://www.instagram.com/developermatrix/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-medium hover:opacity-90 transition-opacity"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              Instagram
            </a>
            <a
              href="https://www.pinterest.com/developersmatrix/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E60023] text-white font-medium hover:bg-[#cc0000] transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg>
              Pinterest
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Try the Tools?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            No signup. No credit card. Just tools built from real experience, designed to solve real problems.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/tools">
              <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
                Explore All Tools
              </Button>
            </a>
            <a href="mailto:sy.bilalshah@gmail.com">
              <Button variant="outline" className="inline-flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Get in Touch
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
