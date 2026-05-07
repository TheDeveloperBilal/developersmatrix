import { Metadata } from 'next';
import { generatePageMetadata, toolMetadata } from '@/lib/seo/metadata';
import AIPromptLibraryClient from './AIPromptLibraryClient';

export const metadata: Metadata = generatePageMetadata(toolMetadata['ai-prompt-library']);

export default function AIPromptLibraryPage() {
  return <AIPromptLibraryClient />;
}
