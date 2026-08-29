import { normalizeTask, normalizeTasks } from "./task-normalize";

const valid = {
  id: "42",
  title: "Do the thing",
  description: "carefully",
  status: "in-progress",
  priority: "high",
  dueDate: "2026-03-10T00:00:00.000Z",
  createdAt: "2026-01-02T09:00:00.000Z",
};

describe("normalizeTask", () => {
  it("normalises a well-formed record", () => {
    expect(normalizeTask(valid)).toEqual({
      id: "42",
      title: "Do the thing",
      description: "carefully",
      status: "in-progress",
      priority: "high",
      dueDate: "2026-03-10",
      createdAt: "2026-01-02T09:00:00.000Z",
    });
  });

  it("coerces a numeric id to a string", () => {
    expect(normalizeTask({ ...valid, id: 42 })?.id).toBe("42");
  });

  it("accepts an epoch-seconds createdAt (MockAPI's default)", () => {
    const task = normalizeTask({ ...valid, createdAt: 1_735_732_800 });
    expect(task?.createdAt).toBe("2025-01-01T12:00:00.000Z");
  });

  it("returns null when a required field is missing or invalid", () => {
    expect(normalizeTask({ ...valid, title: undefined })).toBeNull();
    expect(normalizeTask({ ...valid, status: "archived" })).toBeNull();
    expect(normalizeTask({ ...valid, dueDate: "nonsense" })).toBeNull();
    expect(normalizeTask(null)).toBeNull();
    expect(normalizeTask("string")).toBeNull();
  });
});

describe("normalizeTasks", () => {
  it("keeps valid records and silently drops broken ones", () => {
    const result = normalizeTasks([
      valid,
      { ...valid, id: "43", status: "bogus" },
      { ...valid, id: "44" },
    ]);
    expect(result.map((t) => t.id)).toEqual(["42", "44"]);
  });

  it("returns an empty array for non-array input", () => {
    expect(normalizeTasks({})).toEqual([]);
    expect(normalizeTasks(null)).toEqual([]);
  });
});
