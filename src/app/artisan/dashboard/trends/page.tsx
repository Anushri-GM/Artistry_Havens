
import { ProductCard } from "@/components/product-card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { mockProducts } from "@/lib/mock-data";

export default function TrendsPage() {
    const frequentlyBought = [...mockProducts].sort((a, b) => b.reviews - a.reviews);
    const bestsellers = [...mockProducts].sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="space-y-12">
        <div>
            <h1 className="text-3xl font-bold font-headline mb-2">Frequently Bought Crafts</h1>
            <p className="text-muted-foreground mb-6">Discover what buyers are loving right now across the platform.</p>
            <Carousel opts={{ align: "start", loop: true }}>
                <CarouselContent>
                    {frequentlyBought.map((product) => (
                        <CarouselItem key={product.id} className="basis-1/2">
                            <ProductCard product={product} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>

        <div>
            <h1 className="text-3xl font-bold font-headline mb-2">Bestsellers</h1>
            <p className="text-muted-foreground mb-6">Top-performing products by revenue in each category.</p>
             <Carousel opts={{ align: "start", loop: true }}>
                <CarouselContent>
                    {bestsellers.map((product) => (
                        <CarouselItem key={product.id} className="basis-1/2">
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
