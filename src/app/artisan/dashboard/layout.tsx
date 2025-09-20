
'use client';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';


function ArtisanDashboardLayoutContent({ children }: { children: React.ReactNode }) {
  return (
      <div className="flex flex-1 flex-col overflow-x-hidden">
          <main className="overflow-auto p-4">{children}</main>
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
