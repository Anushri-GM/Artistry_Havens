
'use client';

import * as React from 'react';
import Image from 'next/image';
import { mockProducts } from '@/lib/mock-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function MyProductsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline mb-2">My Products</h1>
        <p className="text-muted-foreground mb-6">
          A detailed view of all your uploaded creations.
        </p>
      </div>

      <div className="space-y-6">
        {mockProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
             <div className="flex flex-col sm:flex-row gap-4">
               {product.image && (
                <div className="w-full sm:w-1/3 p-4 flex-shrink-0">
                    <div className="relative aspect-square w-full rounded-lg overflow-hidden border">
                        <Image src={product.image.imageUrl} alt={product.name} fill className="object-cover" />
                    </div>
                </div>
              )}
              <div className="flex-1 flex flex-col p-4 pt-0 sm:pt-4">
                <CardHeader className="p-0">
                  <CardTitle className="font-headline text-xl">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-4 flex-1 space-y-4">
                    <div>
                        <h3 className="font-semibold text-sm text-muted-foreground">Description</h3>
                        <p className="text-sm mt-1">{product.description}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-sm text-muted-foreground">Story</h3>
                        <p className="text-sm italic mt-1">{product.story}</p>
                    </div>
                </CardContent>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
