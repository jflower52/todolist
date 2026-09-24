import { useState } from "react";
import { useTodoStore } from "@/store/useTodoStore";

export const TodoItem = ({ todo }) => {
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  const updateTodo = useTodoStore((state) => state.updateTodo);

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editDate, setEditDate] = useState(todo.date);

  const handleSave = () => {
    if (editText.trim() === "" || editDate === "") {
      alert("날짜와 일정 내용을 모두 입력해주세요!");
      return;
    }
    updateTodo(todo.id, editText, editDate);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setEditDate(todo.date);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <li className="todo-item editing">
        <div className="edit-inputs">
          <input
            type="date"
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
            className="date-input"
          />
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="text-input"
          />
        </div>
        <div className="todo-actions">
          <button onClick={handleSave} className="save-btn">
            저장
          </button>
          <button onClick={handleCancel} className="cancel-btn">
            취소
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className={`todo-item ${todo.isDone ? "done" : ""}`}>
      <div onClick={() => toggleTodo(todo.id)} className="todo-content">
        <div className="checkbox">✔</div>
        <span className="todo-date-badge">{todo.date}</span>
        <span className="todo-text">{todo.text}</span>
      </div>
      <div className="todo-actions">
        <button onClick={() => setIsEditing(true)} className="edit-btn">
          수정
        </button>
        <button onClick={() => deleteTodo(todo.id)} className="delete-btn">
          삭제
        </button>
      </div>
    </li>
  );
};
