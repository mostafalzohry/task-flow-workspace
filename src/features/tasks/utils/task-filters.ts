import { PRIORITY_ORDER, STATUS_ORDER } from "../config";
import type { PriorityFilter, StatusFilter, Task, TaskFilters } from "../types";

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function asStatusFilter(value: string | null | undefined): StatusFilter {
  return STATUS_ORDER.find((status) => status === value) ?? "all";
}

export function asPriorityFilter(
  value: string | null | undefined,
): PriorityFilter {
  return PRIORITY_ORDER.find((priority) => priority === value) ?? "all";
}

export function asIsoDate(value: string | null | undefined): string {
  if (!value || !ISO_DATE_PATTERN.test(value)) {
    return "";
  }
  return Number.isNaN(new Date(value).getTime()) ? "" : value;
}

export function parseTaskFilters(queryString: string): TaskFilters {
  const params = new URLSearchParams(queryString);
  return {
    search: (params.get("q") ?? "").trim(),
    status: asStatusFilter(params.get("status")),
    priority: asPriorityFilter(params.get("priority")),
    from: asIsoDate(params.get("from")),
    to: asIsoDate(params.get("to")),
  };
}

export function buildTaskFilterQuery(
  currentQueryString: string,
  filters: TaskFilters,
): string {
  const params = new URLSearchParams(currentQueryString);
  const entries: [string, string, string][] = [
    ["q", filters.search, ""],
    ["status", filters.status, "all"],
    ["priority", filters.priority, "all"],
    ["from", filters.from, ""],
    ["to", filters.to, ""],
  ];
  for (const [key, value, defaultValue] of entries) {
    if (value === "" || value === defaultValue) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  }
  return params.toString();
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
