

'use client';

import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Star, Heart, Palette, Axe, SprayCan, Drill, Tent, Wand2, Upload, Loader2, CheckCircle, Mic } from "lucide-react";
import { ArtistryHavensLogo } from "@/components/icons";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { mockProducts } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { useState, useEffect, Suspense } from "react";
import { generateCustomDesign } from "@/ai/flows/generate-custom-design";
import { useToast } from "@/hooks/use-toast";
import type { GenerateCustomDesignInput } from "@/ai/types/generate-custom-design-types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateCategoryIcon } from "@/ai/flows/generate-category-icon";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import { translateText } from "@/ai/flows/translate-text";
import type { Product } from "@/context/ArtisanContext";

const heroImages = [
  PlaceHolderImages.find(img => img.id === 'hero-1'),
  PlaceHolderImages.find(img => img.id === 'hero-2'),
  PlaceHolderImages.find(img => img.id === 'hero-3'),
].filter(Boolean);

const initialCategories = [
  { name: "Pottery", icon: <Palette className="h-6 w-6" />, imageUrl: null as string | null },
  { name: "Sculpture", icon: <Axe className="h-6 w-6" />, imageUrl: null as string | null },
  { name: "Paintings", icon: <SprayCan className="h-6 w-6" />, imageUrl: null as string | null },
  { name: "Crafts", icon: <Drill className="h-6 w-6" />, imageUrl: null as string | null },
  { name: "Textiles", icon: <Tent className="h-6 w-6" />, imageUrl: null as string | null },
];

type TranslatedProduct = Product & { translatedName?: string };

function ProductCard({ product }: { product: TranslatedProduct }) {
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
          {product.image && (
            <div className="relative h-32 w-full">
              <Image
                src={product.image.imageUrl}
                alt={product.image.description}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={product.image.imageHint}
              />
               <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 text-xs font-medium">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" />
                  <span>{product.rating} ({product.reviews})</span>
              </div>
            </div>
          )}
          <CardHeader className="p-4">
            <CardTitle className="font-headline text-base">{product.translatedName || product.name}</CardTitle>
            <p className="text-xs text-muted-foreground">by {product.artisan}</p>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-lg font-semibold text-primary">₹{product.price}</p>
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
    const searchParams = useSearchParams();
    const lang = searchParams.get('lang') || 'en';

    const [prompt, setPrompt] = useState("");
    const [category, setCategory] = useState("");
    const [referenceImage, setReferenceImage] = useState<File | null>(null);
    const [referenceImageUrl, setReferenceImageUrl] = useState<string | null>(null);
    const [generatedMockup, setGeneratedMockup] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [translatedContent, setTranslatedContent] = React.useState<any>(null);

    React.useEffect(() => {
        const original = {
            dialogTitle: "Design Your Custom Craft",
            dialogDescription: "Describe your vision, and we'll generate a mockup for an artisan to create.",
            visionLabel: "Describe your vision",
            visionPlaceholder: "e.g., 'A wooden chess set...'",
            categoryLabel: "Choose a category",
            categoryPlaceholder: "Select an artisan category...",
            uploadLabel: "Upload a reference image (optional)",
            chooseFile: "Choose File",
            generateButton: "Generate Mockup",
            generatingButton: "Generating your vision...",
            mockupLabel: "AI-Generated Mockup",
            mockupPlaceholder: "Your generated mockup will appear here.",
            sendRequestButton: "Send Request to Artisan",
            requestSentTitle: "Request Sent!",
            requestSentDescription: "An artisan from the {category} category has been notified. They will review your request and get in touch soon.",
            toastMissingTitle: "Missing Information",
            toastMissingDesc: "Please provide a description and select a category.",
            toastFailedTitle: "Generation Failed",
            toastFailedDesc: "Could not generate a mockup. Please try again.",
        };
        const translate = async () => {
            if (lang === 'en') {
                setTranslatedContent(original);
                return;
            }
            const texts = Object.values(original);
            const translations = await Promise.all(texts.map(t => translateText({ text: t, targetLanguage: lang })));
            const newContent: any = {};
            Object.keys(original).forEach((key, i) => {
                newContent[key] = translations[i].translatedText;
            });
            setTranslatedContent(newContent);
        };
        translate();
    }, [lang]);

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
                title: translatedContent.toastMissingTitle,
                description: translatedContent.toastMissingDesc,
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
                title: translatedContent.toastFailedTitle,
                description: translatedContent.toastFailedDesc,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitRequest = () => {
        setIsSubmitted(true);
    };

    if (!translatedContent) {
        return <div className="p-6"><Skeleton className="h-64 w-full" /></div>;
    }

    if (isSubmitted) {
        return (
            <div className="text-center py-8 px-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold font-headline">{translatedContent.requestSentTitle}</h3>
                <p className="text-muted-foreground mt-2 text-sm">
                    {translatedContent.requestSentDescription.replace('{category}', category)}
                </p>
            </div>
        )
    }

    return (
        <DialogContent className="max-w-md p-0 overflow-hidden h-[90vh] flex flex-col">
            <DialogHeader className="p-6 pb-4">
                <DialogTitle className="font-headline text-xl">{translatedContent.dialogTitle}</DialogTitle>
                <DialogDescription>
                    {translatedContent.dialogDescription}
                </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-auto">
                 <div className="space-y-6 p-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="description">{translatedContent.visionLabel}</Label>
                            <Textarea 
                                id="description" 
                                placeholder={translatedContent.visionPlaceholder} 
                                rows={3}
                                value={prompt}
                                onChange={e => setPrompt(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="category">{translatedContent.categoryLabel}</Label>
                            <Select onValueChange={setCategory} value={category}>
                                <SelectTrigger>
                                    <SelectValue placeholder={translatedContent.categoryPlaceholder} />
                                </SelectTrigger>
                                <SelectContent>
                                    {initialCategories.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="reference-image">{translatedContent.uploadLabel}</Label>
                            <div className="mt-2 flex items-center gap-4">
                                <Input id="reference-image" type="file" className="hidden" onChange={handleImageUpload} accept="image/*"/>
                                <Button asChild variant="outline" size="sm">
                                    <label htmlFor="reference-image" className="cursor-pointer">
                                        <Upload className="mr-2 h-4 w-4" /> {translatedContent.chooseFile}
                                    </label>
                                </Button>
                                {referenceImageUrl && <Image src={referenceImageUrl} alt="Reference" width={32} height={32} className="rounded-md object-cover" />}
                            </div>
                        </div>
                        <Button onClick={handleGenerate} disabled={isLoading || !prompt || !category} className="w-full">
                            {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Wand2 className="mr-2" />}
                            {isLoading ? translatedContent.generatingButton : translatedContent.generateButton}
                        </Button>
                    </div>
                    <div className="space-y-2">
                        <Label>{translatedContent.mockupLabel}</Label>
                        <div className="relative aspect-square w-full rounded-lg bg-muted flex items-center justify-center border border-dashed">
                            {isLoading ? (
                                <div className="text-center text-muted-foreground p-4">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                                    <p className="text-sm">{translatedContent.generatingButton}</p>
                                </div>
                            ) : generatedMockup ? (
                                <Image src={generatedMockup} alt="AI Generated Mockup" fill className="object-contain rounded-lg p-2" />
                            ) : (
                                <div className="text-center text-muted-foreground p-4">
                                    <Wand2 className="h-6 w-6 mx-auto mb-2" />
                                    <p className="text-sm">{translatedContent.mockupPlaceholder}</p>
                                </div>
                            )}
                        </div>
                        <Button onClick={handleSubmitRequest} disabled={!generatedMockup} className="w-full">{translatedContent.sendRequestButton}</Button>
                    </div>
                </div>
            </div>
        </DialogContent>
    );
}


function BuyerPage() {
    const [categories, setCategories] = useState(initialCategories);
    const searchParams = useSearchParams();
    const lang = searchParams.get('lang') || 'en';
    const [translatedContent, setTranslatedContent] = useState<any>(null);
    const [translatedProducts, setTranslatedProducts] = useState<TranslatedProduct[]>([]);

    useEffect(() => {
        const original = {
            create: "Create",
            login: "Login",
            heroTitle: "The Hands Behind the Art",
            heroSubtitle: "Discover the stories and passion woven into every piece.",
            exploreTitle: "Explore Our Crafts",
            exploreSubtitle: "Find handmade treasures.",
            topPicksTitle: "Top Picks",
            topPicksSubtitle: "Join others in loving these popular creations.",
            trendingTitle: "Trending Now",
            trendingSubtitle: "See what's capturing attention.",
        };
        const translate = async () => {
            if (lang === 'en') {
                setTranslatedContent(original);
                const productsWithTranslation = mockProducts.map(p => ({ ...p, translatedName: p.name }));
                setTranslatedProducts(productsWithTranslation);
                return;
            }
            const texts = Object.values(original);
            const productNames = mockProducts.map(p => p.name);
            const allTexts = [...texts, ...productNames];

            const translations = await Promise.all(allTexts.map(t => translateText({ text: t, targetLanguage: lang })));
            
            const newContent: any = {};
            Object.keys(original).forEach((key, i) => {
                newContent[key] = translations[i].translatedText;
            });
            setTranslatedContent(newContent);
            
            const newTranslatedProducts = mockProducts.map((p, i) => ({
                ...p,
                translatedName: translations[texts.length + i].translatedText
            }));
            setTranslatedProducts(newTranslatedProducts);
        };
        translate();
    }, [lang]);

    useEffect(() => {
        const fetchCategoryImages = async () => {
            const imagePromises = initialCategories.map(category => 
                generateCategoryIcon({ categoryName: category.name })
            );

            try {
                const results = await Promise.all(imagePromises);
                const updatedCategories = initialCategories.map((category, index) => ({
                    ...category,
                    imageUrl: results[index].iconDataUri
                }));
                setCategories(updatedCategories);
            } catch (error) {
                console.error("Failed to generate category images:", error);
            }
        };

        fetchCategoryImages();
    }, []);

  const bestSellers = [...translatedProducts].sort((a, b) => (b.reviews || 0) - (a.reviews || 0)).slice(0, 4);
  const trendingProducts = [...translatedProducts].sort((a, b) => (b.likes || 0) - (a.likes || 0));

  if (!translatedContent) {
      return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex justify-center">
        <div className="w-full bg-background">
            <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
                <div className="container mx-auto flex h-16 items-center justify-between p-4">
                <div className="flex items-center gap-2">
                    <ArtistryHavensLogo className="h-6 w-6 text-primary" />
                    <h1 className="font-headline text-xl font-bold">Artistry Havens</h1>
                </div>
                <div className="flex items-center gap-1">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm">
                                <Wand2 className="mr-2 h-4 w-4"/> {translatedContent.create}
                            </Button>
                        </DialogTrigger>
                        <CustomizationDialog />
                    </Dialog>
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/buyer/login?lang=${lang}`}>{translatedContent.login}</Link>
                    </Button>
                    <Button variant="ghost" size="icon">
                        <ShoppingBag />
                    </Button>
                    <Button variant="ghost" size="icon" className="bg-primary/10 text-primary hover:bg-primary/20">
                        <Mic className="h-5 w-5" />
                        <span className="sr-only">Voice Command</span>
                    </Button>
                </div>
                </div>
            </header>

            <main className="flex flex-col items-center p-4">
                <section className="mb-8 w-full">
                <Carousel opts={{ loop: true }} className="w-full">
                    <CarouselContent className="-ml-2">
                    {heroImages.map((image, index) => image && (
                        <CarouselItem key={index} className="pl-2">
                        <div className="relative h-[60vh] w-full overflow-hidden rounded-lg">
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
                                <h2 className="font-headline text-2xl font-extrabold drop-shadow-md">{translatedContent.heroTitle}</h2>
                                <p className="mt-2 text-sm max-w-xs drop-shadow-sm">{translatedContent.heroSubtitle}</p>
                            </div>
                        </div>
                        </CarouselItem>
                    ))}
                    </CarouselContent>
                </Carousel>
                </section>
                
                <section className="mb-8 w-full">
                    <div className="mb-4 text-center">
                        <h2 className="font-headline text-xl font-bold">{translatedContent.exploreTitle}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">{translatedContent.exploreSubtitle}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {categories.map(category => (
                            <Link href="#" key={category.name}>
                                <div className="group relative block overflow-hidden rounded-lg text-center">
                                    <div className="relative w-full h-24">
                                    {category.imageUrl ? (
                                        <Image src={category.imageUrl} alt={category.name} fill className="object-cover" />
                                    ) : (
                                        <Skeleton className="h-full w-full" />
                                    )}
                                    </div>
                                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-1">
                                        <div className="text-white">{category.icon}</div>
                                        <p className="mt-1 font-headline text-sm font-semibold text-white">{category.name}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="mb-8 w-full">
                    <div className="mb-4 text-center">
                        <h2 className="font-headline text-xl font-bold">{translatedContent.topPicksTitle}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">{translatedContent.topPicksSubtitle}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {bestSellers.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>

                <section className="w-full">
                    <div className="mb-4 text-center">
                        <h2 className="font-headline text-xl font-bold">{translatedContent.trendingTitle}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">{translatedContent.trendingSubtitle}</p>
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

function BuyerPageWithSuspense() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
            <BuyerPage />
        </Suspense>
    )
}

export default BuyerPageWithSuspense;
    
