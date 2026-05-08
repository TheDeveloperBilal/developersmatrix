import { Metadata } from 'next';
import { generatePageMetadata, toolMetadata } from '@/lib/seo/metadata';
import { InContentAd } from '@/components/ads/AdBanner';
import AIEmailAssistantClient from './AIEmailAssistantClient';

export const metadata: Metadata = generatePageMetadata(toolMetadata['ai-email-assistant']);

export default function AIEmailAssistantPage() {
  return (
    <>
      <AIEmailAssistantClient />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InContentAd />
      </div>
    </>
  );
}
