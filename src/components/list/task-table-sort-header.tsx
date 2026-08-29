"use client";

import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { SortOrder, TaskSortField } from "@/types";

interface TaskTableSortHeaderProps {
  field: TaskSortField;
  label: string;
  sortBy: TaskSortField;
  sortOrder: SortOrder;
  onSort: (field: TaskSortField) => void;
}

const TaskTableSortHeader = ({
  field,
  label,
  sortBy,
  sortOrder,
  onSort,
}: TaskTableSortHeaderProps) => {
  const isActive = sortBy === field;
  const SortIcon = !isActive
    ? ChevronsUpDown
    : sortOrder === "asc"
      ? ArrowUp
      : ArrowDown;

  return (
    <th
      scope="col"
      className="p-0 text-left font-medium"
      aria-sort={
        isActive ? (sortOrder === "asc" ? "ascending" : "descending") : "none"
      }
    >
      <Button
        variant="ghost"
        onClick={() => onSort(field)}
        className="h-auto w-full justify-start gap-1.5 rounded-none px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        {label}
        <SortIcon
          aria-hidden="true"
          className={isActive ? "size-3.5" : "size-3.5 opacity-50"}
        />
      </Button>
    </th>
  );
};

export default TaskTableSortHeader;
