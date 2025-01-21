"use client";

import { useState } from "react";
import BtnOpenSidebar from "@/app/ui-components/BtnOpenSidebar";

/**
 * A responsive sidebar component that can be toggled open/closed.
 * @component
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - The content to be rendered inside the sidebar
 * @param {string} [props.className] - Additional CSS classes to apply to the sidebar container
 * @returns {JSX.Element} A sidebar component with toggle functionality
 */
function Sidebar({ children, className }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <div
        className={`flex h-screen max-h-screen flex-col justify-start overflow-y-hidden overflow-x-visible bg-primary_light transition-all duration-300 ease-out ${
          isOpen ? "w-80" : "w-0"
        } ${className}`}
      >
        {isOpen && children}
      </div>
      <BtnOpenSidebar setIsOpen={setIsOpen} />
    </>
  );
}

export default Sidebar;
