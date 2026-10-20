import Image from "next/image";
import type { CSSProperties } from "react";

// A phone with a real Recharge app screen inside it.
export function PhoneFrame({ src, alt, priority, style, className = "" }: { src: string; alt: string; priority?: boolean; style?: CSSProperties; className?: string }) {
  return (
    <div className={`phone ${className}`} style={style}>
      <div className="phone-screen">
        <Image src={src} alt={alt} width={780} height={1688} sizes="(max-width: 900px) 260px, 300px" priority={priority} />
        <div className="phone-glare" />
      </div>
    </div>
  );
}
