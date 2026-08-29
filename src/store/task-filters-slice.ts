import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type {
  PriorityFilter,
  SortOrder,
  StatusFilter,
  TaskFiltersState,
  TaskSortField,
  TaskView,
} from "@/types";

const initialState: TaskFiltersState = {
  search: "",
  status: "all",
  priority: "all",
  from: "",
  to: "",
  view: "board",
  sortBy: "dueDate",
  sortOrder: "asc",
  page: 1,
};

const taskFiltersSlice = createSlice({
  name: "taskFilters",
  initialState,
  reducers: {
    searchChanged(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.page = 1;
    },
    statusChanged(state, action: PayloadAction<StatusFilter>) {
      state.status = action.payload;
      state.page = 1;
    },
    priorityChanged(state, action: PayloadAction<PriorityFilter>) {
      state.priority = action.payload;
      state.page = 1;
    },
    fromDateChanged(state, action: PayloadAction<string>) {
      state.from = action.payload;
      state.page = 1;
    },
    toDateChanged(state, action: PayloadAction<string>) {
      state.to = action.payload;
      state.page = 1;
    },
    viewChanged(state, action: PayloadAction<TaskView>) {
      state.view = action.payload;
      state.page = 1;
    },
    sortChanged(
      state,
      action: PayloadAction<{ sortBy: TaskSortField; sortOrder: SortOrder }>,
    ) {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
      state.page = 1;
    },
    pageChanged(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    filtersReplaced(state, action: PayloadAction<TaskFiltersState>) {
      return action.payload;
    },
    filtersCleared(state) {
      state.search = initialState.search;
      state.status = initialState.status;
      state.priority = initialState.priority;
      state.from = initialState.from;
      state.to = initialState.to;
      state.page = 1;
    },
  },
});

export const {
  searchChanged,
  statusChanged,
  priorityChanged,
  fromDateChanged,
  toDateChanged,
  viewChanged,
  sortChanged,
  pageChanged,
  filtersReplaced,
  filtersCleared,
} = taskFiltersSlice.actions;

export const taskFiltersReducer = taskFiltersSlice.reducer;

export const selectTaskFilters = (state: {
  taskFilters: TaskFiltersState;
}): TaskFiltersState => state.taskFilters;
