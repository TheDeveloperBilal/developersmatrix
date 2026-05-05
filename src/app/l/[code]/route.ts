import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    // Find the short link
    const link = await prisma.shortLink.findUnique({
      where: { shortCode: code }
    });

    // Link not found - redirect to not found page
    if (!link) {
      return NextResponse.redirect(new URL(`/l/not-found?code=${code}`, request.url));
    }

    // Check if link has expired
    if (link.expiresAt && new Date() > link.expiresAt) {
      return NextResponse.redirect(new URL(`/l/not-found?code=${code}&expired=true`, request.url));
    }

    // Detect device type
    const userAgent = request.headers.get('user-agent') || '';
    const deviceType = detectDeviceType(userAgent);

    // Get referrer
    const referrer = request.headers.get('referer') || null;

    // Get IP address
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Record analytics
    await prisma.linkAnalytics.create({
      data: {
        linkId: link.id,
        deviceType,
        referrer,
        userAgent,
        ipAddress: ip
      }
    });

    // Increment click count
    await prisma.shortLink.update({
      where: { id: link.id },
      data: { clicks: { increment: 1 } }
    });

    // Redirect to original URL
    return NextResponse.redirect(link.originalUrl);
  } catch (error) {
    console.error('Error processing short link:', error);
    const { code } = await params;
    return NextResponse.redirect(new URL(`/l/not-found?code=${code}&error=true`, request.url));
  }
}

function detectDeviceType(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    return 'mobile';
  }
  
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    return 'tablet';
  }
  
  return 'desktop';
}
