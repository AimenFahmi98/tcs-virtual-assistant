"use client";

import { useEffect, useRef, useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

/**
 * A sliding extension menu component that expands and collapses with animation.
 * Closes when clicked outside the menu area.
 *
 * @component
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - The content to be displayed inside the sliding menu
 * @param {Function} props.onExpand - Callback function triggered when the menu expands
 * @param {Function} props.onClose - Callback function triggered when the menu closes
 * @param {string} props.className - Additional CSS classes to apply to the container
 *
 * @returns {JSX.Element} A sliding extension menu with animation and click-outside behavior
 *
 * @example
 * <SlidingExtensionMenu
 *   onExpand={() => console.log('Menu expanded')}
 *   onClose={() => console.log('Menu closed')}
 *   className="custom-class"
 * >
 *   <MenuContent />
 * </SlidingExtensionMenu>
 */
function SlidingExtensionMenu({ children, onExpand, onClose, className }) {
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
      <div className="relative flex h-full w-full items-center justify-center">
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent click from propagating to the document
            setIsExpanded(true);
            onExpand();
          }}
        >
          <HiOutlineDotsHorizontal />
        </button>

        <div
          ref={containerRef}
          className={`absolute right-0 top-0 flex h-full transform items-center justify-center overflow-hidden rounded-xl border border-primary_dark bg-primary_light shadow-md_custom transition-transform duration-300 ${
            isExpanded
              ? "translate-x-[12px] opacity-100"
              : "translate-x-full opacity-0"
          }`}
        >
          <button
            className="rounded-xl px-2 py-2 hover:bg-primary"
            onClick={() => setIsExpanded(false)}
          >
            <IoClose className="h-5 w-5" />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}

export default SlidingExtensionMenu;
