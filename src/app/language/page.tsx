
'use client';

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArtistryHavensLogo } from "@/components/icons";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { translateText } from "@/ai/flows/translate-text";


const languages = [
  { name: "English", native: "English", code: "en" },
  { name: "Hindi", native: "हिंदी", code: "hi" },
  { name: "Bengali", native: "বাংলা", code: "bn" },
  { name: "Telugu", native: "తెలుగు", code: "te" },
  { name: "Tamil", native: "தமிழ்", code: "ta" },
  { name: "Urdu", native: "اردو", code: "ur" },
  { name: "Malayalam", native: "മലയാളം", code: "ml" },
];

type TranslatedContent = {
    title: string;
    subtitle: string;
    footer: string;
}

function LanguageSelection() {
  const searchParams = useSearchParams();
  // Default to 'en' if no lang param, but this page is the entry point, so it likely won't have one initially.
  const lang = searchParams.get('lang') || 'en';
  const [translatedContent, setTranslatedContent] = useState<TranslatedContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const originalContent = {
        title: "Welcome to Artistry Havens",
        subtitle: "Choose a Language",
        footer: "Where Every Creation Belongs."
    };

    const translateContent = async () => {
        // No need to translate if the lang is English, but we run it for consistency in the logic flow.
        // On this specific page, we usually start with 'en', so this is more for when a user navigates back.
        if (lang === 'en') {
            setTranslatedContent(originalContent);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const translationPromises = [
                translateText({ text: originalContent.title, targetLanguage: lang }),
                translateText({ text: originalContent.subtitle, targetLanguage: lang }),
                translateText({ text: originalContent.footer, targetLanguage: lang })
            ];
            
            const [title, subtitle, footer] = await Promise.all(translationPromises);
            
            setTranslatedContent({
                title: title.translatedText,
                subtitle: subtitle.translatedText,
                footer: footer.translatedText
            });
        } catch (error) {
            console.error("Translation failed", error);
            setTranslatedContent(originalContent); // Fallback to English
        } finally {
            setIsLoading(false);
        }
    }
    translateContent();
  }, [lang]);
  
  if (isLoading || !translatedContent) {
      return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
              <ArtistryHavensLogo className="h-12 w-12 text-primary" />
          </div>
          <h1 className="font-headline text-4xl font-bold text-foreground">
            {translatedContent.title}
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            {translatedContent.subtitle}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {languages.map((language) => (
            <Link key={language.code} href={`/role-selection?lang=${language.code}`} passHref>
              <Card className="transform-gpu cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                <CardContent className={`flex h-40 w-full flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background`}>
                  <div className="text-4xl font-bold text-primary">{language.native}</div>
                  <div className="mt-2 text-sm text-muted-foreground">{language.name}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <p className="mt-12 text-center text-sm text-muted-foreground italic">
          {translatedContent.footer}
        </p>
      </div>
    </div>
  );
}

export default function LanguageSelectionPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
            <LanguageSelection />
        </Suspense>
    );
}
