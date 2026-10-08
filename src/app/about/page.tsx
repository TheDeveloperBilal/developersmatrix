import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import { InContentAd } from "@/components/ads/AdBanner";
import { BreadcrumbSchema, FAQSchema, PERSON_ID, ORG_ID, CONTACT_EMAIL, OVITECH, ORG_SAME_AS } from "@/components/seo/SchemaMarkup";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/data/config";
import { TOOLS_LABEL } from "@/lib/home-data";

export const metadata: Metadata = generatePageMetadata({
  title: 'About Syed Bilal Shah, Founder',
  description: 'Meet Syed Bilal Shah, founder of DevelopersMatrix and cofounder of OviTech Global. Read his journey from intern to entrepreneur, and learn the mission behind making AI tools free for everyone.',
  path: '/about',
});

// Shown on the page and sent as FAQPage schema, so the two always match.
const aboutFaqs = [
  {
    question: "Who founded DevelopersMatrix?",
    answer: "DevelopersMatrix was founded by Syed Bilal Shah, a full stack developer who started his career in 2018 and has worked across web development, SEO and digital marketing since then. He is also the cofounder of OviTech Global, a software and digital solutions company with more than 20 team members."
  },
  {
    question: "Are the tools on DevelopersMatrix really free?",
    answer: "Yes. The tools are free to use with no signup and no credit card. The site is supported by ads. It exists because Bilal kept seeing the useful features of professional tools locked behind expensive monthly plans."
  },
  {
    question: "What is OviTech Global?",
    answer: "OviTech Global is a software and digital solutions company that Syed Bilal Shah cofounded with a business partner in 2023. Its team of more than 20 professionals builds websites and helps businesses grow their online visibility. You can find it at ovitech.co."
  },
  {
    question: "Is my data private when using DevelopersMatrix tools?",
    answer: "Most tools run in your browser, so what you type into a resume, budget or day plan stays on your device. A few tools, such as the website audit and the content detector, send what you enter to our server so it can be processed. Like most free websites, DevelopersMatrix uses Google Analytics to understand which pages are useful and Google AdSense to pay for hosting, and both use cookies. The cookie policy lists everything that is used."
  }
];

const milestones = [
  {
    year: "2018",
    title: "The beginning",
    text: "Started my career as a web developer intern while completing a Diploma in Software Engineering. I knew the basics and treated every challenge as a chance to learn.",
  },
  {
    year: "2018 to 2023",
    title: "Building experience",
    text: "Worked with three software companies and grew from frontend work into WordPress, Shopify, Magento and modern frameworks, for local and international clients.",
  },
  {
    year: "2018 to today",
    title: "Freelancing",
    text: "Started freelancing for clients around the world alongside my job, and I still do. It taught me to work independently, manage deadlines and talk directly with clients.",
  },
  {
    year: "2023",
    title: "Leather Craftly",
    text: "Launched a leather products brand. It failed, but it became my biggest lesson and pushed me deep into SEO and digital marketing.",
  },
  {
    year: "2023",
    title: "OviTech Global",
    text: "Cofounded OviTech Global with a business partner. We started with a small team and a clear vision. Today it has more than 20 professionals serving clients worldwide.",
    link: OVITECH,
  },
  {
    year: "2024",
    title: "DevelopersMatrix",
    text: "Built DevelopersMatrix to give developers, freelancers, students and business owners useful tools without expensive paywalls.",
  },
];

const principles = [
  {
    title: "Accessibility first",
    text: "Professional tools should not require a credit card. The tools are free because talent and ambition should not be limited by budget.",
  },
  {
    title: "Privacy conscious",
    text: "Most tools run in your browser, so what you type into a resume, budget or plan stays on your device. A few tools, like the website audit, send what you enter to our server to do their job. The site uses Google Analytics and Google AdSense, which set cookies, and the cookie policy explains exactly what they do.",
    link: { href: "/cookies", label: "Read the cookie policy" },
  },
  {
    title: "Real world utility",
    text: "Every tool solves a problem I have actually faced. No vanity features and no bloat. If it does not help someone get hired, improve their site or grow their business, it does not get built.",
  },
];

const facts = [
  { value: "2018", label: "Started as a web developer intern" },
  { value: "2023", label: "Cofounded OviTech Global" },
  { value: "2024", label: "Launched DevelopersMatrix" },
  { value: TOOLS_LABEL, label: "Free tools on DevelopersMatrix" },
];

const profiles = [
  { name: "LinkedIn", href: "https://www.linkedin.com/in/thedeveloperbilal/" },
  { name: "GitHub", href: "https://github.com/TheDeveloperBilal" },
  { name: "X", href: "https://x.com/Developer_Bilal" },
  { name: "Portfolio", href: "https://www.behance.net/thedeveloperbilal" },
];

const brandProfiles = [
  { name: "Facebook", href: ORG_SAME_AS[0] },
  { name: "Instagram", href: ORG_SAME_AS[1] },
  { name: "Pinterest", href: ORG_SAME_AS[2] },
  { name: "LinkedIn", href: ORG_SAME_AS[3] },
];

// The Organization and Person entities are output once, site wide, in the root
// layout. This page only says that it is the profile page for that person.
const profilePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': `${siteConfig.url}/about#page`,
  url: `${siteConfig.url}/about`,
  name: 'About Syed Bilal Shah, Founder',
  mainEntity: { '@id': PERSON_ID },
  isPartOf: { '@type': 'WebSite', url: siteConfig.url, publisher: { '@id': ORG_ID } },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "About", url: `${siteConfig.url}/about` }
        ]}
      />
      <FAQSchema faqs={aboutFaqs} />

      <div className="pt-16">
        {/* Hero */}
        <section className="border-b border-ink-200 bg-ink-50 dark:border-ink-800 dark:bg-ink-950">
          <div className="shell grid items-center gap-10 py-12 lg:grid-cols-12 lg:gap-14 lg:py-20">
            <div className="lg:col-span-7">
              <nav aria-label="Breadcrumb" className="text-sm text-ink-500 dark:text-ink-400">
                <Link href="/" className="hover:text-ink-900 dark:hover:text-white">Home</Link>
                <span className="mx-2 text-ink-300 dark:text-ink-600">/</span>
                <span className="text-ink-700 dark:text-ink-300">About</span>
              </nav>
              <p className="mt-8 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-300">
                Founder of DevelopersMatrix
              </p>
              <h1 className="mt-3 font-sora text-4xl font-bold tracking-tight text-ink-950 dark:text-white sm:text-6xl">
                Syed Bilal Shah
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600 dark:text-ink-300 sm:text-xl">
                Founder of DevelopersMatrix and cofounder of{" "}
                <a href={OVITECH.url} target="_blank" rel="noopener" className="font-medium text-ink-950 underline decoration-brand-300 underline-offset-4 hover:decoration-brand-600 dark:text-white">
                  OviTech Global
                </a>
                . A developer who believes essential tools should never be locked behind paywalls.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-ink-950 px-5 text-sm font-semibold text-white transition hover:bg-ink-800 dark:bg-white dark:text-ink-950 dark:hover:bg-ink-100"
                >
                  <Mail className="h-4 w-4" /> {CONTACT_EMAIL}
                </a>
                <Link
                  href="/tools"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-ink-300 px-5 text-sm font-semibold text-ink-800 transition hover:border-ink-950 dark:border-ink-700 dark:text-ink-100 dark:hover:border-white"
                >
                  Explore the tools <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {profiles.map((p) => (
                  <li key={p.name}>
                    <a href={p.href} target="_blank" rel="noopener noreferrer me" className="inline-flex items-center gap-1 font-medium text-ink-600 hover:text-brand-700 dark:text-ink-300 dark:hover:text-brand-300">
                      {p.name} <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md">
                <div aria-hidden="true" className="absolute -inset-3 rounded-[2rem] border border-ink-200 dark:border-ink-800" />
                <Image
                  src="/images/about/bilal-1.jpg"
                  alt="Syed Bilal Shah, founder of DevelopersMatrix"
                  width={960}
                  height={1280}
                  priority
                  sizes="(min-width: 1024px) 420px, 90vw"
                  className="relative aspect-[4/5] w-full rounded-[1.6rem] object-cover"
                />
              </div>
            </div>
          </div>

          {/* Facts */}
          <div className="border-t border-ink-200 dark:border-ink-800">
            <dl className="shell grid grid-cols-2 lg:grid-cols-4">
              {facts.map((f, i) => (
                <div
                  key={f.label}
                  className={`py-6 pr-4 lg:py-8 ${i % 2 === 1 ? 'pl-4 lg:pl-8' : ''} ${i > 0 ? 'lg:border-l lg:border-ink-200 lg:pl-8 dark:lg:border-ink-800' : ''} ${i < 2 ? 'border-b border-ink-200 lg:border-b-0 dark:border-ink-800' : ''} ${i % 2 === 1 ? 'border-l border-ink-200 dark:border-ink-800' : ''}`}
                >
                  <dt className="sr-only">{f.label}</dt>
                  <dd className="font-sora text-2xl font-bold text-ink-950 dark:text-white sm:text-3xl">{f.value}</dd>
                  <dd className="mt-1 text-sm text-ink-500 dark:text-ink-400">{f.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Timeline */}
        <section className="bg-white py-16 dark:bg-ink-950 lg:py-24">
          <div className="shell grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <p className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-300">My journey</p>
                <h2 className="mt-3 font-sora text-3xl font-bold tracking-tight text-ink-950 dark:text-white sm:text-4xl">
                  From Intern to Entrepreneur
                </h2>
                <p className="mt-4 text-ink-600 dark:text-ink-300">
                  The real story of how DevelopersMatrix came to be, without the polished startup version.
                </p>
              </div>
            </div>
            <ol className="relative lg:col-span-8">
              <span aria-hidden="true" className="absolute bottom-2 left-[7px] top-2 w-px bg-ink-200 dark:bg-ink-800 sm:left-[9.5rem]" />
              {milestones.map((m) => (
                <li key={`${m.year}-${m.title}`} className="relative grid gap-1 pb-10 pl-8 last:pb-0 sm:grid-cols-[8rem_1fr] sm:gap-10 sm:pl-0">
                  <span aria-hidden="true" className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-brand-600 bg-white dark:bg-ink-950 sm:left-[calc(9.5rem-7px)]" />
                  <p className="font-mono text-sm font-medium text-ink-500 dark:text-ink-400 sm:pt-0.5 sm:text-right">{m.year}</p>
                  <div className="sm:pl-2">
                    <h3 className="font-sora text-lg font-semibold text-ink-950 dark:text-white">{m.title}</h3>
                    <p className="mt-1.5 leading-relaxed text-ink-600 dark:text-ink-300">{m.text}</p>
                    {m.link && (
                      <a href={m.link.url} target="_blank" rel="noopener" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline dark:text-brand-300">
                        Visit {m.link.name} <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <InContentAd />

        {/* Story */}
        <section className="border-y border-ink-200 bg-ink-50 py-16 dark:border-ink-800 dark:bg-ink-900/40 lg:py-24">
          <div className="shell">
            <div className="mx-auto max-w-[44rem]">
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-300">The full story</p>
              <h2 className="mt-3 font-sora text-3xl font-bold tracking-tight text-ink-950 dark:text-white sm:text-4xl">
                Why I Built DevelopersMatrix
              </h2>
              <div className="mt-8 space-y-6 text-[1.0625rem] leading-[1.8] text-ink-700 dark:text-ink-300">
                <p>
                  I started my career in 2018 while I was still completing my Diploma in Software Engineering. During that time, I joined my first internship as a web developer. Like many beginners, I knew the basics, but I had a lot to learn. Every project introduced me to something new, and every challenge became an opportunity to improve.
                </p>
                <p>
                  As I gained experience, I moved into frontend development and began working with modern web technologies. Over the next few years, I expanded my skill set by learning WordPress, Shopify, Magento and several frontend frameworks. I worked on everything from small business websites to large ecommerce stores, constantly pushing myself to understand not just how to build websites, but how to build products that solve real business problems.
                </p>
                <p>
                  Between 2018 and 2023, I worked with three different software companies. Each one gave me a different perspective on development, teamwork, project management and client communication. I worked with local businesses as well as international clients from different industries. Those years taught me that writing code is only one part of building successful digital products. Understanding users, solving business problems and delivering measurable results matter just as much.
                </p>
                <p>
                  Outside my full time job, I was always experimenting. I started freelancing and worked with clients from around the world, and I still freelance today. Every freelance project pushed me to become more independent. I learned how to communicate with clients, manage deadlines, understand business requirements and deliver quality work without relying on a large team.
                </p>
                <p>
                  Like many entrepreneurs, I also wanted to build something of my own. In 2023, I launched a leather products brand called Leather Craftly. I invested a lot of time and energy into the business, but it eventually failed. Looking back, the failure was not because the products were bad. It was because I lacked experience in branding, digital marketing, customer acquisition and business operations.
                </p>
                <p>
                  Although the business did not succeed, it became one of my greatest learning experiences. Instead of giving up, I became obsessed with learning digital marketing and search engine optimization.
                </p>

                <figure className="!my-10 grid grid-cols-2 gap-3">
                  <Image src="/images/about/bilal-2.jpg" alt="Syed Bilal Shah outdoors" width={960} height={1280} sizes="(min-width: 768px) 340px, 45vw" className="aspect-[3/4] w-full rounded-xl object-cover" />
                  <Image src="/images/about/bilal-3.jpg" alt="Syed Bilal Shah travelling" width={960} height={1280} sizes="(min-width: 768px) 340px, 45vw" className="aspect-[3/4] w-full rounded-xl object-cover" />
                </figure>

                <p>
                  I launched my own content website and decided to handle everything myself. I wrote the articles, designed the website, optimized every page for SEO, built internal links, improved page speed and kept learning from Google Search Console and Analytics. For a while, the website performed exceptionally well and attracted consistent organic traffic. Eventually, the traffic declined. The biggest lesson I learned was that SEO is never a one time task. Search engines evolve constantly. User behavior changes. Competitors improve their content. What works today may not work next year.
                </p>
                <p>
                  In 2023, I took the biggest step of my career. Together with my business partner, I cofounded{" "}
                  <a href={OVITECH.url} target="_blank" rel="noopener" className="font-medium text-ink-950 underline decoration-brand-300 underline-offset-4 hover:decoration-brand-600 dark:text-white">OviTech Global</a>
                  , a software and digital solutions company. We started with a small team, limited resources and a clear vision to help businesses grow through technology. The journey was far from easy. We worked long hours, solved complex client challenges and kept improving our processes. Today, OviTech Global has grown into a team of more than 20 talented professionals.
                </p>
                <p>
                  Working closely with clients gave me another important realization. Many businesses spend thousands of dollars on websites but struggle to generate traffic because they do not have access to professional SEO tools or actionable insights. Almost every platform had the same limitation. The free version only showed basic information. The features that actually solved problems were locked behind expensive subscriptions.
                </p>

                <blockquote className="!my-10 border-l-4 border-brand-600 pl-6 font-sora text-2xl font-semibold leading-snug text-ink-950 dark:text-white sm:text-[1.75rem]">
                  Why should essential tools only be available to people who can afford expensive monthly plans?
                </blockquote>

                <p>That question became the foundation of DevelopersMatrix.</p>
                <p>
                  I wanted to create a platform that gives developers, freelancers, students, job seekers, entrepreneurs, marketers and business owners access to powerful tools without unnecessary paywalls. DevelopersMatrix is more than a collection of AI tools. It is a platform built from years of real world experience, countless client projects, failed experiments, successful businesses and continuous learning.
                </p>
                <p>
                  Every tool on the platform is designed to solve a practical problem. Whether it is auditing a website, building a professional resume, writing an effective cover letter, improving content quality, discovering AI prompts or exploring the latest technology trends, my goal is simple: build tools that are useful, accessible and free for everyone.
                </p>
                <p>
                  I also believe knowledge should be shared openly. That is why DevelopersMatrix includes guides, research, tutorials, comparison articles and trend analysis alongside its tools. My goal is not just to provide software but to help people understand how to use technology to grow their careers, businesses and ideas.
                </p>
                <p>
                  This journey has taught me one important lesson: there is no shortcut to success. Every failed project, every difficult client, every Google algorithm update, every late night debugging session and every business challenge has contributed to where I am today.
                </p>
                <p>
                  DevelopersMatrix is the result of that journey, and this is only the beginning. I am committed to improving the platform, building better tools, publishing more valuable content and helping millions of people solve real problems through technology.
                </p>
                <p>
                  If DevelopersMatrix helps you save time, learn something new, improve your website, land your dream job or grow your business, then every step of this journey has been worth it.
                </p>
                <p className="font-sora text-lg font-semibold text-ink-950 dark:text-white">Syed Bilal Shah</p>
              </div>
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="bg-white py-16 dark:bg-ink-950 lg:py-24">
          <div className="shell">
            <div className="max-w-2xl">
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-300">Principles</p>
              <h2 className="mt-3 font-sora text-3xl font-bold tracking-tight text-ink-950 dark:text-white sm:text-4xl">
                What Drives DevelopersMatrix
              </h2>
              <p className="mt-4 text-ink-600 dark:text-ink-300">The principles behind every decision on the site.</p>
            </div>
            <ol className="mt-10 divide-y divide-ink-200 border-y border-ink-200 dark:divide-ink-800 dark:border-ink-800">
              {principles.map((p, i) => (
                <li key={p.title} className="grid gap-3 py-8 sm:grid-cols-[5rem_14rem_1fr] sm:gap-8">
                  <span className="font-mono text-sm text-ink-400">0{i + 1}</span>
                  <h3 className="font-sora text-xl font-semibold text-ink-950 dark:text-white">{p.title}</h3>
                  <div>
                    <p className="leading-relaxed text-ink-600 dark:text-ink-300">{p.text}</p>
                    {p.link && (
                      <Link href={p.link.href} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline dark:text-brand-300">
                        {p.link.label} <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <InContentAd />

        {/* FAQ */}
        <section className="border-t border-ink-200 bg-ink-50 py-16 dark:border-ink-800 dark:bg-ink-900/40 lg:py-24">
          <div className="shell grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 className="font-sora text-3xl font-bold tracking-tight text-ink-950 dark:text-white">Questions About DevelopersMatrix</h2>
              <p className="mt-4 text-ink-600 dark:text-ink-300">
                Something else? Email{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-brand-700 hover:underline dark:text-brand-300">{CONTACT_EMAIL}</a>
              </p>
            </div>
            <div className="space-y-3 lg:col-span-8">
              {aboutFaqs.map((faq) => (
                <details key={faq.question} className="group rounded-2xl border border-ink-200 bg-white dark:border-ink-800 dark:bg-ink-950">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold text-ink-950 dark:text-white">
                    {faq.question}
                    <span aria-hidden="true" className="text-xl leading-none text-ink-400 transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <div className="border-t border-ink-100 px-5 pb-5 pt-4 text-[0.95rem] leading-relaxed text-ink-600 dark:border-ink-800 dark:text-ink-300">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Contact and next steps */}
        <section className="bg-ink-950 py-16 text-white lg:py-20">
          <div className="shell grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-sora text-3xl font-bold tracking-tight sm:text-4xl">Ready to Try the Tools?</h2>
              <p className="mt-4 max-w-lg text-white/70">
                No signup. No credit card. Just tools built from real experience to solve real problems.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/tools" className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-ink-950 transition hover:bg-ink-100">
                  Explore all tools <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/25 px-5 text-sm font-semibold text-white transition hover:bg-white/10">
                  Get in touch
                </Link>
              </div>
            </div>
            <dl className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
              <div className="bg-ink-950 p-6">
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Email</dt>
                <dd className="mt-2">
                  <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">{CONTACT_EMAIL}</a>
                </dd>
              </div>
              <div className="bg-ink-950 p-6">
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Website audits</dt>
                <dd className="mt-2">
                  <Link href="/services/website-audit" className="font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">See the paid audit options</Link>
                </dd>
              </div>
              <div className="bg-ink-950 p-6">
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Agency work</dt>
                <dd className="mt-2">
                  <a href={OVITECH.url} target="_blank" rel="noopener" className="font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">OviTech Global</a>
                </dd>
              </div>
              <div className="bg-ink-950 p-6">
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Follow DevelopersMatrix</dt>
                <dd className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  {brandProfiles.map((p) => (
                    <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white">{p.name}</a>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </>
  );
}
