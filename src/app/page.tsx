import {
  KanbanBoard,
  SAMPLE_TASKS,
  TaskToolbar,
  WorkspaceHeader,
} from "@/features/tasks";

export default function Home() {
  return (
    <div className="flex w-full flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <WorkspaceHeader />
      <main className="flex flex-col gap-6">
        <TaskToolbar />
        <KanbanBoard tasks={SAMPLE_TASKS} />
      </main>
    </div>
  );
}
