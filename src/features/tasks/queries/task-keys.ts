import type { TaskListQuery } from "../types";

export const taskKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  list: (query: TaskListQuery) =>
    [...taskKeys.lists(), query.search, query.status, query.priority] as const,
};
