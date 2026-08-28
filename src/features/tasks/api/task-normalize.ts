import { PRIORITY_ORDER, STATUS_ORDER } from "../config";
import type { Task, TaskPriority, TaskStatus } from "../types";

class InvalidRecordError extends Error {}

function required<T>(value: T | null): T {
  if (value === null) {
    throw new InvalidRecordError();
  }
  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeId(value: unknown): string | null {
  if (typeof value === "string" && value.trim() !== "") {
    return value;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  return null;
}

function normalizeText(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function normalizeStatus(value: unknown): TaskStatus | null {
  return STATUS_ORDER.find((status) => status === value) ?? null;
}

function normalizePriority(value: unknown): TaskPriority | null {
  return PRIORITY_ORDER.find((priority) => priority === value) ?? null;
}

function toDate(value: unknown): Date | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    const seconds = new Date(value * 1000);
    if (!Number.isNaN(seconds.getTime())) {
      return seconds;
    }
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return null;
}

function normalizeDueDate(value: unknown): string | null {
  const date = toDate(value);
  return date ? date.toISOString().slice(0, 10) : null;
}

function normalizeCreatedAt(value: unknown): string | null {
  const date = toDate(value);
  return date ? date.toISOString() : null;
}

export function normalizeTask(value: unknown): Task | null {
  if (!isRecord(value)) {
    return null;
  }

  try {
    return {
      id: required(normalizeId(value.id)),
      title: required(normalizeText(value.title)),
      description: required(normalizeText(value.description)),
      status: required(normalizeStatus(value.status)),
      priority: required(normalizePriority(value.priority)),
      dueDate: required(normalizeDueDate(value.dueDate)),
      createdAt: required(normalizeCreatedAt(value.createdAt)),
    };
  } catch (error) {
    if (error instanceof InvalidRecordError) {
      return null;
    }
    throw error;
  }
}

export function normalizeTasks(value: unknown): Task[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const tasks: Task[] = [];
  for (const item of value) {
    const task = normalizeTask(item);
    if (task) {
      tasks.push(task);
    }
  }
  return tasks;
}
