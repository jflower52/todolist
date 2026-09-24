import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useTodoStore = create(
  persist(
    (set) => ({
      todos: [],
      filter: "all",
      selectedDate: "",
      isDarkMode: false, // 다크 모드 상태 추가

      setFilter: (newFilter) => set({ filter: newFilter }),
      setSelectedDate: (dateStr) => set({ selectedDate: dateStr }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })), // 모드 전환 함수

      addTodo: (text, date) =>
        set((state) => ({
          todos: [
            ...state.todos,
            { id: Date.now(), text, date, isDone: false },
          ],
        })),

      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, isDone: !todo.isDone } : todo,
          ),
        })),

      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),

      updateTodo: (id, text, date) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, text, date } : todo,
          ),
        })),
    }),
    {
      name: "my-schedules",
    },
  ),
);
