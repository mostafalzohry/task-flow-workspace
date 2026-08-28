"use client";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PRIORITY_META, PRIORITY_ORDER, STATUS_META, STATUS_ORDER } from "../config";
import {
  DESCRIPTION_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  taskFormSchema,
  type TaskFormValues,
} from "../schemas/task-form-schema";

interface TaskFormProps {
  formId: string;
  defaultValues: TaskFormValues;
  isSubmitting: boolean;
  onSubmit: (values: TaskFormValues) => void;
}

const TaskForm = ({
  formId,
  defaultValues,
  isSubmitting,
  onSubmit,
}: TaskFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: yupResolver(taskFormSchema),
    defaultValues,
    mode: "onTouched",
  });

  const fieldId = (name: string) => `${formId}-${name}`;
  const errorId = (name: string) => `${formId}-${name}-error`;

  return (
    <form
      id={formId}
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4"
    >
      <fieldset disabled={isSubmitting} className="contents">
        <div className="grid gap-1.5">
          <Label htmlFor={fieldId("title")}>Title</Label>
          <Input
            id={fieldId("title")}
            maxLength={TITLE_MAX_LENGTH}
            aria-invalid={errors.title ? true : undefined}
            aria-describedby={errors.title ? errorId("title") : undefined}
            {...register("title")}
          />
          {errors.title && (
            <p id={errorId("title")} role="alert" className="text-xs text-destructive">
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor={fieldId("description")}>Description</Label>
          <Textarea
            id={fieldId("description")}
            rows={3}
            maxLength={DESCRIPTION_MAX_LENGTH}
            aria-invalid={errors.description ? true : undefined}
            aria-describedby={
              errors.description ? errorId("description") : undefined
            }
            {...register("description")}
          />
          {errors.description && (
            <p
              id={errorId("description")}
              role="alert"
              className="text-xs text-destructive"
            >
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor={fieldId("priority")}>Priority</Label>
            <Controller
              control={control}
              name="priority"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id={fieldId("priority")}
                    className="w-full"
                    aria-invalid={errors.priority ? true : undefined}
                    aria-describedby={
                      errors.priority ? errorId("priority") : undefined
                    }
                  >
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITY_ORDER.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {PRIORITY_META[priority].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.priority && (
              <p
                id={errorId("priority")}
                role="alert"
                className="text-xs text-destructive"
              >
                {errors.priority.message}
              </p>
            )}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor={fieldId("status")}>Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id={fieldId("status")}
                    className="w-full"
                    aria-invalid={errors.status ? true : undefined}
                    aria-describedby={
                      errors.status ? errorId("status") : undefined
                    }
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_ORDER.map((status) => (
                      <SelectItem key={status} value={status}>
                        {STATUS_META[status].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p
                id={errorId("status")}
                role="alert"
                className="text-xs text-destructive"
              >
                {errors.status.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor={fieldId("dueDate")}>Due date</Label>
          <Input
            id={fieldId("dueDate")}
            type="date"
            className="w-full sm:w-52"
            aria-invalid={errors.dueDate ? true : undefined}
            aria-describedby={errors.dueDate ? errorId("dueDate") : undefined}
            {...register("dueDate")}
          />
          {errors.dueDate && (
            <p
              id={errorId("dueDate")}
              role="alert"
              className="text-xs text-destructive"
            >
              {errors.dueDate.message}
            </p>
          )}
        </div>
      </fieldset>
    </form>
  );
};

export default TaskForm;
