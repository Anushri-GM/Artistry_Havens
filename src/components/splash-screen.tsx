
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

export function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/language");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="relative flex h-screen w-screen items-center justify-center bg-background animate-in fade-in-0 duration-1000">
        <Image 
            src="https://image2url.com/images/1758193888034-dbd65cc5-da9e-49fd-8766-4f0a1903d5f0.jpg"
            alt="Artisan hands working on a craft"
            fill
            className="object-contain"
            priority
        />
    </div>
  );
}
