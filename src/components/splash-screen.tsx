
"use client";

import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const splashImage = {
    imageUrl: "https://image2url.com/images/1758388595247-d7aa9984-bfbe-4f05-867b-cbbbb9c544bf.jpg",
    description: "Artistry Havens Splash Screen",
    imageHint: "artisan craft"
};

export function SplashScreen() {
  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-background animate-in fade-in-0 duration-1000">
        <Image 
            src={splashImage?.imageUrl}
            alt={splashImage?.description}
            data-ai-hint={splashImage?.imageHint}
            layout="fill"
            objectFit="contain"
            objectPosition="center"
            priority
        />
    </div>
  );
}
