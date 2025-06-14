"use client";

import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  isOpen: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
};

export const Modal = ({ isOpen, children, onClose, title = "" }: Props) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className={`${
        isOpen ? "scale-100 pointer-events-auto" : "scale-0 pointer-events-none"
      } inset-0 fixed bg-black/50 z-50 flex justify-center items-center transition-all duration-300 px-6`}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl transform transition-all max-w-md w-full mx-auto relative px-3 py-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="w-full relative pr-9 overflow-hidden">
          {title && (
            <h2 className="text-2xl overflow-hidden text-ellipsis">{title}</h2>
          )}
        </div>

        <div className="mt-6">{children}</div>
      </div>
    </div>,
    document.body
  );
};
