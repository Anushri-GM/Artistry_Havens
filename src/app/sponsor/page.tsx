
'use client';
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { ArtistryHavensLogo } from "@/components/icons";
import { CheckCircle, Handshake, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { mockProducts } from "@/lib/mock-data";

const heroImage = PlaceHolderImages.find(img => img.id === "sponsor-hero");
const benefits = [
    {
        icon: <Handshake className="h-10 w-10 text-primary" />,
        title: "Empower Artisans",
        description: "Directly contribute to the livelihood and sustainability of traditional Indian crafts and the artisans who create them.",
    },
    {
        icon: <TrendingUp className="h-10 w-10 text-primary" />,
        title: "Shared Growth",
        description: "Participate in a mutually beneficial partnership with profit-sharing on sponsored products, aligning your success with the artisan's.",
    },
    {
        icon: <CheckCircle className="h-10 w-10 text-primary" />,
        title: "Curated Connections",
        description: "Discover and connect with talented artisans, and be part of their unique story and creative journey.",
    },
];

const productsByCategory = mockProducts.reduce((acc, product) => {
    const category = product.category;
    if (!acc[category]) {
        acc[category] = [];
    }
    acc[category].push(product);
    return acc;
}, {} as Record<string, typeof mockProducts>);


export default function SponsorPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex justify-center">
      <div className="w-full">
        <header className="absolute top-0 z-10 w-full">
          <div className="container mx-auto flex h-24 items-center justify-between p-4">
            <div className="flex items-center gap-2 text-white">
              <ArtistryHavensLogo className="h-8 w-8" />
              <h1 className="font-headline text-xl font-bold">Artistry Havens</h1>
            </div>
          </div>
        </header>
        
        <main>
          <section className="relative flex h-[70vh] min-h-[500px] items-center justify-center text-center text-white">
            {heroImage && (
              <Image 
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                priority
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
              />
            )}
            <div className="absolute inset-0 bg-primary/70" />
            <div className="relative z-10 max-w-4xl px-4">
              <h1 className="font-headline text-3xl font-extrabold tracking-tight">
                Welcome, Sponsor!
              </h1>
              <p className="mt-6 text-lg text-primary-foreground/80">
                Invest in culture, empower creators, and share in the success of India's finest artisans.
              </p>
            </div>
          </section>

          <section className="py-12">
              <div className="container mx-auto">
                  <div className="mb-12 text-center">
                      <h2 className="font-headline text-2xl font-bold">Why Sponsor Through Artistry Havens?</h2>
                      <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                          We bridge the gap between tradition and modern patronage, creating opportunities for growth and cultural preservation.
                      </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {benefits.map(benefit => (
                          <div key={benefit.title} className="text-center">
                              <div className="flex justify-center mb-6">
                                  {benefit.icon}
                              </div>
                              <h3 className="font-headline text-xl font-semibold">{benefit.title}</h3>
                              <p className="mt-2 text-muted-foreground px-4">{benefit.description}</p>
                          </div>
                      ))}
                  </div>
              </div>
          </section>

          <section className="bg-background py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="font-headline text-2xl font-bold">Discover Artisans to Sponsor</h2>
                <p className="mt-2 text-muted-foreground">Here are some of the talented creators you can support.</p>
              </div>
              <div className="space-y-12">
                {Object.entries(productsByCategory).map(([category, products]) => (
                  <div key={category}>
                    <h3 className="font-headline text-xl font-bold mb-4">{category}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {products.map(product => (
                        <Card key={product.id} className="overflow-hidden group">
                          {product.image && (
                            <div className="relative aspect-[4/3] w-full">
                              <Image src={product.image.imageUrl} alt={product.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                            </div>
                          )}
                          <CardHeader>
                            <CardTitle className="font-headline text-lg leading-tight">{product.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">by {product.artisan}</p>
                          </CardHeader>
                          <CardContent>
                            <Button className="w-full" asChild>
                              <Link href={`/sponsor/product/${product.id}`}>View Artisan</Link>
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </main>

        <footer className="border-t">
          <div className="container mx-auto py-8 text-center text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} Artistry Havens. All Rights Reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
