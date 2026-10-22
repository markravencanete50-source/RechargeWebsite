import Image from "next/image";
import type { Photo as PhotoType } from "@/content/home-utils";

// A real property photo (from Hostaway, or Cloudinary), or a plain brand panel until the import brings one in.
export function Photo({ photo, alt, sizes, priority }: { photo?: PhotoType; alt: string; sizes: string; priority?: boolean }) {
  if (photo?.src) return <Image src={photo.src} alt={photo.alt || alt} fill sizes={sizes} priority={priority} />;
  return (
    <div className="photo-pending" role="img" aria-label={alt}>
      <Image src="/brand/recharge-mark.png" alt="" width={120} height={120} />
      <span>Photo to come</span>
    </div>
  );
}
