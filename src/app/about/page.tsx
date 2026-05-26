import { Metadata } from "next";
import { Sparkles, Target, Users, Heart, Shield, Zap, CheckCircle, BookOpen, RefreshCw, Award, GraduationCap, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InContentAd } from "@/components/ads/AdBanner";
import { OrganizationSchema, BreadcrumbSchema, PersonSchema, FAQSchema } from "@/components/seo/SchemaMarkup";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/data/config";
import { siteAuthor } from "@/data/authors";

export const metadata: Metadata = generatePageMetadata({
  title: 'About DevelopersMatrix — Our Mission, Team & Editorial Standards',
  description: 'Meet Bilal Ahmad, founder of DevelopersMatrix. Learn about our mission to democratize AI tools, our editorial standards, fact-checking process, and privacy commitment.',
  path: '/about',
});

const aboutFaqs = [
  {
    question: "Who founded DevelopersMatrix?",
    answer: "DevelopersMatrix was founded by Syed Bilal Shah, a full-stack developer and AI tool builder with experience in Next.js, React, and modern web technologies. The platform was built to make professional-grade AI tools accessible to developers, entrepreneurs, and tech professionals regardless of budget."
  },
  {
    question: "Are the tools on DevelopersMatrix really free?",
    answer: "Yes, all core features of every tool are completely free with no signup required. No credit cards, no trial periods, no usage limits. Revenue comes from optional advertising and future premium features for power users — but the free tier will always remain fully functional."
  },
  {
    question: "How does DevelopersMatrix ensure content accuracy?",
    answer: "All technical articles and guides go through a four-step editorial process: (1) Research using primary sources and official documentation, (2) Drafting by writers with relevant domain expertise, (3) Technical review by subject matter experts, and (4) Quarterly updates to reflect new data and industry shifts. We do not accept payment for favorable coverage."
  },
  {
    question: "Is my data private when using DevelopersMatrix tools?",
    answer: "Yes. Most tools operate entirely client-side in your browser. Resume data, budget information, email drafts, and audit targets are never transmitted to our servers. We do not store, sell, or share your personal information. For tools that require server processing, data is handled temporarily and never retained."
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
        employees="5-10"
        knowsAbout={siteAuthor.knowsAbout}
        sameAs={[
          siteConfig.links.twitter,
          siteConfig.links.github,
          siteConfig.links.linkedin,
          siteConfig.links.facebook,
          siteConfig.links.instagram
        ]}
      />
      <PersonSchema
        name={siteAuthor.name}
        url={`${siteConfig.url}/about`}
        image={siteAuthor.image}
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

      {/* Hero Section */}
      <section className="hero-gradient py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 px-4 py-2 border-violet-500/30 bg-violet-500/10">
            <Sparkles className="w-3.5 h-3.5 mr-2 text-violet-500" />
            <span className="text-violet-600 dark:text-violet-400">Our Story</span>
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            About <span className="gradient-text">DevelopersMatrix</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're on a mission to empower developers, entrepreneurs, and tech professionals 
            with AI-powered tools and insights to optimize their careers and lives.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-muted-foreground mb-4">
                DevelopersMatrix was founded with a simple yet powerful vision: to create a daily destination 
                where tech professionals can access the tools, insights, and resources they need to thrive in 
                their careers and personal lives.
              </p>
              <p className="text-muted-foreground mb-4">
                In an industry that moves at breakneck speed, staying ahead requires more than just technical 
                skills. It requires career intelligence, productivity optimization, financial literacy, and 
                a community of peers who understand your journey.
              </p>
              <p className="text-muted-foreground">
                We believe that AI should augment human potential, not replace it. Every tool we build is 
                designed to save time, provide insights, and help you make better decisions—while keeping 
                you in control.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Target className="w-6 h-6" />, title: "Mission-Driven", desc: "Focused on real impact" },
                { icon: <Users className="w-6 h-6" />, title: "Community First", desc: "Built by developers, for developers" },
                { icon: <Shield className="w-6 h-6" />, title: "Privacy-Focused", desc: "Your data stays yours" },
                { icon: <Zap className="w-6 h-6" />, title: "AI-Powered", desc: "Leveraging cutting-edge AI" },
              ].map((item, index) => (
                <Card key={index} className="p-4">
                  <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-500 mb-3">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <InContentAd />

      {/* Founder / Team Section — Critical for EEAT */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-4 py-2 border-violet-500/30 bg-violet-500/10">
              <Award className="w-3.5 h-3.5 mr-2 text-violet-500" />
              <span className="text-violet-600 dark:text-violet-400">Meet the Team</span>
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Who Builds DevelopersMatrix</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real people with real expertise. Every tool and article is built or reviewed by practitioners working in the field.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="p-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                  SBS
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold">{siteAuthor.name}</h3>
                    <Badge variant="outline" className="text-xs">{siteAuthor.jobTitle}</Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{siteAuthor.bio}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {siteAuthor.credentials.map((cred, i) => (
                      <span key={i} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-violet-500/10 text-violet-700 dark:text-violet-400">
                        <GraduationCap className="w-3 h-3" />
                        {cred}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <a href="https://github.com/TheDeveloperBilal" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-violet-600 transition-colors flex items-center gap-2">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.235-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.233 1.911 1.233 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub
                    </a>
                    <a href="https://www.linkedin.com/in/thedeveloperbilal/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-violet-600 transition-colors flex items-center gap-2">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we build
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-violet-500/10">
                    <Sparkles className="w-5 h-5 text-violet-500" />
                  </div>
                  Innovation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We continuously explore new technologies and approaches to deliver cutting-edge solutions 
                  that make a real difference in our users' lives.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <Shield className="w-5 h-5 text-green-500" />
                  </div>
                  Trust
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Transparency and privacy are non-negotiable. We're committed to being clear about how 
                  our tools work and protecting your personal information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Heart className="w-5 h-5 text-blue-500" />
                  </div>
                  Community
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We believe in the power of shared knowledge. Our community-driven approach ensures 
                  that everyone can contribute and benefit.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Editorial Standards */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-4 py-2 border-violet-500/30 bg-violet-500/10">
              <BookOpen className="w-3.5 h-3.5 mr-2 text-violet-500" />
              <span className="text-violet-600 dark:text-violet-400">Our Standards</span>
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Editorial Standards</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every article, guide, and tool on DevelopersMatrix goes through a rigorous process before publication.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <CheckCircle className="w-5 h-5" />, title: "Fact Checked", desc: "All statistics, claims, and technical details are verified against primary sources before publication." },
              { icon: <RefreshCw className="w-5 h-5" />, title: "Regularly Updated", desc: "Content is reviewed and updated quarterly to reflect new data, tool releases, and industry shifts." },
              { icon: <Shield className="w-5 h-5" />, title: "Independent", desc: "We do not accept payment for favorable coverage. Tool reviews are based on hands-on testing." },
              { icon: <Users className="w-5 h-5" />, title: "Expert Reviewed", desc: "Technical articles are reviewed by practitioners working in the relevant field before publishing." },
            ].map((item, index) => (
              <Card key={index} className="p-4">
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-500 mb-3">
                  {item.icon}
                </div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <InContentAd />

      {/* Content Review Process */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How We Create Content</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Transparency in our process so you can trust what you read.
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              { step: "01", title: "Research & Analysis", desc: "We start with primary sources: official documentation, peer reviewed studies, industry reports, and hands on tool testing. No regurgitated press releases." },
              { step: "02", title: "Drafting", desc: "Writers with relevant domain expertise create the first draft, incorporating real world examples, current data, and practical guidance." },
              { step: "03", title: "Technical Review", desc: "A subject matter expert reviews the draft for accuracy, relevance, and completeness. Technical claims are verified against source material." },
              { step: "04", title: "Publication & Maintenance", desc: "After final editing, the content is published with clear publish and review dates. We revisit articles quarterly to update outdated information." },
            ].map((item, index) => (
              <div key={index} className="flex gap-4 p-4 rounded-xl border border-border/50 bg-card/50">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Impact in Numbers</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold gradient-text">14</p>
              <p className="text-muted-foreground mt-2">Free AI Tools</p>
            </div>
            <div>
              <p className="text-4xl font-bold gradient-text">$0</p>
              <p className="text-muted-foreground mt-2">Forever Free</p>
            </div>
            <div>
              <p className="text-4xl font-bold gradient-text">10+</p>
              <p className="text-muted-foreground mt-2">In-Depth Guides</p>
            </div>
            <div>
              <p className="text-4xl font-bold gradient-text">100%</p>
              <p className="text-muted-foreground mt-2">No Signup Needed</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-muted-foreground mb-8">
            Be part of a growing community of developers, entrepreneurs, and tech professionals 
            who are optimizing their careers and lives with DevelopersMatrix.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
              Get Started Free
            </Button>
            <Button variant="outline">Contact Us</Button>
          </div>
        </div>
      </section>
    </>
  );
}
