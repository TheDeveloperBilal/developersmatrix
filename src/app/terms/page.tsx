import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { siteConfig } from "@/data/config";

export const metadata: Metadata = {
  title: "Terms of Service - Usage Agreement",
  description: "Read the terms and conditions for using DevelopersMatrix services and tools.",
  alternates: {
    canonical: `${siteConfig.url}/terms`,
  },
  openGraph: {
    title: "Terms of Service | DevelopersMatrix",
    description: "Terms and conditions for using our services.",
    url: `${siteConfig.url}/terms`,
  },
};

export default function TermsPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Terms of Service", url: `${siteConfig.url}/terms` }
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">
          Last updated: May 2025
        </p>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Agreement to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Welcome to DevelopersMatrix. By accessing or using our website and services, you agree 
                to be bound by these Terms of Service and all applicable laws and regulations. If you 
                do not agree with any of these terms, you are prohibited from using or accessing this 
                site. These terms constitute a legally binding agreement between you and DevelopersMatrix 
                regarding your use of our website and services. We recommend that you read these terms 
                carefully and print a copy for your records.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                These terms apply to all visitors, users, and others who access or use the service. 
                By accessing or using the service, you agree to be bound by these terms. If you are 
                using the service on behalf of an organization, you are agreeing to these terms on 
                behalf of that organization and representing that you have the authority to do so.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Description of Service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                DevelopersMatrix provides a platform offering AI-powered tools and resources designed 
                to help developers, entrepreneurs, and tech professionals optimize their careers and 
                daily productivity. Our services include, but are not limited to:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span><strong>AI Resume Builder:</strong> Create professional resumes with AI assistance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span><strong>Cover Letter Generator:</strong> Generate tailored cover letters for job applications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span><strong>Interview Simulator:</strong> Practice interviews with AI-powered feedback</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span><strong>Budget Planner:</strong> Track and manage personal finances</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span><strong>Salary Estimator:</strong> Research salary data for various positions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span><strong>Community Q&A:</strong> Engage with other professionals in discussions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span><strong>Trend Radar:</strong> Stay updated on industry trends and news</span>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                Our services may change, be updated, or be discontinued at any time without prior notice. 
                We strive to provide high-quality services, but we cannot guarantee that our services 
                will be uninterrupted, secure, or error-free at all times.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. User Accounts and Registration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Some features of our service may require you to create an account. When you create an 
                account, you agree to provide accurate, current, and complete information during the 
                registration process and to update such information to keep it accurate, current, and 
                complete. You are responsible for safeguarding your account password and for any 
                activities or actions under your account.
              </p>
              <p className="text-sm text-muted-foreground">
                You agree not to disclose your password to any third party. You must notify us 
                immediately upon becoming aware of any breach of security or unauthorized use of your 
                account. We reserve the right to refuse service, terminate accounts, remove or edit 
                content, or cancel orders at our sole discretion.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Acceptable Use Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                You agree to use our services only for lawful purposes and in accordance with these 
                Terms of Service. You agree not to use our services in any way that violates any 
                applicable laws or regulations, or to engage in any conduct that restricts or inhibits 
                anyone&apos;s use or enjoyment of the service. Specifically, you agree not to:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span>Use the service for any unlawful purpose or in violation of any laws</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span>Attempt to gain unauthorized access to any portion of the service or any systems or networks connected to it</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span>Use any robot, spider, crawler, scraper, or other automated means to access the service or collect any information from it</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span>Introduce any viruses, Trojan horses, worms, logic bombs, or other harmful material</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span>Attempt to interfere with, compromise, or disrupt the service or servers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span>Harass, abuse, or harm another person or entity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span>Impersonate or attempt to impersonate any person or entity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span>Submit false, misleading, or inaccurate information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-500 mt-1">•</span>
                  <span>Violate the intellectual property rights of others</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Intellectual Property Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                The service and its original content, features, and functionality are and will remain 
                the exclusive property of DevelopersMatrix and its licensors. The service is protected 
                by copyright, trademark, patent, trade secret, and other intellectual property laws 
                of the United States and other countries.
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Our trademarks and trade dress may not be used in connection with any product or 
                service without the prior written consent of DevelopersMatrix. You may not reproduce, 
                modify, distribute, display, or create derivative works from our content without 
                express written permission.
              </p>
              <p className="text-sm text-muted-foreground">
                You retain ownership of any content you submit, post, or display on or through the 
                service (&quot;User Content&quot;). By posting User Content, you grant us a worldwide, 
                non-exclusive, royalty-free license to use, modify, publicly perform, publicly display, 
                reproduce, and distribute such content on and through the service. This license 
                continues even if you stop using our service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. AI-Generated Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Many of our tools utilize artificial intelligence to generate content, suggestions, 
                and recommendations. You understand and acknowledge that AI-generated content may not 
                always be accurate, complete, or appropriate for your specific needs. AI models may 
                occasionally produce incorrect, misleading, or biased outputs.
              </p>
              <p className="text-sm text-muted-foreground">
                You are solely responsible for reviewing, verifying, and editing any AI-generated 
                content before using it for any purpose. DevelopersMatrix is not responsible for any 
                decisions made or actions taken based on AI-generated content. We recommend exercising 
                judgment and conducting additional research when relying on AI-generated suggestions, 
                particularly for important decisions related to employment, finances, or legal matters.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Third-Party Links and Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Our service may contain links to third-party websites or services that are not owned 
                or controlled by DevelopersMatrix. We have no control over, and assume no responsibility 
                for, the content, privacy policies, or practices of any third-party websites or services.
              </p>
              <p className="text-sm text-muted-foreground">
                You acknowledge and agree that DevelopersMatrix shall not be responsible or liable, 
                directly or indirectly, for any damage or loss caused or alleged to be caused by or 
                in connection with the use of or reliance on any such content, goods, or services 
                available on or through any such websites or services. We strongly advise you to read 
                the terms and conditions and privacy policies of any third-party websites or services 
                that you visit.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Disclaimer of Warranties</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS, WITHOUT ANY 
                WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED 
                BY LAW, DEVELOPERSMATRIX DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING, 
                BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
                PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p className="text-sm text-muted-foreground">
                We do not warrant that the service will be uninterrupted or error-free, that defects 
                will be corrected, or that the service or the servers that make it available are free 
                of viruses or other harmful components. We do not warrant or make any representation 
                concerning the accuracy, reliability, or quality of any content, information, or 
                service provided through the service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                IN NO EVENT SHALL DEVELOPERSMATRIX, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, 
                SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
                CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING, WITHOUT LIMITATION, LOSS OF PROFITS, 
                DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR 
                USE OF OR INABILITY TO ACCESS OR USE THE SERVICE.
              </p>
              <p className="text-sm text-muted-foreground">
                Our total liability for any claims arising from or related to the service shall not 
                exceed the amount you paid us, if any, in the twelve (12) months prior to the claim. 
                Some jurisdictions do not allow the exclusion of certain warranties or the limitation 
                of liability for consequential or incidental damages, so the above limitations may 
                not apply to you.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Indemnification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                You agree to defend, indemnify, and hold harmless DevelopersMatrix and its licensors, 
                employees, contractors, agents, officers, and directors from and against any and all 
                claims, damages, obligations, losses, liabilities, costs, and expenses arising from 
                your use of the service, your violation of these terms, or your violation of any 
                rights of another party. This indemnification obligation will survive the termination 
                of these terms and your use of the service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Modifications to Service and Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                We reserve the right to modify or discontinue, temporarily or permanently, the service 
                or any portion thereof, with or without notice. You agree that DevelopersMatrix shall 
                not be liable to you or to any third party for any modification, suspension, or 
                discontinuance of the service.
              </p>
              <p className="text-sm text-muted-foreground">
                We reserve the right to modify these terms at any time. We will notify users of any 
                material changes by posting the new terms on this page and updating the &quot;Last updated&quot; 
                date. Your continued use of the service after any changes becomes effective means that 
                you accept the revised terms. If you do not agree to the modified terms, you should 
                discontinue your use of the service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>12. Termination</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                We may terminate or suspend your account and bar access to the service immediately, 
                without prior notice or liability, under our sole discretion, for any reason whatsoever, 
                including, without limitation, if you breach these terms.
              </p>
              <p className="text-sm text-muted-foreground">
                Upon termination, your right to use the service will immediately cease. If you wish 
                to terminate your account, you may simply discontinue using the service or contact us 
                to request account deletion. The provisions of these terms that by their nature should 
                survive termination shall survive termination, including ownership provisions, warranty 
                disclaimers, indemnification, and limitations of liability.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>13. Governing Law and Dispute Resolution</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                These terms shall be governed by and construed in accordance with the laws of the 
                United States, without regard to its conflict of law provisions. Any disputes arising 
                under or in connection with these terms or the service shall be resolved through 
                binding arbitration, except where prohibited by law.
              </p>
              <p className="text-sm text-muted-foreground">
                Our failure to enforce any right or provision of these terms will not be considered 
                a waiver of those rights. If any provision of these terms is held to be invalid or 
                unenforceable by a court, the remaining provisions of these terms will remain in effect.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>14. Severability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                If any provision of these terms is held to be invalid or unenforceable by a court of 
                competent jurisdiction, the remaining provisions of these terms shall remain in full 
                force and effect. The invalid or unenforceable provision shall be modified to the 
                minimum extent necessary to make it valid and enforceable while preserving the intent 
                of the parties as closely as possible.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>15. Entire Agreement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                These terms, together with our Privacy Policy and Cookie Policy, constitute the entire 
                agreement between you and DevelopersMatrix regarding your use of the service and 
                supersede all prior and contemporaneous understandings, agreements, representations, 
                and warranties, both written and oral, regarding the service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>16. Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                If you have any questions about these Terms of Service, please contact us. We are 
                here to help and will make every effort to respond to your inquiries promptly.
                <br /><br />
                <strong>Legal Department</strong>
                <br />
                Email: <a href="mailto:legal@developersmatrix.com" className="text-violet-600 hover:underline">legal@developersmatrix.com</a>
                <br /><br />
                <strong>General Inquiries</strong>
                <br />
                Email: <a href="mailto:hello@developersmatrix.com" className="text-violet-600 hover:underline">hello@developersmatrix.com</a>
                <br /><br />
                <strong>Website:</strong> <a href="https://developersmatrix.com" className="text-violet-600 hover:underline">developersmatrix.com</a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
