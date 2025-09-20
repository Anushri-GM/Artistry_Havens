
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
    <div className="relative flex h-screen w-full items-center justify-center bg-background animate-in fade-in-0 duration-1000">
        <Image 
            src="https://ik.imagekit.io/a2wpi1kd9/imgToUrl/image-to-url_8WHeha_jVY"
            alt="Artisan hands working on a craft"
            layout="fill"
            objectFit="contain"
            objectPosition="left"
            priority
        />
    </div>
  );
}
