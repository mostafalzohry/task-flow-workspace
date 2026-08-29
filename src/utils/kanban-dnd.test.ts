import { readStatus, resolveColumnMove } from "./kanban-dnd";

const active = (id: string, status: string) =>
  ({ id, data: { current: { type: "card", status } } }) as never;
const over = (data: { type?: string; status?: string } | null) =>
  (data === null ? null : { id: "x", data: { current: data } }) as never;

describe("readStatus", () => {
  it("extracts a valid TaskStatus from dnd-kit drag data", () => {
    expect(readStatus({ type: "column", status: "in-review" })).toBe("in-review");
    expect(readStatus({ type: "card", status: "done" })).toBe("done");
  });

  it("returns null for missing or invalid data", () => {
    expect(readStatus(null)).toBeNull();
    expect(readStatus(undefined)).toBeNull();
    expect(readStatus({})).toBeNull();
    expect(readStatus({ status: "archived" })).toBeNull();
  });
});

describe("resolveColumnMove", () => {
  it("returns the target status when a card is dropped on a different column", () => {
    expect(
      resolveColumnMove(active("7", "todo"), over({ type: "column", status: "done" })),
    ).toEqual({ id: "7", status: "done" });
  });

  it("resolves a drop onto another card to that card's column", () => {
    expect(
      resolveColumnMove(active("7", "todo"), over({ type: "card", status: "in-progress" })),
    ).toEqual({ id: "7", status: "in-progress" });
  });

  it("is a no-op for same-column drops", () => {
    expect(
      resolveColumnMove(active("7", "todo"), over({ type: "column", status: "todo" })),
    ).toBeNull();
  });

  it("is a no-op when dropped outside any column", () => {
    expect(resolveColumnMove(active("7", "todo"), over(null))).toBeNull();
    expect(resolveColumnMove(active("7", "todo"), over({ type: "column" }))).toBeNull();
  });
});
