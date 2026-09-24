import { useTodoStore } from "@/store/useTodoStore";

export const ProgressBar = () => {
  const todos = useTodoStore((state) => state.todos);
  const selectedDate = useTodoStore((state) => state.selectedDate);

  // 1. 선택된 날짜가 있으면 해당 날짜의 일정만, 없으면 전체 일정 가져오기
  const targetTodos = selectedDate
    ? todos.filter((todo) => todo.date === selectedDate)
    : todos;

  // 2. 타겟이 된 일정들로만 달성률 계산
  const totalTodos = targetTodos.length;
  const completedTodos = targetTodos.filter((todo) => todo.isDone).length;

  const progressPercentage =
    totalTodos === 0 ? 0 : Math.round((completedTodos / totalTodos) * 100);

  // 3. 타이틀도 상태에 따라 유동적으로 변경
  const title = selectedDate
    ? `📅 ${selectedDate} 달성률`
    : `📊 전체 누적 달성률`;

  return (
    <div className="progress-section">
      <div className="progress-header">
        <span className="progress-title">{title}</span>
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
