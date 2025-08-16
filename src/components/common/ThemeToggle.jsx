import React, { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { isDarkMode, toggleDarkMode, initTheme } from "../../lib/theme";
import { useI18n } from "../../hooks/useI18n";

const ThemeToggle = () => {
  const darkMode = useStore(isDarkMode);
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    // Marcar que el componente está montado
    setIsMounted(true);

    // Inicializar el tema cuando el componente se monta
    if (typeof window !== "undefined") {
      initTheme();
    }

    // Forzar una re-renderización si el tema cambia a través del localStorage
    const handleStorageChange = (e) => {
      if (e.key === "theme") {
        const newIsDark = e.newValue === "dark";
        if (darkMode !== newIsDark) {
          isDarkMode.set(newIsDark);
        }
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorageChange);
      }
    };
  }, [darkMode]);

  // Función segura para manejar el cambio de tema
  const handleToggleTheme = (e) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      toggleDarkMode();
    }
  };

  // Renderizar un skeleton hasta que el componente esté montado
  if (!isMounted) {
    return (
      <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
          />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggleTheme}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none"
      title={darkMode ? t("light_mode") : t("dark_mode")}
    >
      {darkMode ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
          />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;
