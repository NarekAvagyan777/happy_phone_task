"use client";

import { taskStatusOptions } from "@/constants";
import { Category, Task, TaskStatus } from "@/types";
import { ChangeEvent, useState } from "react";

type Props = {
  categories: Array<Category>;
  onCreate: (task: Task) => void;
};

export const AddTaskForm = ({ categories, onCreate }: Props) => {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TaskStatus>("Незавершённый");
  const [categoryId, setCategoryId] = useState<string>(
    categories.length ? categories[0].id : ""
  );

  const [errors, setErrors] = useState<Record<"title", string | null>>({
    title: null,
  });

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);

    if (errors.title) {
      setErrors({ title: null });
    }
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value as TaskStatus);
  };

  const handleCategorySelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategoryId(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let trimmed = title.trim();

    if (trimmed.length < 4) {
      setErrors({
        title: "Минимальная длина заголовка - 4 символа",
      });

      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: trimmed,
      status,
      categoryId,
      createdAt: new Date().toISOString(),
    };

    onCreate(newTask);
  };

  return categories.length > 0 ? (
    <form onSubmit={handleSubmit}>
      <label className="block mb-2">Заголовок</label>
      <input
        required
        placeholder="Введите название задачи"
        className="w-full border p-2 rounded"
        value={title}
        onChange={handleTitleChange}
      />

      {errors.title && <p className="text-red-500 mt-1 mb-4">{errors.title}</p>}

      <label className="block mb-2">Статус</label>
      <select
        required
        className="w-full border p-2 rounded mb-4"
        value={status}
        onChange={handleStatusChange}
      >
        {taskStatusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {categories.length === 1 && (
        <>
          <label className="block mb-2">Категория</label>
          <select
            required
            className="w-full border p-2 rounded mb-4"
            value={categoryId}
            onChange={handleCategorySelect}
          >
            {/* <option value="">Выберите категорию</option> */}
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title}
              </option>
            ))}
          </select>
        </>
      )}

      {categories.length > 1 && (
        <>
          <label className="block mb-2">Категория</label>
          <select
            required
            className="w-full border p-2 rounded mb-4"
            value={categoryId}
            onChange={handleCategorySelect}
          >
            {/* <option value="">Выберите категорию</option> */}
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title}
              </option>
            ))}
          </select>
        </>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Создать
        </button>
      </div>
    </form>
  ) : (
    <h2 className="text-xl text-red-400 font-semibold mb-4">
      Для начала создайте категорию
    </h2>
  );
};
