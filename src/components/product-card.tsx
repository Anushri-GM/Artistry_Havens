
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
      <CardHeader>
        <CardTitle className="font-headline text-lg">{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span>{product.likes?.toLocaleString() ?? 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Share2 className="h-4 w-4" />
            <span>{product.shares?.toLocaleString() ?? 0}</span>
          </div>
        </div>
      </CardContent>
       <CardFooter className="flex justify-end gap-2">
            <Button variant="ghost" size="sm">Details</Button>
            <Button size="sm">Edit</Button>
      </CardFooter>
    </Card>
  );
}
