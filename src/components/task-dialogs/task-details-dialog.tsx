"use client";

import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PRIORITY_META, STATUS_META } from "@/config";
import { useTaskQuery } from "@/queries/use-task";
import { formatDate } from "@/utils/format";
import DueDate from "../common/due-date";
import ErrorState from "../common/error-state";
import TaskDetailsSkeleton from "./task-details-skeleton";

interface TaskDetailsDialogProps {
  taskId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const Field = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="space-y-1">
    <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
    <dd className="text-sm">{children}</dd>
  </div>
);

const TaskDetailsDialog = ({
  taskId,
  open,
  onOpenChange,
}: TaskDetailsDialogProps) => {
  const query = useTaskQuery(open ? taskId : null);
  const task = query.data ?? null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="wrap-anywhere">
            {task ? task.title : "Task details"}
          </DialogTitle>
          <DialogDescription>
            {task ? `Task #${task.id}` : "Loading task details…"}
          </DialogDescription>
        </DialogHeader>

        {query.isPending ? (
          <TaskDetailsSkeleton />
        ) : query.isError ? (
          <ErrorState
            className="py-4"
            message={
              query.error instanceof Error
                ? query.error.message
                : "We couldn't load this task. Please try again."
            }
            onRetry={() => void query.refetch()}
            isRetrying={query.isFetching}
          />
        ) : task ? (
          <div className="space-y-5">
            <Field label="Description">
              {task.description ? (
                <p className="whitespace-pre-wrap wrap-anywhere text-foreground">
                  {task.description}
                </p>
              ) : (
                <p className="text-muted-foreground italic">No description</p>
              )}
            </Field>

            <dl className="grid grid-cols-2 gap-4">
              <Field label="Status">
                <span className="inline-flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={`size-2.5 shrink-0 rounded-full ${STATUS_META[task.status].indicatorClassName}`}
                  />
                  {STATUS_META[task.status].label}
                </span>
              </Field>
              <Field label="Priority">
                <Badge className={PRIORITY_META[task.priority].badgeClassName}>
                  {PRIORITY_META[task.priority].label}
                </Badge>
              </Field>
              <Field label="Due date">
                <DueDate
                  date={task.dueDate}
                  done={task.status === "done"}
                  withIcon={false}
                />
              </Field>
              <Field label="Created">{formatDate(task.createdAt)}</Field>
            </dl>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsDialog;
