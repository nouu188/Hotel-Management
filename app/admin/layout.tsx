import { requireAdmin } from "@/lib/admin-auth";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/sidebar/AdminSidebar";
import { AdminTopbar } from "@/components/admin/topbar/AdminTopbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="bg-[#eff8fc] min-h-screen">
        <AdminTopbar />
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
