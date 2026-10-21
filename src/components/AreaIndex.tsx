import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { regions, regionSlug } from "@/content/properties";

// Every area as an index, like the contents page of a guide.
export function AreaIndex() {
  return (
    <ul className="area-index">
      {regions.map((r) => (
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
