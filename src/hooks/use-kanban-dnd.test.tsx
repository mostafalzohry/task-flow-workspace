import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { act, renderHook } from "@testing-library/react";

import { makeTask } from "@test/render";
import { useKanbanDnd } from "./use-kanban-dnd";

const mutate = jest.fn();
jest.mock("@/queries/use-task-mutations", () => ({
  usePatchTask: () => ({ mutate, isPending: false }),
}));

const tasks = [
  makeTask({ id: "1", title: "First", status: "todo" }),
  makeTask({ id: "2", title: "Second", status: "in-progress" }),
];

const startEvent = (id: string) =>
  ({ active: { id } }) as unknown as DragStartEvent;

const endEvent = (
  activeStatus: string,
  over: Record<string, unknown> | null,
): DragEndEvent =>
  ({
    active: { id: "1", data: { current: { type: "card", status: activeStatus } } },
    over: over === null ? null : { id: "col", data: { current: over } },
  }) as unknown as DragEndEvent;

beforeEach(() => mutate.mockClear());

describe("useKanbanDnd", () => {
  it("tracks the active task between drag start, end and cancel", () => {
    const { result } = renderHook(() => useKanbanDnd(tasks));
    expect(result.current.activeTask).toBeNull();

    act(() => result.current.onDragStart(startEvent("2")));
    expect(result.current.activeTask?.title).toBe("Second");

    act(() => result.current.onDragCancel());
    expect(result.current.activeTask).toBeNull();
  });

  it("commits a cross-column drop as an optimistic status patch", () => {
    const { result } = renderHook(() => useKanbanDnd(tasks));

    act(() =>
      result.current.onDragEnd(endEvent("todo", { type: "column", status: "done" })),
    );

    expect(mutate).toHaveBeenCalledWith({ id: "1", patch: { status: "done" } });
    expect(result.current.activeTask).toBeNull();
  });

  it("ignores a same-column drop", () => {
    const { result } = renderHook(() => useKanbanDnd(tasks));

    act(() =>
      result.current.onDragEnd(endEvent("todo", { type: "column", status: "todo" })),
    );
    act(() => result.current.onDragEnd(endEvent("todo", null)));

    expect(mutate).not.toHaveBeenCalled();
  });

  it("builds screen-reader announcements from task titles and column labels", () => {
    const { result } = renderHook(() => useKanbanDnd(tasks));
    const a = result.current.accessibility.announcements;

    expect(a.onDragStart?.({ active: { id: "1" } } as never)).toBe(
      "Picked up First. Use the arrow keys to choose a column.",
    );
    expect(
      a.onDragEnd?.({
        active: { id: "1" },
        over: { id: "c", data: { current: { type: "column", status: "done" } } },
      } as never),
    ).toBe("First was moved to the Done column.");
  });

  it("provides all three sensors", () => {
    const { result } = renderHook(() => useKanbanDnd(tasks));
    expect(result.current.sensors).toHaveLength(3);
  });
});
