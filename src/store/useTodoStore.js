import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Preferences } from "@capacitor/preferences";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/firebase";

export const DEFAULT_CATEGORIES = [
  { name: "업무", color: "#3b82f6" },
  { name: "공부", color: "#8b5cf6" },
  { name: "개인", color: "#10b981" },
  { name: "약속", color: "#f59e0b" },
  { name: "중요", color: "#ef4444" },
  { name: "기타", color: "#6b7280" },
];

// ✅ 스마트폰 바탕화면 위젯으로 오늘 할 일 데이터 동기화
const syncToNativeWidget = async (todos) => {
  try {
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000;
    const todayStr = new Date(today.getTime() - offset)
      .toISOString()
      .split("T")[0];

    const todayTodos = todos.filter((t) => t.date === todayStr);
    const remainingToday = todayTodos.filter((t) => !t.isDone);
    const totalRemaining = todos.filter((t) => !t.isDone).length;

    const statsText = `오늘 남은 일 ${remainingToday.length}건  |  전체 할 일 ${totalRemaining}건`;
    const listText =
      remainingToday.length > 0
        ? remainingToday
            .slice(0, 5)
            .map((t) => `• [${t.category || "기타"}] ${t.text}`)
            .join("\n")
        : "🎉 오늘 예정된 할 일을 모두 끝냈거나 등록된 일정이 없습니다!";

    await Preferences.set({ key: "widget_today_stats", value: statsText });
    await Preferences.set({ key: "widget_today_list", value: listText });
  } catch {
    // 웹 브라우저 환경에서는 무시
  }
};

export const useTodoStore = create(
  persist(
    (set, get) => ({
      user: null,
      todos: [],
      categories: DEFAULT_CATEGORIES,
      filter: "all",
      categoryFilter: "전체",
      searchQuery: "",
      selectedDate: "",
      isDarkMode: false,
      viewMode: "list",
      isCloudSynced: false,

      setUser: (user) => set({ user }),
      clearUserData: () => {
        syncToNativeWidget([]);
        set({
          user: null,
          todos: [],
          categories: DEFAULT_CATEGORIES,
          isCloudSynced: false,
        });
      },

      setFilter: (newFilter) => set({ filter: newFilter }),
      setCategoryFilter: (cat) => set({ categoryFilter: cat }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedDate: (dateStr) => set({ selectedDate: dateStr }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setViewMode: (mode) => set({ viewMode: mode }),

      addCategory: async (name, color) => {
        const uid = get().user?.uid;
        if (!uid) return;

        const current = get().categories;
        const exists = current.some((c) => c.name === name);
        const updated = exists
          ? current.map((c) => (c.name === name ? { name, color } : c))
          : [...current, { name, color }];

        set({ categories: updated });
        await setDoc(doc(db, "users", uid, "settings", "userCategories"), {
          list: updated,
        });
      },

      deleteCategory: async (name) => {
        const uid = get().user?.uid;
        if (!uid) return;

        const updated = get().categories.filter((c) => c.name !== name);
        const nextFilter =
          get().categoryFilter === name ? "전체" : get().categoryFilter;
        set({ categories: updated, categoryFilter: nextFilter });
        await setDoc(doc(db, "users", uid, "settings", "userCategories"), {
          list: updated,
        });
      },

      subscribeToUserTodos: (uid) => {
        if (!uid) return () => {};

        const colRef = collection(db, "users", uid, "todos");
        const catDocRef = doc(db, "users", uid, "settings", "userCategories");

        const unsubTodos = onSnapshot(
          colRef,
          async (snapshot) => {
            if (
              snapshot.empty &&
              get().todos.length > 0 &&
              !get().isCloudSynced
            ) {
              const batch = writeBatch(db);
              get().todos.forEach((todo) => {
                const docRef = doc(db, "users", uid, "todos", String(todo.id));
                batch.set(docRef, todo);
              });
              await batch.commit();
              set({ isCloudSynced: true });
              return;
            }

            const cloudTodos = snapshot.docs.map((docSnap) => docSnap.data());
            set({ todos: cloudTodos, isCloudSynced: true });
            syncToNativeWidget(cloudTodos);
          },
          (error) => {
            console.error("Firebase 개인 일정 연동 오류:", error);
          },
        );

        const unsubCats = onSnapshot(catDocRef, async (docSnap) => {
          if (docSnap.exists() && Array.isArray(docSnap.data().list)) {
            set({ categories: docSnap.data().list });
          } else {
            await setDoc(catDocRef, { list: get().categories });
          }
        });

        return () => {
          unsubTodos();
          unsubCats();
        };
      },

      addTodo: async (
        text,
        date,
        category = "기타",
        categoryColor = "#6b7280",
      ) => {
        const uid = get().user?.uid;
        if (!uid) return;

        const newTodo = {
          id: Date.now(),
          text,
          date,
          category,
          categoryColor,
          isDone: false,
          isPinned: false,
        };
        const nextTodos = [...get().todos, newTodo];
        set({ todos: nextTodos });
        syncToNativeWidget(nextTodos);
        await setDoc(
          doc(db, "users", uid, "todos", String(newTodo.id)),
          newTodo,
        );
      },

      toggleTodo: async (id) => {
        const uid = get().user?.uid;
        if (!uid) return;

        const target = get().todos.find((t) => t.id === id);
        if (!target) return;
        const updated = { ...target, isDone: !target.isDone };

        const nextTodos = get().todos.map((todo) =>
          todo.id === id ? updated : todo,
        );
        set({ todos: nextTodos });
        syncToNativeWidget(nextTodos);
        await setDoc(doc(db, "users", uid, "todos", String(id)), updated);
      },

      togglePin: async (id) => {
        const uid = get().user?.uid;
        if (!uid) return;

        const target = get().todos.find((t) => t.id === id);
        if (!target) return;
        const updated = { ...target, isPinned: !target.isPinned };

        const nextTodos = get().todos.map((todo) =>
          todo.id === id ? updated : todo,
        );
        set({ todos: nextTodos });
        syncToNativeWidget(nextTodos);
        await setDoc(doc(db, "users", uid, "todos", String(id)), updated);
      },

      deleteTodo: async (id) => {
        const uid = get().user?.uid;
        if (!uid) return;

        const nextTodos = get().todos.filter((todo) => todo.id !== id);
        set({ todos: nextTodos });
        syncToNativeWidget(nextTodos);
        await deleteDoc(doc(db, "users", uid, "todos", String(id)));
      },

      updateTodo: async (id, text, date, category, categoryColor) => {
        const uid = get().user?.uid;
        if (!uid) return;

        const target = get().todos.find((t) => t.id === id);
        if (!target) return;
        const updated = {
          ...target,
          text,
          date,
          category,
          categoryColor: categoryColor || target.categoryColor || "#6b7280",
        };

        const nextTodos = get().todos.map((todo) =>
          todo.id === id ? updated : todo,
        );
        set({ todos: nextTodos });
        syncToNativeWidget(nextTodos);
        await setDoc(doc(db, "users", uid, "todos", String(id)), updated);
      },

      clearCompleted: async () => {
        const uid = get().user?.uid;
        if (!uid) return;

        const selectedDate = get().selectedDate;
        const toDelete = get().todos.filter((todo) =>
          selectedDate
            ? todo.date === selectedDate && todo.isDone
            : todo.isDone,
        );

        const nextTodos = get().todos.filter((todo) => {
          if (selectedDate && todo.date !== selectedDate) return true;
          return !todo.isDone;
        });
        set({ todos: nextTodos });
        syncToNativeWidget(nextTodos);

        const batch = writeBatch(db);
        toDelete.forEach((todo) => {
          batch.delete(doc(db, "users", uid, "todos", String(todo.id)));
        });
        await batch.commit();
      },
    }),
    {
      name: "my-schedules",
    },
  ),
);
