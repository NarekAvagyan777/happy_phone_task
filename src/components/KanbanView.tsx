"use client";
import React, { DragEvent, useEffect, useMemo, useState } from "react";
import { Category, Task } from "@/types";
import Link from "next/link";

type Props = {
  categories: Array<Category>;
  tasks: Array<Task>;
  setTasks: (arg: Array<Task>) => any;
};

export const KanbanView = ({ categories, tasks, setTasks }: Props) => {
  const [boards, setBoards] = useState<Record<string, Array<Task>>>({});

  useEffect(() => {
    const newMap: Record<string, Task[]> = {};

    categories.forEach(({ id }) => {
      newMap[id] = [];
    });

    tasks.forEach((task) => {
      if (newMap[task.categoryId]) {
        newMap[task.categoryId].push(task);
      } else {
        newMap[task.categoryId] = [task];
      }
    });

    setBoards(newMap);
  }, [categories.length, tasks.length]);

  const [currentBoard, setCurrentBoard] = useState<Category>(
    null as unknown as Category
  );
  const [currentItem, setCurrentItem] = useState<Task>(null as unknown as Task);

  function dragOverHandler(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();

    const target = e.target as HTMLElement;
    if (target.className === "item") {
      target.style.boxShadow = "0 4px 3px gray";
    }
  }

  function dragLeaveHandler(e: DragEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement;
    target.style.boxShadow = "none";
  }

  function dragStartHandler(
    e: DragEvent<HTMLDivElement>,
    board: any,
    item: any
  ) {
    setCurrentBoard(board);
    setCurrentItem(item);
  }

  function dragEndHandler(e: DragEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement;
    target.style.boxShadow = "none";
  }

  function dropHandler(
    e: DragEvent<HTMLDivElement>,
    board: Category,
    item: Task
  ) {
    const target = e.target as HTMLElement;
    e.preventDefault();
    e.stopPropagation();

    const newTasks = tasks.map((task) => {
      if (currentItem.id === task.id) {
        task.categoryId = board.id;
      }

      return task;
    });

    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));

    let currentBoardId = currentBoard.id;
    boards[currentBoardId] = boards[currentBoardId].filter(
      (el) => el.id !== currentItem.id
    );

    let boardsCopy = { ...boards };

    const dropIndex = boards[board.id].indexOf(item);
    boardsCopy[board.id].splice(dropIndex + 1, 0, currentItem);

    setBoards(boardsCopy);
    target.style.boxShadow = "none";
  }

  function dropCardHandler(e: DragEvent<HTMLDivElement>, board: Category) {
    if (board.id === currentBoard.id) {
      return;
    }
    const target = e.target as HTMLElement;

    const newTasks = tasks.map((task) => {
      if (currentItem.id === task.id) {
        task.categoryId = board.id;
      }

      return task;
    });

    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));

    let currentBoardId = currentBoard.id;

    currentItem.categoryId = board.id;

    let boardsCopy = { ...boards };
    boardsCopy[currentBoardId] = boards[currentBoardId].filter(
      (el) => el.id !== currentItem.id
    );

    boardsCopy[board.id] = [...boards[board.id], currentItem];

    setBoards(boardsCopy);
    target.style.boxShadow = "none";
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 overflow-auto mt-4">
      {categories.map((cat) => (
        <div key={cat.id}>
          <h2 className="text-3xl font-bold mb-2">{cat.title}</h2>
          <div
            className="flex-shrink-0 bg-gray-50 rounded p-3 py-6 min-h-[150px]"
            onDragOver={dragOverHandler}
            onDrop={(e) => dropCardHandler(e, cat)}
          >
            {(boards[cat.id] || []).map((task: Task) => (
              <div
                key={task.id}
                draggable
                className="taskItem p-2 mb-2 bg-white rounded shadow flex justify-between overflow-hidden break-all"
                onDragOver={(e) => dragOverHandler(e)}
                onDragLeave={(e) => dragLeaveHandler(e)}
                onDragStart={(e) => dragStartHandler(e, cat, task)}
                onDragEnd={(e) => dragEndHandler(e)}
                onDrop={(e) => dropHandler(e, cat, task)}
              >
                <div className="flex justify-between w-full gap-x-4">
                  <div>
                    {" "}
                    <p className="text-2xl text-ellipsis">{task.title}</p>
                    <p className="mt-2 text-xl">{task.status}</p>
                  </div>

                  <Link href={`/task/${task.id}`} className="shrink-0">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 20.9996C4.45 20.9996 3.97917 20.8038 3.5875 20.4121C3.19583 20.0204 3 19.5496 3 18.9996V4.99961C3 4.44961 3.19583 3.97878 3.5875 3.58711C3.97917 3.19544 4.45 2.99961 5 2.99961H13.925L11.925 4.99961H5V18.9996H19V12.0496L21 10.0496V18.9996C21 19.5496 20.8042 20.0204 20.4125 20.4121C20.0208 20.8038 19.55 20.9996 19 20.9996H5ZM9 14.9996V10.7496L18.175 1.57461C18.375 1.37461 18.6 1.22461 18.85 1.12461C19.1 1.02461 19.35 0.974609 19.6 0.974609C19.8667 0.974609 20.1208 1.02461 20.3625 1.12461C20.6042 1.22461 20.825 1.37461 21.025 1.57461L22.425 2.99961C22.6083 3.19961 22.75 3.42044 22.85 3.66211C22.95 3.90378 23 4.14961 23 4.39961C23 4.64961 22.9542 4.89544 22.8625 5.13711C22.7708 5.37878 22.625 5.59961 22.425 5.79961L13.25 14.9996H9ZM11 12.9996H12.4L18.2 7.19961L17.5 6.49961L16.775 5.79961L11 11.5746V12.9996Z"
                        fill={"black"}
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
