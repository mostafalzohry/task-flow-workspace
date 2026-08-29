export type DueDateStatus = "overdue" | "soon" | "upcoming";

const SOON_DAYS = 2;

export function getTodayIso(): string {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
}

function shiftIso(iso: string, days: number): string {
  const date = new Date(`${iso}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function getDueDateStatus(dueDate: string): DueDateStatus {
  const today = getTodayIso();
  if (dueDate < today) {
    return "overdue";
  }
  if (dueDate <= shiftIso(today, SOON_DAYS)) {
    return "soon";
  }
  return "upcoming";
}
