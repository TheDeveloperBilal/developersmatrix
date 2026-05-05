import { NextRequest, NextResponse } from 'next/server';
import { WebsiteAuditEngine } from '@/lib/website-audit/engine';
import type { CrawlProgress } from '@/lib/website-audit/types';

export const runtime = 'nodejs';
export const maxDuration = 120; // 2 minutes max

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, maxPages = 5 } = body;

    // Validate URL
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      );
    }

    // Normalize URL
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    // Validate URL format
    try {
      new URL(normalizedUrl);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Create audit engine
    const engine = new WebsiteAuditEngine({
      url: normalizedUrl,
      maxPages: Math.min(maxPages, 10), // Limit to 10 pages max
      timeout: 30000,
    });

    // Run audit with progress tracking
    const result = await engine.audit((progress: CrawlProgress) => {
      // In a real-time implementation, this could use Server-Sent Events or WebSockets
      console.log(`[Audit Progress] ${progress.status}: ${progress.message}`);
    });

    return NextResponse.json({
      success: true,
      result,
    });

  } catch (error) {
    console.error('Website audit error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { success: false, error: 'URL parameter is required' },
      { status: 400 }
    );
  }

  // Return audit info/config
  return NextResponse.json({
    success: true,
    message: 'Website Audit API is ready',
    endpoint: '/api/website-audit',
    method: 'POST',
    parameters: {
      url: 'string (required) - The URL to audit',
      maxPages: 'number (optional, default: 5) - Maximum pages to scan',
    },
    features: [
      'Technical SEO Audit',
      'Performance Analysis',
      'Mobile UX Check',
      'Security Assessment',
      'Accessibility Review',
      'Content Quality Analysis',
      'Conversion Optimization',
    ],
  });
}
