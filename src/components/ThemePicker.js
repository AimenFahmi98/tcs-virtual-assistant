"use client";

import { useEffect, useState } from "react";
import { BiCheck } from "react-icons/bi";
import { IoCheckmark } from "react-icons/io5";
import { GiCheckMark } from "react-icons/gi";

import {
  MdOutlineLightMode,
  MdNightlightRound,
  MdOutlineWbTwilight,
} from "react-icons/md";

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

const themes = [
  { name: "light", label: "Light Mode", Icon: MdOutlineLightMode },
  { name: "spring", label: "Spring Mode", Icon: MdOutlineWbTwilight },
  { name: "dark", label: "Dark Mode", Icon: MdNightlightRound },
];

function ThemePicker() {
  const [theme, setTheme] = useState("light");
  const [themeColors, setThemeColors] = useState({});

  const switchTheme = (themeName) => {
    setTheme(themeName);
    document.documentElement.setAttribute("data-theme", themeName);
  };

  useEffect(() => {
    const updatedColors = {};
    themes.forEach(({ name }) => {
      updatedColors[name] = getThemeColors(name);
    });
    setThemeColors(updatedColors);
    document.documentElement.setAttribute("data-theme", theme); // Reset to current theme
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
          onClick={() => switchTheme(name)}
        />
      ))}
    </div>
  );
}

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
