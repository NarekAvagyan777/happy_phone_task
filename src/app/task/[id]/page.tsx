"use client";

import { Modal } from "@/components/Modal";
import { taskStatusOptions } from "@/constants";
import { Category, Task, TaskStatus } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

export default function EditTaskPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState<Array<Category>>([]);

  const [task, setTask] = useState<Task>({
    categoryId: "",
    createdAt: "",
    id: "",
    status: "" as TaskStatus,
    title: "",
  });

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTask((prev) => ({ ...prev, title: newTitle }));
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as TaskStatus;
    setTask((prev) => ({ ...prev, status: newStatus }));
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newCategoryId = e.target.value;
    setTask((prev) => ({ ...prev, categoryId: newCategoryId }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!task.title.trim()) return;

    const savedTasks: Task[] = JSON.parse(
      localStorage.getItem("tasks") || "[]"
    );

    const newTasks = savedTasks.map((current) => {
      return current.id === id ? task : current;
    });

    localStorage.setItem("tasks", JSON.stringify(newTasks));
    router.push("/");
  };

  const deleteItem = () => {
    const savedTasks: Task[] = JSON.parse(
      localStorage.getItem("tasks") || "[]"
    );

    const filtered = savedTasks.filter((current) => {
      return current.id !== id;
    });

    toggleModal();

    localStorage.setItem("tasks", JSON.stringify(filtered));
    router.push("/");
  };

  const memoizedCategories = useMemo(() => {
    return Object.entries(categories);
  }, [categories]);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    const savedCategories = JSON.parse(
      localStorage.getItem("categories") || "[]"
    );

    const foundTask = savedTasks.find((el: Task) => el.id === id);

    setCategories(savedCategories);
    setTask(foundTask);
  }, []);

  return (
    <main className="max-w-7xl px-8 mx-auto">
      <Modal
        isOpen={isModalOpen}
        onClose={toggleModal}
        title="Удалить задачу ?"
      >
        <div>
          <div className="flex justify-end gap-2">
            <button
              onClick={toggleModal}
              type="button"
              className="px-4 py-2 bg-gray-200 text-black rounded"
            >
              Нет
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={deleteItem}
            >
              Да
            </button>
          </div>
        </div>
      </Modal>

      <h1 className="text-2xl md:text-4xl break-all">Редактировать задачу</h1>

      <form onSubmit={handleSubmit} className="mt-4">
        <label htmlFor="title" className="block mb-2">
          Заголовок
        </label>

        <input
          required
          id="title"
          placeholder="Введите название задачи"
          className="w-full border p-2 rounded mb-4"
          value={task.title}
          onChange={handleTitleChange}
          pattern=".*[^ ]{4,}.*"
        />

        <label htmlFor="status" className="block mb-2">
          Статус
        </label>
        <select
          required
          id="status"
          className="w-full border p-2 rounded mb-4"
          value={task.status}
          onChange={handleStatusChange}
        >
          {taskStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <label htmlFor="category" className="block mb-2">
          Категория
        </label>
        <select
          required
          id="category"
          className="w-full border p-2 rounded mb-4"
          value={task.categoryId}
          onChange={handleCategoryChange}
        >
          {memoizedCategories.map((cat) => (
            <option key={cat[1].id} value={cat[1].id}>
              {cat[1].title}
            </option>
          ))}
        </select>

        <div className="flex flex-wrap max-[360px]:justify-start justify-end gap-2">
          <button
            onClick={toggleModal}
            type="button"
            className="px-4 py-2 bg-[red] text-white rounded"
          >
            Удалить
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Редактировать
          </button>
        </div>
      </form>
    </main>
  );
}
