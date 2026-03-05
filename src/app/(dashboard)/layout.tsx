import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/auth";
import { Sidebar } from "@/components/layout/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen">
      <Sidebar user={currentUser.profile} />
      <main className="flex-1 overflow-auto bg-gray-50/30">
        <div className="container mx-auto max-w-5xl px-4 py-8 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
