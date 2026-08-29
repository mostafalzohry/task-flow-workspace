"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type {
  PriorityFilter,
  SortOrder,
  StatusFilter,
  TaskFilters,
  TaskFiltersState,
  TaskListQuery,
  TaskSortField,
  TaskView,
} from "@/types";
import {
  filtersCleared,
  filtersReplaced,
  fromDateChanged,
  pageChanged,
  priorityChanged,
  searchChanged,
  selectTaskFilters,
  sortChanged,
  statusChanged,
  toDateChanged,
  viewChanged,
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
  view: TaskView;
  setView: (value: TaskView) => void;
  sortBy: TaskSortField;
  sortOrder: SortOrder;
  setSort: (field: TaskSortField) => void;
  page: number;
  setPage: (value: number) => void;
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
    (nextFilters: TaskFiltersState) => {
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

    dispatch(searchChanged(appliedSearch));
    updateUrl({ ...filters, search: appliedSearch, page: 1 });
  }, [appliedSearch, searchInput, filters, dispatch, updateUrl]);

  const setStatus = (value: StatusFilter) => {
    dispatch(statusChanged(value));
    updateUrl({ ...filters, status: value, page: 1 });
  };

  const setPriority = (value: PriorityFilter) => {
    dispatch(priorityChanged(value));
    updateUrl({ ...filters, priority: value, page: 1 });
  };

  const setFrom = (value: string) => {
    dispatch(fromDateChanged(value));
    updateUrl({ ...filters, from: value, page: 1 });
  };

  const setTo = (value: string) => {
    dispatch(toDateChanged(value));
    updateUrl({ ...filters, to: value, page: 1 });
  };

  const setView = (value: TaskView) => {
    dispatch(viewChanged(value));
    updateUrl({ ...filters, view: value, page: 1 });
  };

  const setSort = (field: TaskSortField) => {
    const sortOrder: SortOrder =
      filters.sortBy === field && filters.sortOrder === "asc" ? "desc" : "asc";
    dispatch(sortChanged({ sortBy: field, sortOrder }));
    updateUrl({ ...filters, sortBy: field, sortOrder, page: 1 });
  };

  const setPage = (value: number) => {
    dispatch(pageChanged(value));
    updateUrl({ ...filters, page: value });
  };

  const clearFilters = () => {
    setSearchInput("");
    dispatch(filtersCleared());
    updateUrl({
      ...CLEARED_FILTERS,
      view: filters.view,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      page: 1,
    });
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
    view: filters.view,
    setView,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    setSort,
    page: filters.page,
    setPage,
    clearFilters,
    hasActiveFilters,
    dateRangeError,
    serverQuery,
    appliedFilters,
  };
}
