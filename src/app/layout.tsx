
'use client';
import { usePathname } from 'next/navigation';
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
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import {
  AreaChart,
  BadgeIndianRupee,
  Bell,
  Box,
  Heart,
  Home,
  LogOut,
  Palette,
  Send,
  Settings,
  User,
  HelpCircle,
  Handshake,
  Mic,
  Bookmark,
  Upload,
} from 'lucide-react';
import { ArtistryHavensLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const navItems = [
  { href: '/artisan/dashboard/home', label: 'Home', icon: Home },
  { href: '/artisan/dashboard/trends', label: 'Trends', icon: AreaChart },
  { href: '/artisan/dashboard/statistics', label: 'Statistics', icon: AreaChart },
  { href: '/artisan/dashboard/revenue', label: 'Revenue', icon: BadgeIndianRupee },
  { href: '/artisan/dashboard/sponsors', label: 'Sponsors', icon: Handshake },
  { type: 'divider' },
  { href: '/artisan/dashboard/orders', label: 'My Orders', icon: Box },
  { href: '/artisan/dashboard/requests', label: 'Order Requests', icon: Send },
  { href: '/artisan/dashboard/saved', label: 'Saved Collection', icon: Bookmark },
  { type: 'divider' },
  { href: '/artisan/dashboard/profile', label: 'My Profile', icon: User },
];

function PageHeader() {
  const { isMobile, open } = useSidebar();
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-sm">
        <SidebarTrigger className="md:hidden" />
        {isMobile && (
          <div className="flex items-center gap-2">
            <ArtistryHavensLogo className="h-6 w-6 text-primary" />
             <h1 className="font-headline text-lg font-bold">Artistry Havens</h1>
          </div>
        )}
         {!isMobile && (
          <div className="flex items-center gap-4">
              <SidebarTrigger />
              {!open && <ArtistryHavensLogo className="h-6 w-6 text-primary" />}
          </div>
        )}
        <div className="flex w-full items-center justify-end gap-1">

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>New like on "Terracotta Vase"</DropdownMenuItem>
                <DropdownMenuItem>New order from Anjali P.</DropdownMenuItem>
                <DropdownMenuItem>Sponsor request from "Craft Ventures"</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <HelpCircle className="h-5 w-5" />
                    <span className="sr-only">Support</span>
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                <SheetTitle>Contact Support</SheetTitle>
                <SheetDescription>
                    Have an issue? Fill out the form below and we'll get back to you.
                </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                    Subject
                    </Label>
                    <Input id="name" defaultValue="Issue with payment" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                    Description
                    </Label>
                    <Textarea id="username" placeholder="Please describe your issue..." className="col-span-3" />
                </div>
                </div>
                 <Button type="submit" className='w-full'>Submit Ticket</Button>
                 <p className="mt-4 text-center text-sm text-muted-foreground">Thanks for your patience. We will notify the support center of your discomfort.</p>
            </SheetContent>
        </Sheet>
        
        <Button variant="ghost" size="icon" className="bg-primary/10 text-primary hover:bg-primary/20">
            <Mic className="h-5 w-5" />
            <span className="sr-only">Voice Command</span>
        </Button>
        </div>
    </header>
  );
}

function GlobalNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pathsWithoutNav = ['/', '/language', '/role-selection'];

  if (pathsWithoutNav.includes(pathname) || pathname.startsWith('/artisan/login') || pathname.startsWith('/buyer/login')) {
    return <>{children}</>;
  }
  
  return (
        <SidebarProvider>
          <div className="flex h-[100svh] overflow-hidden">
            <Sidebar collapsible="icon" className="border-r">
              <SidebarHeader className="flex items-center gap-2 p-2">
                <ArtistryHavensLogo className="h-8 w-8 text-primary" />
                <h1 className="font-headline text-2xl font-bold group-data-[collapsible=icon]:hidden">
                  Artistry Havens
                </h1>
              </SidebarHeader>
              <SidebarContent>
                <SidebarMenu>
                  {navItems.map((item, index) =>
                    item.type === 'divider' ? (
                      <div key={index} className="my-2 h-px bg-border mx-3 group-data-[collapsible=icon]:mx-2" />
                    ) : (
                      <SidebarMenuItem key={item.label}>
                        <Link href={item.href!}>
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
                <Link href="/role-selection">
                    <SidebarMenuButton>
                        <LogOut />
                        <span>Logout</span>
                    </SidebarMenuButton>
                </Link>
              </SidebarFooter>
            </Sidebar>
            <div className="flex flex-1 flex-col overflow-hidden">
              <PageHeader />
              <main className="flex-1 overflow-y-auto p-4">{children}</main>
            </div>
          </div>
        </SidebarProvider>
  );
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
            <div className="w-full max-w-[375px] aspect-[9/19] bg-background min-h-screen shadow-2xl overflow-y-auto">
                <GlobalNav>{children}</GlobalNav>
            </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}