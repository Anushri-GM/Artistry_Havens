
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Star, ThumbsUp, Palette, Axe, SprayCan, Drill, Tent } from "lucide-react";
import { ArtistryHavensLogo } from "@/components/icons";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { mockProducts } from "@/lib/mock-data";

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
        <Button variant="outline" size="icon">
          <ThumbsUp className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
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
          <Button variant="ghost" size="icon">
            <ShoppingBag />
          </Button>
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
