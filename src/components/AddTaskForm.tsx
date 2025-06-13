"use client";

import { useState, useEffect, useMemo, ChangeEvent } from "react";
import { TaskStatus, Category, Task } from "@/types";
import { taskStatusOptions } from "@/constants";

type Props = {
  categories: Array<Category>;
  onCreate: (task: Task) => void;
};

export const AddTaskForm = ({ categories, onCreate }: Props) => {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [categoryId, setCategoryId] = useState<string>(
    categories.length ? categories[0].id : ""
  );

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value as TaskStatus);
  };

  const handleCategorySelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategoryId(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
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
        className="w-full border p-2 rounded mb-4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        pattern=".*[^ ]{4,}.*"
      />

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
    <h2 className="text-xl font-semibold mb-4">
      Для начала создайте категорию
    </h2>
  );
};
