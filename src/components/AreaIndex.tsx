import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { regionSlug } from "@/content/home-utils";
import { getCatalog } from "@/content/catalog";

// Every area as an index, like the contents page of a guide.
export async function AreaIndex({ limit }: { limit?: number }) {
  const { regions } = await getCatalog();
  return (
    <ul className="area-index">
      {regions.slice(0, limit).map((r) => (
        <li key={r.name}>
          <Link href={`/properties/area/${regionSlug(r.name)}`}>
            <span>{r.name}</span>
            <em>{r.count} {r.count === 1 ? "home" : "homes"}</em>
            <ArrowUpRight size={18} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
