import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useTodoStore } from "@/store/useTodoStore";

export const CalendarWidget = () => {
  const selectedDate = useTodoStore((state) => state.selectedDate);
  const setSelectedDate = useTodoStore((state) => state.setSelectedDate);

  const handleDateChange = (date) => {
    const offset = date.getTimezoneOffset() * 60000;
    const formattedDate = new Date(date.getTime() - offset)
      .toISOString()
      .split("T")[0];
    setSelectedDate(formattedDate);
  };

  return (
    <div className="calendar-widget">
      <Calendar
        onChange={handleDateChange}
        value={selectedDate ? new Date(selectedDate) : null}
        formatDay={(locale, date) => date.getDate()}
      />
      <button
        className={`reset-date-btn ${!selectedDate ? "active" : ""}`}
        onClick={() => setSelectedDate("")}
      >
        전체 날짜 일정 보기
      </button>
    </div>
  );
};
