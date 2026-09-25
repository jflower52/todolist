import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useTodoStore = create(
  persist(
    (set) => ({
      todos: [],
      filter: "all",
      selectedDate: "",
      isDarkMode: false,
      viewMode: "list",

      setFilter: (newFilter) => set({ filter: newFilter }),
      setSelectedDate: (dateStr) => set({ selectedDate: dateStr }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setViewMode: (mode) => set({ viewMode: mode }),

      // ✅ 카테고리(category) 추가 (기본값: '기타')
      addTodo: (text, date, category = "기타") =>
        set((state) => ({
          todos: [
            ...state.todos,
            { id: Date.now(), text, date, category, isDone: false },
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

      // ✅ 수정 시에도 카테고리 업데이트 반영
      updateTodo: (id, text, date, category) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, text, date, category } : todo,
          ),
        })),
    }),
    {
      name: "my-schedules",
    },
  ),
);
