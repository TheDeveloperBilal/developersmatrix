import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - List all links
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'links';

    if (type === 'bio') {
      const username = searchParams.get('username');
      
      if (username) {
        const bioPage = await prisma.bioPage.findUnique({
          where: { username },
          include: {
            links: { orderBy: { order: 'asc' } },
            socials: true
          }
        });
        
        if (!bioPage) {
          return NextResponse.json({ success: false, error: 'Bio page not found' }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, bioPage });
      }
      
      const bioPages = await prisma.bioPage.findMany({
        include: {
          links: true,
          socials: true
        }
      });
      
      return NextResponse.json({ success: true, bioPages });
    }

    const links = await prisma.shortLink.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { analytics: true } }
      }
    });

    return NextResponse.json({ 
      success: true, 
      links: links.map(link => ({
        ...link,
        analyticsCount: link._count.analytics
      }))
    });
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch links' },
      { status: 500 }
    );
  }
}

// POST - Create a new short link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, originalUrl, shortCode, title, expiresAt, username, displayName, bio, theme, links, socials } = body;

    // Create bio page
    if (type === 'bio') {
      // Check if username exists
      const existing = await prisma.bioPage.findUnique({
        where: { username }
      });

      if (existing) {
        return NextResponse.json(
          { success: false, error: 'Username already taken' },
          { status: 400 }
        );
      }

      const bioPage = await prisma.bioPage.create({
        data: {
          username,
          displayName: displayName || username,
          bio,
          theme: theme || 'gradient',
          links: links ? {
            create: links.map((link: { title: string; url: string; icon?: string }, index: number) => ({
              title: link.title,
              url: link.url,
              icon: link.icon || 'link',
              order: index
            }))
          } : undefined,
          socials: socials ? {
            create: Object.entries(socials)
              .filter(([_, value]) => value)
              .map(([platform, username]) => ({
                platform,
                username: username as string
              }))
          } : undefined
        },
        include: {
          links: true,
          socials: true
        }
      });

      return NextResponse.json({ success: true, bioPage });
    }

    // Create short link
    if (!originalUrl) {
      return NextResponse.json(
        { success: false, error: 'Original URL is required' },
        { status: 400 }
      );
    }

    // Validate URL
    try {
      new URL(originalUrl);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Generate or validate short code
    let finalShortCode = shortCode;
    if (!finalShortCode) {
      // Generate random short code
      finalShortCode = Math.random().toString(36).substring(2, 8);
    }

    // Check if short code already exists
    const existing = await prisma.shortLink.findUnique({
      where: { shortCode: finalShortCode }
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Short code already exists' },
        { status: 400 }
      );
    }

    const link = await prisma.shortLink.create({
      data: {
        shortCode: finalShortCode,
        originalUrl,
        title: title || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null
      }
    });

    return NextResponse.json({ 
      success: true, 
      link: {
        ...link,
        shortUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://developersmatrix.com'}/l/${link.shortCode}`
      }
    });
  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create link' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a link
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Link ID is required' },
        { status: 400 }
      );
    }

    if (type === 'bio') {
      await prisma.bioPage.delete({ where: { id } });
    } else {
      await prisma.shortLink.delete({ where: { id } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting link:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete link' },
      { status: 500 }
    );
  }
}

// PUT - Update a link
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, type, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Link ID is required' },
        { status: 400 }
      );
    }

    if (type === 'bio') {
      const { displayName, bio, theme, links, socials } = updates;
      
      // Update bio page
      await prisma.bioPage.update({
        where: { id },
        data: {
          displayName,
          bio,
          theme
        }
      });

      // Update links if provided
      if (links) {
        // Delete existing links
        await prisma.bioLink.deleteMany({ where: { bioPageId: id } });
        
        // Create new links
        await prisma.bioLink.createMany({
          data: links.map((link: { title: string; url: string; icon?: string }, index: number) => ({
            title: link.title,
            url: link.url,
            icon: link.icon || 'link',
            order: index,
            bioPageId: id
          }))
        });
      }

      // Update socials if provided
      if (socials) {
        await prisma.bioSocial.deleteMany({ where: { bioPageId: id } });
        
        const socialEntries = Object.entries(socials)
          .filter(([_, value]) => value)
          .map(([platform, username]) => ({
            platform,
            username: username as string,
            bioPageId: id
          }));
        
        if (socialEntries.length > 0) {
          await prisma.bioSocial.createMany({ data: socialEntries });
        }
      }

      const updated = await prisma.bioPage.findUnique({
        where: { id },
        include: { links: true, socials: true }
      });

      return NextResponse.json({ success: true, bioPage: updated });
    }

    // Update short link
    const link = await prisma.shortLink.update({
      where: { id },
      data: {
        title: updates.title,
        expiresAt: updates.expiresAt ? new Date(updates.expiresAt) : null
      }
    });

    return NextResponse.json({ success: true, link });
  } catch (error) {
    console.error('Error updating link:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update link' },
      { status: 500 }
    );
  }
}
