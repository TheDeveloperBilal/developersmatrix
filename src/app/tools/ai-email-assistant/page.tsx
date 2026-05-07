import { Metadata } from 'next';
import { generatePageMetadata, toolMetadata } from '@/lib/seo/metadata';
import AIEmailAssistantClient from './AIEmailAssistantClient';

export const metadata: Metadata = generatePageMetadata(toolMetadata['ai-email-assistant']);

export default function AIEmailAssistantPage() {
  return <AIEmailAssistantClient />;
}
