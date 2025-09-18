

'use client';

import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Star, Heart, Palette, Axe, SprayCan, Drill, Tent, Wand2, Upload, Loader2, CheckCircle } from "lucide-react";
import { ArtistryHavensLogo } from "@/components/icons";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { mockProducts } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { useState } from "react";
import { generateCustomDesign } from "@/ai/flows/generate-custom-design";
import { useToast } from "@/hooks/use-toast";
import type { GenerateCustomDesignInput } from "@/ai/types/generate-custom-design-types";
import { ScrollArea } from "@/components/ui/scroll-area";

const heroImages = [
  PlaceHolderImages.find(img => img.id === 'hero-1'),
  PlaceHolderImages.find(img => img.id === 'hero-2'),
  PlaceHolderImages.find(img => img.id === 'hero-3'),
].filter(Boolean);

const categories = [
  { name: "Pottery", icon: <Palette className="h-6 w-6" />, imageId: 'category-pottery' },
  { name: "Sculpture", icon: <Axe className="h-6 w-6" />, imageId: 'category-sculpture' },
  { name: "Paintings", icon: <SprayCan className="h-6 w-6" />, imageId: 'category-paintings' },
  { name: "Crafts", icon: <Drill className="h-6 w-6" />, imageId: 'category-crafts' },
  { name: "Textiles", icon: <Tent className="h-6 w-6" />, imageId: 'category-textiles' },
];

const bestSellers = [...mockProducts].sort((a, b) => (b.reviews || 0) - (a.reviews || 0)).slice(0, 4);
const trendingProducts = [...mockProducts].sort((a, b) => (b.likes || 0) - (a.likes || 0));

function ProductCard({ product }: { product: (typeof mockProducts)[0] }) {
  const image = PlaceHolderImages.find(img => img.id === product.id);
  const { toast } = useToast();
  
  const handleLike = () => {
      toast({ title: `You liked ${product.name}!` });
  };
  
  const handleAddToCart = () => {
      toast({ title: `${product.name} added to cart!` });
  }

  return (
    <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-xl group w-full">
      <Link href={`/buyer/product/${product.id}`}>
        <div className="block">
          {image && (
            <div className="relative h-32 w-full">
              <Image
                src={image.imageUrl}
                alt={image.description}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={image.imageHint}
              />
               <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 text-xs font-medium">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" />
                  <span>{product.rating} ({product.reviews})</span>
              </div>
            </div>
          )}
          <CardHeader className="p-4">
            <CardTitle className="font-headline text-base">{product.name}</CardTitle>
            <p className="text-xs text-muted-foreground">by {product.artisan}</p>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-lg font-semibold text-primary">${product.price}</p>
          </CardContent>
        </div>
      </Link>
      <CardFooter className="flex gap-2 p-2">
        <Button className="w-full h-9" onClick={handleAddToCart}>
          <ShoppingBag className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
        <Button variant="outline" size="icon" className="h-9 w-9" onClick={handleLike}>
          <Heart className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function CustomizationDialog() {
    const { toast } = useToast();
    const [prompt, setPrompt] = useState("");
    const [category, setCategory] = useState("");
    const [referenceImage, setReferenceImage] = useState<File | null>(null);
    const [referenceImageUrl, setReferenceImageUrl] = useState<string | null>(null);
    const [generatedMockup, setGeneratedMockup] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setReferenceImage(file);
            setReferenceImageUrl(URL.createObjectURL(file));
        }
    };

    const handleGenerate = async () => {
        if (!prompt || !category) {
            toast({
                variant: "destructive",
                title: "Missing Information",
                description: "Please provide a description and select a category.",
            });
            return;
        }
        setIsLoading(true);
        setGeneratedMockup(null);

        try {
            let referenceImageDataUri: string | undefined = undefined;
            if (referenceImage) {
                const reader = new FileReader();
                referenceImageDataUri = await new Promise((resolve, reject) => {
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(referenceImage);
                });
            }

            const input: GenerateCustomDesignInput = { prompt, category };
            if (referenceImageDataUri) {
                input.referenceImageDataUri = referenceImageDataUri;
            }

            const result = await generateCustomDesign(input);
            setGeneratedMockup(result.designDataUri);
        } catch (error) {
            console.error("Failed to generate custom design:", error);
            toast({
                variant: "destructive",
                title: "Generation Failed",
                description: "Could not generate a mockup. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitRequest = () => {
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="text-center py-8 px-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold font-headline">Request Sent!</h3>
                <p className="text-muted-foreground mt-2 text-sm">An artisan from the {category} category has been notified. They will review your request and get in touch soon.</p>
            </div>
        )
    }

    return (
        <ScrollArea className="h-full">
            <div className="space-y-6 p-6">
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="description">Describe your vision</Label>
                        <Textarea 
                            id="description" 
                            placeholder="e.g., 'A wooden chess set...'" 
                            rows={3}
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="category">Choose a category</Label>
                        <Select onValueChange={setCategory} value={category}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an artisan category..." />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="reference-image">Upload a reference image (optional)</Label>
                        <div className="mt-2 flex items-center gap-4">
                            <Input id="reference-image" type="file" className="hidden" onChange={handleImageUpload} accept="image/*"/>
                            <Button asChild variant="outline" size="sm">
                                <label htmlFor="reference-image" className="cursor-pointer">
                                    <Upload className="mr-2 h-4 w-4" /> Choose File
                                </label>
                            </Button>
                            {referenceImageUrl && <Image src={referenceImageUrl} alt="Reference" width={32} height={32} className="rounded-md object-cover" />}
                        </div>
                    </div>
                    <Button onClick={handleGenerate} disabled={isLoading || !prompt || !category} className="w-full">
                        {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Wand2 className="mr-2" />}
                        Generate Mockup
                    </Button>
                </div>
                <div className="space-y-2">
                    <Label>AI-Generated Mockup</Label>
                    <div className="relative aspect-square w-full rounded-lg bg-muted flex items-center justify-center border border-dashed">
                        {isLoading ? (
                            <div className="text-center text-muted-foreground p-4">
                                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                                <p className="text-sm">Generating your vision...</p>
                            </div>
                        ) : generatedMockup ? (
                            <Image src={generatedMockup} alt="AI Generated Mockup" fill className="object-contain rounded-lg p-2" />
                        ) : (
                            <div className="text-center text-muted-foreground p-4">
                                <Wand2 className="h-6 w-6 mx-auto mb-2" />
                                <p className="text-sm">Your generated mockup will appear here.</p>
                            </div>
                        )}
                    </div>
                    <Button onClick={handleSubmitRequest} disabled={!generatedMockup} className="w-full">Send Request to Artisan</Button>
                </div>
            </div>
        </ScrollArea>
    );
}

export default function BuyerPage() {
  return (
    <div className="min-h-screen bg-background flex justify-center">
        <div className="w-full max-w-md bg-background">
            <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
                <div className="container mx-auto flex h-16 items-center justify-between p-4">
                <div className="flex items-center gap-2">
                    <ArtistryHavensLogo className="h-6 w-6 text-primary" />
                    <h1 className="font-headline text-xl font-bold">Artistry Havens</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm">
                                <Wand2 className="mr-2 h-4 w-4"/> Create
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md p-0 overflow-hidden h-[90vh] flex flex-col">
                            <DialogHeader className="p-6 pb-4">
                                <DialogTitle className="font-headline text-xl">Design Your Custom Craft</DialogTitle>
                                <DialogDescription>
                                Describe your vision, and we'll generate a mockup for an artisan to create.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex-1 overflow-auto">
                                <CustomizationDialog />
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/buyer/login">Login</Link>
                    </Button>
                    <Button variant="ghost" size="icon">
                        <ShoppingBag />
                    </Button>
                </div>
                </div>
            </header>

            <main className="flex flex-col items-center p-4">
                <section className="mb-8 w-full">
                <Carousel opts={{ loop: true }} className="w-full">
                    <CarouselContent>
                    {heroImages.map((image, index) => image && (
                        <CarouselItem key={index}>
                        <div className="relative h-[60vh] w-full">
                            <Image
                            src={image.imageUrl}
                            alt={image.description}
                            fill
                            priority={index === 0}
                            className="object-cover"
                            data-ai-hint={image.imageHint}
                            />
                            <div className="absolute inset-0 bg-black/40" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
                                <h2 className="font-headline text-2xl font-extrabold drop-shadow-md">The Hands Behind the Art</h2>
                                <p className="mt-2 text-sm max-w-xs drop-shadow-sm">Discover the stories and passion woven into every piece.</p>
                            </div>
                        </div>
                        </CarouselItem>
                    ))}
                    </CarouselContent>
                </Carousel>
                </section>
                
                <section className="mb-8 w-full">
                    <div className="mb-4 text-center">
                        <h2 className="font-headline text-xl font-bold">Explore Our Crafts</h2>
                        <p className="mt-1 text-sm text-muted-foreground">Find handmade treasures.</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {categories.map(category => {
                        const image = PlaceHolderImages.find(img => img.id === category.imageId);
                        return (
                            <Link href="#" key={category.name}>
                                <div className="group relative block overflow-hidden rounded-lg text-center">
                                    {image && <Image src={image.imageUrl} alt={category.name} width={200} height={200} className="object-cover w-full h-24" data-ai-hint={image.imageHint}/>}
                                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-1">
                                        <div className="text-white">{category.icon}</div>
                                        <p className="mt-1 font-headline text-sm font-semibold text-white">{category.name}</p>
                                    </div>
                                </div>
                            </Link>
                        )
                        })}
                    </div>
                </section>

                <section className="mb-8 w-full">
                    <div className="mb-4 text-center">
                        <h2 className="font-headline text-xl font-bold">Top Picks</h2>
                        <p className="mt-1 text-sm text-muted-foreground">Join others in loving these popular creations.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {bestSellers.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>

                <section className="w-full">
                    <div className="mb-4 text-center">
                        <h2 className="font-headline text-xl font-bold">Trending Now</h2>
                        <p className="mt-1 text-sm text-muted-foreground">See what's capturing attention.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {trendingProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    </div>
  );
}

    