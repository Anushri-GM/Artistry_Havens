
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, MessageSquare, ThumbsDown } from "lucide-react";
import { mockSponsors as initialSponsors, mockSponsorRequests as initialSponsorRequests } from "@/lib/mock-data";
import { translateText } from '@/ai/flows/translate-text';

type TranslatedContent = {
    title: string;
    description: string;
    mySponsorsTab: string;
    sponsorRequestsTab: string;
    mySponsorsTitle: string;
    mySponsorsDescription: string;
    expiresLabel: string;
    shareLabel: string;
    chatButton: string;
    terminateButton: string;
    noSponsorsText: string;
    sponsorRequestsTitle: string;
    sponsorRequestsDescription: string;
    denyButton: string;
    acceptButton: string;
    noRequestsText: string;
};

function Sponsors() {
  const [sponsors, setSponsors] = useState(initialSponsors);
  const [sponsorRequests, setSponsorRequests] = useState(initialSponsorRequests);
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';
  
  const [translatedContent, setTranslatedContent] = useState<TranslatedContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const originalContent = {
        title: "Sponsors",
        description: "Manage your partnerships and requests.",
        mySponsorsTab: "My Sponsors",
        sponsorRequestsTab: "Sponsor Requests",
        mySponsorsTitle: "My Sponsors",
        mySponsorsDescription: "List of your active sponsors.",
        expiresLabel: "Expires",
        shareLabel: "Share",
        chatButton: "Chat",
        terminateButton: "Terminate",
        noSponsorsText: "You have no active sponsors.",
        sponsorRequestsTitle: "Sponsor Requests",
        sponsorRequestsDescription: "Review and respond to new sponsorship opportunities.",
        denyButton: "Deny",
        acceptButton: "Accept",
        noRequestsText: "You have no new sponsor requests.",
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
            const translations = await Promise.all(
                texts.map(text => translateText({ text, targetLanguage: lang }))
            );
            const keys = Object.keys(originalContent) as (keyof TranslatedContent)[];
            const newContent = keys.reduce((acc, key, index) => {
                acc[key] = translations[index].translatedText;
                return acc;
            }, {} as TranslatedContent);
            setTranslatedContent(newContent);
        } catch (error) {
            console.error("Failed to translate sponsors page", error);
            setTranslatedContent(originalContent);
        } finally {
            setIsLoading(false);
        }
    };
    translate();
  }, [lang]);

  const handleAcceptRequest = (requestId: string) => {
    const request = sponsorRequests.find(r => r.id === requestId);
    if (!request) return;

    const newSponsor = {
      id: `sponsor-${Date.now()}`,
      name: request.name,
      avatar: request.avatar,
      status: 'Active',
      expiry: '2025-12-31', // Example expiry
      share: 15, // Example share
    };

    setSponsors(prevSponsors => [newSponsor, ...prevSponsors]);
    setSponsorRequests(prevRequests => prevRequests.filter(r => r.id !== requestId));
  };

  const handleDenyRequest = (requestId: string) => {
    setSponsorRequests(prevRequests => prevRequests.filter(r => r.id !== requestId));
  };

   const handleTerminate = (sponsorId: string) => {
    setSponsors(prevSponsors => prevSponsors.filter(s => s.id !== sponsorId));
  };

  if (isLoading || !translatedContent) {
    return <div className="flex h-full items-center justify-center">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">{translatedContent.title}</h1>
        <p className="text-muted-foreground">{translatedContent.description}</p>
      </div>

      <Tabs defaultValue="my-sponsors">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-sponsors">{translatedContent.mySponsorsTab}</TabsTrigger>
          <TabsTrigger value="sponsor-requests">{translatedContent.sponsorRequestsTab} {sponsorRequests.length > 0 && `(${sponsorRequests.length})`}</TabsTrigger>
        </TabsList>

        <TabsContent value="my-sponsors" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{translatedContent.mySponsorsTitle}</CardTitle>
              <CardDescription>{translatedContent.mySponsorsDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sponsors.length > 0 ? sponsors.map(sponsor => (
                <div key={sponsor.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={sponsor.avatar?.imageUrl} alt={sponsor.name} />
                      <AvatarFallback>{sponsor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-base">{sponsor.name}</p>
                      <p className="text-xs text-muted-foreground">{translatedContent.expiresLabel}: {sponsor.expiry}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-center flex-wrap justify-end">
                    <Badge variant="secondary" className="whitespace-nowrap text-xs">{sponsor.share}% {translatedContent.shareLabel}</Badge>
                     <Button variant="outline" size="sm" className="h-8"><MessageSquare className="h-4 w-4 mr-2"/>{translatedContent.chatButton}</Button>
                    <Button variant="destructive" size="sm" className="h-8" onClick={() => handleTerminate(sponsor.id)}>{translatedContent.terminateButton}</Button>
                  </div>
                </div>
              )) : <p className="text-sm text-muted-foreground text-center">{translatedContent.noSponsorsText}</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sponsor-requests" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{translatedContent.sponsorRequestsTitle}</CardTitle>
              <CardDescription>{translatedContent.sponsorRequestsDescription}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sponsorRequests.length > 0 ? sponsorRequests.map(request => (
                     <Card key={request.id}>
                        <CardHeader>
                            <div className="flex items-start gap-4">
                                <Avatar>
                                    <AvatarImage src={request.avatar?.imageUrl} alt={request.name} />
                                    <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="font-headline text-lg">{request.name}</CardTitle>
                                    <CardDescription className="pt-2 italic">"{request.message}"</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardFooter className="flex flex-wrap justify-end gap-2">
                           <Button size="sm" variant="outline" onClick={() => handleDenyRequest(request.id)}><ThumbsDown className="h-4 w-4 mr-2"/>{translatedContent.denyButton}</Button>
                           <Button size="sm" onClick={() => handleAcceptRequest(request.id)}><Check className="h-4 w-4 mr-2"/>{translatedContent.acceptButton}</Button>
                        </CardFooter>
                     </Card>
                )) : <p className="text-sm text-muted-foreground text-center">{translatedContent.noRequestsText}</p>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function SponsorsPage() {
    return (
        <Suspense fallback={<div className="flex h-full items-center justify-center">Loading...</div>}>
            <Sponsors />
        </Suspense>
    )
}

    