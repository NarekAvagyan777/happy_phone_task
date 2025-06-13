export type TaskStatus = "todo" | "in process" | "done";
export type TodoStatusLabel = "Незавершённый" | "В процессе" | "Завершённый";

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  categoryId: string;
  createdAt: string;
};

export type Category = {
  id: string;
  title: string;
};

export type ViewOption = {
  value: string;
  label: string;
};
