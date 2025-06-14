"use client";

import { viewOptions } from "@/constants";

type Props = {
  view: "list" | "kanban";
  onChange: (view: "list" | "kanban") => void;
};

export const ViewSwitcher = ({ view, onChange }: Props) => {
  return (
    <div className="flex gap-4 mb-4">
      {viewOptions.map((option) => (
        <button
          key={option.value}
          className={`px-4 py-2 rounded ${
            view === option.value ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => onChange(option.value as "list" | "kanban")}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
