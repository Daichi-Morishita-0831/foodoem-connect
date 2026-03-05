import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.profile.role !== "admin") {
    redirect("/projects");
  }

  return <>{children}</>;
}
