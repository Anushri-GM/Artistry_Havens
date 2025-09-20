
'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Check, ThumbsDown, Wand2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useArtisan } from "@/context/ArtisanContext";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { translateText } from "@/ai/flows/translate-text";

type TranslatedContent = {
    title: string;
    description: string;
    requestFrom: string;
    denyButton: string;
    acceptButton: string;
    aiMockup: string;
    reference: string;
    noRequests: string;
    buyerNames: Record<string, string>;
};

function OrderRequests() {
  const { requests, acceptRequest, denyRequest } = useArtisan();
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';

  const [translatedContent, setTranslatedContent] = useState<TranslatedContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const originalContent = {
        title: "Order Requests",
        description: "Review custom requests from potential buyers.",
        requestFrom: "Request from",
        denyButton: "Deny",
        acceptButton: "Accept",
        aiMockup: "AI Mockup",
        reference: "Reference",
        noRequests: "You have no new order requests.",
    };

    const translate = async () => {
        if (lang === 'en') {
            const buyerNames = requests.reduce((acc, r) => ({...acc, [r.id]: r.buyer}), {});
            setTranslatedContent({...originalContent, buyerNames});
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            const texts = [
                ...Object.values(originalContent),
                ...requests.map(r => r.buyer)
            ];
            const translations = await Promise.all(texts.map(t => translateText({ text: t, targetLanguage: lang })));
            let i = 0;
            const newContent = {
                title: translations[i++].translatedText,
                description: translations[i++].translatedText,
                requestFrom: translations[i++].translatedText,
                denyButton: translations[i++].translatedText,
                acceptButton: translations[i++].translatedText,
                aiMockup: translations[i++].translatedText,
                reference: translations[i++].translatedText,
                noRequests: translations[i++].translatedText,
            };

            const buyerNames = requests.reduce((acc, request, index) => {
                acc[request.id] = translations[i + index].translatedText;
                return acc;
            }, {} as Record<string, string>);

            setTranslatedContent({...newContent, buyerNames});
        } catch (error) {
            console.error("Failed to translate requests page", error);
            const buyerNames = requests.reduce((acc, r) => ({...acc, [r.id]: r.buyer}), {});
            setTranslatedContent({...originalContent, buyerNames});
        } finally {
            setIsLoading(false);
        }
    };
    translate();
  }, [lang, requests]);

  if (isLoading || !translatedContent) {
      return <div className="flex h-full items-center justify-center">Loading...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">{translatedContent.title}</h1>
        <p className="text-muted-foreground">{translatedContent.description}</p>
      </div>

      <div className="space-y-6">
        {requests.length > 0 ? requests.map(request => (
          <Card key={request.id}>
            <div className="flex gap-4">
              <div className="flex flex-col flex-1">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{translatedContent.requestFrom} {translatedContent.buyerNames[request.id]}</CardTitle>
                        <CardDescription className="pt-2 italic">"{request.description}"</CardDescription>
                    </div>
                    {request.isAiRequest && (
                        <div className="flex items-center gap-2 text-primary bg-primary/10 px-3 py-1.5 rounded-full text-sm font-medium">
                            <Wand2 className="h-4 w-4"/>
                            <span>AI</span>
                        </div>
                    )}
                  </div>
                </CardHeader>
                <CardFooter className="flex justify-end gap-2 mt-auto">
                    <Button variant="outline" size="sm" onClick={() => denyRequest(request.id)}><ThumbsDown className="mr-2 h-4 w-4" /> {translatedContent.denyButton}</Button>
                    <Button size="sm" onClick={() => acceptRequest(request.id)}><Check className="mr-2 h-4 w-4" /> {translatedContent.acceptButton}</Button>
                </CardFooter>
              </div>
              
              {request.image && (
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="w-1/3 p-4 cursor-pointer">
                        <div className="relative aspect-square w-full rounded-lg overflow-hidden border">
                            <Image src={request.image.imageUrl} alt="Request reference" fill className="object-cover" />
                        </div>
                         <p className="text-xs text-center font-semibold mt-2 text-muted-foreground">{request.isAiRequest ? translatedContent.aiMockup : translatedContent.reference}</p>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl p-2">
                    <div className="relative aspect-square w-full">
                        <Image src={request.image.imageUrl} alt="Request reference" fill className="object-contain rounded-lg" />
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </Card>
        )) : (
          <p className="text-sm text-muted-foreground text-center">{translatedContent.noRequests}</p>
        )}
      </div>
    </div>
  );
}


export default function OrderRequestsPage() {
    return (
        <Suspense fallback={<div className="flex h-full items-center justify-center">Loading...</div>}>
            <OrderRequests />
        </Suspense>
    )
}
