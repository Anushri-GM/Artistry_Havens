import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Palette } from "lucide-react";

export default function ArtisanDashboardPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold font-headline">Welcome, Artisan!</h1>
                <p className="text-muted-foreground mt-2 text-lg">What would you like to do today?</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                <Link href="/artisan/dashboard/trends">
                    <Card className="group cursor-pointer overflow-hidden text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-primary/10 via-background to-background">
                        <CardHeader>
                            <div className="flex justify-center">
                                <Palette className="w-16 h-16 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <CardTitle className="font-headline text-3xl">Visit My Page</CardTitle>
                            <CardDescription className="mt-2 text-base">
                                See your stats, manage products, and view your profile.
                            </CardDescription>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/artisan/dashboard/upload">
                    <Card className="group cursor-pointer overflow-hidden text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-accent/10 via-background to-background">
                        <CardHeader>
                            <div className="flex justify-center">
                                <Upload className="w-16 h-16 text-accent" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <CardTitle className="font-headline text-3xl">Upload a Product</CardTitle>
                            <CardDescription className="mt-2 text-base">
                                Add a new creation to your collection and generate its story.
                            </CardDescription>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
