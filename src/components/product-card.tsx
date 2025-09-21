
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Share2 } from "lucide-react";

type Product = {
  id: string;
  name: string;
  price: string;
  image?: {
    imageUrl: string;
    description: string;
    imageHint: string;
  };
  likes?: number;
  shares?: number;
  translatedName?: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const likes = product.likes ?? 0;
  const shares = product.shares ?? 0;

  return (
    <Card className="overflow-hidden">
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
      <CardHeader className="p-2">
        <CardTitle className="font-headline text-sm leading-tight">{product.translatedName || product.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-2 pt-0">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            <span>{(product.likes ?? 0).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Share2 className="h-3 w-3" />
            <span>{(product.shares ?? 0).toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
       <CardFooter className="flex justify-end gap-1 p-2">
            <Button variant="ghost" size="sm" className="text-xs h-7">Details</Button>
            <Button size="sm" className="text-xs h-7">Edit</Button>
      </CardFooter>
    </Card>
  );
}
