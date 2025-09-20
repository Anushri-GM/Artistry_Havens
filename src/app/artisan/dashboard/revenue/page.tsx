
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BadgeIndianRupee, Users } from "lucide-react";
import { useArtisan } from "@/context/ArtisanContext";
import Image from "next/image";
import { translateText } from '@/ai/flows/translate-text';

type TranslatedContent = {
    title: string;
    description: string;
    myProfitTab: string;
    sharedProfitTab: string;
    myProfitTitle: string;
    myProfitDescription: string;
    totalEarnings: string;
    productColumn: string;
    revenueColumn: string;
    sharedProfitTitle: string;
    sharedProfitDescription: string;
    totalSharedRevenue: string;
    yourShare: string;
    productBreakdown: string;
    sponsoredBy: string;
    totalRevenueLabel: string;
    yourProfitLabel: string;
    productNames: Record<string, string>;
};


function Revenue() {
    const { products } = useArtisan();
    const searchParams = useSearchParams();
    const lang = searchParams.get('lang') || 'en';

    const [translatedContent, setTranslatedContent] = useState<TranslatedContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const myProfitProducts = products.slice(0, 3);
    const sharedProfitProducts = products.slice(3, 6);
    
    const totalMyProfit = myProfitProducts.reduce((acc, p) => acc + (p.revenue || 0), 0);
    const totalSharedProfit = sharedProfitProducts.reduce((acc, p) => acc + (p.revenue || 0), 0);

    useEffect(() => {
        const originalContent = {
            title: "Revenue",
            description: "Track your earnings and profit shares.",
            myProfitTab: "My Profit",
            sharedProfitTab: "Shared Profit",
            myProfitTitle: "My Profit",
            myProfitDescription: "Revenue from products that are not sponsored.",
            totalEarnings: "Total Earnings",
            productColumn: "Product",
            revenueColumn: "Revenue",
            sharedProfitTitle: "Shared Profit",
            sharedProfitDescription: "Profit gained from selling sponsored products.",
            totalSharedRevenue: "Total Shared Revenue",
            yourShare: "Your Share (80%)",
            productBreakdown: "Product Breakdown",
            sponsoredBy: "Sponsored by Craft Ventures",
            totalRevenueLabel: "Total Revenue:",
            yourProfitLabel: "Your Profit (80%):",
        };

        const translate = async () => {
            if (lang === 'en') {
                const productNames = products.reduce((acc, p) => ({...acc, [p.id]: p.name}), {});
                setTranslatedContent({ ...originalContent, productNames });
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const productSpecificNames = [...myProfitProducts, ...sharedProfitProducts].map(p => p.name);
                const textsToTranslate = [...Object.values(originalContent), ...productSpecificNames];

                const translations = await Promise.all(
                    textsToTranslate.map(text => translateText({ text, targetLanguage: lang }))
                );

                const baseContentKeys = Object.keys(originalContent) as (keyof typeof originalContent)[];
                const newContent: any = {};
                baseContentKeys.forEach((key, index) => {
                    newContent[key] = translations[index].translatedText;
                });

                const allProductsForNames = [...myProfitProducts, ...sharedProfitProducts];
                newContent.productNames = allProductsForNames.reduce((acc, p, index) => {
                    acc[p.id] = translations[baseContentKeys.length + index].translatedText;
                    return acc;
                }, {} as Record<string, string>);
                
                setTranslatedContent(newContent);
            } catch (error) {
                console.error("Failed to translate revenue page", error);
                const productNames = products.reduce((acc, p) => ({...acc, [p.id]: p.name}), {});
                setTranslatedContent({ ...originalContent, productNames });
            } finally {
                setIsLoading(false);
            }
        };

        translate();

    }, [lang, products]);
    
    if (isLoading || !translatedContent) {
        return <div className="flex h-full items-center justify-center">Loading...</div>
    }


  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">{translatedContent.title}</h1>
            <p className="text-muted-foreground">{translatedContent.description}</p>
        </div>
        <Tabs defaultValue="my-profit">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="my-profit">{translatedContent.myProfitTab}</TabsTrigger>
                <TabsTrigger value="shared-profit">{translatedContent.sharedProfitTab}</TabsTrigger>
            </TabsList>
            <TabsContent value="my-profit" className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{translatedContent.myProfitTitle}</CardTitle>
                        <CardDescription>{translatedContent.myProfitDescription}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 p-6 bg-primary/5 rounded-lg">
                            <BadgeIndianRupee className="h-8 w-8 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">{translatedContent.totalEarnings}</p>
                                <p className="text-3xl font-bold">₹{totalMyProfit.toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
                            </div>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="whitespace-normal">{translatedContent.productColumn}</TableHead>
                                    <TableHead className="text-right">{translatedContent.revenueColumn}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {myProfitProducts.map(product => (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium whitespace-normal">{translatedContent.productNames[product.id] || product.name}</TableCell>
                                        <TableCell className="text-right">₹{(product.revenue || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="shared-profit" className="mt-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>{translatedContent.sharedProfitTitle}</CardTitle>
                        <CardDescription>{translatedContent.sharedProfitDescription}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <Card className="bg-primary/5">
                                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                     <CardTitle className="text-sm font-medium">
                                        {translatedContent.totalSharedRevenue}
                                     </CardTitle>
                                     <BadgeIndianRupee className="h-4 w-4 text-muted-foreground" />
                                 </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">₹{totalSharedProfit.toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
                                </CardContent>
                            </Card>
                             <Card className="bg-primary/5">
                                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                     <CardTitle className="text-sm font-medium">
                                        {translatedContent.yourShare}
                                     </CardTitle>
                                     <Users className="h-4 w-4 text-muted-foreground" />
                                 </CardHeader>
                                <CardContent>
                                     <p className="text-2xl font-bold">₹{(totalSharedProfit * 0.8).toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
                                </CardContent>
                            </Card>
                         </div>
                        
                        <div className="space-y-4">
                            <h3 className="font-headline text-lg font-semibold">{translatedContent.productBreakdown}</h3>
                            {sharedProfitProducts.map(product => (
                                <Card key={product.id} className="bg-card overflow-hidden">
                                    <div className="flex flex-col sm:flex-row gap-0 sm:gap-4">
                                        {product.image && (
                                            <div className="relative w-full sm:w-1/3 aspect-video sm:aspect-square">
                                                <Image src={product.image.imageUrl} alt={product.name} fill className="object-cover" />
                                            </div>
                                        )}
                                        <div className="flex-1 p-4 flex flex-col justify-center">
                                            <p className="font-bold font-headline leading-tight">{translatedContent.productNames[product.id] || product.name}</p>
                                            <p className="text-xs text-muted-foreground mt-1 mb-3">{translatedContent.sponsoredBy}</p>
                                            
                                            <div className="space-y-2 mt-auto">
                                                 <div className="flex justify-between items-baseline">
                                                    <span className="text-muted-foreground text-xs">{translatedContent.totalRevenueLabel}</span>
                                                    <span className="font-semibold text-sm">₹{(product.revenue || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                                                </div>
                                                 <div className="flex justify-between items-baseline text-primary">
                                                    <span className="text-xs font-medium">{translatedContent.yourProfitLabel}</span>
                                                    <span className="font-bold text-base">₹{((product.revenue || 0) * 0.8).toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}

export default function RevenuePage() {
    return (
        <Suspense fallback={<div className="flex h-full items-center justify-center">Loading...</div>}>
            <Revenue />
        </Suspense>
    )
}
    

    
