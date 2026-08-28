import { PRIORITY_ORDER, STATUS_ORDER } from "../config";
import type { PriorityFilter, StatusFilter, Task, TaskFilters } from "../types";

export function asStatusFilter(value: string | null | undefined): StatusFilter {
  return STATUS_ORDER.find((status) => status === value) ?? "all";
}

export function asPriorityFilter(
  value: string | null | undefined,
): PriorityFilter {
  return PRIORITY_ORDER.find((priority) => priority === value) ?? "all";
}

export function filterTasks(
  tasks: readonly Task[],
  filters: TaskFilters,
): Task[] {
  const search = filters.search.trim().toLowerCase();
  const hasValidRange = !(
    filters.from !== "" &&
    filters.to !== "" &&
    filters.from > filters.to
  );

  return tasks.filter((task) => {
    if (search !== "") {
      const haystack = `${task.title} ${task.description}`.toLowerCase();
      if (!haystack.includes(search)) {
        return false;
      }
    }

    if (filters.status !== "all" && task.status !== filters.status) {
      return false;
    }

    if (filters.priority !== "all" && task.priority !== filters.priority) {
      return false;
    }

    if (hasValidRange) {
      if (filters.from !== "" && task.dueDate < filters.from) {
        return false;
      }
      if (filters.to !== "" && task.dueDate > filters.to) {
        return false;
      }
    }

    return true;
  });
}
