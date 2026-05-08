import { Metadata } from 'next';
import { generatePageMetadata, toolMetadata } from '@/lib/seo/metadata';
import { InContentAd } from '@/components/ads/AdBanner';
import LinkManagerClient from './LinkManagerClient';

export const metadata: Metadata = generatePageMetadata(toolMetadata['link-manager']);

export default function LinkManagerPage() {
  return (
    <>
      <LinkManagerClient />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InContentAd />
      </div>
    </>
  );
}
