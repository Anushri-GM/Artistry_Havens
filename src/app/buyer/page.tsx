

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

const heroImages = [
  PlaceHolderImages.find(img => img.id === 'hero-1'),
  PlaceHolderImages.find(img => img.id === 'hero-2'),
  PlaceHolderImages.find(img => img.id === 'hero-3'),
].filter(Boolean);

const categories = [
  { name: "Pottery", icon: <Palette className="h-8 w-8" />, imageId: 'category-pottery' },
  { name: "Sculpture", icon: <Axe className="h-8 w-8" />, imageId: 'category-sculpture' },
  { name: "Paintings", icon: <SprayCan className="h-8 w-8" />, imageId: 'category-paintings' },
  { name: "Crafts", icon: <Drill className="h-8 w-8" />, imageId: 'category-crafts' },
  { name: "Textiles", icon: <Tent className="h-8 w-8" />, imageId: 'category-textiles' },
];

const bestSellers = [...mockProducts].sort((a, b) => (b.reviews || 0) - (a.reviews || 0)).slice(0, 4);
const trendingProducts = [...mockProducts].sort((a, b) => (b.likes || 0) - (a.likes || 0));

function ProductCard({ product }: { product: (typeof mockProducts)[0] }) {
  const image = PlaceHolderImages.find(img => img.id === product.id);
  const { toast } = useToast();
  
  const handleLike = () => {
      toast({ title: `You liked ${product.name}!` });
  };
  
  return (
    <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-xl group">
      <Link href={`/buyer/product/${product.id}`}>
        <div className="block">
          {image && (
            <div className="relative h-64 w-full">
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
          <CardHeader>
            <CardTitle className="font-headline text-lg">{product.name}</CardTitle>
            <p className="text-sm text-muted-foreground">by {product.artisan}</p>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold text-primary">${product.price}</p>
          </CardContent>
        </div>
      </Link>
      <CardFooter className="flex gap-2">
        <Button className="w-full">
          <ShoppingBag className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
        <Button variant="outline" size="icon" onClick={handleLike}>
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
            <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold font-headline">Request Sent!</h3>
                <p className="text-muted-foreground mt-2">An artisan from the {category} category has been notified. They will review your request and get in touch soon.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
            <div className="space-y-6">
                <div>
                    <Label htmlFor="description">Describe your vision</Label>
                    <Textarea 
                        id="description" 
                        placeholder="e.g., 'A wooden chess set with intricate Rajasthani carvings...'" 
                        rows={5}
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
                        <Button asChild variant="outline">
                            <label htmlFor="reference-image" className="cursor-pointer">
                                <Upload className="mr-2 h-4 w-4" /> Choose File
                            </label>
                        </Button>
                        {referenceImageUrl && <Image src={referenceImageUrl} alt="Reference" width={40} height={40} className="rounded-md object-cover" />}
                    </div>
                </div>
                <Button onClick={handleGenerate} disabled={isLoading || !prompt || !category} className="w-full">
                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Wand2 className="mr-2" />}
                    Generate Mockup
                </Button>
            </div>
             <div className="space-y-4">
                <Label>AI-Generated Mockup</Label>
                <div className="relative aspect-square w-full rounded-lg bg-muted flex items-center justify-center border border-dashed">
                    {isLoading ? (
                        <div className="text-center text-muted-foreground">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                            <p>Generating your vision...</p>
                        </div>
                    ) : generatedMockup ? (
                        <Image src={generatedMockup} alt="AI Generated Mockup" fill className="object-contain rounded-lg" />
                    ) : (
                         <div className="text-center text-muted-foreground p-4">
                            <Wand2 className="h-8 w-8 mx-auto mb-2" />
                            <p>Your generated mockup will appear here.</p>
                        </div>
                    )}
                </div>
                <Button onClick={handleSubmitRequest} disabled={!generatedMockup} className="w-full">Send Request to Artisan</Button>
             </div>
        </div>
    );
}

export default function BuyerPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-20 items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <ArtistryHavensLogo className="h-8 w-8 text-primary" />
            <h1 className="font-headline text-2xl font-bold">Artistry Havens</h1>
          </div>
          <div className="flex items-center gap-2">
            <Dialog>
                <DialogTrigger asChild>
                    <Button>
                        <Wand2 className="mr-2 h-5 w-5"/> Create Your Own
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle className="font-headline text-2xl">Design Your Custom Craft</DialogTitle>
                        <DialogDescription>
                            Use the power of AI to bring your unique idea to life. Describe your vision, and we'll generate a mockup for an artisan to create.
                        </DialogDescription>
                    </DialogHeader>
                    <CustomizationDialog />
                </DialogContent>
            </Dialog>
            <Button variant="ghost" size="icon">
                <ShoppingBag />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <section className="mb-16">
          <Carousel opts={{ loop: true }} className="w-full">
            <CarouselContent>
              {heroImages.map((image, index) => image && (
                <CarouselItem key={index}>
                  <div className="relative h-[60vh] min-h-[400px] w-full rounded-lg overflow-hidden">
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
                        <h2 className="font-headline text-5xl font-extrabold tracking-tight">The Hands Behind the Art</h2>
                        <p className="mt-4 text-xl max-w-2xl">Discover the stories, traditions, and passion woven into every piece.</p>
                     </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </section>
        
        <section className="mb-16">
            <div className="mb-8 text-center">
                <h2 className="font-headline text-3xl font-bold">Explore Our Crafts</h2>
                <p className="mt-2 text-lg text-muted-foreground">Find handmade treasures from across India.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {categories.map(category => {
                  const image = PlaceHolderImages.find(img => img.id === category.imageId);
                  return (
                    <Link href="#" key={category.name}>
                        <div className="group relative block overflow-hidden rounded-lg text-center">
                            {image && <Image src={image.imageUrl} alt={category.name} width={400} height={400} className="object-cover w-full h-40 transition-transform duration-300 group-hover:scale-110" data-ai-hint={image.imageHint}/>}
                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-2">
                                <div className="text-white">{category.icon}</div>
                                <p className="mt-2 font-headline text-lg font-semibold text-white">{category.name}</p>
                            </div>
                        </div>
                    </Link>
                  )
                })}
            </div>
        </section>

        <section className="mb-16">
            <div className="mb-8 text-center">
                <h2 className="font-headline text-3xl font-bold">Top Picks / Best Sellers</h2>
                 <p className="mt-2 text-lg text-muted-foreground">Join others in loving these popular creations.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {bestSellers.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>

        <section>
            <div className="mb-8 text-center">
                <h2 className="font-headline text-3xl font-bold">Trending Now</h2>
                <p className="mt-2 text-lg text-muted-foreground">See what's capturing everyone's attention.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {trendingProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
      </main>
    </div>
  );
}

    