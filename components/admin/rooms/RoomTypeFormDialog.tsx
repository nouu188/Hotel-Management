"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RoomTypeCreateSchema } from "@/lib/validation";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { RoomTypeWithBranches } from "./RoomTypeCard";

type RoomTypeFormValues = z.infer<typeof RoomTypeCreateSchema>;

interface RoomTypeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomType?: RoomTypeWithBranches | null;
  onSuccess: () => void;
}

export function RoomTypeFormDialog({
  open,
  onOpenChange,
  roomType,
  onSuccess,
}: RoomTypeFormDialogProps) {
  const isEdit = !!roomType;

  const form = useForm<RoomTypeFormValues>({
    resolver: zodResolver(RoomTypeCreateSchema),
    defaultValues: {
      name: "",
      capacity: 1,
      description: "",
      area: 0,
      bedType: "",
      bedNumb: 1,
      bathNumb: 1,
      price: 0,
      image: [],
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: roomType?.name ?? "",
        capacity: roomType?.capacity ?? 1,
        description: roomType?.description ?? "",
        area: roomType?.area ?? 0,
        bedType: roomType?.bedType ?? "",
        bedNumb: roomType?.bedNumb ?? 1,
        bathNumb: roomType?.bathNumb ?? 1,
        price: roomType?.price ?? 0,
        image: roomType?.image ?? [],
      });
    }
  }, [open, roomType, form]);

  const onSubmit = async (values: RoomTypeFormValues) => {
    try {
      const url = isEdit
        ? `/api/admin/room-types/${roomType.id}`
        : "/api/admin/room-types";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();

      if (!json.success) {
        toast.error(json.message || "Something went wrong");
        return;
      }

      toast.success(isEdit ? "Room type updated" : "Room type created");
      onOpenChange(false);
      onSuccess();
    } catch {
      toast.error("Failed to save room type");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Room Type" : "Add Room Type"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Deluxe Double" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Room description" rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area (m²)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step={0.1} {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (VND/night)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bedType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bed Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. King" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bedNumb"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Beds</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bathNumb"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathrooms</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : isEdit ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
