import { useState } from "react";
import { useTodoStore } from "@/store/useTodoStore";

const CATEGORIES = ["업무", "공부", "개인", "약속", "중요", "기타"];

const getDdayInfo = (dateString, isDone) => {
  if (!dateString || isDone) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, month, day] = dateString.split("-").map(Number);
  const targetDate = new Date(year, month - 1, day);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { text: "D-Day", type: "today" };
  } else if (diffDays > 0) {
    return { text: `D-${diffDays}`, type: "upcoming" };
  } else {
    return { text: `D+${Math.abs(diffDays)}`, type: "overdue" };
  }
};

export const TodoItem = ({ todo }) => {
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const togglePin = useTodoStore((state) => state.togglePin);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  const updateTodo = useTodoStore((state) => state.updateTodo);

  const currentCategory = todo.category || "기타";
  const ddayInfo = getDdayInfo(todo.date, todo.isDone);

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
    <li
      className={`todo-item ${todo.isDone ? "done" : ""} ${todo.isPinned ? "pinned" : ""}`}
    >
      {/* 상단 좌측: ⭐고정 버튼, 체크박스, 날짜, [카테고리 + D-Day 뱃지 묶음] */}
      <div onClick={() => toggleTodo(todo.id)} className="todo-meta">
        {/* ✅ 상단 고정(별표) 버튼 */}
        <button
          type="button"
          className={`pin-btn ${todo.isPinned ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation(); // 완료 체크가 동시에 눌리지 않도록 방지
            togglePin(todo.id);
          }}
          title={todo.isPinned ? "상단 고정 해제" : "상단 고정"}
        >
          {todo.isPinned ? "★" : "☆"}
        </button>

        <div className="checkbox">✔</div>
        <span
          className={`todo-date-badge ${ddayInfo?.type === "overdue" ? "overdue-text" : ""}`}
        >
          {todo.date}
        </span>

        <div className="todo-badges">
          <span className={`category-badge cat-${currentCategory}`}>
            {currentCategory}
          </span>
          {ddayInfo && (
            <span className={`dday-badge dday-${ddayInfo.type}`}>
              {ddayInfo.text}
            </span>
          )}
        </div>
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
