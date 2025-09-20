
'use client';

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Paintbrush, ShoppingBag, Heart } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { translateText } from "@/ai/flows/translate-text";

const rolesData = [
  {
    name: "Artisan",
    description: "I create and sell crafts",
    icon: <Paintbrush className="h-12 w-12 text-primary" />,
    href: "/artisan/login",
    emoji: "🎨"
  },
  {
    name: "Buyer",
    description: "I want to buy crafts",
    icon: <ShoppingBag className="h-12 w-12 text-primary" />,
    href: "/buyer",
    emoji: "🛍️"
  },
  {
    name: "Sponsor",
    description: "I want to support artisans",
    icon: <Heart className="h-12 w-12 text-primary" />,
    href: "/sponsor",
    emoji: "❤️"
  },
];

type TranslatedContent = {
    title: string;
    description: string;
    roles: {
        name: string;
        description: string;
    }[];
};

function RoleSelection() {
    const searchParams = useSearchParams();
    const lang = searchParams.get('lang') || 'en';
    
    const [translatedContent, setTranslatedContent] = useState<TranslatedContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const translateContent = async () => {
            if (lang === 'en') {
                 setTranslatedContent({
                    title: "Welcome!",
                    description: "Please select your role to continue.",
                    roles: rolesData.map(r => ({ name: r.name, description: r.description }))
                });
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                 const [titleRes, descriptionRes, ...roleTranslations] = await Promise.all([
                    translateText({ text: "Welcome!", targetLanguage: lang }),
                    translateText({ text: "Please select your role to continue.", targetLanguage: lang }),
                    ...rolesData.flatMap(role => [
                        translateText({ text: role.name, targetLanguage: lang }),
                        translateText({ text: role.description, targetLanguage: lang })
                    ])
                ]);

                const translatedRoles = rolesData.map((_, index) => ({
                    name: roleTranslations[index * 2].translatedText,
                    description: roleTranslations[index * 2 + 1].translatedText
                }));

                setTranslatedContent({
                    title: titleRes.translatedText,
                    description: descriptionRes.translatedText,
                    roles: translatedRoles
                });

            } catch (error) {
                console.error("Translation failed", error);
                // Fallback to English on error
                setTranslatedContent({
                    title: "Welcome!",
                    description: "Please select your role to continue.",
                    roles: rolesData.map(r => ({ name: r.name, description: r.description }))
                });
            } finally {
                setIsLoading(false);
            }
        };

        translateContent();
    }, [lang]);

    if (isLoading || !translatedContent) {
        return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <div className="w-full max-w-md">
              <div className="mb-12 text-center">
              <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground">
                {translatedContent?.title}
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">
                {translatedContent?.description}
              </p>
              </div>
              <div className="grid grid-cols-1 gap-8">
              {rolesData.map((role, index) => (
                  <Link key={role.name} href={`${role.href}?lang=${lang}`} passHref>
                      <Card className="group cursor-pointer overflow-hidden text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                          <CardHeader className="bg-primary/5">
                          <div className="flex justify-center">{role.icon}</div>
                          </CardHeader>
                          <CardContent className="p-6">
                          <CardTitle className="font-headline text-2xl">
                              {translatedContent?.roles[index]?.name} <span role="img" aria-label={role.name}>{role.emoji}</span>
                          </CardTitle>
                          <CardDescription className="mt-2 text-base">
                              "{translatedContent?.roles[index]?.description}"
                          </CardDescription>
                          </CardContent>
                      </Card>
                  </Link>
              ))}
              </div>
          </div>
        </div>
    )
}


export default function RoleSelectionPage() {
    return (
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
        <RoleSelection />
      </Suspense>
    );
}
