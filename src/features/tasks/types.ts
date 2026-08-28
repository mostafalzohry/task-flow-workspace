export type TaskStatus = "todo" | "in-progress" | "in-review" | "done";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

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
}

export type UpdateTaskInput = Partial<CreateTaskInput>;

export type StatusFilter = TaskStatus | "all";

export type PriorityFilter = TaskPriority | "all";

export interface TaskListQuery {
  search: string;
  status: StatusFilter;
  priority: PriorityFilter;
}

export interface TaskFilters extends TaskListQuery {
  from: string;
  to: string;
}
