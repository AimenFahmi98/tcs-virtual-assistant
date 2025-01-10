"use client";

import { useEffect, useRef, useState } from "react";

function getThemeColors(theme) {
  const rootStyles = getComputedStyle(document.documentElement);
  document.documentElement.setAttribute("data-theme", theme);

  return {
    primary: rootStyles.getPropertyValue("--color-primary").trim(),
    secondary: rootStyles.getPropertyValue("--color-secondary").trim(),
    background: rootStyles.getPropertyValue("--color-background").trim(),
  };
}

function ThemePicker() {
  const [theme, setTheme] = useState("theme1");
  const buttonsRef = useRef([]);

  const switchTheme = (themeName) => {
    setTheme(themeName);
    document.documentElement.setAttribute("data-theme", themeName);
  };

  useEffect(() => {
    const themes = ["theme1", "theme2", "theme3"];

    themes.forEach((themeName, index) => {
      const colors = getThemeColors(themeName);
      const button = buttonsRef.current[index];
      if (button) {
        button.style.background = colors.primary;
      }
    });

    switchTheme("theme1");
  }, []);

  return (
    <div className="mx-8 flex flex-col items-start justify-center gap-8 text-xl">
      <div className="flex h-full flex-col items-center justify-end">
        <div className="mb-24 flex gap-8">
          {["theme1", "theme2", "theme3"].map((themeName, index) => (
            <button
              key={themeName}
              ref={(el) => (buttonsRef.current[index] = el)}
              className="h-16 w-16 rounded-2xl shadow-lg"
              onClick={() => switchTheme(themeName)}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ThemePicker;
