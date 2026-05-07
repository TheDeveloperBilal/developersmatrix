'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AdSenseProps {
  slot: string;
  className?: string;
  style?: React.CSSProperties;
}

export function AdSenseAd({ slot, className, style }: AdSenseProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const adsbygoogle = (window as any).adsbygoogle || [];
      adsbygoogle.push({});
    } catch (e) {
      // Silently fail if adsbygoogle not loaded
    }
  }, []);

  return (
    <div ref={adRef} className={cn('ad-wrapper', className)} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-2091805600804724"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

// Pre-configured ad placements
export function SquareAd({ className }: { className?: string }) {
  return (
    <AdSenseAd
      slot="4458608037"
      className={cn('w-full flex justify-center', className)}
    />
  );
}

export function HorizontalAd({ className }: { className?: string }) {
  return (
    <AdSenseAd
      slot="9840523113"
      className={cn('w-full flex justify-center', className)}
    />
  );
}

// Legacy compatibility wrappers
export function AdBanner({ type, className }: { type: string; className?: string }) {
  const isHorizontal = type === 'header' || type === 'footer' || type === 'in-content';
  const Component = isHorizontal ? HorizontalAd : SquareAd;
  return <Component className={className} />;
}

export function HeaderAd({ className }: { className?: string }) {
  return <HorizontalAd className={cn('py-4', className)} />;
}

export function SidebarAd({ className }: { className?: string }) {
  return <SquareAd className={cn('py-4', className)} />;
}

export function InContentAd({ className }: { className?: string }) {
  return <HorizontalAd className={cn('py-6 max-w-[800px] mx-auto', className)} />;
}

export function FooterAd({ className }: { className?: string }) {
  return <HorizontalAd className={cn('py-4', className)} />;
}
