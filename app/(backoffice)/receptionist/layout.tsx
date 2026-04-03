import { requireReceptionist } from "@/lib/admin-auth";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ReceptionistSidebar } from "@/components/receptionist/sidebar/ReceptionistSidebar";
import { AdminTopbar } from "@/components/admin/topbar/AdminTopbar";

export default async function ReceptionistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireReceptionist();

  return (
    <SidebarProvider>
      <ReceptionistSidebar />
      <SidebarInset className="bg-[#eff8fc] min-h-screen min-w-0 overflow-hidden">
        <AdminTopbar />
        <main className="flex-1 min-w-0 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
