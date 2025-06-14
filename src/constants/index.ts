import type { TaskStatus, TodoStatusLabel, ViewOption } from "@/types";

export const viewOptions: Array<ViewOption> = [
  { value: "list", label: "Список" },
  { value: "kanban", label: "Канбан" },
];

export const taskStatusOptions: Array<{
  value: TaskStatus;
  label: TodoStatusLabel;
}> = [
  { value: "Незавершённый", label: "Незавершённый" },
  { value: "В процессе", label: "В процессе" },
  { value: "Завершённый", label: "Завершённый" },
];
