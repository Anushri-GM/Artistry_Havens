import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { ArtistryHavensLogo } from "@/components/icons";
import { CheckCircle, Handshake, TrendingUp } from "lucide-react";

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

export default function SponsorPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="absolute top-0 z-10 w-full">
        <div className="container mx-auto flex h-24 items-center justify-between p-4">
           <div className="flex items-center gap-2 text-white">
            <ArtistryHavensLogo className="h-8 w-8" />
            <h1 className="font-headline text-2xl font-bold">Artistry Havens</h1>
          </div>
          <Button variant="secondary">Login</Button>
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
            <h1 className="font-headline text-5xl font-extrabold tracking-tight md:text-7xl">
              Become a Patron of the Arts
            </h1>
            <p className="mt-6 text-xl text-primary-foreground/80">
              Invest in culture, empower creators, and share in the success of India's finest artisans.
            </p>
            <Button size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
              Start Sponsoring Today
            </Button>
          </div>
        </section>

        <section className="py-20 md:py-32">
            <div className="container mx-auto">
                <div className="mb-16 text-center">
                    <h2 className="font-headline text-4xl font-bold">Why Sponsor Through Artistry Havens?</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                        We bridge the gap between tradition and modern patronage, creating opportunities for growth and cultural preservation.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                    {benefits.map(benefit => (
                        <div key={benefit.title} className="text-center">
                            <div className="flex justify-center mb-6">
                                {benefit.icon}
                            </div>
                            <h3 className="font-headline text-2xl font-semibold">{benefit.title}</h3>
                            <p className="mt-2 text-muted-foreground">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <section className="bg-primary/5 py-20 md:py-32">
             <div className="container mx-auto text-center">
                <h2 className="font-headline text-4xl font-bold">Ready to Make an Impact?</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                   Join our exclusive network of sponsors and start your journey of patronage.
                </p>
                <Button size="lg" className="mt-8">
                    Create a Sponsor Account
                </Button>
             </div>
        </section>
      </main>

       <footer className="border-t">
        <div className="container mx-auto py-8 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Artistry Havens. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
