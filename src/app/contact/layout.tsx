import type { Metadata } from "next";
import { siteConfig } from "@/data/config";

export const metadata: Metadata = {
  title: "Contact Us - Get Support & Send Feedback",
  description: "Contact the DevelopersMatrix team for support, feedback, or business inquiries. We respond within 24 hours.",
  alternates: {
    canonical: `${siteConfig.url}/contact`,
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
