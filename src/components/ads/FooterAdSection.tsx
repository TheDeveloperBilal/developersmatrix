'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils';

export function FooterAdSection() {
  useEffect(() => {
    try {
      const adsbygoogle = (window as any).adsbygoogle || [];
      adsbygoogle.push({});
    } catch (e) {
      // Silently fail if adsbygoogle not loaded
    }
  }, []);

  return (
    <div className={cn('w-full flex justify-center py-4')}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-2091805600804724"
        data-ad-slot="9840523113"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
