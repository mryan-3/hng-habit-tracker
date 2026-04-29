"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import { SplashScreen } from "@/components/shared/SplashScreen";

const SPLASH_DELAY_MS = 1000;
const FALLBACK_REDIRECT_MS = 3000;

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const targetPath = getSession() ? "/dashboard" : "/login";

    const timeoutId = window.setTimeout(() => {
      router.replace(targetPath);
    }, SPLASH_DELAY_MS);

    // Fallback hard redirect in case client-side navigation gets blocked.
    const fallbackId = window.setTimeout(() => {
      window.location.replace(targetPath);
    }, FALLBACK_REDIRECT_MS);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearTimeout(fallbackId);
    };
  }, [router]);

  return <SplashScreen />;
}
