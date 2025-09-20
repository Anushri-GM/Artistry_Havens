
'use client';

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { translateText } from "@/ai/flows/translate-text";
import { generateCategoryIcon } from "@/ai/flows/generate-category-icon";

const initialCategories = [
    { name: "Woodwork" },
    { name: "Pottery" },
    { name: "Paintings" },
    { name: "Sculptures" },
    { name: "Textiles" },
    { name: "Jewelry" },
    { name: "Metalwork" },
];

type TranslatedContent = {
    title: string;
    description: string;
    continueButton: string;
    categories: { name: string }[];
};

type CategoryWithIcon = {
    name: string;
    iconUrl: string | null;
}

function CategorySelection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [translatedContent, setTranslatedContent] = useState<TranslatedContent | null>(null);
  const [categories, setCategories] = useState<CategoryWithIcon[]>(initialCategories.map(c => ({ ...c, iconUrl: null })));

  useEffect(() => {
    // Generate icons for all categories
    const fetchIcons = async () => {
        const iconPromises = initialCategories.map(category => 
            generateCategoryIcon({ categoryName: category.name })
        );

        try {
            const results = await Promise.all(iconPromises.map(p => p.catch(e => e)));
            
            setCategories(prevCategories => {
                return prevCategories.map((category, index) => {
                    const result = results[index];
                    return {
                        ...category,
                        iconUrl: result instanceof Error ? null : result.iconDataUri,
                    };
                });
            });
        } catch (error) {
            console.error("Failed to generate category icons:", error);
        }
    };
    
    fetchIcons();
  }, []);

  useEffect(() => {
    const originalContent = {
        title: "Choose Your Crafts",
        description: "What kind of artisan are you? Select all that apply.",
        continueButton: "Continue",
        categories: initialCategories.map(c => ({ name: c.name }))
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
            originalContent.continueButton,
            ...originalContent.categories.map(c => c.name)
        ];

        const translationPromises = textsToTranslate.map(text => translateText({ text, targetLanguage: lang }));
        const translations = await Promise.all(translationPromises);
        
        const translatedCategories = initialCategories.map((_, index) => ({
            name: translations[index + 3].translatedText
        }));

        setTranslatedContent({
          title: translations[0].translatedText,
          description: translations[1].translatedText,
          continueButton: translations[2].translatedText,
          categories: translatedCategories
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
                <CardHeader className="p-0">
                  <div className="relative w-full h-24 flex items-center justify-center">
                    {category.iconUrl ? (
                      <Image src={category.iconUrl} alt={category.name} fill className="object-cover" />
                    ) : (
                      <Skeleton className="h-full w-full" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
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
