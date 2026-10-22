import type { Metadata } from "next";
import { AdminApp } from "@/components/admin/AdminApp";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false, follow: false } };

// The website dashboard. Invitation only: everything on it is checked again on the server and by the database.
export default function AdminPage() {
  return <AdminApp />;
}
