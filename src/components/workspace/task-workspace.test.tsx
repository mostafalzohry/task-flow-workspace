import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { makeTask, renderWithProviders } from "@test/render";
import TaskWorkspace from "./task-workspace";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock("sonner", () => ({
  toast: Object.assign(jest.fn(), {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  }),
}));

jest.mock("@/api/task-service");
import * as service from "@/api/task-service";
const api = jest.mocked(service);

beforeEach(() => {
  api.getTasks.mockResolvedValue([]);
  api.createTask.mockImplementation(async (input) =>
    makeTask({ id: "new", ...input }),
  );
  api.updateTask.mockImplementation(async (id, input) =>
    makeTask({ id, ...input }),
  );
  api.deleteTask.mockResolvedValue(undefined);
});

describe("creating a task", () => {
  it("opens the dialog, submits the form, and calls the create API", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TaskWorkspace />);

    await user.click(await screen.findByRole("button", { name: /add task/i }));

    const dialog = await screen.findByRole("dialog");
    await user.type(
      within(dialog).getByLabelText(/title/i),
      "Write the migration guide",
    );

    const dueDate = within(dialog).getByLabelText(/due date/i);
    await user.clear(dueDate);
    await user.type(dueDate, "2099-12-31");

    await user.click(
      within(dialog).getByRole("button", { name: /create task/i }),
    );

    await waitFor(() =>
      expect(api.createTask).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Write the migration guide",
          status: "todo",
          priority: "medium",
          dueDate: "2099-12-31T00:00:00.000Z",
        }),
      ),
    );

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });

  it("blocks submission when the title is empty", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TaskWorkspace />);

    await user.click(await screen.findByRole("button", { name: /add task/i }));
    const dialog = await screen.findByRole("dialog");
    await user.click(
      within(dialog).getByRole("button", { name: /create task/i }),
    );

    expect(await within(dialog).findByText(/title is required/i)).toBeVisible();
    expect(api.createTask).not.toHaveBeenCalled();
  });
});

describe("filtering", () => {
  it("re-queries the API with the debounced search term", async () => {
    const user = userEvent.setup();
    api.getTasks.mockResolvedValue([
      makeTask({ id: "1", title: "Alpha" }),
      makeTask({ id: "2", title: "Beta launch" }),
    ]);

    renderWithProviders(<TaskWorkspace />);

    expect(await screen.findByText("Beta launch")).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText(/search tasks/i), "beta");

    await waitFor(
      () =>
        expect(api.getTasks).toHaveBeenCalledWith(
          expect.objectContaining({ search: "beta" }),
        ),
      { timeout: 2000 },
    );
  });

  it("filters the board by status via the toolbar", async () => {
    const user = userEvent.setup();
    api.getTasks.mockResolvedValue([
      makeTask({ id: "1", title: "Alpha", status: "todo" }),
      makeTask({ id: "2", title: "Done thing", status: "done" }),
    ]);

    renderWithProviders(<TaskWorkspace />);
    await screen.findByText("Alpha");

    await user.click(screen.getByRole("combobox", { name: /filter by status/i }));
    await user.click(await screen.findByRole("option", { name: "Done" }));

    await waitFor(() => {
      expect(screen.queryByText("Alpha")).not.toBeInTheDocument();
      expect(screen.getByText("Done thing")).toBeInTheDocument();
    });
  });
});
