"use client";

import { useEffect, useRef, useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

function ExtensionMenu({ className, onExpand, onClose, children }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsExpanded(false);
        onClose();
      }
    }

    // Add the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);
  return (
    <div className={`${className} flex items-center justify-center`}>
      <div className="justify-centers relative flex items-center">
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent click from propagating to the document
            setIsExpanded(true);
            onExpand();
          }}
        >
          <HiOutlineDotsHorizontal />
        </button>
        {isExpanded && (
          <div
            ref={containerRef}
            className="absolute right-0 top-0 flex translate-x-[108%] flex-col items-center justify-center overflow-hidden rounded-2xl border border-primary_dark bg-background py-2 shadow-lg"
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExtensionMenu;
