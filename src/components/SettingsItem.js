"use client";

import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

function SettingsItem({ children, title, icon }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex flex-col items-start gap-2 text-base text-text_light">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center justify-start gap-3">
          {icon}
          <span>{title}</span>
        </div>
        <button
          className="rounded-md p-1 hover:bg-primary hover:text-text"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <IoIosArrowDown className="h-5 w-5" />
        </button>
      </div>

      {isExpanded && (
        <div className="flex w-full flex-col items-center justify-start gap-1">
          {children}
        </div>
      )}
    </div>
  );
}

export default SettingsItem;
