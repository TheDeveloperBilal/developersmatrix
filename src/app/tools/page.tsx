import { generatePageMetadata, pageMetadata } from '@/lib/seo/metadata';
import { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata(pageMetadata.tools);
import { FileText, MessageSquare, CheckCircle } from "lucide-react";
import { ToolCard } from "@/components/shared/Cards";
import { InContentAd } from "@/components/ads/AdBanner";
import { WebApplicationSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { tools } from "@/data/tools";
import { siteConfig } from "@/data/config";

export default function ToolsPage() {
  const categories = [
    { id: 'career', name: 'Career', description: 'Resumes, cover letters, interview practice and pay data' },
    { id: 'seo', name: 'SEO and Web', description: 'Audit a website and check content before you publish' },
    { id: 'ai', name: 'AI and Writing', description: 'Ready prompts and help with work emails' },
    { id: 'productivity', name: 'Productivity', description: 'Habits, day plans and business ideas' },
    { id: 'finance', name: 'Finance', description: 'Plan your monthly budget and savings' },
    { id: 'gaming', name: 'Gaming', description: 'Check PC game requirements before you buy' },
  ];

  return (
    <>
      <WebApplicationSchema
        name="DevelopersMatrix Tools"
        description="Free browser tools for careers, websites, writing, planning and PC gaming"
        url={`${siteConfig.url}/tools`}
        applicationCategory="BusinessApplication"
        operatingSystem="Web"
        offers={{ price: "0", priceCurrency: "USD" }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` }
        ]}
      />

      {/* Hero Section */}
      <section className="hero-gradient py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            AI Powered <span className="gradient-text">Tools</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Free tools for your career, your website, your money and your day. Every tool runs in
            your browser and none of them asks you to sign up.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {categories.map((category) => {
            const categoryTools = tools.filter(tool => tool.category === category.id);
            if (categoryTools.length === 0) return null;

            return (
              <div key={category.id} id={category.id} className="mb-16 scroll-mt-24 last:mb-0">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
                  <p className="text-muted-foreground">{category.description}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {categoryTools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <InContentAd />

      {/* Features Section */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Use Our Tools?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every tool is designed with your success in mind
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-500">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="font-semibold mb-2">Free to Use</h3>
              <p className="text-sm text-muted-foreground">
                Every tool is free, with no trial period and no card details.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-500">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="font-semibold mb-2">Clear, Practical Results</h3>
              <p className="text-sm text-muted-foreground">
                Each tool explains what it found and what to do next, so you can act on it straight away.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-500">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="font-semibold mb-2">No Account Needed</h3>
              <p className="text-sm text-muted-foreground">
                Most tools save your work in your own browser, and none of them asks you to create an account.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
