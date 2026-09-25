import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useTodoStore = create(
  persist(
    (set) => ({
      todos: [],
      filter: "all",
      categoryFilter: "전체", // ✅ 카테고리 필터 상태
      searchQuery: "", // ✅ 검색어 상태
      selectedDate: "",
      isDarkMode: false,
      viewMode: "list",

      setFilter: (newFilter) => set({ filter: newFilter }),
      setCategoryFilter: (cat) => set({ categoryFilter: cat }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedDate: (dateStr) => set({ selectedDate: dateStr }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setViewMode: (mode) => set({ viewMode: mode }),

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

      updateTodo: (id, text, date, category) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, text, date, category } : todo,
          ),
        })),

      // ✅ 완료된 일정 일괄 삭제 (특정 날짜가 선택되어 있으면 해당 날짜의 완료 항목만 삭제)
      clearCompleted: () =>
        set((state) => ({
          todos: state.todos.filter((todo) => {
            if (state.selectedDate && todo.date !== state.selectedDate) {
              return true;
            }
            return !todo.isDone;
          }),
        })),
    }),
    {
      name: "my-schedules",
    },
  ),
);
