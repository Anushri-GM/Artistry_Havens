
'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import {
  AreaChart,
  BadgeIndianRupee,
  BarChart,
  Box,
  Handshake,
  Home,
  LogOut,
  Palette,
  Send,
  User,
  Bookmark,
} from 'lucide-react';
import { ArtistryHavensLogo } from '@/components/icons';
import { Suspense, useEffect, useState } from 'react';
import { translateText } from '@/ai/flows/translate-text';
import { ArtisanProvider } from '@/context/ArtisanContext';

const navItems = [
  { href: '/artisan/dashboard/home', label: 'Home', icon: Home },
  { href: '/artisan/dashboard/my-products', label: 'My Products', icon: Palette },
  { href: '/artisan/dashboard/trends', label: 'Trends', icon: AreaChart },
  { href: '/artisan/dashboard/statistics', label: 'Statistics', icon: BarChart },
  { href: '/artisan/dashboard/revenue', label: 'Income', icon: BadgeIndianRupee },
  { href: '/artisan/dashboard/sponsors', label: 'Sponsors', icon: Handshake },
  { type: 'divider' },
  { href: '/artisan/dashboard/orders', label: 'My Orders', icon: Box },
  { href: '/artisan/dashboard/requests', label: 'Order Requests', icon: Send },
  { href: '/artisan/dashboard/saved', label: 'Saved Collection', icon: Bookmark },
  { type: 'divider' },
  { href: '/artisan/dashboard/profile', label: 'My Profile', icon: User },
];


function GlobalNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';
  
  const pathsWithoutNav = ['/', '/language', '/role-selection', '/buyer/login', '/artisan/login', '/sponsor', '/artisan/dashboard', '/artisan/category-selection', '/artisan/upload/preview'];
  const isBuyerPath = pathname.startsWith('/buyer');
  const isUploadPath = pathname === '/artisan/upload';
  const isDashboardLayout = pathname.startsWith('/artisan/dashboard/');
  
  const [translatedNavItems, setTranslatedNavItems] = useState(navItems);
  const [translatedLogout, setTranslatedLogout] = useState("Logout");

  useEffect(() => {
    const translateNav = async () => {
      if (lang === 'en') {
        setTranslatedNavItems(navItems);
        setTranslatedLogout("Logout");
        return;
      }
      try {
        const itemLabels = navItems.filter(item => item.type !== 'divider').map(item => item.label);
        const translations = await Promise.all([
            ...itemLabels.map(label => translateText({ text: label!, targetLanguage: lang })),
            translateText({text: "Logout", targetLanguage: lang})
        ]);

        const translatedItems = navItems.map(item => {
            if (item.type === 'divider') return item;
            const originalIndex = navItems.filter(it => it.type !== 'divider').findIndex(it => it.label === item.label);
            return {
                ...item,
                label: translations[originalIndex].translatedText
            };
        });
        
        setTranslatedNavItems(translatedItems);
        setTranslatedLogout(translations[translations.length-1].translatedText);

      } catch (error) {
        console.error("Failed to translate nav items", error);
        setTranslatedNavItems(navItems);
        setTranslatedLogout("Logout");
      }
    };
    translateNav();
  }, [lang]);


  if (pathsWithoutNav.includes(pathname) || isBuyerPath || isUploadPath) {
    if (pathname.startsWith('/buyer/product/')) {
       return <div className="h-full flex flex-col">{children}</div>;
    }
    return <>{children}</>;
  }

  if (isDashboardLayout) {
     return (
        <div className="flex h-full overflow-hidden">
          <Sidebar collapsible="icon" className="border-r">
            <SidebarHeader className="flex items-center gap-2 p-2">
              <ArtistryHavensLogo className="h-8 w-8 text-primary" />
              <h1 className="font-headline text-2xl font-bold group-data-[collapsible=icon]:hidden">
                Artistry Havens
              </h1>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {translatedNavItems.map((item, index) =>
                  item.type === 'divider' ? (
                    <div key={index} className="my-2 h-px bg-border mx-3 group-data-[collapsible=icon]:mx-2" />
                  ) : (
                    <SidebarMenuItem key={item.label}>
                      <Link href={`${item.href!}?lang=${lang}`}>
                        <SidebarMenuButton
                          isActive={pathname === item.href}
                          tooltip={{ children: item.label, side: 'right' }}
                        >
                          <item.icon />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  )
                )}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="flex flex-col gap-2 p-2">
              <Link href={`/role-selection?lang=${lang}`}>
                  <SidebarMenuButton>
                      <LogOut />
                      <span>{translatedLogout}</span>
                  </SidebarMenuButton>
              </Link>
            </SidebarFooter>
          </Sidebar>
          {children}
        </div>
     )
  }
  
  return <>{children}</>;
}


function RootLayoutContent({ children }: { children: React.ReactNode }) {
    return (
        <ArtisanProvider>
            <GlobalNav>{children}</GlobalNav>
        </ArtisanProvider>
    )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,200..900;1,7..72,200..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <div className="flex justify-center bg-gray-200">
            <div className="w-full max-w-[375px] bg-background h-screen shadow-2xl flex flex-col">
                <Suspense fallback={<div className="flex-1">{children}</div>}>
                    <RootLayoutContent>{children}</RootLayoutContent>
                </Suspense>
            </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
