import type { Task } from "@/types";
import {
  asIsoDate,
  asPageNumber,
  asPriorityFilter,
  asSortOrder,
  asStatusFilter,
  asTaskSortField,
  asTaskView,
  buildTaskFilterQuery,
  filterTasks,
  parseTaskFilters,
} from "./task-filters";

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: "1",
  title: "Ship the release",
  description: "Cut the branch and tag it",
  status: "todo",
  priority: "medium",
  dueDate: "2026-03-10",
  createdAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

describe("coercion helpers", () => {
  it("asStatusFilter falls back to 'all' for unknown values", () => {
    expect(asStatusFilter("done")).toBe("done");
    expect(asStatusFilter("nonsense")).toBe("all");
    expect(asStatusFilter(null)).toBe("all");
  });

  it("asPriorityFilter falls back to 'all'", () => {
    expect(asPriorityFilter("urgent")).toBe("urgent");
    expect(asPriorityFilter(undefined)).toBe("all");
  });

  it("asIsoDate only accepts YYYY-MM-DD real dates", () => {
    expect(asIsoDate("2026-03-10")).toBe("2026-03-10");
    expect(asIsoDate("2026-3-1")).toBe("");
    expect(asIsoDate("not-a-date")).toBe("");
    expect(asIsoDate(null)).toBe("");
  });

  it("asTaskView / asTaskSortField / asSortOrder default sensibly", () => {
    expect(asTaskView("list")).toBe("list");
    expect(asTaskView("grid")).toBe("board");
    expect(asTaskSortField("title")).toBe("title");
    expect(asTaskSortField("bogus")).toBe("dueDate");
    expect(asSortOrder("desc")).toBe("desc");
    expect(asSortOrder("sideways")).toBe("asc");
  });

  it("asPageNumber only accepts integers greater than 1", () => {
    expect(asPageNumber("3")).toBe(3);
    expect(asPageNumber("1")).toBe(1);
    expect(asPageNumber("0")).toBe(1);
    expect(asPageNumber("-2")).toBe(1);
    expect(asPageNumber("abc")).toBe(1);
  });
});

describe("parseTaskFilters", () => {
  it("reads every recognised param", () => {
    expect(
      parseTaskFilters(
        "q=  hello  &status=done&priority=high&from=2026-01-01&to=2026-02-01&view=list&sort=title&order=desc&page=4",
      ),
    ).toEqual({
      search: "hello",
      status: "done",
      priority: "high",
      from: "2026-01-01",
      to: "2026-02-01",
      view: "list",
      sortBy: "title",
      sortOrder: "desc",
      page: 4,
    });
  });

  it("returns defaults for an empty query string", () => {
    expect(parseTaskFilters("")).toEqual({
      search: "",
      status: "all",
      priority: "all",
      from: "",
      to: "",
      view: "board",
      sortBy: "dueDate",
      sortOrder: "asc",
      page: 1,
    });
  });
});

describe("buildTaskFilterQuery", () => {
  const base = parseTaskFilters("");

  it("omits values that equal their default", () => {
    expect(buildTaskFilterQuery("", base)).toBe("");
  });

  it("serialises only the non-default values", () => {
    const query = buildTaskFilterQuery("", {
      ...base,
      search: "docs",
      status: "in-progress",
      view: "list",
      sortBy: "title",
      sortOrder: "desc",
      page: 2,
    });
    const params = new URLSearchParams(query);
    expect(params.get("q")).toBe("docs");
    expect(params.get("status")).toBe("in-progress");
    expect(params.get("view")).toBe("list");
    expect(params.get("sort")).toBe("title");
    expect(params.get("order")).toBe("desc");
    expect(params.get("page")).toBe("2");
    expect(params.get("priority")).toBeNull();
  });

  it("preserves unrelated params already in the URL", () => {
    const query = buildTaskFilterQuery("ref=email&status=old", {
      ...base,
      status: "done",
    });
    const params = new URLSearchParams(query);
    expect(params.get("ref")).toBe("email");
    expect(params.get("status")).toBe("done");
  });
});

describe("filterTasks", () => {
  const tasks: Task[] = [
    makeTask({ id: "1", title: "Alpha", status: "todo", priority: "low", dueDate: "2026-01-05" }),
    makeTask({ id: "2", title: "Beta report", description: "quarterly", status: "done", priority: "high", dueDate: "2026-02-20" }),
    makeTask({ id: "3", title: "Gamma", status: "in-progress", priority: "high", dueDate: "2026-03-30" }),
  ];
  const base = parseTaskFilters("");

  it("matches search against title and description, case-insensitively", () => {
    expect(filterTasks(tasks, { ...base, search: "beta" }).map((t) => t.id)).toEqual(["2"]);
    expect(filterTasks(tasks, { ...base, search: "QUARTERLY" }).map((t) => t.id)).toEqual(["2"]);
  });

  it("filters by status and priority", () => {
    expect(filterTasks(tasks, { ...base, status: "in-progress" }).map((t) => t.id)).toEqual(["3"]);
    expect(filterTasks(tasks, { ...base, priority: "high" }).map((t) => t.id)).toEqual(["2", "3"]);
  });

  it("applies an inclusive due-date range", () => {
    expect(
      filterTasks(tasks, { ...base, from: "2026-02-01", to: "2026-03-30" }).map((t) => t.id),
    ).toEqual(["2", "3"]);
  });

  it("ignores an inverted date range instead of filtering everything out", () => {
    expect(
      filterTasks(tasks, { ...base, from: "2026-12-01", to: "2026-01-01" }),
    ).toHaveLength(3);
  });
});
