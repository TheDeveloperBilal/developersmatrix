import { NextRequest, NextResponse } from 'next/server';
import { analyzeContent, analyzeBatch, DetectionMode } from '@/lib/ai-detector/engine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle batch analysis
    if (body.texts && Array.isArray(body.texts)) {
      const mode = (body.mode as DetectionMode) || 'blog';
      const results = analyzeBatch(body.texts, mode);
      
      return NextResponse.json({
        success: true,
        results,
        mode,
        timestamp: new Date().toISOString(),
      });
    }
    
    // Handle single text analysis
    const { text, mode = 'blog' } = body;
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Text is required' },
        { status: 400 }
      );
    }
    
    if (text.trim().length < 50) {
      return NextResponse.json(
        { success: false, error: 'Please enter at least 50 characters for accurate analysis' },
        { status: 400 }
      );
    }
    
    if (text.length > 50000) {
      return NextResponse.json(
        { success: false, error: 'Text exceeds maximum length of 50,000 characters' },
        { status: 400 }
      );
    }
    
    const result = analyzeContent(text, mode as DetectionMode);
    
    return NextResponse.json({
      success: true,
      result,
      mode,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('AI Content Detection Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze content' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'AI Content Detector API',
    endpoints: {
      'POST /api/ai-content-detector': 'Analyze text for AI-generated content',
    },
    modes: [
      { id: 'blog', name: 'Blog Content' },
      { id: 'seo-article', name: 'SEO Article' },
      { id: 'academic', name: 'Academic Writing' },
      { id: 'resume', name: 'Resume/CV' },
      { id: 'cover-letter', name: 'Cover Letter' },
      { id: 'sales-copy', name: 'Sales Copy' },
      { id: 'email', name: 'Email Writing' },
    ],
    limits: {
      minCharacters: 50,
      maxCharacters: 50000,
    },
  });
}
