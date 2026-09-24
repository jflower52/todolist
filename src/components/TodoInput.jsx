import { useState } from "react";
import { useTodoStore } from "@/store/useTodoStore";

export const TodoInput = () => {
  const [inputText, setInputText] = useState("");
  const [inputDate, setInputDate] = useState("");

  const addTodo = useTodoStore((state) => state.addTodo);

  const handleAdd = () => {
    if (inputText.trim() === "" || inputDate === "") {
      alert("날짜와 일정 내용을 모두 입력해주세요!");
      return;
    }
    addTodo(inputText, inputDate);
    setInputText("");
    setInputDate("");
  };

  return (
    <div className="input-section">
      <div className="date-input-wrapper">
        <input
          type="date"
          value={inputDate}
          onChange={(e) => setInputDate(e.target.value)}
          onClick={(e) => {
            // 중괄호 안에 주석을 추가하여 Empty block 경고를 해결했습니다.
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
