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

// 오늘 날짜를 'YYYY-MM-DD' 형식으로 가져오는 헬퍼 함수
const getTodayStr = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset() * 60000;
  return new Date(today.getTime() - offset).toISOString().split("T")[0];
};

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
  const setSelectedDate = useTodoStore((state) => state.setSelectedDate);
  const isDarkMode = useTodoStore((state) => state.isDarkMode);
  const viewMode = useTodoStore((state) => state.viewMode);
  const setViewMode = useTodoStore((state) => state.setViewMode);

  const subscribeToTodos = useTodoStore((state) => state.subscribeToTodos);
  const isCloudSynced = useTodoStore((state) => state.isCloudSynced);

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

  // ✅ 대시보드 요약 카드용 실시간 통계 계산 (미완료 일정 기준)
  const todayStr = getTodayStr();
  const activeTodos = todos.filter((t) => !t.isDone);
  const todayCount = activeTodos.filter((t) => t.date === todayStr).length;
  const overdueCount = activeTodos.filter(
    (t) => t.date && t.date < todayStr,
  ).length;
  const pinnedCount = activeTodos.filter((t) => Boolean(t.isPinned)).length;
  const totalActiveCount = activeTodos.length;

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
              {/* ✅ 상단 미니 대시보드 요약 카드 4종 */}
              <section className="summary-dashboard">
                <div
                  className={`summary-card card-today ${selectedDate === todayStr ? "selected" : ""}`}
                  onClick={() =>
                    setSelectedDate(selectedDate === todayStr ? "" : todayStr)
                  }
                  title="클릭하여 오늘 일정만 보기 / 해제"
                >
                  <div className="summary-card-header">
                    <span className="summary-label">오늘 마감</span>
                    <span className="summary-icon">🔥</span>
                  </div>
                  <div className="summary-value">
                    {todayCount}
                    <span className="summary-unit">건</span>
                  </div>
                </div>

                <div className="summary-card card-overdue">
                  <div className="summary-card-header">
                    <span className="summary-label">지연된 일정</span>
                    <span className="summary-icon">🚨</span>
                  </div>
                  <div className="summary-value">
                    {overdueCount}
                    <span className="summary-unit">건</span>
                  </div>
                </div>

                <div className="summary-card card-pinned">
                  <div className="summary-card-header">
                    <span className="summary-label">중요 고정</span>
                    <span className="summary-icon">⭐</span>
                  </div>
                  <div className="summary-value">
                    {pinnedCount}
                    <span className="summary-unit">건</span>
                  </div>
                </div>

                <div
                  className={`summary-card card-active ${!selectedDate && filter === "active" ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedDate("");
                    setFilter("active");
                  }}
                  title="클릭하여 전체 남은 할 일 보기"
                >
                  <div className="summary-card-header">
                    <span className="summary-label">남은 할 일</span>
                    <span className="summary-icon">⏳</span>
                  </div>
                  <div className="summary-value">
                    {totalActiveCount}
                    <span className="summary-unit">건</span>
                  </div>
                </div>
              </section>

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
