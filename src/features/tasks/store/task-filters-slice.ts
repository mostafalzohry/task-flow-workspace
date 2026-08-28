import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { PriorityFilter, StatusFilter, TaskFilters } from "../types";

const initialState: TaskFilters = {
  search: "",
  status: "all",
  priority: "all",
  from: "",
  to: "",
};

const taskFiltersSlice = createSlice({
  name: "taskFilters",
  initialState,
  reducers: {
    searchChanged(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    statusChanged(state, action: PayloadAction<StatusFilter>) {
      state.status = action.payload;
    },
    priorityChanged(state, action: PayloadAction<PriorityFilter>) {
      state.priority = action.payload;
    },
    fromDateChanged(state, action: PayloadAction<string>) {
      state.from = action.payload;
    },
    toDateChanged(state, action: PayloadAction<string>) {
      state.to = action.payload;
    },
    filtersReplaced(state, action: PayloadAction<TaskFilters>) {
      state.search = action.payload.search;
      state.status = action.payload.status;
      state.priority = action.payload.priority;
      state.from = action.payload.from;
      state.to = action.payload.to;
    },
    filtersCleared(state) {
      state.search = initialState.search;
      state.status = initialState.status;
      state.priority = initialState.priority;
      state.from = initialState.from;
      state.to = initialState.to;
    },
  },
});

export const {
  searchChanged,
  statusChanged,
  priorityChanged,
  fromDateChanged,
  toDateChanged,
  filtersReplaced,
  filtersCleared,
} = taskFiltersSlice.actions;

export const taskFiltersReducer = taskFiltersSlice.reducer;

export const selectTaskFilters = (state: {
  taskFilters: TaskFilters;
}): TaskFilters => state.taskFilters;
