
'use client';

import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { ProductCard } from "@/components/product-card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { mockProducts } from "@/lib/mock-data";

export default function ArtisanHomePage() {
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
            <h1 className="text-3xl font-bold font-headline mb-2">My Top Performing Crafts</h1>
            <p className="text-muted-foreground mb-6">Your products that buyers are loving right now.</p>
            <Carousel 
                opts={{ align: "start", loop: true }}
                plugins={[autoplayPluginLTR.current]}
                onMouseEnter={autoplayPluginLTR.current.stop}
                onMouseLeave={autoplayPluginLTR.current.play}
                className="w-full"
            >
                <CarouselContent className="-ml-4">
                    {frequentlyBought.slice(0,3).map((product) => (
                        <CarouselItem key={product.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 pl-4">
                            <ProductCard product={product} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>

        <div>
            <h1 className="text-3xl font-bold font-headline mb-2">My Bestsellers</h1>
            <p className="text-muted-foreground mb-6">Your top-performing products by revenue.</p>
             <Carousel 
                opts={{ align: "start", loop: true, direction: "rtl" }}
                plugins={[autoplayPluginRTL.current]}
                onMouseEnter={autoplayPluginRTL.current.stop}
                onMouseLeave={autoplayPluginRTL.current.play}
                className="w-full"
            >
                <CarouselContent className="-ml-4">
                    {bestsellers.slice(0,3).map((product) => (
                        <CarouselItem key={product.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 pl-4">
                            <ProductCard product={product} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    </div>
  )
}
