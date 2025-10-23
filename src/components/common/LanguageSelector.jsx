import React, { useState, useEffect, useRef } from "react";
import { useStore } from "@nanostores/react";
import {
  currentLanguage,
  changeLanguage,
  initLanguage,
} from "../../lib/language";
import { useI18n } from "../../hooks/useI18n";

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Estado para saber si ya se montó en cliente
  const [mounted, setMounted] = useState(false);
  const [currentLang, setCurrentLang] = useState("es");

  // Store
  const langFromStore = useStore(currentLanguage);

  useEffect(() => {
    // Iniciamos una única vez y usamos localStorage para evitar mismatch
    initLanguage();
    const storedLang = localStorage.getItem("lang") || "es";
    setCurrentLang(storedLang);
    setMounted(true);
  }, []);

  // Elegimos qué idioma mostrar
  const lang = mounted ? langFromStore : currentLang;

  const { t } = useI18n(lang);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLanguageChange = (newLang) => {
    try {
      changeLanguage(newLang);
      setIsOpen(false);
    } catch (error) {
      console.error("Error al cambiar el idioma:", error);
      window.location.reload();
    }
  };

  // Render inicial sencillo para evitar hidratación incorrecta
  if (!mounted) {
    return (
      <div className="relative">
        <button
          className="flex items-center space-x-1 text-red-500 hover:text-red-600 transition focus:outline-none"
          aria-label="Seleccionar idioma"
        >
          <span className="uppercase font-bold">es</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-1 text-red-500 hover:text-red-600 transition focus:outline-none"
        aria-label={t("select_language")}
      >
        <span className="uppercase font-bold">{lang}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-24 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              onClick={() => handleLanguageChange("es")}
              className={`block px-4 py-2 text-sm w-full text-left ${
                lang === "es"
                  ? "text-red-500 font-medium"
                  : "text-gray-800 dark:text-white"
              } hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
              role="menuitem"
            >
              Español
            </button>
            <button
              onClick={() => handleLanguageChange("ca")}
              className={`block px-4 py-2 text-sm w-full text-left ${
                lang === "ca"
                  ? "text-red-500 font-medium"
                  : "text-gray-800 dark:text-white"
              } hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
              role="menuitem"
            >
              Català
            </button>
            <button
              onClick={() => handleLanguageChange("en")}
              className={`block px-4 py-2 text-sm w-full text-left ${
                lang === "en"
                  ? "text-red-500 font-medium"
                  : "text-gray-800 dark:text-white"
              } hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
              role="menuitem"
            >
              English
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
