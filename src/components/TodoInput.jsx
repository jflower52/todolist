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
      <input
        type="date"
        value={inputDate}
        onChange={(e) => setInputDate(e.target.value)}
        className="date-input"
      />
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
