"use client";

import { Eye, MoreVertical, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PRIORITY_META,
  PRIORITY_ORDER,
  STATUS_META,
  STATUS_ORDER,
} from "@/config";
import { usePatchTask } from "@/queries/use-task-mutations";
import type { SortOrder, Task, TaskSortField } from "@/types";
import DueDate from "./due-date";
import TaskTableSortHeader from "./task-table-sort-header";

interface TaskTableProps {
  tasks: readonly Task[];
  sortBy: TaskSortField;
  sortOrder: SortOrder;
  onSort: (field: TaskSortField) => void;
  onViewTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

const TaskTable = ({
  tasks,
  sortBy,
  sortOrder,
  onSort,
  onViewTask,
  onEditTask,
  onDeleteTask,
}: TaskTableProps) => {
  const patchTask = usePatchTask();

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <TaskTableSortHeader
              field="title"
              label="Task"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <th scope="col" className="px-3 py-2.5 text-left font-medium text-muted-foreground">
              Status
            </th>
            <th scope="col" className="px-3 py-2.5 text-left font-medium text-muted-foreground">
              Priority
            </th>
            <TaskTableSortHeader
              field="dueDate"
              label="Due date"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort}
            />
            <th scope="col" className="w-12 px-3 py-2.5">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr
              key={task.id}
              className="border-b border-border transition-colors last:border-0 hover:bg-muted/30"
            >
              <td className="max-w-[22rem] px-3 py-2 align-top">
                <Button
                  variant="link"
                  onClick={() => onViewTask(task)}
                  className="block h-auto max-w-full truncate p-0 text-left text-sm font-medium text-foreground hover:text-foreground"
                >
                  {task.title}
                </Button>
                {task.description && (
                  <p className="truncate text-xs text-muted-foreground">
                    {task.description}
                  </p>
                )}
              </td>
              <td className="px-3 py-2 align-top">
                <Select
                  value={task.status}
                  onValueChange={(value) => {
                    const status = STATUS_ORDER.find((item) => item === value);
                    if (status) {
                      patchTask.mutate({ id: task.id, patch: { status } });
                    }
                  }}
                >
                  <SelectTrigger
                    size="sm"
                    aria-label={`Status for “${task.title}”`}
                    className="w-36"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_ORDER.map((status) => (
                      <SelectItem key={status} value={status}>
                        {STATUS_META[status].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>
              <td className="px-3 py-2 align-top">
                <Select
                  value={task.priority}
                  onValueChange={(value) => {
                    const priority = PRIORITY_ORDER.find((item) => item === value);
                    if (priority) {
                      patchTask.mutate({ id: task.id, patch: { priority } });
                    }
                  }}
                >
                  <SelectTrigger
                    size="sm"
                    aria-label={`Priority for “${task.title}”`}
                    className="w-32"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITY_ORDER.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {PRIORITY_META[priority].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>
              <td className="px-3 py-2 align-top whitespace-nowrap">
                <DueDate
                  date={task.dueDate}
                  done={task.status === "done"}
                  withIcon={false}
                  className="text-sm"
                />
              </td>
              <td className="px-3 py-2 align-top">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
