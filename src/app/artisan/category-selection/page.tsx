'use client';

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Paintbrush, Hammer, CircleDotDashed, Gem, Scissors, Hand, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { translateText } from "@/ai/flows/translate-text";

const categories = [
    { name: "Woodwork", icon: <Hammer className="h-10 w-10 text-primary" /> },
    { name: "Pottery", icon: <CircleDotDashed className="h-10 w-10 text-primary" /> },
    { name: "Paintings", icon: <Paintbrush className="h-10 w-10 text-primary" /> },
    { name: "Sculptures", icon: <Hand className="h-10 w-10 text-primary" /> },
    { name: "Textiles", icon: <Scissors className="h-10 w-10 text-primary" /> },
    { name: "Jewelry", icon: <Gem className="h-10 w-10 text-primary" /> },
];

type TranslatedContent = {
    title: string;
    description: string;
    continueButton: string;
    categories: { name: string }[];
};

function CategorySelection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [translatedContent, setTranslatedContent] = useState<TranslatedContent | null>(null);

  useEffect(() => {
    const translateContent = async () => {
      if (lang === 'en') {
        setTranslatedContent({
            title: "Choose Your Crafts",
            description: "What kind of artisan are you? Select all that apply.",
            continueButton: "Continue",
            categories: categories.map(c => ({ name: c.name }))
        });
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const [title, description, continueButton, ...categoryTranslations] = await Promise.all([
          translateText({ text: "Choose Your Crafts", targetLanguage: lang }),
          translateText({ text: "What kind of artisan are you? Select all that apply.", targetLanguage: lang }),
          translateText({ text: "Continue", targetLanguage: lang }),
          ...categories.map(c => translateText({ text: c.name, targetLanguage: lang }))
        ]);

        setTranslatedContent({
          title: title.translatedText,
          description: description.translatedText,
          continueButton: continueButton.translatedText,
          categories: categoryTranslations.map(t => ({ name: t.translatedText }))
        });

      } catch (error) {
        console.error("Translation failed", error);
        setTranslatedContent({
            title: "Choose Your Crafts",
            description: "What kind of artisan are you? Select all that apply.",
            continueButton: "Continue",
            categories: categories.map(c => ({ name: c.name }))
        });
      } finally {
        setIsLoading(false);
      }
    };

    translateContent();
  }, [lang]);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryName)
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleContinue = () => {
    console.log("Selected categories:", selectedCategories);
    router.push(`/artisan/dashboard?lang=${lang}`);
  };

  if (isLoading || !translatedContent) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">{translatedContent.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{translatedContent.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category, index) => {
            const isSelected = selectedCategories.includes(category.name);
            return (
              <Card 
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className={cn(
                  "group cursor-pointer overflow-hidden text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative",
                  isSelected && "border-primary border-2"
                )}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 rounded-full bg-primary text-primary-foreground">
                    <CheckCircle className="h-5 w-5 p-0.5" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-center">{category.icon}</div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <CardTitle className="font-headline text-lg">{translatedContent.categories[index].name}</CardTitle>
                </CardContent>
              </Card>
            )
          })}
        </div>
        <div className="mt-12">
            <Button 
                className="w-full" 
                size="lg"
                disabled={selectedCategories.length === 0}
                onClick={handleContinue}
            >
                {translatedContent.continueButton}
            </Button>
        </div>
      </div>
    </div>
  );
}


export default function CategorySelectionPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
            <CategorySelection />
        </Suspense>
    )
}
