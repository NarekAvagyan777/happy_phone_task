import { Task, TaskStatus } from "@/types";

export function sortTasks(
  tasks: Task[],
  criteria: "date" | "title" | "status"
) {
  switch (criteria) {
    case "date":
      return [...tasks].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    case "title":
      return [...tasks].sort((a, b) => a.title.localeCompare(b.title));
    case "status":
      const statusOrder: Record<TaskStatus, number> = {
        Незавершённый: 0,
        "В процессе": 1,
        Завершённый: 2,
      };
      return [...tasks].sort(
        (a, b) => (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99)
      );
    default:
      return tasks;
  }
}
