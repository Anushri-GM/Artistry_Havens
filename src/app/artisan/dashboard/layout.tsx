'use client';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArtistryHavensLogo } from '@/components/icons';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const avatar = PlaceHolderImages.find(img => img.id === 'avatar-1');

const navItems = [
  { href: '/artisan/dashboard', label: 'Home', icon: Home },
  { href: '/artisan/dashboard/trends', label: 'Trends', icon: AreaChart },
  { href: '/artisan/dashboard/statistics', label: 'Statistics', icon: AreaChart },
  { href: '/artisan/dashboard/revenue', label: 'Revenue', icon: BadgeIndianRupee },
  { href: '/artisan/dashboard/sponsors', label: 'Sponsors', icon: Handshake },
  { href: '/artisan/dashboard/upload', label: 'Upload Product', icon: Upload },
  { type: 'divider' },
  { href: '/artisan/dashboard/orders', label: 'My Orders', icon: Box },
  { href: '/artisan/dashboard/requests', label: 'Order Requests', icon: Send },
  { href: '/artisan/dashboard/saved', label: 'Saved Collection', icon: Bookmark },
  { type: 'divider' },
  { href: '/artisan/dashboard/profile', label: 'My Profile', icon: User },
];

function PageHeader() {
  const { isMobile } = useSidebar();
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <SidebarTrigger className="md:hidden" />
        {isMobile && <ArtistryHavensLogo className="h-6 w-6 text-primary" />}
        <div className="flex w-full items-center justify-end gap-4">

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
                    <Input id="name" value="Issue with payment" className="col-span-3" />
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
        
        <Button variant="ghost" size="icon">
            <Mic className="h-5 w-5" />
            <span className="sr-only">Voice Command</span>
        </Button>
        </div>
    </header>
  );
}

export default function ArtisanDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
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
                  <div key={index} className="my-2 h-px bg-border mx-3" />
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
             <Link href="/artisan/login">
                <SidebarMenuButton>
                    <LogOut />
                    <span>Logout</span>
                </SidebarMenuButton>
            </Link>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex-1">
          <PageHeader />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
