import type { ReactElement, ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as ReduxProvider } from "react-redux";

import { makeStore, type AppStore } from "@/store";
import { filtersReplaced } from "@/store/task-filters-slice";
import type { Task, TaskFiltersState } from "@/types";

export function makeTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
}

interface ProviderOptions extends Omit<RenderOptions, "wrapper"> {
  initialFilters?: Partial<TaskFiltersState>;
  store?: AppStore;
  queryClient?: QueryClient;
}

export function renderWithProviders(
  ui: ReactElement,
  options: ProviderOptions = {},
) {
  const {
    initialFilters,
    store = makeStore(),
    queryClient = makeTestQueryClient(),
    ...rest
  } = options;

  if (initialFilters) {
    store.dispatch(
      filtersReplaced({ ...store.getState().taskFilters, ...initialFilters }),
    );
  }

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ReduxProvider>
  );

  return {
    store,
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...rest }),
  };
}

export function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "1",
    title: "Ship the release",
    description: "Cut the branch and tag it",
    status: "todo",
    priority: "medium",
    dueDate: "2099-03-10",
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}
