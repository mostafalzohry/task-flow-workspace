import type { TaskFiltersState } from "@/types";
import {
  filtersCleared,
  filtersReplaced,
  pageChanged,
  priorityChanged,
  searchChanged,
  sortChanged,
  statusChanged,
  taskFiltersReducer,
  viewChanged,
} from "./task-filters-slice";

const initial: TaskFiltersState = taskFiltersReducer(undefined, { type: "@@INIT" });

describe("taskFilters slice", () => {
  it("starts from sensible defaults", () => {
    expect(initial).toEqual({
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

  it("resets the page to 1 whenever a filter changes", () => {
    const onPage3: TaskFiltersState = { ...initial, page: 3 };
    expect(taskFiltersReducer(onPage3, statusChanged("done")).page).toBe(1);
    expect(taskFiltersReducer(onPage3, priorityChanged("high")).page).toBe(1);
    expect(taskFiltersReducer(onPage3, searchChanged("x")).page).toBe(1);
    expect(taskFiltersReducer(onPage3, sortChanged({ sortBy: "title", sortOrder: "desc" })).page).toBe(1);
    expect(taskFiltersReducer(onPage3, viewChanged("list")).page).toBe(1);
  });

  it("pageChanged sets the page without touching filters", () => {
    const next = taskFiltersReducer({ ...initial, status: "done" }, pageChanged(4));
    expect(next.page).toBe(4);
    expect(next.status).toBe("done");
  });

  it("filtersReplaced overwrites the whole state (URL -> store hydration)", () => {
    const hydrated: TaskFiltersState = {
      search: "docs",
      status: "in-progress",
      priority: "low",
      from: "2026-01-01",
      to: "2026-02-01",
      view: "list",
      sortBy: "title",
      sortOrder: "desc",
      page: 2,
    };
    expect(taskFiltersReducer(initial, filtersReplaced(hydrated))).toEqual(hydrated);
  });

  it("filtersCleared wipes filters but keeps the view and sort", () => {
    const dirty: TaskFiltersState = {
      ...initial,
      search: "x",
      status: "done",
      priority: "high",
      from: "2026-01-01",
      to: "2026-02-01",
      view: "list",
      sortBy: "title",
      sortOrder: "desc",
      page: 5,
    };
    expect(taskFiltersReducer(dirty, filtersCleared())).toEqual({
      search: "",
      status: "all",
      priority: "all",
      from: "",
      to: "",
      view: "list",
      sortBy: "title",
      sortOrder: "desc",
      page: 1,
    });
  });
});
