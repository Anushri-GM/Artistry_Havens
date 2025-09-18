
import { ProductCard } from "@/components/product-card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { mockProducts } from "@/lib/mock-data";

export default function ArtisanHomePage() {
    const frequentlyBought = [...mockProducts].sort((a, b) => b.reviews - a.reviews);
    const bestsellers = [...mockProducts].sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="space-y-12">
        <div>
            <h1 className="text-3xl font-bold font-headline mb-2">My Top Performing Crafts</h1>
            <p className="text-muted-foreground mb-6">Your products that buyers are loving right now.</p>
            <Carousel opts={{ align: "start", loop: true }}>
                <CarouselContent>
                    {frequentlyBought.slice(0,3).map((product) => (
                        <CarouselItem key={product.id} className="basis-1/2 lg:basis-1/3">
                            <ProductCard product={product} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>

        <div>
            <h1 className="text-3xl font-bold font-headline mb-2">My Bestsellers</h1>
            <p className="text-muted-foreground mb-6">Your top-performing products by revenue.</p>
             <Carousel opts={{ align: "start", loop: true }}>
                <CarouselContent>
                    {bestsellers.slice(0,3).map((product) => (
                        <CarouselItem key={product.id} className="basis-1/2 lg:basis-1/3">
                            <ProductCard product={product} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    </div>
  )
}
