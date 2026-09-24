import { useState, useEffect } from "react";
import "./App.css";

function App() {
  // 1. 초기 데이터를 로컬 스토리지에서 불러오기
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("my-schedules");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  const [inputText, setInputText] = useState("");
  const [inputDate, setInputDate] = useState(""); // 날짜 상태 추가

  // 2. todos 데이터가 변경될 때마다 자동으로 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem("my-schedules", JSON.stringify(todos));
  }, [todos]);

  // 일정 추가
  const addTodo = () => {
    if (inputText.trim() === "" || inputDate === "") {
      alert("날짜와 일정 내용을 모두 입력해주세요!");
      return;
    }

    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: inputText,
        date: inputDate, // 날짜 데이터 추가
        isDone: false,
      },
    ]);

    setInputText("");
    setInputDate("");
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isDone: !todo.isDone } : todo,
      ),
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="container">
      <h1>📅 나의 일정 관리</h1>

      <div className="input-area">
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
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="새로운 일정을 입력하세요"
          className="text-input"
        />
        <button onClick={addTodo} className="add-btn">
          추가
        </button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={todo.isDone ? "done" : ""}>
            <span onClick={() => toggleTodo(todo.id)} className="todo-text">
              {todo.isDone ? "✅ " : "⬜ "}
              <strong className="todo-date">[{todo.date}]</strong> {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)} className="delete-btn">
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
