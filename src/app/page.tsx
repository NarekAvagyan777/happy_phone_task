"use client";

import { useEffect, useState } from "react";
import { AddCategoryForm } from "@/components/AddCategoryForm";
import { AddTaskForm } from "@/components/AddTaskForm";
import { KanbanView } from "@/components/KanbanView";
import { ListView } from "@/components/ListView";
import { Modal } from "@/components/Modal";
import { ViewSwitcher } from "@/components/ViewSwitcher";
import { Category, Task } from "@/types";

export default function Home() {
  const [selectedView, setSelectedView] = useState<"list" | "kanban">("list");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<string | null>(null);
  const [categories, setCategories] = useState<Array<Category>>([]);
  const [tasks, setTasks] = useState<Array<Task>>([]);

  useEffect(() => {
    const savedCategories = JSON.parse(
      localStorage.getItem("categories") || "[]"
    );

    const savedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");

    setCategories(savedCategories);
    setTasks(savedTasks);
  }, []);

  const handleViewChange = (view: "list" | "kanban") => {
    setSelectedView(view);
  };

  const handleCategoryClick = () => {
    setVisibleForm("category");
    setIsModalOpen(true);
  };

  const handleTaskClick = () => {
    setVisibleForm("task");
    setIsModalOpen(true);
  };

  const addTask = (task: Task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
    localStorage.setItem("tasks", JSON.stringify([...tasks, task]));
    localStorage.setItem("tasks", JSON.stringify([...tasks, task]));
  };

  const addCategory = (category: Category) => {
    setCategories((prev) => [...prev, category]);

    localStorage.setItem(
      "categories",
      JSON.stringify([...categories, category])
    );
  };

  const handleModal = () => {
    setVisibleForm(null);
    setIsModalOpen((prev) => !prev);
  };

  const handleCategoryCreate = (category: Category) => {
    addCategory(category);
    handleModal();
  };

  const handleTaskCreate = (task: Task) => {
    addTask(task);
    handleModal();
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={handleModal}
        title={
          visibleForm === "category"
            ? "Создать категорию"
            : visibleForm === "task"
            ? "Создать задачу"
            : ""
        }
      >
        {visibleForm === "category" && (
          <AddCategoryForm
            onCreate={handleCategoryCreate}
            categories={categories}
          />
        )}
        {visibleForm === "task" && (
          <AddTaskForm onCreate={handleTaskCreate} categories={categories} />
        )}
      </Modal>
      <main className="max-w-7xl px-8 mx-auto">
        <div className="mt-4 flex gap-4">
          <button
            onClick={handleCategoryClick}
            className={`px-4 py-2 rounded bg-gray-200`}
          >
            Создать категорию
          </button>
          <button
            onClick={handleTaskClick}
            className={`px-4 py-2 rounded bg-gray-200`}
          >
            Создать задачу
          </button>
        </div>

        <div className="mt-4">
          <ViewSwitcher view={selectedView} onChange={handleViewChange} />
        </div>

        <div className="">
          <div>
            {selectedView === "kanban" ? (
              <KanbanView
                categories={categories}
                tasks={tasks}
                setTasks={setTasks}
              />
            ) : (
              <ListView tasks={tasks} categories={categories} />
            )}
          </div>
        </div>
      </main>
    </>
  );
}
