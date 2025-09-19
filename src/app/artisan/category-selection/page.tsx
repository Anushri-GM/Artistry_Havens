
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Paintbrush, Hammer, CircleDotDashed, Gem, Scissors, Hand, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
    { name: "Woodwork", icon: <Hammer className="h-10 w-10 text-primary" /> },
    { name: "Pottery", icon: <CircleDotDashed className="h-10 w-10 text-primary" /> },
    { name: "Paintings", icon: <Paintbrush className="h-10 w-10 text-primary" /> },
    { name: "Sculptures", icon: <Hand className="h-10 w-10 text-primary" /> },
    { name: "Textiles", icon: <Scissors className="h-10 w-10 text-primary" /> },
    { name: "Jewelry", icon: <Gem className="h-10 w-10 text-primary" /> },
];

export default function CategorySelectionPage() {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryName)
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleContinue = () => {
    // Here you would typically save the selected categories to the user's profile
    console.log("Selected categories:", selectedCategories);
    router.push("/artisan/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">Choose Your Crafts</h1>
          <p className="mt-2 text-lg text-muted-foreground">What kind of artisan are you? Select all that apply.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => {
            const isSelected = selectedCategories.includes(category.name);
            return (
              <Card 
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className={cn(
                  "group cursor-pointer overflow-hidden text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative",
                  isSelected && "border-primary border-2"
                )}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 rounded-full bg-primary text-primary-foreground">
                    <CheckCircle className="h-5 w-5 p-0.5" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-center">{category.icon}</div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <CardTitle className="font-headline text-lg">{category.name}</CardTitle>
                </CardContent>
              </Card>
            )
          })}
        </div>
        <div className="mt-12">
            <Button 
                className="w-full" 
                size="lg"
                disabled={selectedCategories.length === 0}
                onClick={handleContinue}
            >
                Continue
            </Button>
        </div>
      </div>
    </div>
  );
}
