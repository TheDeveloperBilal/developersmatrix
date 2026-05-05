import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link2, Home, Search, Clock, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: "Link Not Found - DevelopersMatrix",
  description: "The link you're looking for doesn't exist or has expired.",
  robots: {
    index: false,
    follow: false
  }
};

export default function LinkNotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <img 
              src="/logo-small.png" 
              alt="DevelopersMatrix" 
              className="h-10 w-auto"
            />
          </Link>
        </div>

        {/* Not Found Card */}
        <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-xl">
          <CardContent className="p-8 text-center">
            {/* Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
              <Link2 className="w-10 h-10 text-red-400" />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-white mb-3">
              Link Not Found
            </h1>

            {/* Message */}
            <p className="text-gray-300 mb-6">
              The short link you're looking for doesn't exist, has expired, or may have been removed. 
              Please check the link and try again.
            </p>

            {/* Possible Reasons */}
            <div className="bg-white/5 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm font-medium text-gray-200 mb-2">Possible reasons:</p>
              <ul className="text-sm text-gray-400 space-y-2">
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 text-amber-400 shrink-0" />
                  <span>The link was entered incorrectly</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 text-amber-400 shrink-0" />
                  <span>The link has expired</span>
                </li>
                <li className="flex items-start gap-2">
                  <Link2 className="w-4 h-4 mt-0.5 text-amber-400 shrink-0" />
                  <span>The link was deleted by its creator</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/">
                <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white w-full sm:w-auto">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </Link>
              <Link href="/tools/link-manager">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 w-full sm:w-auto">
                  <Link2 className="w-4 h-4 mr-2" />
                  Create Your Own Link
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          © {new Date().getFullYear()} DevelopersMatrix. All rights reserved.
        </p>
      </div>
    </div>
  );
}
