import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/firebase";

const TODOS_COLLECTION = "todos";

export const useTodoStore = create(
  persist(
    (set, get) => ({
      todos: [],
      filter: "all",
      categoryFilter: "전체",
      searchQuery: "",
      selectedDate: "",
      isDarkMode: false,
      viewMode: "list",
      isCloudSynced: false, // ✅ 클라우드 연결 상태 표시용

      setFilter: (newFilter) => set({ filter: newFilter }),
      setCategoryFilter: (cat) => set({ categoryFilter: cat }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedDate: (dateStr) => set({ selectedDate: dateStr }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setViewMode: (mode) => set({ viewMode: mode }),

      // ✅ 파이어베이스 실시간 동기화 리스너
      subscribeToTodos: () => {
        const colRef = collection(db, TODOS_COLLECTION);
        const unsubscribe = onSnapshot(
          colRef,
          async (snapshot) => {
            // 클라우드 DB가 비어있고 로컬에 기존 일정이 있다면 클라우드로 자동 백업
            if (
              snapshot.empty &&
              get().todos.length > 0 &&
              !get().isCloudSynced
            ) {
              const batch = writeBatch(db);
              get().todos.forEach((todo) => {
                const docRef = doc(db, TODOS_COLLECTION, String(todo.id));
                batch.set(docRef, todo);
              });
              await batch.commit();
              set({ isCloudSynced: true });
              return;
            }

            const cloudTodos = snapshot.docs.map((docSnap) => docSnap.data());
            set({ todos: cloudTodos, isCloudSynced: true });
          },
          (error) => {
            console.error("Firebase 실시간 연동 오류:", error);
          },
        );
        return unsubscribe;
      },

      addTodo: async (text, date, category = "기타") => {
        const newTodo = {
          id: Date.now(),
          text,
          date,
          category,
          isDone: false,
          isPinned: false,
        };
        set((state) => ({ todos: [...state.todos, newTodo] }));
        await setDoc(doc(db, TODOS_COLLECTION, String(newTodo.id)), newTodo);
      },

      toggleTodo: async (id) => {
        const target = get().todos.find((t) => t.id === id);
        if (!target) return;
        const updated = { ...target, isDone: !target.isDone };

        set((state) => ({
          todos: state.todos.map((todo) => (todo.id === id ? updated : todo)),
        }));
        await setDoc(doc(db, TODOS_COLLECTION, String(id)), updated);
      },

      togglePin: async (id) => {
        const target = get().todos.find((t) => t.id === id);
        if (!target) return;
        const updated = { ...target, isPinned: !target.isPinned };

        set((state) => ({
          todos: state.todos.map((todo) => (todo.id === id ? updated : todo)),
        }));
        await setDoc(doc(db, TODOS_COLLECTION, String(id)), updated);
      },

      deleteTodo: async (id) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        }));
        await deleteDoc(doc(db, TODOS_COLLECTION, String(id)));
      },

      updateTodo: async (id, text, date, category) => {
        const target = get().todos.find((t) => t.id === id);
        if (!target) return;
        const updated = { ...target, text, date, category };

        set((state) => ({
          todos: state.todos.map((todo) => (todo.id === id ? updated : todo)),
        }));
        await setDoc(doc(db, TODOS_COLLECTION, String(id)), updated);
      },

      clearCompleted: async () => {
        const selectedDate = get().selectedDate;
        const toDelete = get().todos.filter((todo) =>
          selectedDate
            ? todo.date === selectedDate && todo.isDone
            : todo.isDone,
        );

        set((state) => ({
          todos: state.todos.filter((todo) => {
            if (selectedDate && todo.date !== selectedDate) return true;
            return !todo.isDone;
          }),
        }));

        const batch = writeBatch(db);
        toDelete.forEach((todo) => {
          batch.delete(doc(db, TODOS_COLLECTION, String(todo.id)));
        });
        await batch.commit();
      },
    }),
    {
      name: "my-schedules",
    },
  ),
);
