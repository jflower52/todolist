import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useTodoStore } from "@/store/useTodoStore";

export const CalendarWidget = ({ isLarge = false }) => {
  const selectedDate = useTodoStore((state) => state.selectedDate);
  const setSelectedDate = useTodoStore((state) => state.setSelectedDate);
  const todos = useTodoStore((state) => state.todos);
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);

  // ✅ 플로팅 팝오버 상태 (열린 날짜, 띄울 화면 좌표)
  const [popover, setPopover] = useState({
    isOpen: false,
    date: "",
    x: 0,
    y: 0,
  });

  // 팝오버 바깥 영역 클릭 시 자동으로 닫기
  useEffect(() => {
    const handleClickOutside = () => {
      if (popover.isOpen) {
        setPopover((prev) => ({ ...prev, isOpen: false }));
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [popover.isOpen]);

  const handleDateChange = (date) => {
    const offset = date.getTimezoneOffset() * 60000;
    const formattedDate = new Date(date.getTime() - offset)
      .toISOString()
      .split("T")[0];
    setSelectedDate(formattedDate);
  };

  // ✅ '+N개 더보기' 클릭 시 실행되는 함수
  const handleMoreClick = (e, formattedDate) => {
    e.stopPropagation(); // 부모 이벤트를 막아 팝오버가 즉시 닫히는 현상 방지
    setSelectedDate(formattedDate); // 좌측 사이드바도 해당 날짜로 동기화

    const rect = e.currentTarget.getBoundingClientRect();
    const popWidth = 280;
    const popHeight = 260;

    // 화면 오른쪽이나 아래쪽 끝을 넘어가지 않도록 스마트하게 위치 보정
    let x = rect.left;
    let y = rect.bottom + 6;

    if (x + popWidth > window.innerWidth - 20) {
      x = window.innerWidth - popWidth - 20;
    }
    if (y + popHeight > window.innerHeight - 20) {
      y = rect.top - popHeight - 6; // 아래 공간이 부족하면 위쪽으로 띄움
    }

    setPopover({
      isOpen: true,
      date: formattedDate,
      x: Math.max(16, x),
      y: Math.max(16, y),
    });
  };

  const addContentToTile = ({ date, view }) => {
    if (view === "month") {
      const offset = date.getTimezoneOffset() * 60000;
      const formattedDate = new Date(date.getTime() - offset)
        .toISOString()
        .split("T")[0];
      const dayTodos = todos.filter((todo) => todo.date === formattedDate);

      if (dayTodos.length === 0) return null;

      if (isLarge) {
        return (
          <div className="calendar-tasks-preview">
            {/* ✅ 글자 잘림 방지를 위해 칸 안에는 최대 2개까지만 여유 있게 표시 */}
            {dayTodos.slice(0, 2).map((todo) => {
              const cat = todo.category || "기타";
              return (
                <div
                  key={todo.id}
                  className={`preview-task cat-${cat} ${todo.isDone ? "done" : ""}`}
                >
                  {todo.text}
                </div>
              );
            })}
            {/* ✅ 3개 이상일 때 '+N개 더보기' 버튼 표시 */}
            {dayTodos.length > 2 && (
              <div
                className="preview-more"
                onClick={(e) => handleMoreClick(e, formattedDate)}
              >
                +{dayTodos.length - 2}개 더보기
              </div>
            )}
          </div>
        );
      }

      return (
        <div className="calendar-marker-container">
          <div className="calendar-marker"></div>
        </div>
      );
    }
    return null;
  };

  // 현재 팝오버에 표시할 해당 날짜의 일정 목록
  const popoverTodos = popover.date
    ? todos.filter((t) => t.date === popover.date)
    : [];

  return (
    <div className="calendar-widget">
      <Calendar
        className={isLarge ? "large-calendar" : ""}
        onChange={handleDateChange}
        value={selectedDate ? new Date(selectedDate) : null}
        formatDay={(locale, date) => date.getDate()}
        tileContent={addContentToTile}
      />
      {!isLarge && (
        <button
          className={`reset-date-btn ${!selectedDate ? "active" : ""}`}
          onClick={() => setSelectedDate("")}
        >
          전체 날짜 일정 보기
        </button>
      )}

      {/* ✅ 구글 캘린더 스타일 플로팅 팝오버(Popover) 창 */}
      {isLarge && popover.isOpen && (
        <div
          className="calendar-popover"
          style={{ top: `${popover.y}px`, left: `${popover.x}px` }}
          onClick={(e) => e.stopPropagation()} // 팝오버 내부 클릭 시 닫히지 않게 보호
        >
          <div className="popover-header">
            <span className="popover-date">
              📅 {popover.date} ({popoverTodos.length})
            </span>
            <button
              className="popover-close"
              onClick={() => setPopover((prev) => ({ ...prev, isOpen: false }))}
            >
              ✕
            </button>
          </div>

          <div className="popover-list">
            {popoverTodos.map((todo) => {
              const cat = todo.category || "기타";
              return (
                <div
                  key={todo.id}
                  className={`popover-item ${todo.isDone ? "done" : ""}`}
                >
                  <div
                    className="popover-item-left"
                    onClick={() => toggleTodo(todo.id)}
                  >
                    <div className="checkbox small">✔</div>
                    <span className={`category-badge small cat-${cat}`}>
                      {cat}
                    </span>
                    <span className="popover-text">{todo.text}</span>
                  </div>
                  <button
                    className="popover-del-btn"
                    onClick={() => deleteTodo(todo.id)}
                    title="일정 삭제"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
