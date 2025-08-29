"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (process.env.NODE_ENV !== "production") return; // only register in prod
  if ("serviceWorker" in navigator) {
      const register = async () => {
        try {
      const reg = await navigator.serviceWorker.register("/sw.js?v=2");
          // Optional: listen for updates
          reg.onupdatefound = () => {
            const installing = reg.installing;
            if (!installing) return;
            installing.onstatechange = () => {
              // You could prompt user to refresh when installed === 'installed'
            };
          };
      // Ask the SW to check for updates proactively
      navigator.serviceWorker.ready.then((readyReg) => readyReg.update()).catch(() => {});
        } catch (e) {
          console.error("SW registration failed", e);
        }
      };
      // wait a tick to avoid blocking TTI
      setTimeout(register, 0);
    }
  }, []);

  return null;
}
