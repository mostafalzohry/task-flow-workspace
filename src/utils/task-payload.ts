import type { TaskFormValues } from "@/schemas/task-form-schema";
import type { CreateTaskInput, Task, UpdateTaskInput } from "@/types";

function toApiDueDate(dateOnly: string): string {
  return new Date(`${dateOnly}T00:00:00.000Z`).toISOString();
}

function toTaskFields(values: TaskFormValues) {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    status: values.status,
    priority: values.priority,
    dueDate: toApiDueDate(values.dueDate),
  };
}

export function formValuesToCreateInput(
  values: TaskFormValues,
): CreateTaskInput {
  return {
    ...toTaskFields(values),
    createdAt: new Date().toISOString(),
  };
}

export function formValuesToUpdateInput(
  values: TaskFormValues,
): UpdateTaskInput {
  return toTaskFields(values);
}

export function taskToFormValues(task: Task): TaskFormValues {
  return {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
  };
}

export const EMPTY_TASK_FORM_VALUES: TaskFormValues = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
};
