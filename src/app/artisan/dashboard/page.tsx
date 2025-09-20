
'use client';

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Palette } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { translateText } from "@/ai/flows/translate-text";

type TranslatedContent = {
    welcome: string;
    whatToDo: string;
    uploadTitle: string;
    uploadDescription: string;
    visitTitle: string;
    visitDescription: string;
};

function ArtisanDashboard() {
    const searchParams = useSearchParams();
    const lang = searchParams.get('lang') || 'en';
    const [translatedContent, setTranslatedContent] = useState<TranslatedContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const originalContent = {
            welcome: "Welcome, Artisan!",
            whatToDo: "What would you like to do today?",
            uploadTitle: "Upload a Product",
            uploadDescription: "Add a new creation to your collection.",
            visitTitle: "Visit My Page",
            visitDescription: "See stats, manage products, and view your profile.",
        };

        const translateContent = async () => {
            if (lang === 'en') {
                setTranslatedContent(originalContent);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const textsToTranslate = Object.values(originalContent);
                const translationPromises = textsToTranslate.map(text => translateText({ text, targetLanguage: lang }));
                const translations = await Promise.all(translationPromises);
                
                const contentKeys = Object.keys(originalContent) as (keyof TranslatedContent)[];
                const newTranslatedContent = contentKeys.reduce((acc, key, index) => {
                    acc[key] = translations[index].translatedText;
                    return acc;
                }, {} as TranslatedContent);

                setTranslatedContent(newTranslatedContent);
            } catch (error) {
                console.error("Translation failed", error);
                setTranslatedContent(originalContent);
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
        <div className="flex flex-col items-center min-h-screen bg-background">
            
            <main className="flex flex-col items-center justify-center flex-1 p-4 w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold font-headline">{translatedContent.welcome}</h1>
                    <p className="text-muted-foreground mt-2 text-md">{translatedContent.whatToDo}</p>
                </div>
                <div className="grid grid-cols-1 gap-6 w-full max-w-md">
                    <Link href={`/artisan/upload?lang=${lang}`}>
                        <Card className="group cursor-pointer overflow-hidden text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br from-destructive/10 via-background to-background">
                            <CardHeader>
                                <div className="flex justify-center">
                                    <Upload className="w-12 h-12 text-destructive" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-4">
                                <CardTitle className="font-headline text-xl">{translatedContent.uploadTitle}</CardTitle>
                                <CardDescription className="mt-1 text-sm">
                                    {translatedContent.uploadDescription}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href={`/artisan/dashboard/home?lang=${lang}`}>
                        <Card className="group cursor-pointer overflow-hidden text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br from-primary/10 via-background to-background">
                            <CardHeader>
                                <div className="flex justify-center">
                                    <Palette className="w-12 h-12 text-primary" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-4">
                                <CardTitle className="font-headline text-xl">{translatedContent.visitTitle}</CardTitle>
                                <CardDescription className="mt-1 text-sm">
                                    {translatedContent.visitDescription}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </main>
        </div>
    );
}


export default function ArtisanDashboardPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
            <ArtisanDashboard />
        </Suspense>
    )
}
