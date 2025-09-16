"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArtistryHavensLogo } from "./icons";

const splashImage = PlaceHolderImages.find(img => img.id === "splash");

export function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/language");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="relative h-screen w-screen animate-in fade-in-0 duration-1000">
      {splashImage && (
        <Image
          src={splashImage.imageUrl}
          alt={splashImage.description}
          fill
          priority
          className="object-cover"
          data-ai-hint={splashImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <div className="flex items-center space-x-4">
            <ArtistryHavensLogo className="h-16 w-16 text-white" />
            <div>
                <h1 className="font-headline text-5xl font-bold tracking-tight">
                    Artistry Havens
                </h1>
                <p className="mt-1 text-lg italic">
                    Where Every Creation Belongs.
                </p>
            </div>
          </div>
      </div>
    </div>
  );
}
