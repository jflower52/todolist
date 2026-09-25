import { useEffect } from "react";
import { TodoInput } from "@/components/TodoInput";
import { TodoList } from "@/components/TodoList";
import { CalendarWidget } from "@/components/CalendarWidget";
import { ProgressBar } from "@/components/ProgressBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTodoStore } from "@/store/useTodoStore";
import "./App.css";

const FILTER_CATEGORIES = [
  "전체",
  "업무",
  "공부",
  "개인",
  "약속",
  "중요",
  "기타",
];

function App() {
  const todos = useTodoStore((state) => state.todos);
  const filter = useTodoStore((state) => state.filter);
  const setFilter = useTodoStore((state) => state.setFilter);
  const categoryFilter = useTodoStore((state) => state.categoryFilter);
  const setCategoryFilter = useTodoStore((state) => state.setCategoryFilter);
  const searchQuery = useTodoStore((state) => state.searchQuery);
  const setSearchQuery = useTodoStore((state) => state.setSearchQuery);
  const clearCompleted = useTodoStore((state) => state.clearCompleted);

  const selectedDate = useTodoStore((state) => state.selectedDate);
  const isDarkMode = useTodoStore((state) => state.isDarkMode);
  const viewMode = useTodoStore((state) => state.viewMode);
  const setViewMode = useTodoStore((state) => state.setViewMode);

  const subscribeToTodos = useTodoStore((state) => state.subscribeToTodos);
  const isCloudSynced = useTodoStore((state) => state.isCloudSynced);

  // ✅ 앱 시작 시 파이어베이스 실시간 동기화 연결
  useEffect(() => {
    const unsubscribe = subscribeToTodos();
    return () => unsubscribe();
  }, [subscribeToTodos]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [isDarkMode]);

  const completedCount = todos.filter((todo) =>
    selectedDate ? todo.date === selectedDate && todo.isDone : todo.isDone,
  ).length;

  const renderListControls = () => (
    <div className="list-controls">
      <div className="search-bar-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="일정 키워드 검색..."
          className="search-input"
        />
        {searchQuery && (
          <button
            className="search-clear-btn"
            onClick={() => setSearchQuery("")}
            title="검색어 지우기"
          >
            ✕
          </button>
        )}
      </div>

      <div className="category-filter-chips">
        {FILTER_CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`chip-btn ${categoryFilter === cat ? "active" : ""}`}
            onClick={() => setCategoryFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="filter-tabs-row">
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

        {completedCount > 0 && (
          <button className="clear-completed-btn" onClick={clearCompleted}>
            🗑️ 완료 비우기 ({completedCount})
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="app-container">
      {/* ⬅️ 왼쪽 사이드바 */}
      <aside className="app-sidebar">
        <div className="sidebar-header">
          <div>
            <h1>📅 나의 일정</h1>
            <span
              style={{
                fontSize: "11px",
                color: isCloudSynced ? "#10b981" : "var(--text-muted)",
                fontWeight: 600,
              }}
            >
              {isCloudSynced
                ? "☁️ 클라우드 실시간 연동 중"
                : "⏳ 클라우드 연결 중..."}
            </span>
          </div>
          <ThemeToggle />
        </div>

        <div className="view-toggle-group">
          <button
            className={viewMode === "list" ? "active" : ""}
            onClick={() => setViewMode("list")}
          >
            📋 리스트 뷰
          </button>
          <button
            className={viewMode === "calendar" ? "active" : ""}
            onClick={() => setViewMode("calendar")}
          >
            📆 캘린더 뷰
          </button>
        </div>

        <div className="sidebar-content">
          {viewMode === "list" ? (
            <>
              <h2 className="menu-title">달력 필터</h2>
              <CalendarWidget isLarge={false} />
            </>
          ) : (
            <div className="sidebar-detail-view">
              <h2 className="menu-title">
                {selectedDate ? `${selectedDate} 상세` : "날짜를 선택해주세요"}
              </h2>
              {selectedDate ? (
                <>
                  <ProgressBar />
                  <TodoInput />
                  <div style={{ marginTop: "24px" }}>
                    {renderListControls()}
                  </div>
                  <TodoList />
                </>
              ) : (
                <div className="empty-state">
                  오른쪽 달력에서
                  <br />
                  날짜를 클릭하여 일정을 관리하세요.
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* ➡️ 오른쪽 메인 작업 영역 */}
      <main className="app-main">
        {viewMode === "list" ? (
          <>
            <div className="main-header">
              <h2>{selectedDate ? `${selectedDate} 일정` : "📂 전체 일정"}</h2>
            </div>
            <div className="main-content">
              <section className="registration-section">
                <ProgressBar />
                <TodoInput />
              </section>
              <section className="list-section">
                {renderListControls()}
                <TodoList />
              </section>
            </div>
          </>
        ) : (
          <>
            <div className="main-header" style={{ maxWidth: "100%" }}>
              <h2>📆 월간 캘린더</h2>
            </div>
            <div className="main-content" style={{ maxWidth: "100%" }}>
              <CalendarWidget isLarge={true} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
