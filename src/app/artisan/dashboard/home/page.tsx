
'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from "@/components/product-card";
import { useArtisan } from "@/context/ArtisanContext";
import type { Product } from '@/context/ArtisanContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { translateText } from '@/ai/flows/translate-text';
import { Suspense } from 'react';


type TranslatedContent = {
    title: string;
    description: string;
    categories: Record<string, string>;
};

function ArtisanHome() {
  const { products } = useArtisan();
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';
  
  const [translatedContent, setTranslatedContent] = React.useState<TranslatedContent | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Group products by category
  const groupedByCategory = products.reduce((acc, product) => {
    const category = product.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const uniqueCategories = Object.keys(groupedByCategory);

  React.useEffect(() => {
    const originalContent = {
        title: "My Crafts",
        description: "All of your products, organized by category."
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

            const translations = await Promise.all(textsToTranslate.map(text => translateText({ text, targetLanguage: lang })));
            
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
            console.error("Translation failed for Artisan Home:", error);
            const categoriesMap = uniqueCategories.reduce((acc, cat) => ({...acc, [cat]: cat}), {});
            setTranslatedContent({ ...originalContent, categories: categoriesMap }); // Fallback
        } finally {
            setIsLoading(false);
        }
    };

    translate();
  }, [lang, products]); // Rerun if products change, which might change categories

  if (isLoading) {
      return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline mb-2">{translatedContent?.title}</h1>
            <p className="text-muted-foreground mb-6">{translatedContent?.description}</p>
        </div>

        {Object.keys(groupedByCategory).length > 0 ? (
            <Accordion type="multiple" className="w-full space-y-4" defaultValue={Object.keys(groupedByCategory)}>
                {Object.entries(groupedByCategory).map(([category, productsInCategory]) => (
                <AccordionItem key={category} value={category} className="border rounded-lg bg-card overflow-hidden">
                    <AccordionTrigger className="px-6 py-4 text-lg font-headline hover:no-underline">
                        {translatedContent?.categories[category] || category}
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="p-6 pt-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {productsInCategory.map(product => <ProductCard key={product.id} product={product} />)}
                        </div>
                    </AccordionContent>
                </AccordionItem>
                ))}
            </Accordion>
        ) : (
            <div className="text-center text-muted-foreground py-10">
                <p>You haven't uploaded any products yet.</p>
                {/* TODO: Add a link to the upload page */}
            </div>
        )}
    </div>
  )
}

export default function ArtisanHomePage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
            <ArtisanHome />
        </Suspense>
    )
}
