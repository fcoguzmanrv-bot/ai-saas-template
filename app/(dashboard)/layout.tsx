// Dashboard layout — protected, shows sidebar
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Sidebar from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({ where: { id: session.user.id } });

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar plan={user?.plan ?? "FREE"} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
