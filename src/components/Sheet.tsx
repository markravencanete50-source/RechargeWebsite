"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

// A "Show more" button that opens the full content in a sheet: up from the bottom on a phone,
// a centred panel on a larger screen. The content is in the page HTML either way, so it is still indexed.
export function Sheet({ label, title, children, className = "btn btn-ghost show-more" }: { label: ReactNode; title: string; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const onClose = () => { document.body.style.overflow = ""; };
    // A click on the backdrop (the dialog itself, outside the panel) closes it.
    const onClick = (e: MouseEvent) => { if (e.target === d) d.close(); };
    d.addEventListener("close", onClose);
    d.addEventListener("click", onClick);
    return () => { d.removeEventListener("close", onClose); d.removeEventListener("click", onClick); };
  }, []);

  return (
    <>
      <button type="button" className={className} onClick={() => { ref.current?.showModal(); document.body.style.overflow = "hidden"; }}>{label}</button>
      <dialog ref={ref} className="sheet" aria-label={title}>
        <div className="sheet-panel">
          <div className="sheet-head">
            <button type="button" className="sheet-close" onClick={() => ref.current?.close()} aria-label="Close"><X size={20} /></button>
            <strong>{title}</strong>
          </div>
          <div className="sheet-body">{children}</div>
        </div>
      </dialog>
    </>
  );
}
