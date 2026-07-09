'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Twitter, 
  Github, 
  Linkedin, 
  Mail,
  Heart,
  Facebook,
  Instagram,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { siteConfig, footerLinks } from '@/data/config';
import { FooterAdSection } from '@/components/ads/FooterAdSection';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Pinterest icon (not in lucide)
function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
    </svg>
  );
}

// Behance icon
function BehanceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 1.905.982 2.576 2.436 2.576 1.215 0 1.88-.504 2.202-1.25h2.747zm-7.127-3.5h4.468c-.093-1.233-.774-1.832-1.88-1.832-1.146 0-1.908.625-2.588 1.832zM9.135 17.09c1.138 0 2.04-.388 2.653-1.07v.84h2.89v-7.546c0-2.403-1.668-3.84-4.687-3.84-2.797 0-4.77 1.378-4.91 3.613h2.75c.13-.746.746-1.17 1.748-1.17 1.074 0 1.73.478 1.73 1.34v.616l-2.558.16c-2.688.17-4.12 1.32-4.12 3.22 0 1.92 1.37 3.037 3.504 3.037zm.71-2.264c-.883 0-1.418-.445-1.418-1.13 0-.72.517-1.112 1.608-1.216l1.69-.134v.84c0 .924-.802 1.64-1.88 1.64zM2 20h5.65v-2.266H4.706v-3.065H7.33v-2.264H4.706V9.34H7.65V7.075H2V20z"/>
    </svg>
  );
}

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

    setIsSubmitting(true);
    setStatus('idle');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'newsletter', email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setStatusMsg(data.message || 'Subscribed successfully! Welcome aboard.');
        setEmail('');
      } else {
        setStatus('error');
        setStatusMsg(data.error || 'Subscription failed. Please try again.');
      }
    } catch {
      setStatus('error');
      setStatusMsg('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <div className="flex flex-col items-end gap-2 w-full md:w-auto">
              {status === 'success' ? (
                <div className="flex items-center gap-2 text-green-500 text-sm">
                  <CheckCircle className="w-5 h-5" />
                  <span>{statusMsg}</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex w-full md:w-auto gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full md:w-72"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0 whitespace-nowrap"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Subscribe'}
                  </Button>
                </form>
              )}
              {status === 'error' && (
                <p className="text-red-500 text-xs">{statusMsg}</p>
              )}
            </div>
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
              {/* Company Social Profiles */}
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
                href={siteConfig.links.pinterest}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                aria-label="Pinterest"
              >
                <PinterestIcon className="w-4 h-4" />
              </a>
              {/* Personal Profiles */}
              <a
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                aria-label="Twitter / X"
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
                href={siteConfig.links.behance}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                aria-label="Behance Portfolio"
              >
                <BehanceIcon className="w-4 h-4" />
              </a>
              <a
                href="mailto:sy.bilalshah@gmail.com"
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
