import Image from "next/image";
import type { Photo as PhotoType } from "@/content/photos";

// A real property photo from Cloudinary, or a plain brand panel until one is added in src/content/photos.ts.
export function Photo({ photo, sizes, priority }: { photo: PhotoType; sizes: string; priority?: boolean }) {
  if (photo.src) return <Image src={photo.src} alt={photo.alt} fill sizes={sizes} priority={priority} />;
  return (
    <div className="photo-pending" role="img" aria-label={photo.alt}>
      <Image src="/brand/recharge-mark.png" alt="" width={120} height={120} />
      <span>Photo to come</span>
    </div>
  );
}
