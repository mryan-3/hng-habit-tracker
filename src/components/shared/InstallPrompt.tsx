"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "@phosphor-icons/react";

type DeferredPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isIos(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }

  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandaloneMode(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari standalone indicator.
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<DeferredPromptEvent | null>(
    null,
  );
  const [isInstalled, setIsInstalled] = useState(() => isStandaloneMode());
  const [showIosHint, setShowIosHint] = useState(
    () => isIos() && !isStandaloneMode(),
  );
  const [isDismissed, setIsDismissed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.localStorage.getItem("habit-tracker-install-dismissed") === "true";
  });

  const shouldShowInstallButton = useMemo(
    () => !isInstalled && deferredPrompt !== null,
    [deferredPrompt, isInstalled],
  );

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as DeferredPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowIosHint(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("habit-tracker-install-dismissed", "true");
    }
  };

  if (isInstalled || isDismissed) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4">
      <div className="flex w-full max-w-md items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
        <div className="text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Install Habit Tracker</p>
          <p className="text-xs text-slate-600">
            Add to home screen for quick access.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {shouldShowInstallButton ? (
            <button
              type="button"
              onClick={handleInstall}
              className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white"
            >
              Install
            </button>
          ) : showIosHint ? (
            <span className="text-xs font-medium text-slate-600">
              Share → Add to Home Screen
            </span>
          ) : null}
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss install prompt"
            className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
