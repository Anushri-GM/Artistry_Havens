
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
            src="https://image2url.com/images/1758187635882-4ed559ce-8eb3-4f40-9fa3-068a6dc1e242.jpg"
            alt="Artisan hands working on a craft"
            fill
            className="object-cover"
            priority
        />
    </div>
  );
}
