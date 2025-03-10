import { updateTheme } from "@/redux/uiSlice";
import { useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

function BtnThemeSwitcher() {
  const { theme } = useSelector((state) => state.ui);
  const { currentUser: user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const isDarkMode = theme === "dark";

  const toggleTheme = () => {
    dispatch(
      updateTheme({
        user_id: user.id,
        themeName: isDarkMode ? "light" : "dark",
      }),
    );
  };

  return (
    <div className="flex items-center justify-center rounded-xl bg-primary px-4 py-3">
      <button
        onClick={toggleTheme}
        className={`relative h-7 w-16 rounded-full shadow-inner transition-colors duration-500 ${
          isDarkMode ? "bg-background" : "bg-primary_dark"
        }`}
      >
        <span
          className={`absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300 ${
            isDarkMode ? "translate-x-[180%]" : ""
          }`}
        >
          {isDarkMode ? (
            <FaMoon className="text-sm text-gray-800" />
          ) : (
            <FaSun className="text-sm text-text" />
          )}
        </span>
      </button>
    </div>
  );
}

export default BtnThemeSwitcher;
