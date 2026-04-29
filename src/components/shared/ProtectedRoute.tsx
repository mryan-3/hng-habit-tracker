"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { getSession } from "@/lib/auth";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const session = isClient ? getSession() : null;

  useEffect(() => {
    if (isClient && !session) {
      router.replace("/login");
    }
  }, [isClient, router, session]);

  if (!isClient || !session) {
    return null;
  }

  return <>{children}</>;
}
