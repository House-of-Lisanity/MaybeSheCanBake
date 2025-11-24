"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "@/styles/components/admin.scss";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <h2>Admin Console</h2>
        <nav>
          <Link
            href="/admin/dashboard"
            className={pathname.includes("dashboard") ? "active" : ""}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className={pathname.includes("products") ? "active" : ""}
          >
            Products
          </Link>
          <Link
            href="/admin/events"
            className={pathname.includes("events") ? "active" : ""}
          >
            Events
          </Link>
          <Link
            href="/admin/gallery"
            className={pathname.includes("gallery") ? "active" : ""}
          >
            Gallery
          </Link>
        </nav>
      </aside>
      <main className="admin-content">{children}</main>
    </div>
  );
}
