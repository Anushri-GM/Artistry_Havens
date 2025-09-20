
'use client';

import * as React from 'react';
import Image from 'next/image';
import { useArtisan } from '@/context/ArtisanContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { translateText } from '@/ai/flows/translate-text';
import type { Product } from '@/context/ArtisanContext';

type TranslatedContent = {
  title: string;
  description: string;
  descriptionLabel: string;
  storyLabel: string;
};

type TranslatedProduct = Product & {
    translatedName: string;
    translatedDescription: string;
    translatedStory: string;
};


function MyProducts() {
  const { products } = useArtisan();
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';

  const [translatedContent, setTranslatedContent] = React.useState<TranslatedContent | null>(null);
  const [translatedProducts, setTranslatedProducts] = React.useState<TranslatedProduct[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    const originalContent = {
        title: "My Products",
        description: "A detailed view of all your uploaded creations.",
        descriptionLabel: "Description",
        storyLabel: "Story",
    };

    const translateAll = async () => {
        setIsLoading(true);

        if (lang === 'en') {
            setTranslatedContent(originalContent);
            setTranslatedProducts(products.map(p => ({
                ...p,
                translatedName: p.name,
                translatedDescription: p.description,
                translatedStory: p.story
            })));
            setIsLoading(false);
            return;
        }

        try {
            // Translate static content
            const staticTexts = [originalContent.title, originalContent.description, originalContent.descriptionLabel, originalContent.storyLabel];
            const staticTranslations = await Promise.all(
                staticTexts.map(text => translateText({ text, targetLanguage: lang }))
            );
            setTranslatedContent({
                title: staticTranslations[0].translatedText,
                description: staticTranslations[1].translatedText,
                descriptionLabel: staticTranslations[2].translatedText,
                storyLabel: staticTranslations[3].translatedText,
            });

            // Translate dynamic product content
            const productPromises = products.map(async (product) => {
                const [name, description, story] = await Promise.all([
                    translateText({ text: product.name, targetLanguage: lang }),
                    translateText({ text: product.description, targetLanguage: lang }),
                    translateText({ text: product.story, targetLanguage: lang }),
                ]);
                return {
                    ...product,
                    translatedName: name.translatedText,
                    translatedDescription: description.translatedText,
                    translatedStory: story.translatedText,
                };
            });
            
            const newTranslatedProducts = await Promise.all(productPromises);
            setTranslatedProducts(newTranslatedProducts);

        } catch (error) {
            console.error("Failed to translate my products page:", error);
            // Fallback to English
            setTranslatedContent(originalContent);
            setTranslatedProducts(products.map(p => ({
                ...p,
                translatedName: p.name,
                translatedDescription: p.description,
                translatedStory: p.story
            })));
        } finally {
            setIsLoading(false);
        }
    };

    translateAll();
  }, [lang, products]);

  if (isLoading) {
      return <div className="flex h-full items-center justify-center">Loading products...</div>
  }
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline mb-2">{translatedContent?.title}</h1>
        <p className="text-muted-foreground mb-6">
          {translatedContent?.description}
        </p>
      </div>

      <div className="space-y-6">
        {translatedProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
             <div className="flex flex-col sm:flex-row gap-4">
               {product.image && (
                <div className="w-full sm:w-1/3 p-4 flex-shrink-0">
                    <div className="relative aspect-square w-full rounded-lg overflow-hidden border">
                        <Image src={product.image.imageUrl} alt={product.translatedName} fill className="object-cover" />
                    </div>
                </div>
              )}
              <div className="flex-1 flex flex-col p-4 pt-0 sm:pt-4">
                <CardHeader className="p-0">
                  <CardTitle className="font-headline text-xl">{product.translatedName}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-4 flex-1 space-y-4">
                    <div>
                        <h3 className="font-semibold text-sm text-muted-foreground">{translatedContent?.descriptionLabel}</h3>
                        <p className="text-sm mt-1">{product.translatedDescription}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-sm text-muted-foreground">{translatedContent?.storyLabel}</h3>
                        <p className="text-sm italic mt-1">{product.translatedStory}</p>
                    </div>
                </CardContent>
              </div>
            </div>
          </Card>
        ))}
         {products.length === 0 && (
            <div className="text-center text-muted-foreground py-10">
                <p>You haven't uploaded any products yet.</p>
            </div>
        )}
      </div>
    </div>
  );
}


export default function MyProductsPage() {
    return (
        <Suspense fallback={<div className="flex h-full items-center justify-center">Loading...</div>}>
            <MyProducts />
        </Suspense>
    )
}
