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
  const selectedDate = useTodoStore((state) => state.selectedDate);
  const isDarkMode = useTodoStore((state) => state.isDarkMode);

  // 새로 추가된 뷰 모드 가져오기
  const viewMode = useTodoStore((state) => state.viewMode);
  const setViewMode = useTodoStore((state) => state.setViewMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [isDarkMode]);

  return (
    <div className="app-container">
      {/* ⬅️ 왼쪽 사이드바 */}
      <aside className="app-sidebar">
        <div className="sidebar-header">
          <h1>📅 나의 일정</h1>
          <ThemeToggle />
        </div>

        {/* 보기 모드 전환 스위치 */}
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
            // 캘린더 뷰일 때의 사이드바 (해당 날짜 상세 패널)
            <div className="sidebar-detail-view">
              <h2 className="menu-title">
                {selectedDate ? `${selectedDate} 상세` : "날짜를 선택해주세요"}
              </h2>
              {selectedDate ? (
                <>
                  <ProgressBar />
                  <TodoInput />
                  <div className="filter-tabs" style={{ marginTop: "24px" }}>
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
              </section>
            </div>
          </>
        ) : (
          // 캘린더 뷰일 때의 메인 영역 (대형 달력)
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
