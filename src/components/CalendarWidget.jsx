import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useTodoStore } from "@/store/useTodoStore";

export const CalendarWidget = ({ isLarge = false }) => {
  const selectedDate = useTodoStore((state) => state.selectedDate);
  const setSelectedDate = useTodoStore((state) => state.setSelectedDate);
  const todos = useTodoStore((state) => state.todos);

  const handleDateChange = (date) => {
    const offset = date.getTimezoneOffset() * 60000;
    const formattedDate = new Date(date.getTime() - offset)
      .toISOString()
      .split("T")[0];
    setSelectedDate(formattedDate);
  };

  const addContentToTile = ({ date, view }) => {
    if (view === "month") {
      const offset = date.getTimezoneOffset() * 60000;
      const formattedDate = new Date(date.getTime() - offset)
        .toISOString()
        .split("T")[0];
      const dayTodos = todos.filter((todo) => todo.date === formattedDate);

      if (dayTodos.length === 0) return null;

      // 넓은 캘린더 뷰일 때는 텍스트 블록을 보여줍니다.
      if (isLarge) {
        return (
          <div className="calendar-tasks-preview">
            {dayTodos.slice(0, 3).map((todo) => (
              <div
                key={todo.id}
                className={`preview-task ${todo.isDone ? "done" : ""}`}
              >
                {todo.text}
              </div>
            ))}
            {dayTodos.length > 3 && (
              <div className="preview-more">
                +{dayTodos.length - 3}개 더보기
              </div>
            )}
          </div>
        );
      }

      // 작은 캘린더 뷰일 때는 기존처럼 점만 보여줍니다.
      return (
        <div className="calendar-marker-container">
          <div className="calendar-marker"></div>
        </div>
      );
    }
    return null;
  };

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
    </div>
  );
};
