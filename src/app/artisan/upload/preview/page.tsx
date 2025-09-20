
'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Star, MessageSquare, Heart, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface ProductPreviewData {
    productName: string;
    productDescription: string;
    productStory: string;
    productImage: string | null;
    price: string;
}

const StarRating = ({ rating }: { rating: number }) => {
    return (
        <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <Star
                        key={index}
                        className={`h-5 w-5 ${
                            ratingValue <= rating
                            ? 'text-yellow-500 fill-yellow-400'
                            : 'text-yellow-500/30'
                        }`}
                    />
                );
            })}
        </div>
    );
};

export default function PreviewPage() {
    const router = useRouter();
    const [previewData, setPreviewData] = useState<ProductPreviewData | null>(null);
    const artisanAvatar = PlaceHolderImages.find(img => img.id === "avatar-1");

    useEffect(() => {
        const data = sessionStorage.getItem('productPreview');
        if (data) {
            setPreviewData(JSON.parse(data));
        } else {
            // Handle case where there's no data, maybe redirect back
            router.push('/artisan/upload');
        }
    }, [router]);

    if (!previewData) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p>Loading preview...</p>
            </div>
        );
    }
    
    const { productName, productDescription, productStory, productImage, price } = previewData;

    return (
        <div className="flex flex-col h-full">
            <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
                <div className="container mx-auto flex h-16 items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft />
                        </Button>
                        <h1 className="font-headline text-xl font-bold truncate">Product Preview</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                            <Heart />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <ShoppingBag />
                        </Button>
                    </div>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto">
                <div>
                    {productImage && (
                        <div className="relative aspect-square w-full">
                            <Image
                                src={productImage}
                                alt={productName || "Product image"}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}
                </div>

                <div className="p-4 space-y-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="font-headline text-2xl font-bold">{productName || "Product Name"}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <StarRating rating={0} />
                                <span className="font-semibold ml-1 text-sm">0.0</span>
                                <span className="text-muted-foreground text-sm">(0 reviews)</span>
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-primary">₹{price || '0.00'}</p>
                    </div>
                    
                    <Card className="bg-primary/5">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={artisanAvatar?.imageUrl} />
                                    <AvatarFallback>A</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-xs text-muted-foreground">Created by</p>
                                    <CardTitle className="font-headline text-lg">Rohan Joshi</CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    <div>
                        <h3 className="font-headline text-lg font-semibold mb-2">Description</h3>
                        <p className="text-sm text-muted-foreground">{productDescription || "No description provided."}</p>
                    </div>
                    
                    <div>
                        <h3 className="font-headline text-lg font-semibold mb-2">The Story Behind</h3>
                        <p className="text-sm text-muted-foreground italic">{productStory || "No story provided."}</p>
                    </div>
                </div>
            </main>
            <footer className="sticky bottom-0 p-4 bg-background border-t flex gap-2 w-full">
                <Button size="lg" variant="outline" className="flex-1">
                    <MessageSquare className="mr-2 h-4 w-4" /> Message
                </Button>
                <Button size="lg" className="flex-1">
                    <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
            </footer>
        </div>
    );
}

    