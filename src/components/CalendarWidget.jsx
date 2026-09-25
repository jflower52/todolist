import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useTodoStore } from "@/store/useTodoStore";

export const CalendarWidget = ({ isLarge = false }) => {
  const selectedDate = useTodoStore((state) => state.selectedDate);
  const setSelectedDate = useTodoStore((state) => state.setSelectedDate);
  const todos = useTodoStore((state) => state.todos);
  const categories = useTodoStore((state) => state.categories);
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);

  const [popover, setPopover] = useState({
    isOpen: false,
    date: "",
    x: 0,
    y: 0,
  });

  // 태그 이름에 맞는 커스텀 색상 반환 헬퍼
  const getTagColor = (todo) => {
    const catName = todo.category || "기타";
    const matched = categories.find((c) => c.name === catName);
    return matched?.color || todo.categoryColor || "#6b7280";
  };

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

  const handleMoreClick = (e, formattedDate) => {
    e.stopPropagation();
    setSelectedDate(formattedDate);

    const rect = e.currentTarget.getBoundingClientRect();
    const popWidth = 280;
    const popHeight = 260;

    let x = rect.left;
    let y = rect.bottom + 6;

    if (x + popWidth > window.innerWidth - 20) {
      x = window.innerWidth - popWidth - 20;
    }
    if (y + popHeight > window.innerHeight - 20) {
      y = rect.top - popHeight - 6;
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
            {dayTodos.slice(0, 2).map((todo) => {
              const color = getTagColor(todo);
              return (
                <div
                  key={todo.id}
                  className={`preview-task ${todo.isDone ? "done" : ""}`}
                  style={!todo.isDone ? { backgroundColor: color } : undefined}
                >
                  {todo.text}
                </div>
              );
            })}
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

      {isLarge && popover.isOpen && (
        <div
          className="calendar-popover"
          style={{ top: `${popover.y}px`, left: `${popover.x}px` }}
          onClick={(e) => e.stopPropagation()}
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
              const color = getTagColor(todo);
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
                    <span
                      className="category-badge small"
                      style={{
                        backgroundColor: `${color}24`,
                        color: color,
                        border: `1px solid ${color}40`,
                      }}
                    >
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
