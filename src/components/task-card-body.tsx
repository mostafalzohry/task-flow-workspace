"use client";

import { CalendarDays, Eye, MoreVertical, Pencil, Trash2 } from "lucide-react";

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
import { formatDate } from "@/utils/format";
import type { Task } from "@/types";

interface TaskCardBodyProps {
  task: Task;
  onViewTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  isOverlay?: boolean;
}

const TaskCardBody = ({
  task,
  onViewTask,
  onEditTask,
  onDeleteTask,
  isOverlay = false,
}: TaskCardBodyProps) => {
  const priority = PRIORITY_META[task.priority];

  return (
    <Card
      size="sm"
      className={isOverlay ? "ring-border cursor-grabbing shadow-xl" : "ring-border"}
    >
      <CardHeader className="gap-1">
        <CardTitle>
          <Button
            variant="link"
            onClick={() => onViewTask(task)}
            className="line-clamp-2 h-auto w-full justify-start whitespace-normal wrap-anywhere p-0 text-left text-sm font-semibold text-foreground hover:text-foreground"
          >
            {task.title}
          </Button>
        </CardTitle>
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
                onPointerDown={(event) => event.stopPropagation()}
              >
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => onViewTask(task)}>
                <Eye />
                Details
              </DropdownMenuItem>
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
          <span>Due {formatDate(task.dueDate)}</span>
        </span>
      </CardContent>
    </Card>
  );
};

export default TaskCardBody;
