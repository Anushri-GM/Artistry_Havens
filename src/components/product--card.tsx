
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Share2, MoreHorizontal } from "lucide-react";

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
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      {product.image && (
        <div className="relative h-48 w-full">
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
        <CardTitle className="font-headline text-base leading-tight">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            <span>{product.likes?.toLocaleString() ?? 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Share2 className="h-3 w-3" />
            <span>{product.shares?.toLocaleString() ?? 0}</span>
          </div>
        </div>
      </CardContent>
       <CardFooter className="flex justify-end gap-2 p-2">
            <Button variant="ghost" size="sm">Details</Button>
            <Button size="sm">Edit</Button>
      </CardFooter>
    </Card>
  );
}
