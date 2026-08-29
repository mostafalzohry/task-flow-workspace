import { getDueDateStatus, getTodayIso } from "./due-date";

function shift(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

describe("getTodayIso", () => {
  it("returns today as YYYY-MM-DD", () => {
    expect(getTodayIso()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(getTodayIso()).toBe(shift(0));
  });
});

describe("getDueDateStatus", () => {
  it("flags a past date as overdue", () => {
    expect(getDueDateStatus(shift(-1))).toBe("overdue");
    expect(getDueDateStatus(shift(-30))).toBe("overdue");
  });

  it("treats today and the next two days as soon", () => {
    expect(getDueDateStatus(shift(0))).toBe("soon");
    expect(getDueDateStatus(shift(1))).toBe("soon");
    expect(getDueDateStatus(shift(2))).toBe("soon");
  });

  it("treats anything further out as upcoming", () => {
    expect(getDueDateStatus(shift(3))).toBe("upcoming");
    expect(getDueDateStatus(shift(90))).toBe("upcoming");
  });
});
