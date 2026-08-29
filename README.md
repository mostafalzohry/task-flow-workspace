# TaskFlow — Interactive Task & Workflow Workspace

A Kanban and list-based task management dashboard. Organize work across the
To Do → In Progress → In Review → Done pipeline with full CRUD, drag-and-drop
between statuses, a virtualized list view, debounced search, multi-criteria and
date-range filtering that is synced to the URL (so any view is a shareable link),
optimistic status changes, and accessible dialogs and drag-and-drop.

**Live demo:** https://task-flow-workspace-rose.vercel.app

## Quick Start

```bash
git clone <repo-url>
cd task-flow-workspace
npm install
npm run dev            # http://localhost:3000
```

A working MockAPI base URL is committed in `.env`, so no configuration is needed
to run the app. To point it at your own backend, copy `.env.example` to
`.env.local` and set `NEXT_PUBLIC_MOCK_API_BASE_URL` (it is resolved and
validated in `src/lib/env.ts`).

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm test` | Run the test suite (unit + integration) |

## Architecture & Key Decisions

- **Next.js 16 (App Router)** — React Server Components and file-based routing.
- **TanStack Query** owns all server data (`src/queries/`): caching,
  `keepPreviousData` pagination, and optimistic status/priority updates with
  rollback in `src/queries/use-task-mutations.tsx`
  (`usePatchTask` — `onMutate` / `onError` / `onSettled`).
- **Redux Toolkit** (`src/store/`) holds only the client UI state — filter, view,
  sort, and page. The **URL query string is the source of truth** and hydrates
  the store through `src/hooks/use-task-filters.ts`, so every filtered view is a
  shareable link.
- **Layered structure** — `api/` (an axios service plus a `normalize` layer,
  `src/api/task-normalize.ts`, that turns untrusted MockAPI JSON into typed
  `Task` objects) → `queries/` + `hooks/` (data and logic) → `components/`
  grouped by feature (`board/`, `list/`, `task-dialogs/`, `workspace/`,
  `common/`, `ui/`).
- **Forms** — React Hook Form with a Yup schema
  (`src/schemas/task-form-schema.ts`): accessible inline errors and a
  past-due-date guard.
- **Drag & drop** — `@dnd-kit` with pointer, touch, and keyboard sensors plus
  live screen-reader announcements (`src/hooks/use-kanban-dnd.ts`).
- **Performance** — row virtualization via `@tanstack/react-virtual` in the list
  table; `React.memo` / `useMemo` / `useCallback` on hot paths.
- **Styling** — Tailwind CSS v4 with shadcn/ui (Radix primitives) for accessible
  dialogs, selects, and menus.
- **TypeScript** — `strict: true`, with no `any` or `unknown`; API responses are
  validated at the boundary rather than cast.

## Testing

Jest + React Testing Library — **60 tests across 12 suites**.

- **Unit** — custom hooks (`use-debounced-value`, `use-task-filters`,
  `use-kanban-dnd`), utility functions, the Redux slice, and the API normalizer.
- **Integration** — the create-a-task flow, keyboard drag across columns, and
  debounced filtering.

```bash
npm test
```

## Engineering Trade-Offs (48h)

Features consciously left outside the time-box:

- **Single-user scope** — no auth, assignees, or multiple workspaces; the focus
  was a polished single board / list experience.
- **Comments and attachments** on tasks.
- **Analytics dashboard** (throughput, cycle time, per-status metrics).

## Deployment

Deployed on Vercel: https://task-flow-workspace-rose.vercel.app
