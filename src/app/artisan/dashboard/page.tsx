

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Palette, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ArtisanDashboardPage() {
    return (
        <div className="flex flex-col items-center min-h-screen bg-background">
            
            <main className="flex flex-col items-center justify-center flex-1 p-4 w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold font-headline">Welcome, Artisan!</h1>
                    <p className="text-muted-foreground mt-2 text-md">What would you like to do today?</p>
                </div>
                <div className="grid grid-cols-1 gap-6 w-full max-w-md">
                    <Link href="/artisan/upload">
                        <Card className="group cursor-pointer overflow-hidden text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br from-accent/10 via-background to-background">
                            <CardHeader>
                                <div className="flex justify-center">
                                    <Upload className="w-12 h-12 text-accent" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-4">
                                <CardTitle className="font-headline text-xl">Upload a Product</CardTitle>
                                <CardDescription className="mt-1 text-sm">
                                    Add a new creation to your collection.
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href="/artisan/dashboard/home">
                        <Card className="group cursor-pointer overflow-hidden text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br from-primary/10 via-background to-background">
                            <CardHeader>
                                <div className="flex justify-center">
                                    <Palette className="w-12 h-12 text-primary" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-4">
                                <CardTitle className="font-headline text-xl">Visit My Page</CardTitle>
                                <CardDescription className="mt-1 text-sm">
                                    See stats, manage products, and view your profile.
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </main>
        </div>
    );
}
