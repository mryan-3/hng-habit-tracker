"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    const registerServiceWorker = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js");
      } catch {
        // Silent fail keeps app usable if SW registration fails.
      }
    };

    registerServiceWorker();
  }, []);

  return null;
}
