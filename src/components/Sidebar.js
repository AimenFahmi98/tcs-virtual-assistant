"use client";

import { useState } from "react";
import BtnOpenSidebar from "./BtnOpenSidebar";

function Sidebar({ children, className }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <div
        className={`flex h-screen flex-col justify-start bg-primary_light transition-all duration-300 ease-out ${
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
