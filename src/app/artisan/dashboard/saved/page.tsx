
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProductCard } from "@/components/product-card";
import { mockProducts } from "@/lib/mock-data";

const savedProducts = mockProducts.slice(0, 5);

const groupedByCategory = savedProducts.reduce((acc, product) => {
  const category = product.category;
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push(product);
  return acc;
}, {} as Record<string, typeof savedProducts>);

export default function SavedCollectionPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Saved Collection</h1>
        <p className="text-muted-foreground">Inspiration and favorite pieces you've collected.</p>
      </div>

      <Accordion type="multiple" className="w-full space-y-4">
        {Object.entries(groupedByCategory).map(([category, products]) => (
          <AccordionItem key={category} value={category} className="border rounded-lg bg-card overflow-hidden">
            <AccordionTrigger className="px-6 py-4 text-lg font-headline hover:no-underline">
                {category}
            </AccordionTrigger>
            <AccordionContent>
                <div className="p-6 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => <ProductCard key={product.id} product={product} />)}
                </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
