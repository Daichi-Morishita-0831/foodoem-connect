import { getAllUsers } from "@/lib/supabase/queries/admin";
import { UserTable } from "@/components/admin/user-table";

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ユーザー管理</h1>
        <p className="text-sm text-gray-500">
          全{users.length}ユーザー
        </p>
      </div>
      <UserTable users={users} />
    </div>
  );
}
