import { useState } from "react";

function CollapsibleMenuItem({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleItem = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-gray-800 text-white w-64">
      <div
        className="p-4 hover:bg-gray-700 cursor-pointer flex justify-between items-center"
        onClick={toggleItem}
      >
        <span className="text-sm font-medium">{title}</span>
        <span>
          {isOpen ? (
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 15l7-7 7 7"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </span>
      </div>
      {isOpen && <div className="pl-4">{children}</div>}
    </div>
  );
}

export default CollapsibleMenuItem;
