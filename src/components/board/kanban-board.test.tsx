import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { makeTask, renderWithProviders } from "@test/render";
import KanbanBoard from "./kanban-board";

const mutate = jest.fn();
jest.mock("@/queries/use-task-mutations", () => ({
  usePatchTask: () => ({ mutate, isPending: false }),
}));

const STATUS_X: Record<string, number> = {
  todo: 0,
  "in-progress": 320,
  "in-review": 640,
  done: 960,
};

function stubHorizontalLayout() {
  jest
    .spyOn(Element.prototype, "getBoundingClientRect")
    .mockImplementation(function (this: Element) {
      const section = this.closest<HTMLElement>(
        "section[aria-labelledby^='column-']",
      );
      const status = section
        ?.getAttribute("aria-labelledby")
        ?.replace("column-", "");
      const x = status ? (STATUS_X[status] ?? 0) : 0;
      return {
        x,
        y: 0,
        left: x,
        top: 0,
        right: x + 280,
        bottom: 360,
        width: 280,
        height: 360,
        toJSON: () => ({}),
      } as DOMRect;
    });
}

const noop = () => {};

function renderBoard() {
  return renderWithProviders(
    <KanbanBoard
      tasks={[
        makeTask({ id: "1", title: "Draggable card", status: "todo" }),
        makeTask({ id: "2", title: "Neighbour", status: "in-progress" }),
      ]}
      onViewTask={noop}
      onEditTask={noop}
      onDeleteTask={noop}
      onCreateTask={noop}
    />,
  );
}

beforeEach(() => {
  mutate.mockClear();
  stubHorizontalLayout();
});
afterEach(() => jest.restoreAllMocks());

describe("KanbanBoard drag-and-drop", () => {
  it("renders every column with its tasks grouped", () => {
    renderBoard();
    const todo = screen.getByRole("region", { name: /to do/i });
    expect(within(todo).getByText("Draggable card")).toBeInTheDocument();
    const inProgress = screen.getByRole("region", { name: /in progress/i });
    expect(within(inProgress).getByText("Neighbour")).toBeInTheDocument();
  });

  it("moves a card to the next column with the keyboard sensor", async () => {
    const user = userEvent.setup();
    renderBoard();

    const handle = screen.getByRole("button", {
      name: "Draggable card",
      description: /use the arrow keys to move it between columns/i,
    });
    handle.focus();

    await user.keyboard("[Space]");
    expect(handle).toHaveAttribute("aria-pressed", "true");

    await user.keyboard("[ArrowRight]");
    await user.keyboard("[Space]");

    await waitFor(() =>
      expect(mutate).toHaveBeenCalledWith({
        id: "1",
        patch: { status: "in-progress" },
      }),
    );
  });

  it("does not call the move API when a card is dropped back in place", async () => {
    const user = userEvent.setup();
    renderBoard();

    const handle = screen.getByRole("button", {
      name: "Draggable card",
      description: /use the arrow keys to move it between columns/i,
    });
    handle.focus();

    await user.keyboard("[Space]");
    await user.keyboard("[Space]");

    expect(mutate).not.toHaveBeenCalled();
  });
});
