import axios from "axios";

import { httpClient } from "@/lib/http";
import type {
  CreateTaskInput,
  Task,
  TaskListQuery,
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

function buildListParams(query: TaskListQuery): Record<string, string> {
  const params: Record<string, string> = {};
  if (query.search) {
    params.search = query.search;
  }
  if (query.status !== "all") {
    params.status = query.status;
  }
  if (query.priority !== "all") {
    params.priority = query.priority;
  }
  return params;
}

export async function getTasks(query: TaskListQuery): Promise<Task[]> {
  try {
    const response = await httpClient.get<unknown>(TASKS_PATH, {
      params: buildListParams(query),
    });
    return normalizeTasks(response.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return [];
    }
    throw requestError(error, "We couldn't load your tasks. Please try again.");
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
