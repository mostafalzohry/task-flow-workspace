"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type {
  PriorityFilter,
  StatusFilter,
  TaskFilters,
  TaskListQuery,
} from "../types";
import {
  filtersCleared,
  filtersReplaced,
  fromDateChanged,
  priorityChanged,
  searchChanged,
  selectTaskFilters,
  statusChanged,
  toDateChanged,
} from "../store/task-filters-slice";
import { buildTaskFilterQuery, parseTaskFilters } from "../utils/task-filters";

const SEARCH_DEBOUNCE_MS = 300;

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

  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectTaskFilters);

  const [hydratedFromUrl, setHydratedFromUrl] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search);
  const [syncedSearch, setSyncedSearch] = useState(filters.search);
  const appliedSearch = useDebouncedValue(searchInput.trim(), SEARCH_DEBOUNCE_MS);

  if (filters.search !== syncedSearch) {
    setSyncedSearch(filters.search);
    if (filters.search !== searchInput.trim()) {
      setSearchInput(filters.search);
    }
  }

  useEffect(() => {
    dispatch(filtersReplaced(parseTaskFilters(searchParamsString)));
  }, [searchParamsString, dispatch]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setHydratedFromUrl(true), 0);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!hydratedFromUrl) {
      return;
    }
    const current = window.location.search.replace(/^\?/, "");
    const next = buildTaskFilterQuery(current, filters);
    if (next === current) {
      return;
    }
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  }, [hydratedFromUrl, filters, pathname, router]);

  useEffect(() => {
    if (appliedSearch !== searchInput.trim()) {
      return;
    }
    if (appliedSearch === filters.search) {
      return;
    }
    dispatch(searchChanged(appliedSearch));
  }, [appliedSearch, searchInput, filters.search, dispatch]);

  const clearFilters = () => {
    setSearchInput("");
    dispatch(filtersCleared());
  };

  const dateRangeError =
    filters.from !== "" && filters.to !== "" && filters.from > filters.to
      ? "The From date must be on or before the To date."
      : null;

  const hasActiveFilters =
    searchInput.trim() !== "" ||
    filters.status !== "all" ||
    filters.priority !== "all" ||
    filters.from !== "" ||
    filters.to !== "";

  const serverQuery = useMemo<TaskListQuery>(
    () => ({
      search: filters.search,
      status: filters.status,
      priority: filters.priority,
    }),
    [filters.search, filters.status, filters.priority],
  );

  const appliedFilters = useMemo<TaskFilters>(
    () => ({
      search: filters.search,
      status: filters.status,
      priority: filters.priority,
      from: filters.from,
      to: filters.to,
    }),
    [filters.search, filters.status, filters.priority, filters.from, filters.to],
  );

  return {
    searchInput,
    setSearchInput,
    status: filters.status,
    setStatus: (value) => dispatch(statusChanged(value)),
    priority: filters.priority,
    setPriority: (value) => dispatch(priorityChanged(value)),
    from: filters.from,
    setFrom: (value) => dispatch(fromDateChanged(value)),
    to: filters.to,
    setTo: (value) => dispatch(toDateChanged(value)),
    clearFilters,
    hasActiveFilters,
    dateRangeError,
    serverQuery,
    appliedFilters,
  };
}
