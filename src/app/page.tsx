"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import { SplashScreen } from "@/components/shared/SplashScreen";

const SPLASH_DELAY_MS = 1000;

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const session = getSession();
      if (session) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }, SPLASH_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [router]);

  return <SplashScreen />;
}
