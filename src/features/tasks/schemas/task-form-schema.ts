import * as yup from "yup";

import { PRIORITY_ORDER, STATUS_ORDER } from "../config";
import type { TaskPriority, TaskStatus } from "../types";

export const TITLE_MAX_LENGTH = 120;
export const DESCRIPTION_MAX_LENGTH = 2000;

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
}

export const taskFormSchema: yup.ObjectSchema<TaskFormValues> = yup.object({
  title: yup
    .string()
    .trim()
    .required("Title is required.")
    .max(
      TITLE_MAX_LENGTH,
      `Title must be ${TITLE_MAX_LENGTH} characters or fewer.`,
    ),
  description: yup
    .string()
    .trim()
    .required("Description is required.")
    .max(
      DESCRIPTION_MAX_LENGTH,
      `Description must be ${DESCRIPTION_MAX_LENGTH} characters or fewer.`,
    ),
  status: yup
    .string<TaskStatus>()
    .oneOf([...STATUS_ORDER], "Choose a status.")
    .required("Status is required."),
  priority: yup
    .string<TaskPriority>()
    .oneOf([...PRIORITY_ORDER], "Choose a priority.")
    .required("Priority is required."),
  dueDate: yup
    .string()
    .required("Due date is required.")
    .matches(ISO_DATE_PATTERN, "Enter a valid date.")
    .test(
      "real-date",
      "Enter a valid date.",
      (value) => value != null && !Number.isNaN(new Date(value).getTime()),
    ),
});
