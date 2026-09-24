import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useTodoStore = create(
  persist(
    (set) => ({
      todos: [],
      filter: "all",
      selectedDate: "",
      isDarkMode: false,
      viewMode: "list", // 'list' (리스트 뷰) 또는 'calendar' (달력 뷰)

      setFilter: (newFilter) => set({ filter: newFilter }),
      setSelectedDate: (dateStr) => set({ selectedDate: dateStr }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setViewMode: (mode) => set({ viewMode: mode }), // 뷰 전환 함수

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
