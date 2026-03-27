"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InventoryCreateSchema, InventoryUpdateSchema } from "@/lib/validation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { InventoryStatus } from "@prisma/client";
import type { InventoryItem } from "./InventoryTable";

type CreateValues = z.infer<typeof InventoryCreateSchema>;
type UpdateValues = z.infer<typeof InventoryUpdateSchema>;

interface InventoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inventory?: InventoryItem | null;
  branches: Array<{ id: string; name: string }>;
  onSuccess: () => void;
}

const inventoryStatuses = Object.values(InventoryStatus);

export function InventoryFormDialog({
  open,
  onOpenChange,
  inventory,
  branches,
  onSuccess,
}: InventoryFormDialogProps) {
  const isEdit = !!inventory;
  const [roomTypes, setRoomTypes] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    if (open && !isEdit) {
      fetch("/api/admin/room-types?limit=100")
        .then((res) => res.json())
        .then((json) => {
          if (json.success) setRoomTypes(json.data.roomTypes.map((r: any) => ({ id: r.id, name: r.name })));
        })
        .catch(() => {});
    }
  }, [open, isEdit]);

  const createForm = useForm<CreateValues>({
    resolver: zodResolver(InventoryCreateSchema),
    defaultValues: { hotelBranchId: "", roomTypeId: "", quantity: 1 },
  });

  const updateForm = useForm<UpdateValues>({
    resolver: zodResolver(InventoryUpdateSchema),
    defaultValues: { quantity: 0, status: "AVAILABLE" },
  });

  useEffect(() => {
    if (open) {
      if (isEdit) {
        updateForm.reset({
          quantity: inventory.quantity,
          status: inventory.status as InventoryStatus,
        });
      } else {
        createForm.reset({ hotelBranchId: "", roomTypeId: "", quantity: 1 });
      }
    }
  }, [open, inventory, isEdit, createForm, updateForm]);

  const onCreateSubmit = async (values: CreateValues) => {
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!json.success) { toast.error(json.message || "Failed"); return; }
      toast.success("Room type assigned to branch");
      onOpenChange(false);
      onSuccess();
    } catch { toast.error("Failed to assign room type"); }
  };

  const onUpdateSubmit = async (values: UpdateValues) => {
    try {
      const res = await fetch(`/api/admin/inventory/${inventory!.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!json.success) { toast.error(json.message || "Failed"); return; }
      toast.success("Inventory updated");
      onOpenChange(false);
      onSuccess();
    } catch { toast.error("Failed to update inventory"); }
  };

  if (isEdit) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Inventory — {inventory.roomType.name}</DialogTitle>
          </DialogHeader>
          <Form {...updateForm}>
            <form onSubmit={updateForm.handleSubmit(onUpdateSubmit)} className="space-y-4">
              <FormField
                control={updateForm.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {inventoryStatuses.map((s) => (
                          <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit" disabled={updateForm.formState.isSubmitting}>
                  {updateForm.formState.isSubmitting ? "Saving..." : "Update"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Room Type to Branch</DialogTitle>
        </DialogHeader>
        <Form {...createForm}>
          <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
            <FormField
              control={createForm.control}
              name="hotelBranchId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {branches.map((b) => (
                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={createForm.control}
              name="roomTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roomTypes.map((r) => (
                        <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={createForm.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={createForm.formState.isSubmitting}>
                {createForm.formState.isSubmitting ? "Saving..." : "Assign"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
