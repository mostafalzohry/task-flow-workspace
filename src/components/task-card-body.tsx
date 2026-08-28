"use client";

import type { ReactNode } from "react";
import {
  CalendarDays,
  GripVertical,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PRIORITY_META } from "@/config";
import { formatDueDate } from "@/utils/format";
import type { Task } from "@/types";

interface TaskCardBodyProps {
  task: Task;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  dragHandle?: ReactNode;
  isOverlay?: boolean;
}

const TaskCardBody = ({
  task,
  onEditTask,
  onDeleteTask,
  dragHandle,
  isOverlay = false,
}: TaskCardBodyProps) => {
  const priority = PRIORITY_META[task.priority];

  return (
    <Card
      size="sm"
      className={isOverlay ? "ring-border cursor-grabbing shadow-xl" : "ring-border"}
    >
      <CardHeader className="gap-1">
        <div className="flex items-start gap-1.5">
          {dragHandle ?? (
            <span
              aria-hidden="true"
              className="mt-0.5 -ml-0.5 shrink-0 p-0.5 text-muted-foreground"
            >
              <GripVertical className="size-4" />
            </span>
          )}
          <CardTitle className="min-w-0 line-clamp-2 wrap-anywhere">
            {task.title}
          </CardTitle>
        </div>
        <CardDescription className="line-clamp-2 text-xs wrap-anywhere">
          {task.description}
        </CardDescription>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon-sm"
                variant="ghost"
                aria-label={`Actions for “${task.title}”`}
              >
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => onEditTask(task)}>
                <Pencil />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => onDeleteTask(task)}
              >
                <Trash2 />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center justify-between gap-2">
        <Badge className={priority.badgeClassName}>{priority.label}</Badge>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays aria-hidden="true" className="size-3.5" />
          <span>Due {formatDueDate(task.dueDate)}</span>
        </span>
      </CardContent>
    </Card>
  );
};

export default TaskCardBody;
