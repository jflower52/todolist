import { useTodoStore } from "@/store/useTodoStore";
import { TodoItem } from "./TodoItem";

export const TodoList = () => {
  const todos = useTodoStore((state) => state.todos);
  const filter = useTodoStore((state) => state.filter);
  const categoryFilter = useTodoStore((state) => state.categoryFilter);
  const searchQuery = useTodoStore((state) => state.searchQuery);
  const selectedDate = useTodoStore((state) => state.selectedDate);

  // 1. 다중 조건 필터링
  const filteredTodos = todos.filter((todo) => {
    const matchesDate = !selectedDate || todo.date === selectedDate;

    const matchesStatus =
      filter === "all"
        ? true
        : filter === "active"
          ? !todo.isDone
          : todo.isDone;

    const currentCat = todo.category || "기타";
    const matchesCategory =
      categoryFilter === "전체" || currentCat === categoryFilter;

    const matchesSearch =
      !searchQuery.trim() ||
      todo.text.toLowerCase().includes(searchQuery.trim().toLowerCase());

    return matchesDate && matchesStatus && matchesCategory && matchesSearch;
  });

  // 2. 스마트 자동 정렬 (미완료 우선 -> ⭐상단 고정 우선 -> 날짜순 -> 등록순)
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    // (1) 완료된 항목은 무조건 아래로
    if (a.isDone !== b.isDone) {
      return a.isDone ? 1 : -1;
    }
    // (2) 상단 고정(isPinned)된 항목을 최상단으로
    const pinA = Boolean(a.isPinned);
    const pinB = Boolean(b.isPinned);
    if (pinA !== pinB) {
      return pinA ? -1 : 1;
    }
    // (3) 날짜가 빠른 순
    if (a.date !== b.date) {
      return a.date.localeCompare(b.date);
    }
    // (4) 등록된 순
    return a.id - b.id;
  });

  if (sortedTodos.length === 0) {
    return (
      <div className="empty-state">📝 해당 조건에 등록된 일정이 없습니다.</div>
    );
  }

  return (
    <ul className="todo-list">
      {sortedTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
};
