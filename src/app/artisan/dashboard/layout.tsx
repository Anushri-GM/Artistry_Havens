
'use client';
import {
  useSidebar,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { ArtistryHavensLogo } from '@/components/icons';
import { Bell, HelpCircle, Mic } from 'lucide-react';
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

function PageHeader() {
  const { isMobile, open } = useSidebar();
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-sm">
        {isMobile ? (
          <div className="flex items-center gap-2">
            <ArtistryHavensLogo className="h-6 w-6 text-primary" />
             <h1 className="font-headline text-lg font-bold">Artistry Havens</h1>
          </div>
        ) : (
          <div className="flex items-center gap-4">
              <SidebarTrigger className="h-9 w-9" />
              {!open && (
                <>
                    <ArtistryHavensLogo className="h-6 w-6 text-primary" />
                    <h1 className="font-headline text-lg font-bold">Artistry Havens</h1>
                </>
              )}
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

export default function ArtisanDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
        <div className="flex flex-1 flex-col overflow-x-hidden">
            <PageHeader />
            <main className="p-4 overflow-auto">
                {children}
            </main>
        </div>
    </SidebarProvider>
  );
}
