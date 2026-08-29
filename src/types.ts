export type TaskStatus = "todo" | "in-progress" | "in-review" | "done";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type TaskView = "board" | "list";

export type TaskSortField = "title" | "dueDate";

export type SortOrder = "asc" | "desc";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
}

export type UpdateTaskInput = Partial<CreateTaskInput>;

export type StatusFilter = TaskStatus | "all";

export type PriorityFilter = TaskPriority | "all";

export interface TaskListQuery {
  search: string;
  status: StatusFilter;
  priority: PriorityFilter;
}

export interface TaskListParams extends TaskListQuery {
  sortBy?: TaskSortField;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
}

export interface TaskFilters extends TaskListQuery {
  from: string;
  to: string;
}

export interface TaskFiltersState extends TaskFilters {
  view: TaskView;
  sortBy: TaskSortField;
  sortOrder: SortOrder;
  page: number;
}
