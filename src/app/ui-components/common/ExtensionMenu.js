import { useState, useRef, useEffect } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

function ExtensionMenu({ children, className, onOpen }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        className={`absolute rounded-full p-1`}
        onClick={() => {
          onOpen();
          setIsOpen(!isOpen);
        }}
        aria-label="Menu"
      >
        <HiOutlineDotsHorizontal className="h-5 w-5" />
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-1 -translate-y-[8px] translate-x-[40px] rounded-lg p-1 shadow-lg">
          <div className="flex flex-col">{children}</div>
        </div>
      )}
    </div>
  );
}

export default ExtensionMenu;
