const dueDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDueDate(isoDate: string): string {
  return dueDateFormatter.format(new Date(isoDate));
}
