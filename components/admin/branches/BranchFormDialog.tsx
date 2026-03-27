"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BranchCreateSchema } from "@/lib/validation";
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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect } from "react";

type BranchFormValues = z.infer<typeof BranchCreateSchema>;

interface BranchFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branch?: { id: string; name: string; location: string } | null;
  onSuccess: () => void;
}

export function BranchFormDialog({
  open,
  onOpenChange,
  branch,
  onSuccess,
}: BranchFormDialogProps) {
  const isEdit = !!branch;

  const form = useForm<BranchFormValues>({
    resolver: zodResolver(BranchCreateSchema),
    defaultValues: { name: "", location: "" },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: branch?.name ?? "",
        location: branch?.location ?? "",
      });
    }
  }, [open, branch, form]);

  const onSubmit = async (values: BranchFormValues) => {
    try {
      const url = isEdit
        ? `/api/admin/branches/${branch.id}`
        : "/api/admin/branches";
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

      toast.success(isEdit ? "Branch updated" : "Branch created");
      onOpenChange(false);
      onSuccess();
    } catch {
      toast.error("Failed to save branch");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Branch" : "Add Branch"}</DialogTitle>
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
                    <Input placeholder="Branch name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Branch location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? "Saving..."
                  : isEdit
                    ? "Update"
                    : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
