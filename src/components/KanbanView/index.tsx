"use client";
import { Edit } from "@/icons";
import { Category, Task } from "@/types";
import Link from "next/link";
import { DragEvent, useEffect, useState } from "react";
import styles from "./KanbanView.module.css";

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
          <div className="flex items-start justify-between">
            <h2 className="text-3xl font-bold mb-2">{cat.title}</h2>

            <Link href={`/category/${cat.id}`} className="shrink-0">
              <Edit />
            </Link>
          </div>
          <div
            className="flex-shrink-0 bg-gray-50 rounded p-3 py-6 min-h-[150px]"
            onDragOver={dragOverHandler}
            onDrop={(e) => dropCardHandler(e, cat)}
          >
            {(boards[cat.id] || []).map((task: Task) => (
              <div
                key={task.id}
                draggable
                className={`${styles.taskItem} p-2 mb-2 bg-white rounded shadow flex justify-between overflow-hidden break-all`}
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
                    <Edit />
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
