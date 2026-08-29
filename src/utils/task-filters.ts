import { PRIORITY_ORDER, STATUS_ORDER } from "@/config";
import type {
  PriorityFilter,
  SortOrder,
  StatusFilter,
  Task,
  TaskFilters,
  TaskFiltersState,
  TaskSortField,
  TaskView,
} from "@/types";

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const SORT_FIELDS: readonly TaskSortField[] = ["title", "dueDate"];

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

export function asTaskView(value: string | null | undefined): TaskView {
  return value === "list" ? "list" : "board";
}

export function asTaskSortField(
  value: string | null | undefined,
): TaskSortField {
  return SORT_FIELDS.find((field) => field === value) ?? "dueDate";
}

export function asSortOrder(value: string | null | undefined): SortOrder {
  return value === "desc" ? "desc" : "asc";
}

export function asPageNumber(value: string | null | undefined): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 1 ? parsed : 1;
}

export function parseTaskFilters(queryString: string): TaskFiltersState {
  const params = new URLSearchParams(queryString);
  return {
    search: (params.get("q") ?? "").trim(),
    status: asStatusFilter(params.get("status")),
    priority: asPriorityFilter(params.get("priority")),
    from: asIsoDate(params.get("from")),
    to: asIsoDate(params.get("to")),
    view: asTaskView(params.get("view")),
    sortBy: asTaskSortField(params.get("sort")),
    sortOrder: asSortOrder(params.get("order")),
    page: asPageNumber(params.get("page")),
  };
}

export function buildTaskFilterQuery(
  currentQueryString: string,
  filters: TaskFiltersState,
): string {
  const params = new URLSearchParams(currentQueryString);
  const entries: [string, string, string][] = [
    ["q", filters.search, ""],
    ["status", filters.status, "all"],
    ["priority", filters.priority, "all"],
    ["from", filters.from, ""],
    ["to", filters.to, ""],
    ["view", filters.view, "board"],
    ["sort", filters.sortBy, "dueDate"],
    ["order", filters.sortOrder, "asc"],
    ["page", String(filters.page), "1"],
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
