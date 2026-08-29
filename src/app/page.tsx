import { Suspense } from "react";

import TaskWorkspace from "@/components/task-workspace";
import TaskWorkspaceFallback from "@/components/task-workspace-fallback";

const Home = () => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <Suspense fallback={<TaskWorkspaceFallback />}>
        <TaskWorkspace />
      </Suspense>
    </div>
  );
};

export default Home;
