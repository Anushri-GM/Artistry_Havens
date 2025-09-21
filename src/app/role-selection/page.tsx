
'use client';

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { translateText } from "@/ai/flows/translate-text";
import { generateRoleImage } from "@/ai/flows/generate-role-image";
import { Skeleton } from "@/components/ui/skeleton";

const initialRolesData = [
  {
    name: "Artisan",
    description: "I create and sell crafts",
    imageUrl: null as string | null,
    imageHint: "artisan working",
    href: "/artisan/login",
    emoji: "🎨"
  },
  {
    name: "Buyer",
    description: "I want to buy crafts",
    imageUrl: null as string | null,
    imageHint: "person shopping",
    href: "/buyer",
    emoji: "🛒"
  },
  {
    name: "Sponsor",
    description: "I want to support artisans",
    imageUrl: null as string | null,
    imageHint: "patron art",
    href: "/sponsor/login",
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
    
    const [rolesData, setRolesData] = useState(initialRolesData);
    const [translatedContent, setTranslatedContent] = useState<TranslatedContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [areImagesLoading, setAreImagesLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            setAreImagesLoading(true);
            try {
                const imagePromises = initialRolesData.map(role => generateRoleImage({roleName: role.name}));
                const images = await Promise.all(imagePromises);
                setRolesData(prevRoles => prevRoles.map((role, index) => ({
                    ...role,
                    imageUrl: images[index].imageDataUri
                })));
            } catch (error) {
                console.error("Failed to generate role images:", error);
                 // Fallback to placeholder URLs if generation fails
                const fallbackRoles = [
                    { ...initialRolesData[0], imageUrl: "https://picsum.photos/seed/artisan-role/400/400" },
                    { ...initialRolesData[1], imageUrl: "https://picsum.photos/seed/buyer-role/400/400" },
                    { ...initialRolesData[2], imageUrl: "https://picsum.photos/seed/sponsor-role/400/400" },
                ];
                setRolesData(fallbackRoles);
            } finally {
                setAreImagesLoading(false);
            }
        };
        fetchImages();
    }, []);

    useEffect(() => {
        const originalContent = {
            title: "Welcome!",
            description: "Please select your role to continue.",
            roles: initialRolesData.map(r => ({ name: r.name, description: r.description }))
        };

        const translateContent = async () => {
            if (lang === 'en') {
                setTranslatedContent(originalContent);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const textsToTranslate = [
                    originalContent.title,
                    originalContent.description,
                    ...originalContent.roles.flatMap(role => [role.name, role.description])
                ];

                const translationPromises = textsToTranslate.map(text => translateText({ text, targetLanguage: lang }));
                const translations = await Promise.all(translationPromises);
                
                const translatedRoles = initialRolesData.map((_, index) => ({
                    name: translations[2 + index * 2].translatedText,
                    description: translations[3 + index * 2].translatedText
                }));

                setTranslatedContent({
                    title: translations[0].translatedText,
                    description: translations[1].translatedText,
                    roles: translatedRoles
                });

            } catch (error) {
                console.error("Translation failed", error);
                setTranslatedContent(originalContent); // Fallback to English
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
                {translatedContent.title}
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">
                {translatedContent.description}
              </p>
              </div>
              <div className="grid grid-cols-1 gap-8">
              {rolesData.map((role, index) => (
                  <Link key={role.name} href={`${role.href}?lang=${lang}`} passHref>
                      <Card className="group cursor-pointer overflow-hidden text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                          <CardHeader className="p-0">
                            <div className="relative h-40 w-full">
                                {areImagesLoading || !role.imageUrl ? (
                                    <Skeleton className="h-full w-full" />
                                ) : (
                                    <>
                                        <Image 
                                            src={role.imageUrl}
                                            alt={role.name}
                                            fill
                                            className="object-cover"
                                            data-ai-hint={role.imageHint}
                                        />
                                        <div className="absolute inset-0 bg-black/30"></div>
                                    </>
                                )}
                            </div>
                          </CardHeader>
                          <CardContent className="p-6">
                          <CardTitle className="font-headline text-2xl">
                              {translatedContent.roles[index].name} <span role="img" aria-label={role.name}>{role.emoji}</span>
                          </CardTitle>
                          <CardDescription className="mt-2 text-base">
                              "{translatedContent.roles[index].description}"
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
