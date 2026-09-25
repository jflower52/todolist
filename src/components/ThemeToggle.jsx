import { useTodoStore } from "@/store/useTodoStore";

export const ThemeToggle = () => {
  const isDarkMode = useTodoStore((state) => state.isDarkMode);
  const toggleDarkMode = useTodoStore((state) => state.toggleDarkMode);

  return (
    <button
      onClick={toggleDarkMode}
      className="theme-toggle-btn"
      title={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
      aria-label="테마 전환"
    >
      {isDarkMode ? "☀️" : "🌙"}
    </button>
  );
};
