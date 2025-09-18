
"use client";

import { ArtistryHavensLogo } from "@/components/icons";
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
    <div className="relative flex h-screen w-screen items-center justify-center bg-background animate-in fade-in-0 duration-1000">
        <div className="flex flex-col items-center gap-6">
            <ArtistryHavensLogo className="h-20 w-20 text-primary" />
            <div className="text-center">
                 <h1 className="font-headline text-5xl font-bold text-primary">Artistry Havens</h1>
                 <p className="mt-4 text-lg text-muted-foreground italic">Where Every Creation Belongs.</p>
            </div>
        </div>
    </div>
  );
}
