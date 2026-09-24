import { useTodoStore } from "@/store/useTodoStore";

export const ThemeToggle = () => {
  const isDarkMode = useTodoStore((state) => state.isDarkMode);
  const toggleDarkMode = useTodoStore((state) => state.toggleDarkMode);

  return (
    <button className="theme-toggle-btn" onClick={toggleDarkMode}>
      {isDarkMode ? "☀️ 라이트 모드" : "🌙 다크 모드"}
    </button>
  );
};
