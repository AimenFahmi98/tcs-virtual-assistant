"use client";

import { useEffect } from "react";
import { IoCheckmark } from "react-icons/io5";

import {
  MdOutlineLightMode,
  MdNightlightRound,
  MdOutlineWbTwilight,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setTheme, fetchTheme, updateTheme } from "@/redux/uiSlice";

/**
 * Array of theme objects representing different visual modes for the application.
 * @type {Array<{name: string, label: string, Icon: React.ComponentType}>}
 * @constant
 * @description Each theme object contains:
 * - name: The internal identifier for the theme
 * - label: The user-friendly display name for the theme
 * - Icon: A React component representing the theme's icon
 */
const themes = [
  { name: "light", label: "Light Mode", Icon: MdOutlineLightMode },
  { name: "spring", label: "Spring Mode", Icon: MdOutlineWbTwilight },
  { name: "dark", label: "Dark Mode", Icon: MdNightlightRound },
];

/**
 * A component that renders theme selection buttons and manages theme switching functionality.
 * Fetches initial theme on mount and updates theme colors when theme changes.
 * Allows users to switch between different themes and updates the DOM accordingly.
 *
 * @component
 * @returns {JSX.Element} A div containing theme selection buttons
 *
 * @example
 * return (
 *   <ThemePicker />
 * )
 */
function ThemePicker() {
  const dispatch = useDispatch();
  const { theme, themeConfigs, isFetchingCurrentTheme } = useSelector(
    (state) => state.ui,
  );
  const { currentUser: user } = useSelector((state) => state.users);

  const switchTheme = async (themeName) => {
    if (user) {
      document.documentElement.setAttribute("data-theme", themeName);
      dispatch(updateTheme({ user_id: user.id, themeName }));
    }
  };

  useEffect(() => {
    if (user) {
      dispatch(fetchTheme(user.id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (!isFetchingCurrentTheme) {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme, isFetchingCurrentTheme]);

  return (
    <div className="flex gap-8">
      {themes.map(({ name, label, Icon }) => (
        <ThemeButton
          key={name}
          themeName={name}
          label={label}
          Icon={Icon}
          colors={themeConfigs[name]}
          isSelected={name === theme}
          isFetchingCurrentTheme={isFetchingCurrentTheme}
          onClick={async () => await switchTheme(name)}
        />
      ))}
    </div>
  );
}

/**
 * A button component for theme selection that displays theme colors and an icon
 * @param {Object} props - The component props
 * @param {string} props.label - The text label for the theme button
 * @param {React.ComponentType} props.Icon - The icon component to display
 * @param {Object} props.colors - Object containing theme colors
 * @param {string} [props.colors.primary] - Primary theme color
 * @param {string} [props.colors.text] - Text color for the theme
 * @param {Function} props.onClick - Click handler function
 * @param {boolean} props.isSelected - Whether this theme is currently selected
 * @returns {JSX.Element} A theme selection button component
 */
function ThemeButton({
  label,
  Icon,
  colors,
  onClick,
  isSelected,
  isFetchingCurrentTheme,
}) {
  // Create an array of color values from the colors object (excluding undefined or null values)
  const colorCircles = Object.values(colors || {}).filter((color) => color);

  if (isFetchingCurrentTheme) {
    return (
      <div className="flex animate-pulse flex-col items-center justify-center gap-4 rounded-2xl bg-primary p-6 shadow-lg">
        <div className="flex items-center gap-3 self-start">
          <div className="h-6 w-6 rounded-full bg-primary_light" />
          <div className="h-4 w-40 rounded bg-primary_light" />
        </div>
        <div className="mt-2 flex -space-x-5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((_, index) => (
            <div key={index} className="h-8 w-8 rounded-full bg-primary_dark" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <button
      className={`flex flex-col items-center justify-center gap-4 rounded-2xl p-6 shadow-lg ${isSelected && "border-4 border-primary_dark"} relative`}
      style={{ background: colors?.primary || "transparent" }}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 self-start">
        <Icon className="h-6 w-6" style={{ color: colors?.text }} />
        <span style={{ color: colors?.text }}>{label}</span>
      </div>
      <div className="mt-2 flex -space-x-5">
        {colorCircles.map((color, index) => (
          <div
            key={index}
            className="h-8 w-8 rounded-full border border-gray-400"
            style={{
              backgroundColor: color,
            }}
          ></div>
        ))}
      </div>
      {isSelected && (
        <div className="absolute right-0 top-0 -translate-y-[40%] translate-x-[40%] rounded-full bg-primary_dark p-2">
          <IoCheckmark className="h-6 w-6" />
        </div>
      )}
    </button>
  );
}

export default ThemePicker;
