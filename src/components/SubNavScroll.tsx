"use client";

import { useEffect, useRef, type ReactNode } from "react";

// On a narrow screen the tab row scrolls sideways; this brings the current page's tab into view without moving the page.
export function SubNavScroll({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const row = ref.current;
    const on = row?.querySelector<HTMLElement>('[aria-current="page"]');
    if (row && on && row.scrollWidth > row.clientWidth) row.scrollLeft = on.offsetLeft - row.offsetLeft - 16;
  }, []);
  return <div className="wrap" ref={ref}>{children}</div>;
}
