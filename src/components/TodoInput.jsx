import { useState } from "react";
import { useTodoStore } from "@/store/useTodoStore";

const CATEGORIES = ["업무", "공부", "개인", "약속", "중요", "기타"];

export const TodoInput = () => {
  const addTodo = useTodoStore((state) => state.addTodo);
  const selectedDate = useTodoStore((state) => state.selectedDate);

  const [inputText, setInputText] = useState("");
  const [inputDate, setInputDate] = useState(selectedDate || "");
  const [category, setCategory] = useState("업무"); // 기본 선택값

  const [prevSelectedDate, setPrevSelectedDate] = useState(selectedDate);

  if (selectedDate !== prevSelectedDate) {
    setPrevSelectedDate(selectedDate);
    setInputDate(selectedDate || "");
  }

  const handleAdd = () => {
    if (inputText.trim() === "" || inputDate === "") {
      alert("날짜와 일정 내용을 모두 입력해주세요!");
      return;
    }
    addTodo(inputText, inputDate, category);
    setInputText("");
    setInputDate(selectedDate || "");
  };

  return (
    <div className="input-section">
      <div className="date-input-wrapper">
        <input
          type="date"
          value={inputDate}
          onChange={(e) => setInputDate(e.target.value)}
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
          <span>{inputDate || "연도-월-일"}</span>
          <span className="calendar-icon">📅</span>
        </div>
      </div>

      {/* ✅ 카테고리 선택 드롭다운 */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="category-select"
      >
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        placeholder="새로운 일정을 입력하세요 (예: 프로젝트 회의)"
        className="text-input"
      />
      <button onClick={handleAdd} className="add-btn">
        일정 추가
      </button>
    </div>
  );
};
