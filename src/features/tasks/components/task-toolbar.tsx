import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRIORITY_META, PRIORITY_ORDER, STATUS_META, STATUS_ORDER } from "../config";

export function TaskToolbar() {
  return (
    <section
      aria-label="Task filters"
      className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
    >
      <div className="relative w-full sm:max-w-sm sm:flex-1">
        <label htmlFor="task-search" className="sr-only">
          Search tasks
        </label>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          id="task-search"
          type="search"
          placeholder="Search tasks..."
          className="pl-8"
        />
      </div>

      <Select defaultValue="all">
        <SelectTrigger aria-label="Filter by status" className="w-full sm:w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {STATUS_ORDER.map((status) => (
            <SelectItem key={status} value={status}>
              {STATUS_META[status].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select defaultValue="all">
        <SelectTrigger aria-label="Filter by priority" className="w-full sm:w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All priorities</SelectItem>
          {PRIORITY_ORDER.map((priority) => (
            <SelectItem key={priority} value={priority}>
              {PRIORITY_META[priority].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </section>
  );
}
