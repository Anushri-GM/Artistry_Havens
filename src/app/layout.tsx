
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
  SidebarTrigger,
  useSidebar,
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
  Bell,
  HelpCircle,
  Mic,
  MicOff,
  Upload,
} from 'lucide-react';
import { ArtistryHavensLogo } from '@/components/icons';
import { Suspense, useEffect, useState } from 'react';
import { translateText } from '@/ai/flows/translate-text';
import { ArtisanProvider } from '@/context/ArtisanContext';
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
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';


const navItems = [
  { href: '/artisan/dashboard/home', label: 'Home', icon: Home, commands: ['home', 'dashboard', 'main', 'start', 'मुख', 'ড্যাশবোর্ড', 'హోమ్', 'வீடு', 'گھر'] },
  { href: '/artisan/dashboard/my-products', label: 'My Products', icon: Palette, commands: ['my products', 'products', 'items', 'creations', 'उत्पाद', 'পণ্য', 'ఉత్పత్తులు', 'பொருட்கள்', 'مصنوعات'] },
  { href: '/artisan/upload', label: 'Upload Product', icon: Upload, commands: ['upload', 'add product', 'new item', 'अपलोड', 'আপলোড', 'అప్లోడ్', 'பதிவேற்று', 'اپ لوڈ'] },
  { href: '/artisan/dashboard/trends', label: 'Trends', icon: AreaChart, commands: ['trends', 'popular', 'ट्रेंड्स', 'প্রবণতা', 'ట్రెండ్లు', 'போக்குகள்', 'رجحانات'] },
  { href: '/artisan/dashboard/statistics', label: 'Statistics', icon: BarChart, commands: ['statistics', 'stats', 'performance', 'analytics', 'आंकड़े', 'পরিসংখ্যান', 'గణాంకాలు', 'புள்ளிவிவரங்கள்', 'اعداد و شمار'] },
  { href: '/artisan/dashboard/revenue', label: 'Finance', icon: BadgeIndianRupee, commands: ['finance', 'income', 'revenue', 'earnings', 'money', 'वित्त', 'অর্থ', 'ఆదాయం', 'வருவாய்', 'مالیات'] },
  { href: '/artisan/dashboard/sponsors', label: 'Sponsors', icon: Handshake, commands: ['sponsors', 'partners', 'sponsorships', 'प्रायोजक', 'পৃষ্ঠপোষক', 'స్పాన్సర్‌లు', 'ఆதரவாளர்கள்', 'کفیل'] },
  { type: 'divider' },
  { href: '/artisan/dashboard/orders', label: 'My Orders', icon: Box, commands: ['my orders', 'orders', 'sales', 'मेरे ऑर्डर', 'আমার আদেশ', 'నా ఆర్డర్లు', 'எனது ஆர்டர்கள்', 'میرے احکامات'] },
  { href: '/artisan/dashboard/requests', label: 'Order Requests', icon: Send, commands: ['order requests', 'requests', 'custom orders', 'अनुरोध', 'অনুরোধ', 'विनंत्या', 'கோரிக்கைகள்', 'درخواستیں'] },
  { href: '/artisan/dashboard/saved', label: 'Saved Collection', icon: Bookmark, commands: ['saved', 'collection', 'favorites', 'bookmarks', 'बुकमार्क', 'সংরক্ষিত', 'సేవ్ చేయబడింది', 'சேமித்தவை', 'محفوظ'] },
  { type: 'divider' },
  { href: '/artisan/dashboard/profile', label: 'My Profile', icon: User, commands: ['my profile', 'profile', 'account', 'प्रोफ़ाइल', 'প্রোফাইল', 'ప్రొఫైల్', 'சுயவிவரம்', 'پروفائل'] },
];

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
    toasts: {
        voiceNotSupportedTitle: string;
        voiceNotSupportedDesc: string;
        listeningTitle: string;
        listeningDesc: string;
        voiceErrorTitle: string;
        voiceErrorMicDenied: string;
        voiceErrorGeneric: string;
        navigatingTitle: string;
        navigatingDesc: (label: string) => string;
        commandNotUnderstoodTitle: string;
        commandNotUnderstoodDesc: (cmd: string) => string;
    }
};


function PageHeader() {
  const { isMobile, open } = useSidebar();
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';
  const router = useRouter();
  const { toast } = useToast();

  const [isRecording, setIsRecording] = useState(false);
  
  const [translatedContent, setTranslatedContent] = useState<TranslatedHeaderContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleVoiceCommand = () => {
    if (!translatedContent) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        variant: 'destructive',
        title: translatedContent.toasts.voiceNotSupportedTitle,
        description: translatedContent.toasts.voiceNotSupportedDesc,
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
      toast({ title: translatedContent.toasts.listeningTitle, description: translatedContent.toasts.listeningDesc });
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      toast({
        variant: 'destructive',
        title: translatedContent.toasts.voiceErrorTitle,
        description: event.error === 'not-allowed' ? translatedContent.toasts.voiceErrorMicDenied : translatedContent.toasts.voiceErrorGeneric,
      });
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      
      const foundNavItem = navItems.find(item => 
        item.type !== 'divider' && item.commands && item.commands.some(cmd => transcript.includes(cmd))
      );

      if (foundNavItem && foundNavItem.href) {
        toast({
          title: translatedContent.toasts.navigatingTitle,
          description: translatedContent.toasts.navigatingDesc(foundNavItem.label),
        });
        router.push(`${foundNavItem.href}?lang=${lang}`);
      } else {
        toast({
          variant: 'destructive',
          title: translatedContent.toasts.commandNotUnderstoodTitle,
          description: translatedContent.toasts.commandNotUnderstoodDesc(transcript),
        });
      }
    };

    recognition.start();
  };


  useEffect(() => {
    const originalContent: TranslatedHeaderContent = {
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
        supportThanksMessage: "Thanks for your patience. We will notify the support center of your discomfort.",
        toasts: {
            voiceNotSupportedTitle: 'Voice Commands Not Supported',
            voiceNotSupportedDesc: 'Your browser does not support the Web Speech API.',
            listeningTitle: 'Listening...',
            listeningDesc: 'Say a command like "Go to my products".',
            voiceErrorTitle: 'Voice Recognition Error',
            voiceErrorMicDenied: 'Microphone access was denied.',
            voiceErrorGeneric: 'An error occurred.',
            navigatingTitle: 'Navigating...',
            navigatingDesc: (label: string) => `Going to ${label}.`,
            commandNotUnderstoodTitle: 'Command Not Understood',
            commandNotUnderstoodDesc: (cmd: string) => `Sorry, I didn't recognize the command: "${cmd}"`,
        }
    };

    const translate = async () => {
        if (lang === 'en') {
            setTranslatedContent(originalContent);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const staticTexts = [
                originalContent.notificationsTitle,
                originalContent.notification1,
                originalContent.notification2,
                originalContent.notification3,
                originalContent.supportTitle,
                originalContent.supportDescription,
                originalContent.supportSubjectLabel,
                originalContent.supportSubjectDefault,
                originalContent.supportDescriptionLabel,
                originalContent.supportDescriptionPlaceholder,
                originalContent.supportSubmitButton,
                originalContent.supportThanksMessage,
                originalContent.toasts.voiceNotSupportedTitle,
                originalContent.toasts.voiceNotSupportedDesc,
                originalContent.toasts.listeningTitle,
                originalContent.toasts.listeningDesc,
                originalContent.toasts.voiceErrorTitle,
                originalContent.toasts.voiceErrorMicDenied,
                originalContent.toasts.voiceErrorGeneric,
                originalContent.toasts.navigatingTitle,
                originalContent.toasts.commandNotUnderstoodTitle,
            ];

            const translations = await Promise.all(staticTexts.map(t => translateText({ text: t, targetLanguage: lang })));
            
            let i = 0;
            const newContent: TranslatedHeaderContent = {
                notificationsTitle: translations[i++].translatedText,
                notification1: translations[i++].translatedText,
                notification2: translations[i++].translatedText,
                notification3: translations[i++].translatedText,
                supportTitle: translations[i++].translatedText,
                supportDescription: translations[i++].translatedText,
                supportSubjectLabel: translations[i++].translatedText,
                supportSubjectDefault: translations[i++].translatedText,
                supportDescriptionLabel: translations[i++].translatedText,
                supportDescriptionPlaceholder: translations[i++].translatedText,
                supportSubmitButton: translations[i++].translatedText,
                supportThanksMessage: translations[i++].translatedText,
                toasts: {
                    voiceNotSupportedTitle: translations[i++].translatedText,
                    voiceNotSupportedDesc: translations[i++].translatedText,
                    listeningTitle: translations[i++].translatedText,
                    listeningDesc: translations[i++].translatedText,
                    voiceErrorTitle: translations[i++].translatedText,
                    voiceErrorMicDenied: translations[i++].translatedText,
                    voiceErrorGeneric: translations[i++].translatedText,
                    navigatingTitle: translations[i++].translatedText,
                    commandNotUnderstoodTitle: translations[i++].translatedText,
                    navigatingDesc: (label: string) => ``,
                    commandNotUnderstoodDesc: (cmd: string) => ``,
                }
            };
            
            const goingToText = await translateText({ text: "Going to", targetLanguage: lang });
            newContent.toasts.navigatingDesc = (label: string) => `${goingToText.translatedText} ${label}.`;

            const notRecognizedText = await translateText({ text: "Sorry, I didn't recognize the command:", targetLanguage: lang });
            newContent.toasts.commandNotUnderstoodDesc = (cmd: string) => `${notRecognizedText.translatedText} "${cmd}"`;

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
           <SidebarTrigger className="h-9 w-9" />
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
          onClick={handleVoiceCommand}
          disabled={isRecording}
        >
          {isRecording ? <MicOff className="h-5 w-5 animate-pulse" /> : <Mic className="h-5 w-5" />}
          <span className="sr-only">Voice Command</span>
        </Button>
      </div>
    </header>
  );
}


function GlobalNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';
  
  const showNav = !['/artisan/login', '/artisan/category-selection', '/artisan/upload/preview'].includes(pathname) && pathname.startsWith('/artisan');
  
  const [translatedNavItems, setTranslatedNavItems] = useState(navItems.map(item => item.type === 'divider' ? item : { ...item, label: item.label! } ));
  const [translatedLogout, setTranslatedLogout] = useState("Logout");

  useEffect(() => {
    const translateNav = async () => {
      if (lang === 'en') {
        setTranslatedNavItems(navItems.map(item => item.type === 'divider' ? item : { ...item, label: item.label! } ));
        setTranslatedLogout("Logout");
        return;
      }
      try {
        const itemLabels = navItems.filter(item => item.type !== 'divider').map(item => item.label!);
        const translations = await Promise.all([
            ...itemLabels.map(label => translateText({ text: label, targetLanguage: lang })),
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
        
        setTranslatedNavItems(translatedItems.map(item => item.type === 'divider' ? item : { ...item, label: item.label! }));
        setTranslatedLogout(translations[translations.length-1].translatedText);

      } catch (error) {
        console.error("Failed to translate nav items", error);
        setTranslatedNavItems(navItems.map(item => item.type === 'divider' ? item : { ...item, label: item.label! } ));
        setTranslatedLogout("Logout");
      }
    };
    translateNav();
  }, [lang]);

  if (!showNav) {
      if (pathname.startsWith('/buyer/product/')) {
        return <div className="h-full flex flex-col">{children}</div>;
      }
      return <>{children}</>;
  }

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
            <Link href={`/language?lang=${lang}`}>
                <SidebarMenuButton>
                    <LogOut />
                    <span>{translatedLogout}</span>
                </SidebarMenuButton>
            </Link>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-1 flex-col overflow-hidden">
            <PageHeader />
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
      </div>
  )
}


function RootLayoutContent({ children }: { children: React.ReactNode }) {
    return (
        <ArtisanProvider>
          <SidebarProvider>
              <GlobalNav>{children}</GlobalNav>
          </SidebarProvider>
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

    
