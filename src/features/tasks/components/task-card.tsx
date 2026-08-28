"use client";

import { CalendarDays, MoreVertical, Pencil, Trash2 } from "lucide-react";

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
import { PRIORITY_META } from "../config";
import { formatDueDate } from "../utils/format";
import type { Task } from "../types";

interface TaskCardProps {
  task: Task;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

const TaskCard = ({ task, onEditTask, onDeleteTask }: TaskCardProps) => {
  const priority = PRIORITY_META[task.priority];

  return (
    <Card size="sm" className="ring-border">
      <CardHeader className="gap-1">
        <CardTitle className="line-clamp-2 wrap-anywhere">{task.title}</CardTitle>
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

export default TaskCard;
