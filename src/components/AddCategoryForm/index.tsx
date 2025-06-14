import { Category } from "@/types";
import { useState } from "react";

type Props = {
  onCreate: (category: Category) => void;
  categories: Array<Category>;
};

export const AddCategoryForm = ({ onCreate, categories }: Props) => {
  const [title, setTitle] = useState<string>("");
  const [errors, setErrors] = useState<Record<"title", string | null>>({
    title: null,
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);

    if (errors.title) {
      setErrors({ title: null });
    }
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

    const found = categories.find((cat) => cat.title === trimmed);

    if (found) {
      setErrors({ title: "Категория с таким названием уже существует" });
      return;
    }

    onCreate({ title: trimmed, id: Date.now().toString() });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div>
        <input
          required
          minLength={4}
          type="text"
          onChange={handleTitleChange}
          value={title}
          placeholder="Введите название категории"
          className="border border-gray-300 p-2 rounded w-full"
        />
        {errors?.title && <p className="text-red-500 mt-1">{errors.title}</p>}
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Создать категорию
        </button>
      </div>
    </form>
  );
};
