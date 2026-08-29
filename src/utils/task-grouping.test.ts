import type { Task } from "@/types";
import { groupByStatus } from "./task-grouping";

const task = (id: string, status: Task["status"]): Task => ({
  id,
  title: `Task ${id}`,
  description: "",
  status,
  priority: "medium",
  dueDate: "2026-03-10",
  createdAt: "2026-01-01T00:00:00.000Z",
});

describe("groupByStatus", () => {
  it("buckets tasks into every column, preserving order", () => {
    const grouped = groupByStatus([
      task("1", "todo"),
      task("2", "done"),
      task("3", "todo"),
      task("4", "in-review"),
    ]);

    expect(grouped.todo.map((t) => t.id)).toEqual(["1", "3"]);
    expect(grouped["in-progress"]).toEqual([]);
    expect(grouped["in-review"].map((t) => t.id)).toEqual(["4"]);
    expect(grouped.done.map((t) => t.id)).toEqual(["2"]);
  });

  it("always returns all four keys for an empty input", () => {
    expect(Object.keys(groupByStatus([])).sort()).toEqual([
      "done",
      "in-progress",
      "in-review",
      "todo",
    ]);
  });
});
