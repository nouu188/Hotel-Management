"use client";

import { useState } from "react";
import { RoomTypeGrid } from "@/components/admin/rooms/RoomTypeGrid";
import { InventoryTable } from "@/components/admin/rooms/InventoryTable";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "room-types", label: "Room Types" },
  { key: "inventory", label: "Inventory" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export default function RoomsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("room-types");

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-colors",
              activeTab === tab.key
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === "room-types" ? <RoomTypeGrid /> : <InventoryTable />}
    </div>
  );
}
