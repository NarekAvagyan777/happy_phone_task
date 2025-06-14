"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Modal } from "@/components/Modal";
import { Category, Task } from "@/types";
import { useParams, useRouter } from "next/navigation";

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState<Array<Category>>([]);
  const [tasks, setTasks] = useState<Array<Task>>([]);

  const [category, setCategory] = useState<Category>({
    id: "",
    title: "",
  });

  const [errors, setErrors] = useState<Record<"title", string | null>>({
    title: null,
  });

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setCategory((prev) => ({ ...prev, title: newTitle }));

    if (errors?.title) {
      setErrors({ title: null });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let trimmed = category.title.trim();

    if (trimmed.length < 4) {
      setErrors({
        title: "Минимальная длина заголовка - 4 символа",
      });

      return;
    }

    const found = categories.find((cat) => cat.title === trimmed);

    if (found) {
      setErrors({ title: "Категория с таким названием уже существует" });
      return;
    }

    const newCategories = categories.map((current) => {
      return current.id === id ? { ...category, title: trimmed } : current;
    });

    localStorage.setItem("categories", JSON.stringify(newCategories));
    router.push("/");
  };

  const deleteItem = () => {
    const filteredCategories = categories.filter((current) => {
      return current.id !== id;
    });

    const filteredTasks = tasks.filter(
      (task) => task.categoryId !== category.id
    );

    toggleModal();

    localStorage.setItem("categories", JSON.stringify(filteredCategories));
    localStorage.setItem("tasks", JSON.stringify(filteredTasks));

    router.push("/");
  };

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    const savedCategories = JSON.parse(
      localStorage.getItem("categories") || "[]"
    );

    const foundCategory = savedCategories.find(
      (el: Category) => el.id === id
    ) as Category;

    setTasks(savedTasks);
    setCategories(savedCategories);
    setCategory(foundCategory);
  }, []);

  return (
    <main className="max-w-7xl px-8 mx-auto">
      <Modal
        isOpen={isModalOpen}
        onClose={toggleModal}
        title={`Удалить категорию вместе с его задачами ?`}
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

      <h1 className="text-2xl md:text-4xl break-all">
        Редактировать категорию
      </h1>

      <form onSubmit={handleSubmit} className="mt-4">
        <label htmlFor="title" className="block mb-2">
          Заголовок
        </label>

        <input
          required
          id="title"
          placeholder="Введите название категории"
          className="w-full border p-2 rounded mb-4"
          value={category.title}
          onChange={handleTitleChange}
        />

        {errors?.title && <p className="text-red-500 mt-1">{errors.title}</p>}

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
