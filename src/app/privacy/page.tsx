import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { siteConfig } from "@/data/config";

export const metadata: Metadata = {
  title: "Privacy Policy - Your Data, Your Rights",
  description: "Learn how DevelopersMatrix collects, uses, and protects your personal information. Our privacy-first approach to your data.",
  openGraph: {
    title: "Privacy Policy | DevelopersMatrix",
    description: "Learn how we protect your personal information.",
    url: `${siteConfig.url}/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Privacy Policy", url: `${siteConfig.url}/privacy` }
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">
          Last updated: May 2025
        </p>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Our Commitment to Your Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                At DevelopersMatrix, we understand that your privacy is important to you, and we take 
                our responsibility to protect it seriously. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you visit our website and use our 
                services. We believe in being transparent about our data practices, and we want you to 
                feel confident about how your personal information is handled. Our platform is built 
                with a privacy-first approach, meaning we minimize data collection and maximize your 
                control over your personal information.
              </p>
              <p className="text-muted-foreground mt-4">
                Please read this privacy policy carefully. By using our website, you consent to the 
                practices described in this policy. If you do not agree with the terms of this privacy 
                policy, please do not access the site. We reserve the right to make changes to this 
                policy at any time, and your continued use of the site following any changes indicates 
                your acceptance of those changes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2 text-foreground">Personal Information You Provide</h4>
                <p className="text-sm text-muted-foreground">
                  When you use our tools and services, you may choose to provide us with personal 
                  information. This can include your email address when you subscribe to our newsletter, 
                  contact information when you reach out to our support team, and any other details you 
                  voluntarily share. When you use our AI-powered tools like the Resume Builder or Budget 
                  Planner, the data you enter is processed to provide you with the service. For most of 
                  our tools, data is stored locally in your browser unless you explicitly choose to save 
                  it to an account. We do not sell or rent your personal information to third parties.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-foreground">Automatically Collected Information</h4>
                <p className="text-sm text-muted-foreground">
                  When you visit DevelopersMatrix, we automatically collect certain information about 
                  your device and how you interact with our website. This includes your IP address, 
                  browser type and version, operating system, referring URLs, pages viewed, time spent 
                  on pages, links clicked, and other diagnostic data. We use this information to improve 
                  our website, analyze trends, and understand how users engage with our content. This 
                  data is collected through cookies, web beacons, and similar technologies. For more 
                  details about our use of cookies, please refer to our Cookie Policy.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-foreground">Information from Third Parties</h4>
                <p className="text-sm text-muted-foreground">
                  We may receive information about you from third-party sources, such as when you sign 
                  in using social media accounts or when our advertising partners share information 
                  with us. This information is typically limited to what is necessary for providing 
                  the requested service or for advertising purposes. We do not purchase personal 
                  information from data brokers or similar services.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                We use the information we collect for a variety of legitimate business purposes. These 
                purposes are essential to providing you with the services you expect and improving your 
                overall experience on our platform. Below are the primary ways we use your information:
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span><strong>Service Delivery:</strong> To provide, maintain, and improve our services, including personalizing your experience and displaying content relevant to your interests.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span><strong>Communication:</strong> To respond to your inquiries, send you technical notices and support messages, and keep you informed about updates to our services.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span><strong>Analytics and Research:</strong> To analyze usage patterns, conduct research, and develop new features and improvements to our platform.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span><strong>Advertising:</strong> To display advertisements that may be of interest to you and to measure the effectiveness of advertising campaigns.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span><strong>Security and Fraud Prevention:</strong> To detect, prevent, and address technical issues, security threats, and fraudulent activity.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span><strong>Legal Compliance:</strong> To comply with legal obligations and protect our rights, privacy, safety, or property.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Advertising and Google AdSense</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                We use Google AdSense to display advertisements on our website. Google AdSense uses 
                cookies to serve ads based on your prior visits to our website or other websites on 
                the Internet. These cookies allow Google and its partners to serve ads to you based on 
                your interests and past online activity. This is known as interest-based advertising 
                or personalized advertising.
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Google&apos;s use of advertising cookies enables it and its partners to serve ads to users 
                based on their visit to our site and other sites on the Internet. You can opt out of 
                personalized advertising by visiting 
                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline mx-1">Google Ads Settings</a>.
                You can also opt out of personalized advertising from third-party vendors by visiting
                <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline mx-1">www.aboutads.info</a>.
              </p>
              <p className="text-sm text-muted-foreground">
                Advertising revenue helps us maintain and improve our free services. We are committed 
                to ensuring that the advertisements displayed on our site are appropriate and do not 
                interfere with your experience. We do not share your personal information directly 
                with advertisers, but our advertising partners may use their own cookies and tracking 
                technologies to collect information about your browsing activities.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Sharing and Disclosure</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                We do not sell, trade, or rent your personal information to third parties. However, 
                we may share your information in the following circumstances:
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span><strong>Service Providers:</strong> We may share information with third-party vendors and service providers who perform services on our behalf, such as hosting, analytics, and customer support.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span><strong>Advertising Partners:</strong> We work with advertising partners to display relevant ads on our website. These partners may use cookies and similar technologies to collect information about your browsing activities.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span><strong>Legal Requirements:</strong> We may disclose information if required by law, court order, or other legal processes, or if we believe disclosure is necessary to protect our rights or the safety of others.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span><strong>Business Transfers:</strong> In the event of a merger, acquisition, reorganization, or sale of assets, your information may be transferred as part of that transaction.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span><strong>With Your Consent:</strong> We may share your information with third parties when you give us explicit consent to do so.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction. These 
                measures include encryption of data in transit using HTTPS, secure server infrastructure, 
                regular security audits, and access controls that limit who can view your information.
              </p>
              <p className="text-sm text-muted-foreground">
                While we take reasonable steps to protect your information, no method of transmission 
                over the Internet or electronic storage is 100% secure. We cannot guarantee absolute 
                security of your data. You are responsible for maintaining the confidentiality of any 
                account credentials and for taking steps to protect your own privacy online.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Privacy Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Depending on your location, you may have certain rights regarding your personal 
                information. We are committed to respecting these rights and providing you with the 
                means to exercise them:
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span><strong>Access:</strong> You have the right to request access to the personal information we hold about you.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span><strong>Correction:</strong> You have the right to request that we correct any inaccurate or incomplete personal information.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span><strong>Deletion:</strong> You have the right to request that we delete your personal information, subject to certain exceptions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span><strong>Data Portability:</strong> You have the right to request a copy of your personal information in a portable format.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span><strong>Opt-Out:</strong> You have the right to opt out of marketing communications and certain types of data processing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span><strong>Withdraw Consent:</strong> Where we rely on your consent for processing, you have the right to withdraw that consent at any time.</span>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                To exercise any of these rights, please contact us at 
                <a href="mailto:privacy@developersmatrix.com" className="text-violet-600 hover:underline ml-1">privacy@developersmatrix.com</a>.
                We will respond to your request within a reasonable timeframe.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                DevelopersMatrix is operated from the United States, and the information we collect 
                may be transferred to and processed in the United States or other countries where our 
                service providers are located. By using our website, you acknowledge that your 
                information may be transferred to and processed in countries other than your own. We 
                take appropriate measures to ensure that your information remains protected in 
                accordance with this privacy policy, regardless of where it is processed.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Children&apos;s Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our website is not intended for children under the age of 13 (or 16 in certain 
                jurisdictions). We do not knowingly collect personal information from children under 
                these ages. If you are a parent or guardian and believe that your child has provided 
                us with personal information, please contact us immediately. If we discover that we 
                have collected personal information from a child without parental consent, we will 
                take steps to delete that information as soon as possible.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We may update this Privacy Policy from time to time to reflect changes in our 
                practices, technologies, or legal requirements. When we make material changes to this 
                policy, we will post the updated policy on this page and update the &quot;Last updated&quot; date 
                at the top. We encourage you to review this policy periodically to stay informed about 
                how we protect your information. Your continued use of our website after any changes 
                indicates your acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our 
                data practices, please contact us. We are committed to addressing your privacy concerns 
                and providing you with the information you need to make informed decisions about your 
                personal data.
                <br /><br />
                <strong>Privacy Officer</strong>
                <br />
                Email: <a href="mailto:privacy@developersmatrix.com" className="text-violet-600 hover:underline">privacy@developersmatrix.com</a>
                <br /><br />
                For general inquiries, you can also reach us at:
                <br />
                Email: <a href="mailto:hello@developersmatrix.com" className="text-violet-600 hover:underline">hello@developersmatrix.com</a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
