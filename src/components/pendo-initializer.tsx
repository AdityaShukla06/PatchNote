"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";

export function PendoInitializer() {
  const { userId, isLoaded } = useAuth();
  const initialized = useRef(false);

  useEffect(() => {
    if (typeof pendo === "undefined" || initialized.current) return;
    pendo.initialize({ visitor: { id: "" } });
    initialized.current = true;
  }, []);

  useEffect(() => {
    if (!isLoaded || !userId || typeof pendo === "undefined") return;
    pendo.identify({
      visitor: {
        id: userId,
      },
    });
  }, [isLoaded, userId]);

  return null;
}
