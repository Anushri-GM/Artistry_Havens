
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Paintbrush, Hammer, CircleDotDashed, Gem, Scissors, Hand } from "lucide-react";

const categories = [
    { name: "Woodwork", icon: <Hammer className="h-10 w-10 text-primary" />, href: "/artisan/dashboard" },
    { name: "Pottery", icon: <CircleDotDashed className="h-10 w-10 text-primary" />, href: "/artisan/dashboard" },
    { name: "Paintings", icon: <Paintbrush className="h-10 w-10 text-primary" />, href: "/artisan/dashboard" },
    { name: "Sculptures", icon: <Hand className="h-10 w-10 text-primary" />, href: "/artisan/dashboard" },
    { name: "Textiles", icon: <Scissors className="h-10 w-10 text-primary" />, href: "/artisan/dashboard" },
    { name: "Jewelry", icon: <Gem className="h-10 w-10 text-primary" />, href: "/artisan/dashboard" },
];

export default function CategorySelectionPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">Choose Your Craft</h1>
          <p className="mt-2 text-lg text-muted-foreground">What kind of artisan are you?</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <Link key={category.name} href={category.href} passHref>
              <Card className="group cursor-pointer overflow-hidden text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className="flex justify-center">{category.icon}</div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <CardTitle className="font-headline text-lg">{category.name}</CardTitle>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
