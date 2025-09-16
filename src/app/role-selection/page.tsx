import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Paintbrush, ShoppingBag, Heart } from "lucide-react";
import { Suspense } from "react";

const roles = [
  {
    name: "Artisan",
    description: "I create and sell crafts",
    icon: <Paintbrush className="h-12 w-12 text-primary" />,
    href: "/artisan/login",
    emoji: "🎨"
  },
  {
    name: "Buyer",
    description: "I want to buy crafts",
    icon: <ShoppingBag className="h-12 w-12 text-primary" />,
    href: "/buyer",
    emoji: "🛍️"
  },
  {
    name: "Sponsor",
    description: "I want to support artisans",
    icon: <Heart className="h-12 w-12 text-primary" />,
    href: "/sponsor",
    emoji: "❤️"
  },
];

function RoleSelection() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-4xl">
            <div className="mb-12 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground">Welcome!</h1>
            <p className="mt-2 text-lg text-muted-foreground">Please select your role to continue.</p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {roles.map((role) => (
                <Link key={role.name} href={role.href} passHref>
                    <Card className="group cursor-pointer overflow-hidden text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                        <CardHeader className="bg-primary/5">
                        <div className="flex justify-center">{role.icon}</div>
                        </CardHeader>
                        <CardContent className="p-6">
                        <CardTitle className="font-headline text-2xl">
                            {role.name} <span role="img" aria-label={role.name}>{role.emoji}</span>
                        </CardTitle>
                        <CardDescription className="mt-2 text-base">
                            "{role.description}"
                        </CardDescription>
                        </CardContent>
                    </Card>
                </Link>
            ))}
            </div>
        </div>
        </div>
    )
}


export default function RoleSelectionPage() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <RoleSelection />
      </Suspense>
    );
}
