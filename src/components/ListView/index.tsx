"use client";
import { taskStatusOptions } from "@/constants";
import { Edit } from "@/icons";
import { Category, Task, TaskStatus } from "@/types";
import { filterTasks } from "@/utils/filter";
import { sortTasks } from "@/utils/sort";
import Link from "next/link";
import { ChangeEvent, useState } from "react";

type TaskListProps = {
  tasks: Task[];
  categories: Category[];
};

export const ListView = ({ tasks, categories }: TaskListProps) => {
  const [sortBy, setSortBy] = useState<"date" | "title" | "status">("date");
  const [filterData, setFilterData] = useState<{
    status: "all" | TaskStatus;
    category: string;
  }>({
    status: "all",
    category: "all",
  });

  const handleSortSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as any);
  };

  const handleFilterSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const target = e.target;

    setFilterData((prev) => {
      return { ...prev, [target.name]: target.value };
    });
  };

  const filteredTasks = filterTasks(tasks, filterData);

  const sortedTasks = sortTasks(filteredTasks, sortBy);

  return (
    <div>
      <div className="flex items-center gap-x-6 gap-y-5 flex-wrap pb-2 border-b">
        <div className="flex items-center gap-3 mb-2">
          <label htmlFor="sort">Сортировать по:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={handleSortSelect}
            className="border rounded p-2"
          >
            <option value="date">Дате</option>
            <option value="title">Алфавиту</option>
            <option value="status">Статусу</option>
          </select>
        </div>

        <div className="flex items-center gap-3 mb-2">
          <label htmlFor="status">Фильтровать по статусу:</label>
          <select
            id="status"
            name="status"
            value={filterData.status}
            onChange={handleFilterSelect}
            className="border rounded p-2"
          >
            <option value="all">Все</option>
            {taskStatusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 mb-2">
          <label htmlFor="category">Фильтровать по категории:</label>
          <select
            id="category"
            name="category"
            value={filterData.category}
            onChange={handleFilterSelect}
            className="border rounded p-2"
          >
            <option value="all">Все</option>
            {categories.map((el) => (
              <option key={el.id} value={el.id}>
                {el.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ul className="space-y-2 pt-2">
        {sortedTasks.map((task) => {
          return (
            <li
              key={task.id}
              className="p-4 border rounded shadow-sm flex justify-between items-center"
            >
              <div className="">
                <p className="text-2xl text-ellipsis">{task.title}</p>
                <p className="text-sm text-gray-600">Статус: {task.status}</p>
                <p className="text-sm text-gray-400">
                  Создано: {new Date(task.createdAt).toLocaleString()}
                </p>
              </div>
              <Link href={`/task/${task.id}`} className="shrink-0">
                <Edit />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
