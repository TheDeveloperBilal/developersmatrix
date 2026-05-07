import { Metadata } from 'next';
import { generatePageMetadata, toolMetadata } from '@/lib/seo/metadata';
import LinkManagerClient from './LinkManagerClient';

export const metadata: Metadata = generatePageMetadata(toolMetadata['link-manager']);

export default function LinkManagerPage() {
  return <LinkManagerClient />;
}
