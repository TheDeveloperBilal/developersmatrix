import { Metadata } from 'next';
import { generatePageMetadata, toolMetadata } from '@/lib/seo/metadata';
import { InContentAd } from '@/components/ads/AdBanner';
import AIPromptLibraryClient from './AIPromptLibraryClient';

export const metadata: Metadata = generatePageMetadata(toolMetadata['ai-prompt-library']);

export default function AIPromptLibraryPage() {
  return (
    <>
      <AIPromptLibraryClient />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InContentAd />
      </div>
    </>
  );
}
