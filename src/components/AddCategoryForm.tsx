import { Category } from "@/types";
import { useState } from "react";

type Props = {
  onCreate: (category: Category) => void;
};

export const AddCategoryForm = ({ onCreate }: Props) => {
  const [title, setTitle] = useState<string>("");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onCreate({ title, id: Date.now().toString() });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <input
        required
        minLength={4}
        type="text"
        onChange={handleTitleChange}
        value={title}
        placeholder="Введите название категории"
        className="border border-gray-300 p-2 rounded"
        pattern=".*[^ ]{4,}.*"
      />

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
