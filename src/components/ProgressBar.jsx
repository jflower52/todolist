import { useTodoStore } from "@/store/useTodoStore";

export const ProgressBar = () => {
  const todos = useTodoStore((state) => state.todos);

  const totalTodos = todos.length;
  const completedTodos = todos.filter((todo) => todo.isDone).length;

  const progressPercentage =
    totalTodos === 0 ? 0 : Math.round((completedTodos / totalTodos) * 100);

  return (
    <div className="progress-section">
      <div className="progress-header">
        <span className="progress-title">📈 오늘의 달성률</span>
        <span className="progress-stats">
          {completedTodos} / {totalTodos} 완료 ({progressPercentage}%)
        </span>
      </div>
      <div className="progress-bar-bg">
        <div
          className="progress-bar-fill"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};
