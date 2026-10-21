"use client";

import { useEffect, useState, type ReactNode } from "react";

// The price and "Check dates" bar along the foot of a phone screen. It steps aside while the price calculator itself is on
// screen, so the two never cover each other, and comes back once the guest scrolls past it.
export function BookBar({ children }: { children: ReactNode }) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const panel = document.getElementById("book");
    if (!panel || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting), { rootMargin: "0px 0px -80px 0px" });
    io.observe(panel);
    return () => io.disconnect();
  }, []);
  return <div className={`book-bar${hidden ? " is-hidden" : ""}`} inert={hidden}>{children}</div>;
}
