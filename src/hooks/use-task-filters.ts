"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type {
  PriorityFilter,
  StatusFilter,
  TaskFilters,
  TaskListQuery,
} from "@/types";
import {
  filtersCleared,
  filtersReplaced,
  fromDateChanged,
  priorityChanged,
  searchChanged,
  selectTaskFilters,
  statusChanged,
  toDateChanged,
} from "@/store/task-filters-slice";
import { buildTaskFilterQuery, parseTaskFilters } from "@/utils/task-filters";

const SEARCH_DEBOUNCE_MS = 300;
const CLEARED_FILTERS: TaskFilters = {
  search: "",
  status: "all",
  priority: "all",
  from: "",
  to: "",
};

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

  const updateUrl = useCallback(
    (nextFilters: TaskFilters) => {
      const next = buildTaskFilterQuery(searchParamsString, nextFilters);
      if (next === searchParamsString) {
        return;
      }

      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    },
    [pathname, router, searchParamsString],
  );

  useEffect(() => {
    if (appliedSearch !== searchInput.trim()) {
      return;
    }
    if (appliedSearch === filters.search) {
      return;
    }

    const nextFilters = { ...filters, search: appliedSearch };
    dispatch(searchChanged(appliedSearch));
    updateUrl(nextFilters);
  }, [appliedSearch, searchInput, filters, dispatch, updateUrl]);

  const setStatus = (value: StatusFilter) => {
    const nextFilters = { ...filters, status: value };
    dispatch(statusChanged(value));
    updateUrl(nextFilters);
  };

  const setPriority = (value: PriorityFilter) => {
    const nextFilters = { ...filters, priority: value };
    dispatch(priorityChanged(value));
    updateUrl(nextFilters);
  };

  const setFrom = (value: string) => {
    const nextFilters = { ...filters, from: value };
    dispatch(fromDateChanged(value));
    updateUrl(nextFilters);
  };

  const setTo = (value: string) => {
    const nextFilters = { ...filters, to: value };
    dispatch(toDateChanged(value));
    updateUrl(nextFilters);
  };

  const clearFilters = () => {
    setSearchInput("");
    dispatch(filtersCleared());
    updateUrl(CLEARED_FILTERS);
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
    setStatus,
    priority: filters.priority,
    setPriority,
    from: filters.from,
    setFrom,
    to: filters.to,
    setTo,
    clearFilters,
    hasActiveFilters,
    dateRangeError,
    serverQuery,
    appliedFilters,
  };
}
