import type { ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { Provider as ReduxProvider } from "react-redux";

import { makeStore } from "@/store";
import { useTaskFilters } from "./use-task-filters";

const mockReplace = jest.fn();
let searchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => searchParams,
}));

function wrapper(store = makeStore()) {
  const StoreWrapper = ({ children }: { children: ReactNode }) => (
    <ReduxProvider store={store}>{children}</ReduxProvider>
  );
  StoreWrapper.displayName = "StoreWrapper";
  return StoreWrapper;
}

beforeEach(() => {
  searchParams = new URLSearchParams();
  mockReplace.mockClear();
  window.history.replaceState(null, "", "/");
});

describe("useTaskFilters", () => {
  it("exposes defaults and hydrates from the URL query string", async () => {
    searchParams = new URLSearchParams("status=done&priority=high&view=list");
    const { result } = renderHook(() => useTaskFilters(), { wrapper: wrapper() });

    await waitFor(() => expect(result.current.status).toBe("done"));
    expect(result.current.priority).toBe("high");
    expect(result.current.view).toBe("list");
  });

  it("setStatus updates state and writes the URL, resetting the page", async () => {
    const store = makeStore();
    const { result } = renderHook(() => useTaskFilters(), {
      wrapper: wrapper(store),
    });

    act(() => result.current.setPage(3));
    act(() => result.current.setStatus("in-progress"));

    expect(result.current.status).toBe("in-progress");
    expect(result.current.page).toBe(1);
    expect(mockReplace).toHaveBeenLastCalledWith(
      expect.stringContaining("status=in-progress"),
      { scroll: false },
    );
  });

  it("setSort toggles asc <-> desc on the same field", () => {
    const { result } = renderHook(() => useTaskFilters(), { wrapper: wrapper() });

    act(() => result.current.setSort("title"));
    expect(result.current.sortBy).toBe("title");
    expect(result.current.sortOrder).toBe("asc");

    act(() => result.current.setSort("title"));
    expect(result.current.sortOrder).toBe("desc");

    act(() => result.current.setSort("dueDate"));
    expect(result.current.sortBy).toBe("dueDate");
    expect(result.current.sortOrder).toBe("asc");
  });

  it("clearFilters resets filters but keeps the current view", () => {
    const { result } = renderHook(() => useTaskFilters(), { wrapper: wrapper() });

    act(() => result.current.setView("list"));
    act(() => result.current.setStatus("done"));
    act(() => result.current.setPriority("urgent"));
    expect(result.current.hasActiveFilters).toBe(true);

    act(() => result.current.clearFilters());
    expect(result.current.status).toBe("all");
    expect(result.current.priority).toBe("all");
    expect(result.current.hasActiveFilters).toBe(false);
    expect(result.current.view).toBe("list");
  });

  it("reports an inverted date range as an error", () => {
    const { result } = renderHook(() => useTaskFilters(), { wrapper: wrapper() });

    act(() => result.current.setFrom("2026-05-01"));
    act(() => result.current.setTo("2026-04-01"));

    expect(result.current.dateRangeError).toMatch(/on or before/i);
  });
});
