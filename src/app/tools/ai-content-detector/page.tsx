import { Metadata } from 'next';
import { siteConfig } from '@/data/config';
import { WebApplicationSchema, BreadcrumbSchema, FAQSchema } from '@/components/seo/SchemaMarkup';
import AIContentDetectorClient from './AIContentDetectorClient';

export const metadata: Metadata = {
  title: 'AI Content Detector for SEO & Professional Writing | Free Tool',
  description: 'Detect AI-generated content with our free AI Content Detector. Analyze text for SEO issues, keyword stuffing, EEAT signals, and writing quality. Get real, accurate scores for blog content, academic writing, resumes, and more.',
  keywords: [
    'AI content detector',
    'AI detector',
    'ChatGPT detector',
    'AI content checker',
    'SEO AI detector',
    'human vs AI content',
    'AI text analyzer',
    'content authenticity checker',
    'AI writing detector',
    'GPT detector',
    'AI generated content checker',
    'plagiarism detector',
    'content quality analyzer',
  ],
  alternates: {
    canonical: `${siteConfig.url}/tools/ai-content-detector`,
  },
  openGraph: {
    title: 'AI Content Detector for SEO & Professional Writing',
    description: 'Detect AI-generated content with our free AI Content Detector. Analyze text for SEO issues, keyword stuffing, EEAT signals, and writing quality.',
    url: `${siteConfig.url}/tools/ai-content-detector`,
    siteName: siteConfig.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Content Detector for SEO & Professional Writing',
    description: 'Detect AI-generated content with real analysis. Check perplexity, burstiness, vocabulary diversity, and SEO issues.',
  },
};

const faqs = [
  {
    question: 'How does the AI Content Detector work?',
    answer: 'Our AI Content Detector uses multiple NLP analysis techniques including perplexity scoring, burstiness analysis, vocabulary diversity measurement, and sentence structure consistency checks. These methods identify patterns typical of AI-generated text without using external APIs, ensuring your content remains private.',
  },
  {
    question: 'Is the AI detection accurate?',
    answer: 'Our detector provides real analysis based on linguistic patterns and statistical metrics. While no AI detector is 100% accurate, our multi-factor approach including perplexity, burstiness, and vocabulary analysis provides reliable results with confidence scores to help you understand the reliability of each analysis.',
  },
  {
    question: 'What types of content can I analyze?',
    answer: 'You can analyze various content types including blog posts, SEO articles, academic writing, resumes/CVs, cover letters, sales copy, and emails. Each mode uses context-specific scoring optimized for that content type.',
  },
  {
    question: 'Is my content stored or shared?',
    answer: 'No, your content is never stored or shared. All analysis happens in real-time and no data is retained on our servers. Your privacy is our priority.',
  },
  {
    question: 'What are SEO-specific detections?',
    answer: 'Our tool detects SEO issues including keyword stuffing, thin content, robotic writing patterns, low EEAT (Experience, Expertise, Authoritativeness, Trustworthiness) signals, generic AI phrasing, and unnatural optimization patterns.',
  },
  {
    question: 'How long should my text be for accurate analysis?',
    answer: 'For best results, we recommend at least 50 characters. Longer texts (300+ words) provide more accurate analysis as the statistical patterns become more apparent. Our tool supports up to 50,000 characters.',
  },
];

export default function AIContentDetectorPage() {
  return (
    <>
      <WebApplicationSchema
        name="AI Content Detector"
        description="Detect AI-generated content with real analysis for perplexity, burstiness, vocabulary diversity, and SEO issues."
        url={`${siteConfig.url}/tools/ai-content-detector`}
        applicationCategory="UtilityApplication"
        operatingSystem="Web"
        offers={{ price: "0", priceCurrency: "USD" }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "AI Content Detector", url: `${siteConfig.url}/tools/ai-content-detector` }
        ]}
      />
      <FAQSchema faqs={faqs} />

      <main className="pt-16">
        <AIContentDetectorClient />
        
        {/* FAQ Section */}
        <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div 
                  key={i}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">
                    {faq.question}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
