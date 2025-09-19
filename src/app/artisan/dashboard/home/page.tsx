
'use client';

import * as React from 'react';
import { ProductCard } from "@/components/product-card";
import { mockProducts } from "@/lib/mock-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Group products by category
const groupedByCategory = mockProducts.reduce((acc, product) => {
  const category = product.category;
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push(product);
  return acc;
}, {} as Record<string, typeof mockProducts>);


export default function ArtisanHomePage() {

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline mb-2">My Crafts</h1>
            <p className="text-muted-foreground mb-6">All of your products, organized by category.</p>
        </div>

        <Accordion type="multiple" className="w-full space-y-4" defaultValue={Object.keys(groupedByCategory)}>
            {Object.entries(groupedByCategory).map(([category, products]) => (
            <AccordionItem key={category} value={category} className="border rounded-lg bg-card overflow-hidden">
                <AccordionTrigger className="px-6 py-4 text-lg font-headline hover:no-underline">
                    {category}
                </AccordionTrigger>
                <AccordionContent>
                    <div className="p-6 pt-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {products.map(product => <ProductCard key={product.id} product={product} />)}
                    </div>
                </AccordionContent>
            </AccordionItem>
            ))}
      </Accordion>
    </div>
  )
}
