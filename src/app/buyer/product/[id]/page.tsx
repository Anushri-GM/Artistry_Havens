
'use client';
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { mockProducts } from "@/lib/mock-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Star, MessageSquare, ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArtistryHavensLogo } from "@/components/icons";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const product = mockProducts.find(p => p.id === productId);

  if (!product) {
    notFound();
  }

  const image = PlaceHolderImages.find(img => img.id === product.id);
  const artisanAvatar = PlaceHolderImages.find(img => img.id === "avatar-1");

  return (
    <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
            <div className="container mx-auto flex h-20 items-center justify-between p-4">
            <div className="flex items-center gap-2">
                <ArtistryHavensLogo className="h-8 w-8 text-primary" />
                <h1 className="font-headline text-2xl font-bold">Artistry Havens</h1>
            </div>
            <Button variant="ghost" size="icon">
                <ShoppingBag />
            </Button>
            </div>
        </header>
        <main className="container mx-auto p-4 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                    {image && (
                        <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-lg">
                        <Image
                            src={image.imageUrl}
                            alt={image.description}
                            fill
                            className="object-cover"
                            data-ai-hint={image.imageHint}
                        />
                        </div>
                    )}
                </div>
                <div className="space-y-6">
                    <h1 className="font-headline text-4xl font-bold">{product.name}</h1>
                    <div className="flex items-center gap-4">
                         <div className="flex items-center gap-1">
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-500" />
                            <span className="font-semibold">{product.rating}</span>
                            <span className="text-muted-foreground">({product.reviews} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{product.likes?.toLocaleString()} likes</span>
                        </div>
                    </div>
                    <p className="text-4xl font-semibold text-primary">${product.price}</p>
                    
                    <div>
                        <h3 className="font-headline text-xl font-semibold mb-2">Description</h3>
                        <p className="text-muted-foreground">{product.description}</p>
                    </div>
                    
                     <div>
                        <h3 className="font-headline text-xl font-semibold mb-2">The Story Behind</h3>
                        <p className="text-muted-foreground italic">{product.story}</p>
                    </div>

                    <Card className="bg-primary/5">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={artisanAvatar?.imageUrl} />
                                    <AvatarFallback>{product.artisan.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm text-muted-foreground">Created by</p>
                                    <CardTitle className="font-headline text-xl">{product.artisan}</CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button size="lg" className="flex-1">
                            <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart
                        </Button>
                        <Button size="lg" variant="outline" className="flex-1">
                            <MessageSquare className="mr-2 h-5 w-5" /> Message Artisan
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    </div>
  )
}
