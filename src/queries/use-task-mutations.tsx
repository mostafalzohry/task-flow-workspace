"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeftRight } from "lucide-react";
import { toast } from "sonner";

import { createTask, deleteTask, updateTask } from "@/api/task-service";
import { STATUS_META } from "@/config";
import type { CreateTaskInput, Task, TaskStatus, UpdateTaskInput } from "@/types";
import { taskKeys } from "./task-keys";

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTaskInput) => createTask(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { id: string; input: UpdateTaskInput }) =>
      updateTask(variables.id, variables.input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}

export function useMoveTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { id: string; status: TaskStatus }) =>
      updateTask(variables.id, { status: variables.status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      const snapshots = queryClient.getQueriesData<Task[]>({
        queryKey: taskKeys.lists(),
      });
      for (const [key, data] of snapshots) {
        if (!data) {
          continue;
        }
        queryClient.setQueryData<Task[]>(
          key,
          data.map((task) => (task.id === id ? { ...task, status } : task)),
        );
      }
      return { snapshots };
    },
    onError: (_error, _variables, context) => {
      for (const [key, data] of context?.snapshots ?? []) {
        queryClient.setQueryData(key, data);
      }
      toast.error("We couldn't move the task. Please try again.");
    },
    onSuccess: (task) => {
      toast.info(`“${task.title}” moved to ${STATUS_META[task.status].label}`, {
        icon: <ArrowLeftRight className="size-4" />,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}
