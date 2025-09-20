
"use client";

import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const splashImage = PlaceHolderImages.find(img => img.id === "splash");

export function SplashScreen() {
  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-background animate-in fade-in-0 duration-1000">
        <Image 
            src={splashImage?.imageUrl || "https://ik.imagekit.io/a2wpi1kd9/imgToUrl/image-to-url_8WHeha_jVY"}
            alt={splashImage?.description || "Artisan hands working on a craft"}
            data-ai-hint={splashImage?.imageHint || "artisan hands"}
            layout="fill"
            objectFit="contain"
            objectPosition="left"
            priority
        />
    </div>
  );
}
