
'use client';
import { useSidebar, SidebarTrigger } from '@/components/ui/sidebar';
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { translateText } from '@/ai/flows/translate-text';


type TranslatedHeaderContent = {
    notificationsTitle: string;
    notification1: string;
    notification2: string;
    notification3: string;
    supportTitle: string;
    supportDescription: string;
    supportSubjectLabel: string;
    supportSubjectDefault: string;
    supportDescriptionLabel: string;
    supportDescriptionPlaceholder: string;
    supportSubmitButton: string;
    supportThanksMessage: string;
};


function PageHeader() {
  const { isMobile, open } = useSidebar();
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';
  
  const [translatedContent, setTranslatedContent] = useState<TranslatedHeaderContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const originalContent = {
        notificationsTitle: "Notifications",
        notification1: 'New like on "Terracotta Vase"',
        notification2: "New order from Anjali P.",
        notification3: 'Sponsor request from "Craft Ventures"',
        supportTitle: "Contact Support",
        supportDescription: "Have an issue? Fill out the form below and we'll get back to you.",
        supportSubjectLabel: "Subject",
        supportSubjectDefault: "Issue with payment",
        supportDescriptionLabel: "Description",
        supportDescriptionPlaceholder: "Please describe your issue...",
        supportSubmitButton: "Submit Ticket",
        supportThanksMessage: "Thanks for your patience. We will notify the support center of your discomfort."
    };

    const translate = async () => {
        if (lang === 'en') {
            setTranslatedContent(originalContent);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const texts = Object.values(originalContent);
            const translations = await Promise.all(texts.map(t => translateText({ text: t, targetLanguage: lang })));
            
            const keys = Object.keys(originalContent) as (keyof TranslatedHeaderContent)[];
            const newContent = keys.reduce((acc, key, index) => {
                acc[key] = translations[index].translatedText;
                return acc;
            }, {} as TranslatedHeaderContent);

            setTranslatedContent(newContent);
        } catch (error) {
            console.error("Failed to translate header", error);
            setTranslatedContent(originalContent);
        } finally {
            setIsLoading(false);
        }
    };
    translate();
  }, [lang]);

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
            <DropdownMenuLabel>{isLoading ? '...' : translatedContent?.notificationsTitle}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{isLoading ? '...' : translatedContent?.notification1}</DropdownMenuItem>
            <DropdownMenuItem>{isLoading ? '...' : translatedContent?.notification2}</DropdownMenuItem>
            <DropdownMenuItem>{isLoading ? '...' : translatedContent?.notification3}</DropdownMenuItem>
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
              <SheetTitle>{isLoading ? '...' : translatedContent?.supportTitle}</SheetTitle>
              <SheetDescription>
                {isLoading ? '...' : translatedContent?.supportDescription}
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  {isLoading ? '...' : translatedContent?.supportSubjectLabel}
                </Label>
                <Input id="name" defaultValue={isLoading ? '...' : translatedContent?.supportSubjectDefault} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  {isLoading ? '...' : translatedContent?.supportDescriptionLabel}
                </Label>
                <Textarea id="username" placeholder={isLoading ? '...' : translatedContent?.supportDescriptionPlaceholder} className="col-span-3" />
              </div>
            </div>
            <Button type="submit" className="w-full">
              {isLoading ? '...' : translatedContent?.supportSubmitButton}
            </Button>
            <p className="mt-4 text-center text-sm text-muted-foreground">
                {isLoading ? '...' : translatedContent?.supportThanksMessage}
            </p>
          </SheetContent>
        </Sheet>

        <Button
          variant="ghost"
          size="icon"
          className="bg-primary/10 text-primary hover:bg-primary/20"
        >
          <Mic className="h-5 w-5" />
          <span className="sr-only">Voice Command</span>
        </Button>
      </div>
    </header>
  );
}


function ArtisanDashboardLayoutContent({ children }: { children: React.ReactNode }) {
  return (
      <SidebarProvider>
          <div className="flex flex-1 flex-col overflow-x-hidden">
              <PageHeader />
              <main className="overflow-auto p-4">{children}</main>
          </div>
      </SidebarProvider>
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
