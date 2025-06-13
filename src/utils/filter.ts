import { Task, TaskStatus } from "@/types";

export function filterTasks(
  tasks: Task[],
  params: {
    status: "all" | TaskStatus;
    category: string;
  }
) {
  const filtered = tasks.filter(
    (task) =>
      (params.status === "all" ? true : task.status === params.status) &&
      (params.category === "all" ? true : task.categoryId === params.category)
  );

  return filtered;
}
