'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Rocket, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CTABannerProps {
  variant?: 'primary' | 'secondary' | 'accent';
  title: string;
  description: string;
  buttonText: string;
  href: string;
  className?: string;
}

export function CTABanner({
  variant = 'primary',
  title,
  description,
  buttonText,
  href,
  className
}: CTABannerProps) {
  const variants = {
    primary: 'from-violet-600 to-purple-700 text-white',
    secondary: 'from-slate-800 to-slate-900 text-white',
    accent: 'from-amber-500 to-orange-600 text-white'
  };

  const icons = {
    primary: <Zap className="w-5 h-5" />,
    secondary: <Rocket className="w-5 h-5" />,
    accent: <Sparkles className="w-5 h-5" />
  };

  return (
    <div className={cn(
      'relative overflow-hidden rounded-xl bg-gradient-to-br p-6 sm:p-8 my-8',
      variants[variant],
      className
    )}>
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_30%,white,transparent_50%)]" />
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <div className="hidden sm:flex w-12 h-12 rounded-xl bg-white/20 items-center justify-center shrink-0 backdrop-blur-sm">
          {icons[variant]}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg sm:text-xl mb-1">{title}</h3>
          <p className="text-sm sm:text-base opacity-90 leading-relaxed">{description}</p>
        </div>
        <Link href={href} className="shrink-0">
          <Button
            variant="secondary"
            size="sm"
            className={cn(
              'bg-white font-semibold min-h-[44px] px-5',
              variant === 'primary' && 'text-violet-700 hover:bg-violet-50',
              variant === 'secondary' && 'text-slate-800 hover:bg-slate-50',
              variant === 'accent' && 'text-amber-700 hover:bg-amber-50'
            )}
          >
            {buttonText}
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
