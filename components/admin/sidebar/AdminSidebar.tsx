"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Hotel,
  LayoutDashboard,
  CalendarCheck,
  CreditCard,
  Building2,
  BedDouble,
  Users,
  UserCog,
  Receipt,
  BarChart3,
  Bell,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ROUTES from "@/constants/route";

const navGroups = [
  {
    label: "Main",
    items: [
      { title: "Overview", href: ROUTES.ADMIN_OVERVIEW, icon: LayoutDashboard },
      { title: "Bookings", href: ROUTES.ADMIN_BOOKINGS, icon: CalendarCheck },
      { title: "Payments", href: ROUTES.ADMIN_PAYMENTS, icon: CreditCard },
    ],
  },
  {
    label: "Property",
    items: [
      { title: "Branches", href: ROUTES.ADMIN_BRANCHES, icon: Building2 },
      { title: "Rooms", href: ROUTES.ADMIN_ROOMS, icon: BedDouble },
    ],
  },
  {
    label: "People",
    items: [
      { title: "Guests", href: ROUTES.ADMIN_GUESTS, icon: Users },
      { title: "Staff", href: ROUTES.ADMIN_STAFF, icon: UserCog },
    ],
  },
  {
    label: "Finance",
    items: [
      { title: "Bills", href: ROUTES.ADMIN_BILLS, icon: Receipt },
      { title: "Analytics", href: ROUTES.ADMIN_ANALYTICS, icon: BarChart3 },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Notifications", href: ROUTES.ADMIN_NOTIFICATIONS, icon: Bell },
      { title: "Settings", href: ROUTES.ADMIN_SETTINGS, icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Hotel className="size-5" />
          <span className="text-lg font-semibold">Hotel Admin</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith(item.href)}
                      tooltip={item.title}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        {session?.user && (
          <div className="flex items-center gap-3">
            <Avatar className="size-8">
              <AvatarImage src={session.user.image ?? undefined} alt={session.user.name} />
              <AvatarFallback>
                {session.user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-sm leading-tight">
              <span className="font-medium">{session.user.name}</span>
              <span className="text-muted-foreground text-xs">{session.user.role}</span>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
