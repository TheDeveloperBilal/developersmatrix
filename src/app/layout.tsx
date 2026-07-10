import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/data/config";
import { siteAuthor } from "@/data/authors";
import { OrganizationSchema, PersonSchema } from "@/components/seo/SchemaMarkup";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - Free AI Tools & Career Hub`,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: [
    "AI tools",
    "resume builder",
    "career optimization",
    "productivity tools",
    "budget planner",
    "job search",
    "developer tools",
    "interview preparation",
    "career growth",
    "skill development",
    "GTA 6",
    "gaming news",
    "tech news",
    "AI resume",
    "cover letter generator",
    "salary estimator",
    "habit tracker",
    "productivity planner",
    "startup ideas"
  ],
  authors: [{ name: siteAuthor.name, url: `${siteConfig.url}/about` }],
  creator: siteAuthor.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@developersmatrix"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "cT-3Tl1WSPU8XVdWcDf_MGmGZ8GtOiNmBDdBDytV23A",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Site Verification */}
        <meta name="google-site-verification" content="cT-3Tl1WSPU8XVdWcDf_MGmGZ8GtOiNmBDdBDytV23A" />
        
        {/* Google AdSense — async, non-blocking, required for ads to work */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2091805600804724"
          crossOrigin="anonymous"
        />
        
        {/* Favicon & Icons */}
        <link rel="icon" type="image/png" href="/favicon.png" sizes="32x32" />
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#7c3aed" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="1 days" />
        <meta name="author" content={siteAuthor.name} />
        
        {/* Preconnect to external domains we actually use */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />

        {/* Organization Schema — Site-wide */}
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

        {/* Person Schema — Author Entity */}
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
      </head>
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        {/* Google Tag Manager (noscript) — must stay in body for non-JS users */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-N7VXC8SG"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1 pt-16">
            {children}
          </main>
          <Footer />
          <Toaster />
          <Analytics />
        </ThemeProvider>

        {/* Google Tag Manager — afterInteractive so it doesn't block first paint */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'\u0026l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-N7VXC8SG');
            `,
          }}
        />

        {/* Google Analytics — afterInteractive */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3P7JSPHQ39"
          strategy="afterInteractive"
        />
        <Script
          id="ga-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-3P7JSPHQ39');
            `,
          }}
        />
      </body>
    </html>
  );
}
