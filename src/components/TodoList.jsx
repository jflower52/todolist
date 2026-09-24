import { TodoItem } from "@/components/TodoItem";
import { useTodoStore } from "@/store/useTodoStore";

export const TodoList = () => {
  const todos = useTodoStore((state) => state.todos);
  const filter = useTodoStore((state) => state.filter);
  const selectedDate = useTodoStore((state) => state.selectedDate);

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active" && todo.isDone) return false;
    if (filter === "completed" && !todo.isDone) return false;

    if (selectedDate && todo.date !== selectedDate) return false;

    return true;
  });

  const sortedTodos = [...filteredTodos].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );

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
