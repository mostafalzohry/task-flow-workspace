import type { TaskPriority, TaskStatus } from "./types";

interface StatusMeta {
  label: string;
  indicatorClassName: string;
}

interface PriorityMeta {
  label: string;
  badgeClassName: string;
}

export const STATUS_ORDER: readonly TaskStatus[] = [
  "todo",
  "in-progress",
  "in-review",
  "done",
] as const;

export const STATUS_META: Record<TaskStatus, StatusMeta> = {
  todo: {
    label: "To Do",
    indicatorClassName: "bg-slate-400 dark:bg-slate-500",
  },
  "in-progress": {
    label: "In Progress",
    indicatorClassName: "bg-blue-500",
  },
  "in-review": {
    label: "In Review",
    indicatorClassName: "bg-amber-500",
  },
  done: {
    label: "Done",
    indicatorClassName: "bg-emerald-500",
  },
};

export const PRIORITY_ORDER: readonly TaskPriority[] = [
  "low",
  "medium",
  "high",
  "urgent",
] as const;

export const PRIORITY_META: Record<TaskPriority, PriorityMeta> = {
  low: {
    label: "Low",
    badgeClassName:
      "border-transparent bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  medium: {
    label: "Medium",
    badgeClassName:
      "border-transparent bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
  },
  high: {
    label: "High",
    badgeClassName:
      "border-transparent bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300",
  },
  urgent: {
    label: "Urgent",
    badgeClassName:
      "border-transparent bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  },
};
