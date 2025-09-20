
'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SplashScreen } from '@/components/splash-screen';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/language");
        }, 3000);

        return () => clearTimeout(timer);
    }, [router]);

    return <SplashScreen />;
}
