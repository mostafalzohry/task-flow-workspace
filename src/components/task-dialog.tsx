"use client";

import { Pencil, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  EMPTY_TASK_FORM_VALUES,
  formValuesToCreateInput,
  formValuesToUpdateInput,
  taskToFormValues,
} from "@/utils/task-payload";
import { useCreateTask, useUpdateTask } from "@/queries/use-task-mutations";
import type { TaskFormValues } from "@/schemas/task-form-schema";
import type { Task, TaskStatus } from "@/types";
import { getTodayIso } from "@/utils/due-date";
import TaskForm from "./task-form";

interface TaskDialogProps {
  open: boolean;
  task: Task | null;
  createStatus?: TaskStatus;
  onOpenChange: (open: boolean) => void;
}

const TaskDialog = ({
  open,
  task,
  createStatus = "todo",
  onOpenChange,
}: TaskDialogProps) => {
  const formId = "task-form";
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const isEditing = task !== null;
  const mutation = isEditing ? updateTask : createTask;

  const today = getTodayIso();
  const minDueDate =
    task && task.dueDate < today ? task.dueDate : today;

  const savingLabel = isEditing ? "Saving..." : "Creating...";
  const readyLabel = isEditing ? "Save changes" : "Create task";

  const handleCreate = (values: TaskFormValues) => {
    if (createTask.isPending) {
      return;
    }
    createTask.mutate(formValuesToCreateInput(values), {
      onSuccess: () => {
        toast.success(`“${values.title.trim()}” created`, {
          icon: <Plus className="size-4" />,
        });
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const handleUpdate = (values: TaskFormValues) => {
    if (!task || updateTask.isPending) {
      return;
    }
    updateTask.mutate(
      { id: task.id, input: formValuesToUpdateInput(values) },
      {
        onSuccess: () => {
          toast.info(`“${values.title.trim()}” updated`, {
            icon: <Pencil className="size-4" />,
          });
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next || !mutation.isPending) {
          onOpenChange(next);
        }
      }}
    >
      <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit task" : "Create task"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details for this task and save your changes."
              : "Add a new task to your workspace. Only the description is optional."}
          </DialogDescription>
        </DialogHeader>

        <TaskForm
          key={open ? (task?.id ?? `create-${createStatus}`) : "closed"}
          formId={formId}
          defaultValues={
            task
              ? taskToFormValues(task)
              : { ...EMPTY_TASK_FORM_VALUES, status: createStatus }
          }
          isSubmitting={mutation.isPending}
          minDueDate={minDueDate}
          onSubmit={isEditing ? handleUpdate : handleCreate}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost" disabled={mutation.isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form={formId} disabled={mutation.isPending}>
            {mutation.isPending ? savingLabel : readyLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
