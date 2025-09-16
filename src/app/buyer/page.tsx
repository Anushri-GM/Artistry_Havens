import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Star, ThumbsUp } from "lucide-react";
import { ArtistryHavensLogo } from "@/components/icons";

const products = [
  { id: 'pottery-1', name: 'Terracotta Vase', price: '49.99', rating: 4.5, reviews: 89, artisan: 'Mira Varma' },
  { id: 'woodwork-1', name: 'Elephant Sculpture', price: '129.99', rating: 4.9, reviews: 152, artisan: 'Rohan Joshi' },
  { id: 'jewelry-1', name: 'Turquoise Necklace', price: '89.99', rating: 4.7, reviews: 210, artisan: 'Priya Mehta' },
  { id: 'textiles-1', name: 'Kalamkari Weave', price: '75.00', rating: 4.8, reviews: 112, artisan: 'Ananya Reddy' },
  { id: 'paintings-1', name: 'Abstract Dreams', price: '250.00', rating: 4.6, reviews: 45, artisan: 'Vikram Singh' },
  { id: 'metalwork-1', name: 'Brass Wall Art', price: '180.00', rating: 4.9, reviews: 99, artisan: 'Sanjay Patel' },
];

export default function BuyerPage() {
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
        <div className="mb-8 text-center">
          <h2 className="font-headline text-4xl font-bold">Discover Unique Handicrafts</h2>
          <p className="mt-2 text-lg text-muted-foreground">Handmade with love by local artisans across India.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {products.map(product => {
            const image = PlaceHolderImages.find(img => img.id === product.id);
            return (
              <Card key={product.id} className="overflow-hidden transition-shadow duration-300 hover:shadow-xl">
                {image && (
                  <div className="relative h-80 w-full">
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      fill
                      className="object-cover"
                      data-ai-hint={image.imageHint}
                    />
                     <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 text-xs font-medium">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" />
                        <span>{product.rating} ({product.reviews})</span>
                    </div>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="font-headline text-xl">{product.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">by {product.artisan}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold text-primary">${product.price}</p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button className="w-full">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="icon">
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
