import { useState } from "react";
import { useTodoStore } from "@/store/useTodoStore";
import { TagSelector } from "./TagSelector";

const getTodayString = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset() * 60000;
  return new Date(today.getTime() - offset).toISOString().split("T")[0];
};

export const TodoInput = () => {
  const [input, setInput] = useState("");
  const categories = useTodoStore((state) => state.categories);
  const [category, setCategory] = useState(categories[0]?.name || "업무");
  const [categoryColor, setCategoryColor] = useState(
    categories[0]?.color || "#3b82f6",
  );

  const addTodo = useTodoStore((state) => state.addTodo);
  const selectedDate = useTodoStore((state) => state.selectedDate);

  // ✅ useEffect 없이 달력 선택 날짜와 직접 입력 날짜를 자동으로 연동
  const [dateOverride, setDateOverride] = useState({ base: null, value: "" });
  const date =
    dateOverride.base === selectedDate && dateOverride.value
      ? dateOverride.value
      : selectedDate || getTodayString();

  const handleDateChange = (newDate) => {
    setDateOverride({ base: selectedDate, value: newDate });
  };

  const handleAdd = () => {
    if (input.trim() === "" || date === "") {
      alert("날짜와 일정 내용을 모두 입력해주세요!");
      return;
    }
    const matchedCat = categories.find((c) => c.name === category);
    const finalColor = matchedCat ? matchedCat.color : categoryColor;

    addTodo(input, date, category, finalColor);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <div className="input-section">
      {/* 1. 날짜 선택 영역 */}
      <div className="date-input-wrapper">
        <input
          type="date"
          value={date}
          onChange={(e) => handleDateChange(e.target.value)}
          onClick={(e) => {
            try {
              e.target.showPicker();
            } catch {
              /* ignore */
            }
          }}
          className="hidden-date-input"
        />
        <div className="date-display">
          <span>{date}</span>
          <span className="calendar-icon">📅</span>
        </div>
      </div>

      {/* 2. 커스텀 태그 & 색상 선택기 */}
      <TagSelector
        selectedTag={category}
        onSelectTag={(name, color) => {
          setCategory(name);
          setCategoryColor(color);
        }}
      />

      {/* 3. 일정 텍스트 입력 */}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="새로운 일정을 입력하세요..."
        className="text-input"
      />

      <button onClick={handleAdd} className="add-btn">
        추가
      </button>
    </div>
  );
};
