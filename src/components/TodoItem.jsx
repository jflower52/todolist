import { useState } from "react";
import { useTodoStore } from "@/store/useTodoStore";

const CATEGORIES = ["업무", "공부", "개인", "약속", "중요", "기타"];

export const TodoItem = ({ todo }) => {
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  const updateTodo = useTodoStore((state) => state.updateTodo);

  const currentCategory = todo.category || "기타";

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editDate, setEditDate] = useState(todo.date);
  const [editCategory, setEditCategory] = useState(currentCategory);

  const handleSave = () => {
    if (editText.trim() === "" || editDate === "") {
      alert("날짜와 일정 내용을 모두 입력해주세요!");
      return;
    }
    updateTodo(todo.id, editText, editDate, editCategory);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setEditDate(todo.date);
    setEditCategory(currentCategory);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <li className="todo-item editing">
        <div className="edit-inputs">
          <div className="date-input-wrapper">
            <input
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              onClick={(e) => {
                try {
                  e.target.showPicker();
                } catch {
                  /* ignore */
                }
              }}
              className="hidden-date-input"
            />
            <div className="date-display">{editDate || "날짜 선택"}</div>
          </div>

          <select
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
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
      {/* 상단 좌측: 체크박스, 날짜, 카테고리 뱃지 */}
      <div onClick={() => toggleTodo(todo.id)} className="todo-meta">
        <div className="checkbox">✔</div>
        <span className="todo-date-badge">{todo.date}</span>
        <span className={`category-badge cat-${currentCategory}`}>
          {currentCategory}
        </span>
      </div>

      {/* 본문: 일정 텍스트 */}
      <div onClick={() => toggleTodo(todo.id)} className="todo-body">
        <span className="todo-text">{todo.text}</span>
      </div>

      {/* 상단 우측: 수정 및 삭제 버튼 */}
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
