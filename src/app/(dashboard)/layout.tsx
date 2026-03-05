"use client";

import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-gray-50/30">
        <div className="container mx-auto max-w-5xl px-4 py-8 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
