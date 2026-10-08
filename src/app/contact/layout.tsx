import type { Metadata } from "next";
import { siteConfig } from "@/data/config";

export const metadata: Metadata = {
  title: "Contact Us - Get Support & Send Feedback",
  description: "Contact DevelopersMatrix with questions, bug reports, tool ideas or business enquiries. I usually reply within 24 to 48 hours.",
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
