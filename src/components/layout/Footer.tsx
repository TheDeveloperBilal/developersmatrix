import Link from 'next/link';
import Image from 'next/image';
import { 
  Twitter, 
  Github, 
  Linkedin, 
  Mail,
  Heart,
  Facebook,
  Instagram
} from 'lucide-react';
import { siteConfig, footerLinks } from '@/data/config';
import { FooterAdSection } from '@/components/ads/FooterAdSection';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border">
      {/* Newsletter Section */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
              <p className="text-muted-foreground">
                Get the latest tools, trends, and insights delivered to your inbox.
              </p>
            </div>
            <form className="flex w-full md:w-auto gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="w-full md:w-72"
              />
              <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0 whitespace-nowrap">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image 
                src="/logo.png" 
                alt="DevelopersMatrix" 
                width={160} 
                height={40}
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              AI-powered tools and insights for developers, entrepreneurs, and tech professionals.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href={siteConfig.links.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="mailto:hello@developersmatrix.com"
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} DevelopersMatrix. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for the global community
            </p>
          </div>
        </div>
      </div>

      {/* AdSense Footer Banner */}
      <div className="bg-muted/50 border-t border-border py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FooterAdSection />
        </div>
      </div>
    </footer>
  );
}
