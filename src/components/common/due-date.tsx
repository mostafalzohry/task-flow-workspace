import { CalendarClock, CalendarDays, CalendarX } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { getDueDateStatus, type DueDateStatus } from "@/utils/due-date";
import { formatDate } from "@/utils/format";

interface DueDateProps {
  date: string;
  done?: boolean;
  prefix?: string;
  withIcon?: boolean;
  className?: string;
}

const STATUS_META: Record<
  DueDateStatus,
  { text: string; label: string | null; icon: LucideIcon }
> = {
  overdue: {
    text: "text-destructive",
    label: "Overdue",
    icon: CalendarX,
  },
  soon: {
    text: "text-amber-600 dark:text-amber-500",
    label: "Due soon",
    icon: CalendarClock,
  },
  upcoming: {
    text: "text-muted-foreground",
    label: null,
    icon: CalendarDays,
  },
};

const DueDate = ({
  date,
  done = false,
  prefix,
  withIcon = true,
  className,
}: DueDateProps) => {
  const status = done ? "upcoming" : getDueDateStatus(date);
  const meta = STATUS_META[status];
  const Icon = meta.icon;

  return (
    <span
      className={cn("inline-flex items-center gap-1.5", meta.text, className)}
    >
      {withIcon ? (
        <Icon aria-hidden="true" className="size-3.5 shrink-0" />
      ) : null}
      <span>
        {meta.label ? (
          <span className="font-medium">{meta.label} &middot; </span>
        ) : prefix ? (
          `${prefix} `
        ) : null}
        {formatDate(date)}
      </span>
    </span>
  );
};

export default DueDate;
