"use client";

import { getTheme, replaceTheme } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { IoCheckmark } from "react-icons/io5";

import {
  MdOutlineLightMode,
  MdNightlightRound,
  MdOutlineWbTwilight,
} from "react-icons/md";

/**
 * Retrieves theme colors from CSS variables based on the specified theme.
 * @param {string} theme - The theme name to set as data-theme attribute.
 * @returns {Object} An object containing theme colors with the following properties:
 *   @property {string} primary - The primary color
 *   @property {string} primaryLight - The light variant of primary color
 *   @property {string} primaryDarker - The darker variant of primary color
 *   @property {string} accent - The accent color
 *   @property {string} background - The background color
 *   @property {string} text - The main text color
 *   @property {string} textLight - The light variant of text color
 */
function getThemeColors(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const rootStyles = getComputedStyle(document.documentElement);
  return {
    primary: rootStyles.getPropertyValue("--color-primary").trim(),
    primaryLight: rootStyles.getPropertyValue("--color-primary-light").trim(),
    primaryDarker: rootStyles.getPropertyValue("--color-primary-darker").trim(),
    accent: rootStyles.getPropertyValue("--color-accent").trim(),
    background: rootStyles.getPropertyValue("--color-background").trim(),
    text: rootStyles.getPropertyValue("--color-text").trim(),
    textLight: rootStyles.getPropertyValue("--color-text-light").trim(),
  };
}

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
  const [theme, setTheme] = useState();
  const [themeColors, setThemeColors] = useState({});

  const switchTheme = async (themeName) => {
    setTheme(themeName);
    document.documentElement.setAttribute("data-theme", themeName);
    await replaceTheme(themeName);
  };

  useEffect(() => {
    async function fetchedTheme() {
      const response = await getTheme();
      if (response) {
        setTheme(response.data);
      }
    }
    fetchedTheme();
  }, []);

  useEffect(() => {
    const updatedColors = {};
    themes.forEach(({ name }) => {
      updatedColors[name] = getThemeColors(name);
    });
    setThemeColors(updatedColors);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="flex gap-8">
      {themes.map(({ name, label, Icon }) => (
        <ThemeButton
          key={name}
          themeName={name}
          label={label}
          Icon={Icon}
          colors={themeColors[name]}
          isSelected={name === theme}
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
function ThemeButton({ label, Icon, colors, onClick, isSelected }) {
  // Create an array of color values from the colors object (excluding undefined or null values)
  const colorCircles = Object.values(colors || {}).filter((color) => color);

  return (
    <button
      className={`flex flex-col items-center justify-center gap-3 rounded-2xl p-6 shadow-xl ${isSelected && "border-4 border-primary_dark"} relative`}
      style={{ background: colors?.primary || "transparent" }}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 self-start">
        <Icon className="h-6 w-6" style={{ color: colors?.text }} />
        <span style={{ color: colors?.text }}>{label}</span>
      </div>
      <div className="mt-2 flex -space-x-4">
        {colorCircles.map((color, index) => (
          <div
            key={index}
            className="h-10 w-10 rounded-full border border-gray-400"
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
