import { useEffect } from "react";
import { TodoInput } from "@/components/TodoInput";
import { TodoList } from "@/components/TodoList";
import { CalendarWidget } from "@/components/CalendarWidget";
import { ProgressBar } from "@/components/ProgressBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTodoStore } from "@/store/useTodoStore";
import "./App.css";

function App() {
  const filter = useTodoStore((state) => state.filter);
  const setFilter = useTodoStore((state) => state.setFilter);
  const isDarkMode = useTodoStore((state) => state.isDarkMode);

  // 다크 모드 상태가 바뀔 때마다 HTML 최상단 태그에 속성을 추가/제거합니다.
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [isDarkMode]);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>📅 나의 일정 관리</h1>
        <ThemeToggle />
      </header>

      <div className="dashboard-content">
        <aside className="sidebar">
          <CalendarWidget />
        </aside>

        <main className="main-board">
          <ProgressBar />

          <TodoInput />

          <div className="filter-tabs">
            <button
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              전체
            </button>
            <button
              className={filter === "active" ? "active" : ""}
              onClick={() => setFilter("active")}
            >
              진행 중
            </button>
            <button
              className={filter === "completed" ? "active" : ""}
              onClick={() => setFilter("completed")}
            >
              완료
            </button>
          </div>

          <TodoList />
        </main>
      </div>
    </div>
  );
}

export default App;
