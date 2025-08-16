import React from "react";
import { useStore } from "@nanostores/react";
import { isDarkMode } from "../../lib/theme";

const Spinner = () => {
  const darkMode = useStore(isDarkMode);

  return (
    <div className="flex justify-center items-center h-40">
      <div
        className={`w-12 h-12 rounded-full animate-spin border-4 border-solid ${
          darkMode
            ? "border-white border-t-transparent"
            : "border-primary border-t-transparent"
        }`}
      ></div>
    </div>
  );
};

export default Spinner;
