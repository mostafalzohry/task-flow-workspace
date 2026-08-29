"use client";

import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

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
      <button
        type="button"
        onClick={() => onSort(field)}
        className="flex w-full items-center gap-1.5 px-3 py-2.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        {label}
        <SortIcon
          aria-hidden="true"
          className={
            isActive ? "size-3.5 shrink-0" : "size-3.5 shrink-0 opacity-50"
          }
        />
      </button>
    </th>
  );
};

export default TaskTableSortHeader;
