import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { siteConfig } from "@/data/config";

export const metadata: Metadata = {
  title: "Cookie Policy - How We Use Cookies",
  description: "Understand how DevelopersMatrix uses cookies and similar technologies to improve your experience, provide relevant advertising, and analyze site traffic.",
  alternates: {
    canonical: `${siteConfig.url}/cookies`,
  },
  openGraph: {
    title: "Cookie Policy | DevelopersMatrix",
    description: "Learn about our cookie usage and privacy practices.",
    url: `${siteConfig.url}/cookies`,
  },
};

export default function CookiePolicyPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Cookie Policy", url: `${siteConfig.url}/cookies` }
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
        <p className="text-muted-foreground mb-8">
          Last updated: May 2025
        </p>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>What Are Cookies?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Cookies are small text files that are stored on your device when you visit a website. 
                They serve various purposes such as remembering your preferences, understanding how you 
                interact with our site, and delivering personalized content and advertisements. Cookies 
                help us provide you with a better, more tailored experience each time you visit 
                DevelopersMatrix. Without cookies, many features of modern websites would not function 
                properly, and your browsing experience would be significantly less convenient.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How We Use Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                At DevelopersMatrix, we use cookies for several important reasons. First, we use them to 
                ensure the basic functionality of our website operates smoothly. This includes keeping you 
                signed in during your session and remembering your preferences such as dark mode settings. 
                Second, we use cookies to analyze how visitors interact with our platform, which helps us 
                identify areas for improvement and understand which features are most valuable to our users. 
                Third, we work with trusted advertising partners to display relevant advertisements that 
                support our free services.
              </p>
              <p className="text-muted-foreground">
                We believe in being completely transparent about our cookie usage. Below, you will find 
                detailed information about each category of cookies we use, their specific purposes, and 
                how you can manage your preferences. We encourage you to read through this information 
                carefully so you can make informed decisions about your privacy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Types of Cookies We Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2 text-foreground">Essential Cookies (Always Active)</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  These cookies are strictly necessary for the website to function properly. They enable 
                  core functionality such as security, network management, and accessibility. You cannot 
                  opt-out of these cookies because they are essential for the website to work. Without 
                  them, features like user authentication, form submissions, and page navigation would 
                  not be possible. These cookies do not collect any personal information that can be used 
                  for marketing purposes.
                </p>
                <ul className="text-sm text-muted-foreground ml-4 space-y-1">
                  <li>• Session management and authentication</li>
                  <li>• Security and fraud prevention</li>
                  <li>• Load balancing and site stability</li>
                  <li>• Accessibility features and preferences</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-foreground">Analytics and Performance Cookies</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  These cookies help us understand how visitors interact with our website by collecting 
                  and reporting information anonymously. They allow us to count visits and traffic sources 
                  so we can measure and improve the performance of our site. The data collected includes 
                  pages visited, time spent on pages, and navigation patterns. This information helps us 
                  optimize our content and identify areas where users may be experiencing difficulties.
                </p>
                <ul className="text-sm text-muted-foreground ml-4 space-y-1">
                  <li>• Google Analytics - Page views, session duration, bounce rate</li>
                  <li>• Performance monitoring and error tracking</li>
                  <li>• A/B testing for feature improvements</li>
                  <li>• Content engagement analysis</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-foreground">Advertising and Personalization Cookies</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  We partner with Google AdSense and other advertising networks to display advertisements 
                  on our website. These partners use cookies to show you ads that are relevant to your 
                  interests based on your browsing activity across different websites. This practice is 
                  known as interest-based advertising or personalized advertising. The goal is to show 
                  you advertisements that are more likely to be of interest to you, rather than random, 
                  unrelated ads.
                </p>
                <ul className="text-sm text-muted-foreground ml-4 space-y-1">
                  <li>• Google AdSense - Personalized ad delivery</li>
                  <li>• DoubleClick - Ad performance measurement</li>
                  <li>• Remarketing pixels - Reconnecting with visitors</li>
                  <li>• Conversion tracking - Measuring ad effectiveness</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-foreground">Functional Cookies</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  These cookies enable enhanced functionality and personalization, such as remembering 
                  your preferences and settings. If you do not allow these cookies, some or all of these 
                  services may not function properly. For example, we use functional cookies to remember 
                  your theme preference (light or dark mode), your language settings, and any customizations 
                  you make to our tools and dashboards.
                </p>
                <ul className="text-sm text-muted-foreground ml-4 space-y-1">
                  <li>• Theme and display preferences</li>
                  <li>• Language and region settings</li>
                  <li>• Tool configurations and saved inputs</li>
                  <li>• Recently viewed content</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Google AdSense and Advertising Partners</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                We use Google AdSense to serve advertisements on DevelopersMatrix. Google AdSense uses 
                cookies to serve ads based on your prior visits to our website or other websites. 
                Google&apos;s use of advertising cookies enables it and its partners to serve ads based on 
                your visit to our site and/or other sites on the Internet. This personalized advertising 
                approach helps support our free services while ensuring you see ads that may be relevant 
                to your interests.
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                You may opt out of personalized advertising by visiting Google&apos;s Ad Settings at
                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline ml-1">
                  www.google.com/settings/ads
                </a>. 
                Alternatively, you can opt out of third-party vendor cookies by visiting 
                <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline ml-1">
                  www.aboutads.info
                </a>.
              </p>
              <p className="text-sm text-muted-foreground">
                Please note that even if you opt out of personalized advertising, you may still see 
                advertisements on our website. However, these advertisements will not be tailored to 
                your interests and may be less relevant to you. Opting out does not reduce the number 
                of ads you see; it only affects how relevant those ads are to your interests.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Third-Party Cookies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Some cookies on our website are placed by third-party services that appear on our pages. 
                These third parties may use cookies to collect information about your browsing activities 
                across multiple websites. We do not control these cookies and recommend reviewing the 
                privacy policies of these third parties to understand their cookie practices. The third 
                parties we currently work with include:
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span><strong>Google (Analytics, AdSense, Tag Manager):</strong> Used for analytics, advertising, and tag management. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline">Privacy Policy</a></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span><strong>Vercel (Analytics, Speed Insights):</strong> Used for performance monitoring and analytics. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline">Privacy Policy</a></span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Cookie Choices</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                You have several options when it comes to managing cookies on your device. Most web 
                browsers allow you to control cookies through their settings. You can typically set 
                your browser to refuse cookies or delete certain cookies. Here are the main options 
                available to you:
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span><strong>Browser Settings:</strong> You can configure your browser to reject all cookies or only certain types of cookies. Most browsers also allow you to delete cookies after they have been set.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span><strong>Incognito/Private Browsing:</strong> Using private browsing modes will prevent cookies from being stored on your device after you close the browser window.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span><strong>Ad Settings:</strong> You can manage your advertising preferences through Google Ad Settings and the Digital Advertising Alliance&apos;s consumer choice tools.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span><strong>Browser Extensions:</strong> Various browser extensions can help you manage cookies and protect your privacy online.</span>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                Please be aware that blocking or deleting cookies may impact your experience on our 
                website. Some features may not function properly, and you may need to re-enter your 
                preferences each time you visit.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How to Manage Cookies in Your Browser</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Below are links to instructions for managing cookies in popular web browsers. Please 
                refer to your browser&apos;s help documentation for the most current instructions, as 
                browser settings and options may change with updates:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline">Google Chrome Cookie Settings</a>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline">Mozilla Firefox Cookie Settings</a>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline">Safari Cookie Settings</a>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline">Microsoft Edge Cookie Settings</a>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Updates to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We may update this Cookie Policy from time to time to reflect changes in technology, 
                legislation, or our data practices. When we make material changes to this policy, we 
                will notify you by updating the &quot;Last updated&quot; date at the top of this page. We encourage 
                you to review this policy periodically to stay informed about how we use cookies and 
                similar technologies. Your continued use of our website after any changes indicates 
                your acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                If you have any questions about our use of cookies or this Cookie Policy, please 
                contact us. We are committed to addressing your concerns and providing clarification 
                about our privacy practices. You can reach our privacy team at:
                <br /><br />
                <a href="mailto:privacy@developersmatrix.com" className="text-violet-600 hover:underline">
                  privacy@developersmatrix.com
                </a>
                <br /><br />
                We will make every effort to respond to your inquiry within a reasonable timeframe.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
