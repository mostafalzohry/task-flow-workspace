import type { TaskFormValues } from "@/schemas/task-form-schema";
import type { Task } from "@/types";
import {
  EMPTY_TASK_FORM_VALUES,
  formValuesToCreateInput,
  formValuesToUpdateInput,
  taskToFormValues,
} from "./task-payload";

const values: TaskFormValues = {
  title: "  Trim me  ",
  description: "  and me  ",
  status: "in-progress",
  priority: "high",
  dueDate: "2026-04-01",
};

describe("formValuesToCreateInput", () => {
  it("trims text, converts the due date to an ISO instant, and stamps createdAt", () => {
    const input = formValuesToCreateInput(values);
    expect(input.title).toBe("Trim me");
    expect(input.description).toBe("and me");
    expect(input.dueDate).toBe("2026-04-01T00:00:00.000Z");
    expect(input.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(Number.isNaN(Date.parse(input.createdAt))).toBe(false);
  });
});

describe("formValuesToUpdateInput", () => {
  it("produces the task fields without createdAt so edits never overwrite it", () => {
    const input = formValuesToUpdateInput(values);
    expect(input).toEqual({
      title: "Trim me",
      description: "and me",
      status: "in-progress",
      priority: "high",
      dueDate: "2026-04-01T00:00:00.000Z",
    });
    expect("createdAt" in input).toBe(false);
  });
});

describe("taskToFormValues", () => {
  it("maps a task back to editable form values", () => {
    const t: Task = {
      id: "9",
      title: "Existing",
      description: "desc",
      status: "done",
      priority: "low",
      dueDate: "2026-05-05",
      createdAt: "2026-01-01T00:00:00.000Z",
    };
    expect(taskToFormValues(t)).toEqual({
      title: "Existing",
      description: "desc",
      status: "done",
      priority: "low",
      dueDate: "2026-05-05",
    });
  });
});

it("EMPTY_TASK_FORM_VALUES has sane defaults", () => {
  expect(EMPTY_TASK_FORM_VALUES).toEqual({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
  });
});
