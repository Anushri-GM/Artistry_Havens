
'use client';
import { Button } from '@/components/ui/button';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Upload } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';


function ArtisanDashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';

  return (
      <div className="flex flex-1 flex-col overflow-x-hidden relative">
          <main className="flex-1 overflow-y-auto p-4 pb-20">{children}</main>
           <div className="absolute bottom-4 right-4">
              <Button asChild size="lg" className="rounded-full h-16 w-16 shadow-lg">
                  <Link href={`/artisan/upload?lang=${lang}`}>
                      <Upload className="h-6 w-6" />
                      <span className="sr-only">Upload Product</span>
                  </Link>
              </Button>
          </div>
      </div>
  )
}

export default function ArtisanDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center">Loading...</div>}>
      <ArtisanDashboardLayoutContent>{children}</ArtisanDashboardLayoutContent>
    </Suspense>
  )
}
