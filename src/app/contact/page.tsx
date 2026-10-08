import Link from 'next/link';
import { Mail, Search, MapPin, Clock, Handshake } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BreadcrumbSchema } from '@/components/seo/SchemaMarkup';
import ContactForm from '@/components/forms/ContactForm';
import { siteConfig } from '@/data/config';

export default function ContactPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Contact", url: `${siteConfig.url}/contact` }
        ]}
      />

      {/* Hero Section */}
      <section className="hero-gradient py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a question, found a bug or want a new tool? Send a message and I will get back to you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-violet-500/10">
                      <Mail className="w-5 h-5 text-violet-500" />
                    </div>
                    Email Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    For general inquiries and support
                  </p>
                  <a href="mailto:info@developersmatrix.com" className="text-violet-600 hover:underline">
                    info@developersmatrix.com
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <Search className="w-5 h-5 text-blue-500" />
                    </div>
                    Website Audits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Want a full manual review of your site?
                  </p>
                  <Link href="/services/website-audit" className="text-violet-600 hover:underline">
                    See the paid audit options
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-violet-500/10">
                      <Handshake className="w-5 h-5 text-violet-500" />
                    </div>
                    Business Enquiries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Sponsored posts, tool features, ads or a web project?
                  </p>
                  <Link href="/connect" className="text-violet-600 hover:underline">
                    Use the Connect page
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <MapPin className="w-5 h-5 text-green-500" />
                    </div>
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Run remotely, working with clients in many countries
                  </p>
                  <p className="text-sm">Worldwide</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/10">
                      <Clock className="w-5 h-5 text-orange-500" />
                    </div>
                    Response Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    I usually reply within
                  </p>
                  <p className="text-sm font-medium">24 to 48 hours</p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send a Message</CardTitle>
                  <p className="text-sm text-muted-foreground">Questions, bug reports and tool ideas all land in my inbox.</p>
                </CardHeader>
                <CardContent>
                  <ContactForm kind="general" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
