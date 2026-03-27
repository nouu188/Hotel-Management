"use client";

import { BedDouble, Users, Ruler, Bath, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/components/admin/overview/KpiCardGrid";

export interface RoomTypeWithBranches {
  id: string;
  name: string;
  capacity: number;
  description: string;
  area: number;
  bedType: string | null;
  bedNumb: number;
  bathNumb: number;
  price: number;
  image: string[];
  createdAt: string;
  updatedAt: string;
  hotelBranchRoomTypes: Array<{
    id: string;
    quantity: number;
    status: string;
    hotelBranch: { name: string };
  }>;
}

interface RoomTypeCardProps {
  roomType: RoomTypeWithBranches;
  onEdit: (roomType: RoomTypeWithBranches) => void;
}

export function RoomTypeCard({ roomType, onEdit }: RoomTypeCardProps) {
  const totalRooms = roomType.hotelBranchRoomTypes.reduce((sum, b) => sum + b.quantity, 0);
  const branchCount = roomType.hotelBranchRoomTypes.length;

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      {roomType.image.length > 0 ? (
        <img
          src={roomType.image[0]}
          alt={roomType.name}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-slate-100 flex items-center justify-center">
          <BedDouble className="h-12 w-12 text-slate-300" />
        </div>
      )}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg">{roomType.name}</h3>
          <Button variant="ghost" size="icon" onClick={() => onEdit(roomType)}>
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xl font-bold text-primary">{formatVND(roomType.price)}<span className="text-sm font-normal text-muted-foreground">/night</span></p>
        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            <span>{roomType.capacity} guests</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Ruler className="h-3.5 w-3.5" />
            <span>{roomType.area} m²</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BedDouble className="h-3.5 w-3.5" />
            <span>{roomType.bedNumb} {roomType.bedType ?? "bed"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="h-3.5 w-3.5" />
            <span>{roomType.bathNumb} bath</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {totalRooms} rooms across {branchCount} {branchCount === 1 ? "branch" : "branches"}
        </p>
      </div>
    </div>
  );
}
