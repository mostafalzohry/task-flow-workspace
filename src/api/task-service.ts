import axios from "axios";

import { httpClient } from "@/lib/http";
import type {
  CreateTaskInput,
  Task,
  TaskListParams,
  UpdateTaskInput,
} from "@/types";
import { normalizeTask, normalizeTasks } from "./task-normalize";

const TASKS_PATH = "/tasks";

function requestError(error: unknown, message: string): Error {
  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return new Error("The request timed out. Please try again.");
    }
    if (!error.response) {
      return new Error("We couldn't reach the server. Check your connection.");
    }
    return new Error(message);
  }
  return new Error(message);
}

function buildListParams(params: TaskListParams): Record<string, string> {
  const query: Record<string, string> = {};
  if (params.search) {
    query.search = params.search;
  }
  if (params.status !== "all") {
    query.status = params.status;
  }
  if (params.priority !== "all") {
    query.priority = params.priority;
  }
  if (params.sortBy) {
    query.sortBy = params.sortBy;
    query.order = params.sortOrder ?? "asc";
  }
  if (params.page && params.limit) {
    query.page = String(params.page);
    query.limit = String(params.limit);
  }
  return query;
}

export async function getTasks(params: TaskListParams): Promise<Task[]> {
  try {
    const response = await httpClient.get<unknown>(TASKS_PATH, {
      params: buildListParams(params),
    });
    return normalizeTasks(response.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return [];
    }
    throw requestError(error, "We couldn't load your tasks. Please try again.");
  }
}

export async function getTaskById(id: string): Promise<Task> {
  try {
    const response = await httpClient.get<unknown>(`${TASKS_PATH}/${id}`);
    const task = normalizeTask(response.data);
    if (!task) {
      throw new Error("We couldn't load this task. Please try again.");
    }
    return task;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error("This task no longer exists.");
    }
    throw requestError(error, "We couldn't load this task. Please try again.");
  }
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  try {
    const response = await httpClient.post<unknown>(TASKS_PATH, input);
    const task = normalizeTask(response.data);
    if (!task) {
      throw new Error("We couldn't create the task. Please try again.");
    }
    return task;
  } catch (error) {
    throw requestError(error, "We couldn't create the task. Please try again.");
  }
}

export async function updateTask(
  id: string,
  input: UpdateTaskInput,
): Promise<Task> {
  try {
    const response = await httpClient.put<unknown>(`${TASKS_PATH}/${id}`, input);
    const task = normalizeTask(response.data);
    if (!task) {
      throw new Error("We couldn't save your changes. Please try again.");
    }
    return task;
  } catch (error) {
    throw requestError(error, "We couldn't save your changes. Please try again.");
  }
}

export async function deleteTask(id: string): Promise<void> {
  try {
    await httpClient.delete(`${TASKS_PATH}/${id}`);
  } catch (error) {
    throw requestError(error, "We couldn't delete the task. Please try again.");
  }
}
