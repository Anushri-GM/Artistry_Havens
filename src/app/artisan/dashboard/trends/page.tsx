
'use client';
import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { TrendProductCard } from "@/components/trend-product-card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useArtisan } from "@/context/ArtisanContext";
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { translateText } from '@/ai/flows/translate-text';
import type { Product } from '@/context/ArtisanContext';

type TranslatedContent = {
    frequentlyBoughtTitle: string;
    frequentlyBoughtDescription: string;
    bestsellersTitle: string;
    bestsellersDescription: string;
};

type TranslatedProduct = Product & {
    translatedName?: string;
};

function Trends() {
    const { products } = useArtisan();
    const searchParams = useSearchParams();
    const lang = searchParams.get('lang') || 'en';

    const [translatedContent, setTranslatedContent] = React.useState<TranslatedContent | null>(null);
    const [translatedProducts, setTranslatedProducts] = React.useState<TranslatedProduct[]>(products);
    const [isLoading, setIsLoading] = React.useState(true);
    
    const frequentlyBought = [...translatedProducts].sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    const bestsellers = [...translatedProducts].sort((a, b) => (b.revenue || 0) - (a.revenue || 0));

    React.useEffect(() => {
        const originalContent = {
            frequentlyBoughtTitle: "Frequently Bought Crafts",
            frequentlyBoughtDescription: "Discover what buyers are loving right now across the platform.",
            bestsellersTitle: "Bestsellers",
            bestsellersDescription: "Top-performing products by revenue in each category.",
        };

        const translate = async () => {
            if (lang === 'en') {
                setTranslatedContent(originalContent);
                setTranslatedProducts(products.map(p => ({...p, translatedName: p.name})));
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                // Translate static content
                const staticTexts = Object.values(originalContent);
                const staticTranslations = await Promise.all(
                    staticTexts.map(text => translateText({ text, targetLanguage: lang }))
                );
                const keys = Object.keys(originalContent) as (keyof TranslatedContent)[];
                const newContent = keys.reduce((acc, key, index) => {
                    acc[key] = staticTranslations[index].translatedText;
                    return acc;
                }, {} as TranslatedContent);
                setTranslatedContent(newContent);

                // Translate product names
                const productPromises = products.map(async (product) => {
                    const name = await translateText({ text: product.name, targetLanguage: lang });
                    return {
                        ...product,
                        translatedName: name.translatedText,
                    };
                });
                const newTranslatedProducts = await Promise.all(productPromises);
                setTranslatedProducts(newTranslatedProducts);

            } catch (error) {
                console.error("Failed to translate trends page:", error);
                setTranslatedContent(originalContent);
                setTranslatedProducts(products.map(p => ({...p, translatedName: p.name})));
            } finally {
                setIsLoading(false);
            }
        };
        translate();
    }, [lang, products]);


    const autoplayPluginLTR = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true, playOnInit: true })
    );
    const autoplayPluginRTL = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true, playOnInit: true })
    );

    if (isLoading) {
        return <div className="flex h-full items-center justify-center">Loading...</div>;
    }

  return (
    <div className="space-y-12">
        <div>
            <h1 className="text-3xl font-bold font-headline mb-2">{translatedContent?.frequentlyBoughtTitle}</h1>
            <p className="text-muted-foreground mb-6">{translatedContent?.frequentlyBoughtDescription}</p>
            <Carousel 
                opts={{ align: "start", loop: true }}
                plugins={[autoplayPluginLTR.current]}
                onMouseEnter={autoplayPluginLTR.current.stop}
                onMouseLeave={autoplayPluginLTR.current.play}
                className="w-full max-w-full"
            >
                <CarouselContent>
                    {frequentlyBought.map((product) => (
                        <CarouselItem key={product.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                            <TrendProductCard product={product} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="ml-12"/>
                <CarouselNext className="mr-12"/>
            </Carousel>
        </div>

        <div>
            <h1 className="text-3xl font-bold font-headline mb-2">{translatedContent?.bestsellersTitle}</h1>
            <p className="text-muted-foreground mb-6">{translatedContent?.bestsellersDescription}</p>
             <Carousel 
                opts={{ align: "start", loop: true, direction: "rtl" }}
                plugins={[autoplayPluginRTL.current]}
                onMouseEnter={autoplayPluginRTL.current.stop}
                onMouseLeave={autoplayPluginRTL.current.play}
                className="w-full max-w-full"
             >
                <CarouselContent>
                    {bestsellers.map((product) => (
                        <CarouselItem key={product.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                            <TrendProductCard product={product} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="ml-12"/>
                <CarouselNext className="mr-12"/>
            </Carousel>
        </div>
    </div>
  )
}


export default function TrendsPage() {
    return (
        <Suspense fallback={<div className="flex h-full items-center justify-center">Loading...</div>}>
            <Trends />
        </Suspense>
    )
}
