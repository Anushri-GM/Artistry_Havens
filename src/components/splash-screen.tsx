
"use client";

import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const splashImage = PlaceHolderImages.find(img => img.id === "splash");

export function SplashScreen() {
  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-background animate-in fade-in-0 duration-1000">
        <Image 
            src={splashImage?.imageUrl || "https://storage.googleapis.com/stedi-dev-public/splash.jpg"}
            alt={splashImage?.description || "Artistry Havens Splash Screen"}
            data-ai-hint={splashImage?.imageHint || "artisan craft"}
            layout="fill"
            objectFit="contain"
            objectPosition="center"
            priority
        />
    </div>
  );
}
