import type { TaskStatus, TodoStatusLabel, ViewOption } from "@/types";

export const viewOptions: Array<ViewOption> = [
  { value: "list", label: "Список" },
  { value: "kanban", label: "Канбан" },
];

export const taskStatusOptions: Array<{
  value: TaskStatus;
  label: TodoStatusLabel;
}> = [
  { value: "todo", label: "Незавершённый" },
  { value: "in process", label: "В процессе" },
  { value: "done", label: "Завершённый" },
];
