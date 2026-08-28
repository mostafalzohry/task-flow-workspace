import { FilterX, Inbox, Plus, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

interface KanbanBoardEmptyProps {
  variant: "empty" | "no-results";
  onCreate: () => void;
  onClearFilters: () => void;
}

const KanbanBoardEmpty = ({
  variant,
  onCreate,
  onClearFilters,
}: KanbanBoardEmptyProps) => {
  const isNoResults = variant === "no-results";

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
      <span className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {isNoResults ? (
          <SearchX className="size-5" />
        ) : (
          <Inbox className="size-5" />
        )}
      </span>
      <div className="space-y-1">
        <p className="text-sm font-medium">
          {isNoResults ? "No matching tasks" : "No tasks yet"}
        </p>
        <p className="max-w-sm text-sm text-muted-foreground">
          {isNoResults
            ? "No tasks match your current search and filters. Try adjusting them."
            : "Create your first task to start organizing your team's work."}
        </p>
      </div>
      {isNoResults ? (
        <Button variant="outline" onClick={onClearFilters}>
          <FilterX />
          Clear filters
        </Button>
      ) : (
        <Button onClick={onCreate}>
          <Plus />
          Add task
        </Button>
      )}
    </div>
  );
};

export default KanbanBoardEmpty;
