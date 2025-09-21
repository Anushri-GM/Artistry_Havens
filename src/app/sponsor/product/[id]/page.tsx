
'use client';

import Image from "next/image";
import { notFound, useParams, useRouter } from "next/navigation";
import { mockProducts } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Star, Phone, Handshake } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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


export default function SponsorProductPage() {
  const params = useParams();
  const { toast } = useToast();
  
  const productId = params.id as string;
  const product = mockProducts.find(p => p.id === productId);

  if (!product) {
    notFound();
  }

  const handleSponsorClick = () => {
    toast({
        title: "Request Sent!",
        description: "Your sponsorship request has been sent to the artisan.",
    });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <main className="flex-1 overflow-y-auto">
          <div>
              {product.image && (
                  <div className="relative aspect-square w-full">
                  <Image
                      src={product.image.imageUrl}
                      alt={product.image.description}
                      fill
                      className="object-cover"
                      data-ai-hint={product.image.imageHint}
                      priority
                  />
                  </div>
              )}
          </div>

          <div className="p-4 space-y-6">
              <div className="flex items-start justify-between">
                  <div>
                      <h1 className="font-headline text-2xl font-bold">{product.name}</h1>
                       <div className="flex items-center gap-2 mt-1">
                          <StarRating rating={product.rating || 0} />
                          <span className="font-semibold ml-1 text-sm">{product.rating}</span>
                          <span className="text-muted-foreground text-sm">({product.reviews} reviews)</span>
                      </div>
                  </div>
                  <p className="text-2xl font-bold text-primary">₹{product.price}</p>
              </div>
              
              <Card>
                  <CardHeader>
                      <CardTitle className="font-headline text-lg">Artisan Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="font-semibold">{product.artisan}</p>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <a href="tel:+919876543210" className="text-sm">+91 98765 43210</a>
                    </div>
                  </CardContent>
              </Card>

              <div>
                  <h3 className="font-headline text-lg font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
              </div>
              
               <div>
                  <h3 className="font-headline text-lg font-semibold mb-2">The Story Behind</h3>
                  <p className="text-sm text-muted-foreground italic">{product.story}</p>
              </div>
          </div>
      </main>
      <footer className="sticky bottom-0 p-4 bg-background border-t">
          <Button size="lg" className="w-full" onClick={handleSponsorClick}>
              <Handshake className="mr-2 h-4 w-4" /> Sponsor Artisan
          </Button>
      </footer>
    </div>
  )
}
