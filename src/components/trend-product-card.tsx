
'use client';

import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Bookmark } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface TrendProductCardProps {
  product: Product;
}

export function TrendProductCard({ product }: TrendProductCardProps) {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Saved!",
      description: `"${product.name}" has been added to your saved collection.`,
    });
  };

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
        <CardTitle className="font-headline text-sm leading-tight">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-2 pt-0">
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
       <CardFooter className="flex justify-end gap-1 p-2">
            <Button variant="ghost" size="sm" className="text-xs h-7">Details</Button>
            <Button size="sm" className="text-xs h-7" onClick={handleSave}>
              <Bookmark className="mr-2 h-3 w-3" />
              Save
            </Button>
      </CardFooter>
    </Card>
  );
}
