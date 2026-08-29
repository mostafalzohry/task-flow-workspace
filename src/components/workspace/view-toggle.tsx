"use client";

import { LayoutGrid, List, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { TaskView } from "@/types";

interface ViewToggleProps {
  view: TaskView;
  onViewChange: (view: TaskView) => void;
}

const OPTIONS: { value: TaskView; label: string; icon: LucideIcon }[] = [
  { value: "board", label: "Board", icon: LayoutGrid },
  { value: "list", label: "List", icon: List },
];

const ViewToggle = ({ view, onViewChange }: ViewToggleProps) => {
  return (
    <div
      role="group"
      aria-label="View"
      className="inline-flex shrink-0 items-center gap-0.5 rounded-lg border border-input p-1"
    >
      {OPTIONS.map(({ value, label, icon: Icon }) => (
        <Button
          key={value}
          type="button"
          size="default"
          className="h-9 px-3.5"
          variant={view === value ? "secondary" : "ghost"}
          aria-pressed={view === value}
          onClick={() => onViewChange(value)}
          startIcon={<Icon />}
        >
          {label}
        </Button>
      ))}
    </div>
  );
};

export default ViewToggle;
