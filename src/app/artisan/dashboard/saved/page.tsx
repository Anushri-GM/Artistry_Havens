
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
import { translateText } from '@/ai/flows/translate-text';
import { Suspense } from 'react';
import { useArtisan } from '@/context/ArtisanContext';
import type { Product } from '@/context/ArtisanContext';


function SavedCollection() {
    const { savedProducts } = useArtisan();
    const searchParams = useSearchParams();
    const lang = searchParams.get('lang') || 'en';

    const [translatedContent, setTranslatedContent] = React.useState<{title: string, description: string, categories: Record<string, string>}> | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [translatedProducts, setTranslatedProducts] = React.useState<Product[]>(savedProducts);

    const groupedByCategory = translatedProducts.reduce((acc, product) => {
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
            title: "Saved Collection",
            description: "Inspiration and favorite pieces you've collected."
        };

        const translate = async () => {
            if (lang === 'en') {
                const categoriesMap = uniqueCategories.reduce((acc, cat) => ({...acc, [cat]: cat}), {});
                setTranslatedContent({ ...originalContent, categories: categoriesMap });
                setTranslatedProducts(savedProducts.map(p => ({ ...p, name: p.name })))
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const textsToTranslate = [
                    originalContent.title,
                    originalContent.description,
                    ...uniqueCategories,
                    ...savedProducts.map(p => p.name)
                ];

                const translations = await Promise.all(
                    textsToTranslate.map(text => translateText({ text, targetLanguage: lang }))
                );
                
                const translatedCategoriesMap = uniqueCategories.reduce((acc, cat, index) => {
                    acc[cat] = translations[index + 2].translatedText;
                    return acc;
                }, {} as Record<string, string>);

                const newTranslatedProducts = savedProducts.map((p, index) => ({
                    ...p,
                    name: translations[2 + uniqueCategories.length + index].translatedText
                }));
                setTranslatedProducts(newTranslatedProducts);

                setTranslatedContent({
                    title: translations[0].translatedText,
                    description: translations[1].translatedText,
                    categories: translatedCategoriesMap
                });
            } catch (error) {
                console.error("Failed to translate Saved Collection:", error);
                const categoriesMap = uniqueCategories.reduce((acc, cat) => ({...acc, [cat]: cat}), {});
                setTranslatedContent({ ...originalContent, categories: categoriesMap }); // Fallback
                setTranslatedProducts(savedProducts.map(p => ({ ...p, name: p.name })))
            } finally {
                setIsLoading(false);
            }
        };

        translate();
    }, [lang, savedProducts]);

    if (isLoading || !translatedContent) {
        return <div className="flex h-full items-center justify-center">Loading...</div>;
    }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">{translatedContent.title}</h1>
        <p className="text-muted-foreground">{translatedContent.description}</p>
      </div>

      {savedProducts.length > 0 ? (
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
      ) : (
        <div className="text-center text-muted-foreground py-10">
            <p>You haven't saved any products yet.</p>
        </div>
      )}
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
