"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type {
  PriorityFilter,
  StatusFilter,
  TaskFilters,
  TaskListQuery,
} from "../types";
import { asPriorityFilter, asStatusFilter } from "../utils/task-filters";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

const SEARCH_DEBOUNCE_MS = 300;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function parseDate(value: string | null): string {
  if (!value || !ISO_DATE_PATTERN.test(value)) {
    return "";
  }
  return Number.isNaN(new Date(value).getTime()) ? "" : value;
}

function readFilters(params: URLSearchParams): TaskFilters {
  return {
    search: (params.get("q") ?? "").trim(),
    status: asStatusFilter(params.get("status")),
    priority: asPriorityFilter(params.get("priority")),
    from: parseDate(params.get("from")),
    to: parseDate(params.get("to")),
  };
}

function setParam(
  params: URLSearchParams,
  key: string,
  value: string,
  defaultValue: string,
): void {
  if (value === "" || value === defaultValue) {
    params.delete(key);
  } else {
    params.set(key, value);
  }
}

export interface UseTaskFiltersResult {
  searchInput: string;
  setSearchInput: (value: string) => void;
  status: StatusFilter;
  setStatus: (value: StatusFilter) => void;
  priority: PriorityFilter;
  setPriority: (value: PriorityFilter) => void;
  from: string;
  setFrom: (value: string) => void;
  to: string;
  setTo: (value: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  dateRangeError: string | null;
  serverQuery: TaskListQuery;
  appliedFilters: TaskFilters;
}

export function useTaskFilters(): UseTaskFiltersResult {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();

  const urlFilters = useMemo(
    () => readFilters(new URLSearchParams(searchParamsString)),
    [searchParamsString],
  );

  const [searchInput, setSearchInput] = useState(urlFilters.search);
  const [syncedUrlSearch, setSyncedUrlSearch] = useState(urlFilters.search);
  const appliedSearch = useDebouncedValue(searchInput.trim(), SEARCH_DEBOUNCE_MS);

  if (urlFilters.search !== syncedUrlSearch) {
    setSyncedUrlSearch(urlFilters.search);
    if (urlFilters.search !== searchInput.trim()) {
      setSearchInput(urlFilters.search);
    }
  }

  const commit = useCallback(
    (patch: Partial<TaskFilters>) => {
      const params = new URLSearchParams(searchParamsString);
      const next = { ...readFilters(params), ...patch };
      setParam(params, "q", next.search, "");
      setParam(params, "status", next.status, "all");
      setParam(params, "priority", next.priority, "all");
      setParam(params, "from", next.from, "");
      setParam(params, "to", next.to, "");
      const nextString = params.toString();
      if (nextString === searchParamsString) {
        return;
      }
      router.replace(nextString ? `${pathname}?${nextString}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParamsString],
  );

  useEffect(() => {
    if (appliedSearch !== searchInput.trim()) {
      return;
    }
    if (appliedSearch === urlFilters.search) {
      return;
    }
    commit({ search: appliedSearch });
  }, [appliedSearch, searchInput, urlFilters.search, commit]);

  const clearFilters = useCallback(() => {
    setSearchInput("");
    commit({ search: "", status: "all", priority: "all", from: "", to: "" });
  }, [commit]);

  const dateRangeError =
    urlFilters.from !== "" &&
    urlFilters.to !== "" &&
    urlFilters.from > urlFilters.to
      ? "The From date must be on or before the To date."
      : null;

  const hasActiveFilters =
    searchInput.trim() !== "" ||
    urlFilters.status !== "all" ||
    urlFilters.priority !== "all" ||
    urlFilters.from !== "" ||
    urlFilters.to !== "";

  const serverQuery = useMemo<TaskListQuery>(
    () => ({
      search: urlFilters.search,
      status: urlFilters.status,
      priority: urlFilters.priority,
    }),
    [urlFilters.search, urlFilters.status, urlFilters.priority],
  );

  const appliedFilters = useMemo<TaskFilters>(
    () => ({
      search: urlFilters.search,
      status: urlFilters.status,
      priority: urlFilters.priority,
      from: urlFilters.from,
      to: urlFilters.to,
    }),
    [
      urlFilters.search,
      urlFilters.status,
      urlFilters.priority,
      urlFilters.from,
      urlFilters.to,
    ],
  );

  return {
    searchInput,
    setSearchInput,
    status: urlFilters.status,
    setStatus: (value) => commit({ status: value }),
    priority: urlFilters.priority,
    setPriority: (value) => commit({ priority: value }),
    from: urlFilters.from,
    setFrom: (value) => commit({ from: value }),
    to: urlFilters.to,
    setTo: (value) => commit({ to: value }),
    clearFilters,
    hasActiveFilters,
    dateRangeError,
    serverQuery,
    appliedFilters,
  };
}
