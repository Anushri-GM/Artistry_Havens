
'use client';
import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { ProductCard } from "@/components/product-card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { mockProducts } from "@/lib/mock-data";

export default function TrendsPage() {
    const frequentlyBought = [...mockProducts].sort((a, b) => b.reviews - a.reviews);
    const bestsellers = [...mockProducts].sort((a, b) => b.revenue - a.revenue);

    const autoplayPluginLTR = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true, playOnInit: true })
    );
    const autoplayPluginRTL = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true, playOnInit: true })
    );

  return (
    <div className="space-y-12">
        <div>
            <h1 className="text-3xl font-bold font-headline mb-2">Frequently Bought Crafts</h1>
            <p className="text-muted-foreground mb-6">Discover what buyers are loving right now across the platform.</p>
            <Carousel 
                opts={{ align: "start", loop: true }}
                plugins={[autoplayPluginLTR.current]}
                onMouseEnter={autoplayPluginLTR.current.stop}
                onMouseLeave={autoplayPluginLTR.current.play}
            >
                <CarouselContent>
                    {frequentlyBought.map((product) => (
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
            <h1 className="text-3xl font-bold font-headline mb-2">Bestsellers</h1>
            <p className="text-muted-foreground mb-6">Top-performing products by revenue in each category.</p>
             <Carousel 
                opts={{ align: "start", loop: true, direction: "rtl" }}
                plugins={[autoplayPluginRTL.current]}
                onMouseEnter={autoplayPluginRTL.current.stop}
                onMouseLeave={autoplayPluginRTL.current.play}
             >
                <CarouselContent>
                    {bestsellers.map((product) => (
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
