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
      <div className="relative flex items-center justify-centers">
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
            className="absolute top-0 right-0 translate-x-[108%] bg-white border border-primary_dark rounded-2xl shadow-lg flex flex-col items-center justify-center overflow-hidden py-2"
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExtensionMenu;
