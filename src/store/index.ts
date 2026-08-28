import { configureStore } from "@reduxjs/toolkit";

import { taskFiltersReducer } from "./task-filters-slice";

export const makeStore = () =>
  configureStore({
    reducer: {
      taskFilters: taskFiltersReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
