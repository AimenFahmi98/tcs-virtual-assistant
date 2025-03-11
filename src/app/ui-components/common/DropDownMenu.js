import React, { useState, useRef, useEffect } from "react";

/**
 * A reusable dropdown menu component that opens when clicked and closes when clicking outside.
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.trigger - The element that triggers the menu to open/close when clicked
 * @param {React.ReactNode} props.children - The content to be displayed inside the dropdown menu
 * @returns {JSX.Element} A dropdown menu component with click-outside behavior
 *
 * @example
 * <ClickableMenu trigger={<button>Open Menu</button>}>
 *   <div>Menu content</div>
 * </ClickableMenu>
 */
function DropDownMenu({ trigger, children, isMenuOpen = false }) {
  const [isOpen, setIsOpen] = useState(isMenuOpen);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    setIsOpen(isMenuOpen);
    console.log("isMenuOpen", isMenuOpen);
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ position: "relative" }}>
      <div ref={triggerRef} onClick={toggleMenu}>
        {trigger}
      </div>
      {isOpen && (
        <div
          ref={menuRef}
          className="rounded-xl bg-background"
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            zIndex: 1000,
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            padding: "8px",
            minWidth: "100%",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default DropDownMenu;
