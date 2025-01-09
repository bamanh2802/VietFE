"use client";
import { useEffect, useState } from "react";

// Khai báo kiểu dữ liệu cho hook
const useDarkMode = (): [boolean, () => void] => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // Kiểm tra chế độ từ localStorage khi tải trang
    const darkModeFromStorage = localStorage.getItem("dark-mode") === "true";

    setIsDarkMode(darkModeFromStorage);
    if (darkModeFromStorage) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;

      localStorage.setItem("dark-mode", newMode.toString());
      if (newMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      return newMode;
    });
  };

  return [isDarkMode, toggleDarkMode];
};

export default useDarkMode;
