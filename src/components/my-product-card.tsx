
'use client';

import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Product } from "@/context/ArtisanContext";

interface MyProductCardProps {
  product: Product & { translatedName?: string };
  onDetailsClick: () => void;
}

export function MyProductCard({ product, onDetailsClick }: MyProductCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col">
      {product.image && (
        <div className="relative w-full aspect-[4/3]">
          <Image
            src={product.image.imageUrl}
            alt={product.image.description}
            fill
            className="object-cover"
            data-ai-hint={product.image.imageHint}
          />
        </div>
      )}
      <CardHeader className="p-4">
        <CardTitle className="font-headline text-lg leading-tight">{product.translatedName || product.name}</CardTitle>
      </CardHeader>
      <CardFooter className="flex justify-end gap-2 p-4 pt-0 mt-auto">
            <Button variant="outline" size="sm" onClick={onDetailsClick}>Details</Button>
            <Button size="sm">Edit</Button>
      </CardFooter>
    </Card>
  );
}
