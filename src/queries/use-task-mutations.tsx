"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeftRight, Flag } from "lucide-react";
import { toast } from "sonner";

import { createTask, deleteTask, updateTask } from "@/api/task-service";
import { PRIORITY_META, STATUS_META } from "@/config";
import type { CreateTaskInput, Task, UpdateTaskInput } from "@/types";
import { taskKeys } from "./task-keys";

type TaskPatch = Pick<Partial<Task>, "status" | "priority">;

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

export function usePatchTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { id: string; patch: TaskPatch }) =>
      updateTask(variables.id, variables.patch),
    onMutate: async ({ id, patch }) => {
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
          data.map((task) => (task.id === id ? { ...task, ...patch } : task)),
        );
      }
      return { snapshots };
    },
    onError: (_error, _variables, context) => {
      for (const [key, data] of context?.snapshots ?? []) {
        queryClient.setQueryData(key, data);
      }
      toast.error("We couldn't update the task. Please try again.");
    },
    onSuccess: (task, { patch }) => {
      if (patch.status !== undefined) {
        toast.info(`“${task.title}” moved to ${STATUS_META[task.status].label}`, {
          icon: <ArrowLeftRight className="size-4" />,
        });
      } else if (patch.priority !== undefined) {
        toast.info(
          `“${task.title}” set to ${PRIORITY_META[task.priority].label} priority`,
          { icon: <Flag className="size-4" /> },
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}
