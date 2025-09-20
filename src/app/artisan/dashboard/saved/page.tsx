
'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProductCard } from "@/components/product-card";
import { mockProducts } from "@/lib/mock-data";
import { translateText } from '@/ai/flows/translate-text';
import { Suspense } from 'react';

const savedProducts = mockProducts.slice(0, 5);

const groupedByCategory = savedProducts.reduce((acc, product) => {
  const category = product.category;
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push(product);
  return acc;
}, {} as Record<string, typeof savedProducts>);

const uniqueCategories = Object.keys(groupedByCategory);

type TranslatedContent = {
    title: string;
    description: string;
    categories: Record<string, string>;
};

function SavedCollection() {
    const searchParams = useSearchParams();
    const lang = searchParams.get('lang') || 'en';

    const [translatedContent, setTranslatedContent] = React.useState<TranslatedContent | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const originalContent = {
            title: "Saved Collection",
            description: "Inspiration and favorite pieces you've collected."
        };

        const translate = async () => {
            if (lang === 'en') {
                const categoriesMap = uniqueCategories.reduce((acc, cat) => ({...acc, [cat]: cat}), {});
                setTranslatedContent({ ...originalContent, categories: categoriesMap });
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const textsToTranslate = [
                    originalContent.title,
                    originalContent.description,
                    ...uniqueCategories
                ];

                const translations = await Promise.all(
                    textsToTranslate.map(text => translateText({ text, targetLanguage: lang }))
                );
                
                const translatedCategoriesMap = uniqueCategories.reduce((acc, cat, index) => {
                    acc[cat] = translations[index + 2].translatedText;
                    return acc;
                }, {} as Record<string, string>);

                setTranslatedContent({
                    title: translations[0].translatedText,
                    description: translations[1].translatedText,
                    categories: translatedCategoriesMap
                });
            } catch (error) {
                console.error("Failed to translate Saved Collection:", error);
                const categoriesMap = uniqueCategories.reduce((acc, cat) => ({...acc, [cat]: cat}), {});
                setTranslatedContent({ ...originalContent, categories: categoriesMap }); // Fallback
            } finally {
                setIsLoading(false);
            }
        };

        translate();
    }, [lang]);

    if (isLoading || !translatedContent) {
        return <div className="flex h-full items-center justify-center">Loading...</div>;
    }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">{translatedContent.title}</h1>
        <p className="text-muted-foreground">{translatedContent.description}</p>
      </div>

      <Accordion type="multiple" className="w-full space-y-4" defaultValue={uniqueCategories}>
        {Object.entries(groupedByCategory).map(([category, products]) => (
          <AccordionItem key={category} value={category} className="border rounded-lg bg-card overflow-hidden">
            <AccordionTrigger className="px-6 py-4 text-lg font-headline hover:no-underline">
                {translatedContent.categories[category] || category}
            </AccordionTrigger>
            <AccordionContent>
                <div className="p-6 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => <ProductCard key={product.id} product={product} />)}
                </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default function SavedCollectionPage() {
    return (
        <Suspense fallback={<div className="flex h-full items-center justify-center">Loading...</div>}>
            <SavedCollection />
        </Suspense>
    )
}
