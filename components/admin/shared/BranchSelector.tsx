"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BranchSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  branches?: Array<{ id: string; name: string }>;
  includeAll?: boolean;
}

export function BranchSelector({
  value,
  onValueChange,
  branches = [],
  includeAll = true,
}: BranchSelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="All Branches" />
      </SelectTrigger>
      <SelectContent>
        {includeAll && <SelectItem value="all">All Branches</SelectItem>}
        {branches.map((branch) => (
          <SelectItem key={branch.id} value={branch.id}>
            {branch.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
