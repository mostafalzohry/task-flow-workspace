"use client";

import { useId } from "react";
import { FilterX, LoaderCircle, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRIORITY_META, PRIORITY_ORDER, STATUS_META, STATUS_ORDER } from "@/config";
import type { PriorityFilter, StatusFilter } from "@/types";
import { asPriorityFilter, asStatusFilter } from "@/utils/task-filters";

interface TaskToolbarProps {
  searchInput: string;
  onSearchChange: (value: string) => void;
  status: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  priority: PriorityFilter;
  onPriorityChange: (value: PriorityFilter) => void;
  from: string;
  onFromChange: (value: string) => void;
  to: string;
  onToChange: (value: string) => void;
  dateRangeError: string | null;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  isFetching: boolean;
}

const TaskToolbar = ({
  searchInput,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  from,
  onFromChange,
  to,
  onToChange,
  dateRangeError,
  hasActiveFilters,
  onClearFilters,
  isFetching,
}: TaskToolbarProps) => {
  const searchId = useId();
  const fromId = useId();
  const toId = useId();
  const dateErrorId = useId();

  return (
    <section aria-label="Task filters" className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="relative w-full sm:max-w-xs sm:flex-1">
          <Label htmlFor={searchId} className="sr-only">
            Search tasks
          </Label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id={searchId}
            type="search"
            placeholder="Search tasks..."
            className="pl-8 [&::-webkit-search-cancel-button]:cursor-pointer"
            value={searchInput}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>

        <div className="grid gap-1.5">
          <Label className="text-xs text-muted-foreground">Status</Label>
          <div className="relative">
            <Select
              value={status}
              onValueChange={(value) => onStatusChange(asStatusFilter(value))}
            >
              <SelectTrigger
                aria-label="Filter by status"
                className={cn(
                  "w-full sm:w-40",
                  status !== "all" && "[&>svg]:invisible",
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUS_ORDER.map((option) => (
                  <SelectItem key={option} value={option}>
                    {STATUS_META[option].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {status !== "all" ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label="Clear status filter"
                onClick={() => onStatusChange("all")}
                className="absolute top-1/2 right-1.5 -translate-y-1/2 text-muted-foreground hover:bg-transparent hover:text-foreground"
              >
                <X className="size-3.5" />
              </Button>
            ) : null}
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label className="text-xs text-muted-foreground">Priority</Label>
          <div className="relative">
            <Select
              value={priority}
              onValueChange={(value) => onPriorityChange(asPriorityFilter(value))}
            >
              <SelectTrigger
                aria-label="Filter by priority"
                className={cn(
                  "w-full sm:w-40",
                  priority !== "all" && "[&>svg]:invisible",
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                {PRIORITY_ORDER.map((option) => (
                  <SelectItem key={option} value={option}>
                    {PRIORITY_META[option].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {priority !== "all" ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label="Clear priority filter"
                onClick={() => onPriorityChange("all")}
                className="absolute top-1/2 right-1.5 -translate-y-1/2 text-muted-foreground hover:bg-transparent hover:text-foreground"
              >
                <X className="size-3.5" />
              </Button>
            ) : null}
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor={fromId} className="text-xs text-muted-foreground">
            Due from
          </Label>
          <Input
            id={fromId}
            type="date"
            className="w-full sm:w-40"
            value={from}
            max={to || undefined}
            aria-invalid={dateRangeError ? true : undefined}
            aria-describedby={dateRangeError ? dateErrorId : undefined}
            onChange={(event) => onFromChange(event.target.value)}
          />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor={toId} className="text-xs text-muted-foreground">
            Due to
          </Label>
          <Input
            id={toId}
            type="date"
            className="w-full sm:w-40"
            value={to}
            min={from || undefined}
            aria-invalid={dateRangeError ? true : undefined}
            aria-describedby={dateRangeError ? dateErrorId : undefined}
            onChange={(event) => onToChange(event.target.value)}
          />
        </div>

        {hasActiveFilters ? (
          <Button
            type="button"
            variant="ghost"
            className="w-full sm:w-auto"
            onClick={onClearFilters}
            startIcon={<FilterX />}
          >
            Clear filters
          </Button>
        ) : null}
      </div>

      <div className="flex min-h-4 items-center gap-3">
        {dateRangeError ? (
          <p id={dateErrorId} role="alert" className="text-xs text-destructive">
            {dateRangeError}
          </p>
        ) : null}
        <span
          role="status"
          aria-live="polite"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          {isFetching ? (
            <>
              <LoaderCircle aria-hidden="true" className="size-3.5 animate-spin" />
              Updating results
            </>
          ) : null}
        </span>
      </div>
    </section>
  );
};

export default TaskToolbar;
