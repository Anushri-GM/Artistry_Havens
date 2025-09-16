"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/language");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="relative flex h-screen w-screen items-center justify-center bg-[#FDFBF4] animate-in fade-in-0 duration-1000">
      <Image
        src="/splash-logo.png"
        alt="Artistry Havens Logo"
        width={500}
        height={500}
        priority
        className="object-contain"
      />
    </div>
  );
}
