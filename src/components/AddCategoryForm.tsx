import { Category } from "@/types";
import { useState } from "react";

type Props = {
  onCreate: (category: Category) => void;
  categories: Array<Category>;
};

export const AddCategoryForm = ({ onCreate, categories }: Props) => {
  const [title, setTitle] = useState<string>("");
  const [error, setError] = useState<string | null>();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);

    if (error) {
      setError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const found = categories.find((cat) => cat.title === title);

    if (found) {
      setError("Категория с таким названием уже существует");
      return;
    }

    onCreate({ title, id: Date.now().toString() });
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
          pattern=".*[^ ]{4,}.*"
        />
        {error && <p className="text-red-500 mt-1">{error}</p>}
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
