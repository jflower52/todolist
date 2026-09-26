import { useState, useEffect } from "react";
import { Capacitor, registerPlugin } from "@capacitor/core";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider } from "@/firebase";
import { TodoInput } from "@/components/TodoInput";
import { TodoList } from "@/components/TodoList";
import { CalendarWidget } from "@/components/CalendarWidget";
import { ProgressBar } from "@/components/ProgressBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTodoStore } from "@/store/useTodoStore";
import "./App.css";

const NativeGoogleAuth = registerPlugin("NativeGoogleAuth");

// ✅ GitHub Releases APK 직통 다운로드 주소
const APK_DOWNLOAD_URL =
  "https://github.com/jflower52/DoneDay_APK/releases/download/v1.0.0/doneday.apk";

const getTodayStr = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset() * 60000;
  return new Date(today.getTime() - offset).toISOString().split("T")[0];
};

// ✅ 안드로이드 APK 앱으로 실행 중이거나 아이폰 홈 화면 앱으로 실행 중인지 확인
const checkIsStandalone = () => {
  if (typeof window === "undefined") return false;
  return Capacitor.isNativePlatform() || window.navigator.standalone === true;
};

function App() {
  const [authLoading, setAuthLoading] = useState(true);
  const [isInstalled] = useState(checkIsStandalone);

  const user = useTodoStore((state) => state.user);
  const setUser = useTodoStore((state) => state.setUser);
  const clearUserData = useTodoStore((state) => state.clearUserData);

  const todos = useTodoStore((state) => state.todos);
  const categories = useTodoStore((state) => state.categories);
  const filter = useTodoStore((state) => state.filter);
  const setFilter = useTodoStore((state) => state.setFilter);
  const categoryFilter = useTodoStore((state) => state.categoryFilter);
  const setCategoryFilter = useTodoStore((state) => state.setCategoryFilter);
  const searchQuery = useTodoStore((state) => state.searchQuery);
  const setSearchQuery = useTodoStore((state) => state.setSearchQuery);
  const clearCompleted = useTodoStore((state) => state.clearCompleted);

  const selectedDate = useTodoStore((state) => state.selectedDate);
  const setSelectedDate = useTodoStore((state) => state.setSelectedDate);
  const isDarkMode = useTodoStore((state) => state.isDarkMode);
  const viewMode = useTodoStore((state) => state.viewMode);
  const setViewMode = useTodoStore((state) => state.setViewMode);

  const subscribeToUserTodos = useTodoStore(
    (state) => state.subscribeToUserTodos,
  );
  const isCloudSynced = useTodoStore((state) => state.isCloudSynced);

  // 로그인 상태 감지 및 해당 사용자의 개인 일정 구독
  useEffect(() => {
    let unsubFirestore = () => {};

    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      unsubFirestore();
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          displayName: currentUser.displayName || "사용자",
          email: currentUser.email,
          photoURL: currentUser.photoURL,
        });
        unsubFirestore = subscribeToUserTodos(currentUser.uid);
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => {
      unsubAuth();
      unsubFirestore();
    };
  }, [setUser, subscribeToUserTodos]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [isDarkMode]);

  // ✅ 스마트폰 앱에서는 안드로이드 네이티브 구글 로그인 실행, 웹에서는 팝업 실행
  const handleGoogleLogin = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        const result = await NativeGoogleAuth.signIn();
        const credential = GoogleAuthProvider.credential(result.idToken);
        await signInWithCredential(auth, credential);
      } else {
        await signInWithPopup(auth, googleProvider);
      }
    } catch (error) {
      console.error("구글 로그인 실패:", error);
      alert(
        "구글 로그인 중 문제가 발생했습니다.\n상세 내용: " +
          (error?.message || "SHA-1 인증키 설정을 확인해주세요."),
      );
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    clearUserData();
  };

  // ✅ 창 이동 없이 깃허브 Releases에서 즉시 APK 다운로드 실행 (아이폰은 홈 화면 안내)
  const handleInstallClick = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      alert(
        "📱 아이폰/아이패드 안내:\n\n아이폰은 APK 설치를 지원하지 않습니다.\n사파리 하단 가운데 [공유 📤] ➔ [홈 화면에 추가]를 눌러 앱으로 사용해주세요!",
      );
      return;
    }

    const link = document.createElement("a");
    link.href = APK_DOWNLOAD_URL;
    link.setAttribute("download", "doneday.apk");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (authLoading) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <p className="auth-desc">⏳ 로그인 정보를 확인하고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <div className="auth-top-bar">
            <span className="auth-logo">📅</span>
            <ThemeToggle />
          </div>
          <h1 className="auth-title">던데이 (DoneDay)</h1>
          <p className="auth-desc">
            구글 계정으로 로그인하면 나만의 개인 캘린더와 할 일 목록이
            <br />
            PC와 스마트폰 어디서나 실시간으로 동기화됩니다.
          </p>
          <button onClick={handleGoogleLogin} className="google-login-btn">
            <span className="google-g-icon">G</span>
            <span>Google 계정으로 시작하기</span>
          </button>

          {!isInstalled && (
            <button
              onClick={handleInstallClick}
              className="install-app-btn auth-install"
            >
              📲 안드로이드 앱(APK) 다운로드
            </button>
          )}
        </div>
      </div>
    );
  }

  const todayStr = getTodayStr();
  const activeTodos = todos.filter((t) => !t.isDone);
  const todayCount = activeTodos.filter((t) => t.date === todayStr).length;
  const overdueCount = activeTodos.filter(
    (t) => t.date && t.date < todayStr,
  ).length;
  const pinnedCount = activeTodos.filter((t) => Boolean(t.isPinned)).length;
  const totalActiveCount = activeTodos.length;

  const completedCount = todos.filter((todo) =>
    selectedDate ? todo.date === selectedDate && todo.isDone : todo.isDone,
  ).length;

  const renderListControls = () => (
    <div className="list-controls">
      <div className="search-bar-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="일정 키워드 검색..."
          className="search-input"
        />
        {searchQuery && (
          <button
            className="search-clear-btn"
            onClick={() => setSearchQuery("")}
            title="검색어 지우기"
          >
            ✕
          </button>
        )}
      </div>

      <div className="category-filter-chips">
        <button
          className={`chip-btn ${categoryFilter === "전체" ? "active" : ""}`}
          onClick={() => setCategoryFilter("전체")}
        >
          전체
        </button>
        {categories.map((cat) => {
          const isActive = categoryFilter === cat.name;
          return (
            <button
              key={cat.name}
              className={`chip-btn ${isActive ? "active" : ""}`}
              style={
                isActive
                  ? {
                      backgroundColor: cat.color,
                      borderColor: cat.color,
                      color: "#fff",
                    }
                  : undefined
              }
              onClick={() => setCategoryFilter(cat.name)}
            >
              <span
                className="chip-color-dot"
                style={{ backgroundColor: isActive ? "#fff" : cat.color }}
              />
              {cat.name}
            </button>
          );
        })}
      </div>

      <div className="filter-tabs-row">
        <div className="filter-tabs">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            전체
          </button>
          <button
            className={filter === "active" ? "active" : ""}
            onClick={() => setFilter("active")}
          >
            진행 중
          </button>
          <button
            className={filter === "completed" ? "active" : ""}
            onClick={() => setFilter("completed")}
          >
            완료
          </button>
        </div>

        {completedCount > 0 && (
          <button className="clear-completed-btn" onClick={clearCompleted}>
            🗑️ 완료 비우기 ({completedCount})
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="app-container">
      {/* ⬅️ 왼쪽 사이드바 */}
      <aside className="app-sidebar">
        <div className="sidebar-header">
          <div>
            <h1>📅 던데이</h1>
            <span
              style={{
                fontSize: "11px",
                color: isCloudSynced ? "#10b981" : "var(--text-muted)",
                fontWeight: 600,
              }}
            >
              {isCloudSynced
                ? "☁️ 개인 클라우드 동기화됨"
                : "⏳ 클라우드 연결 중..."}
            </span>
          </div>
          <ThemeToggle />
        </div>

        {/* 로그인된 사용자 프로필 & 로그아웃 바 */}
        <div className="user-profile-bar">
          <div className="user-profile-info">
            {user.photoURL ? (
              <img src={user.photoURL} alt="프로필" className="user-avatar" />
            ) : (
              <div className="user-avatar-fallback">{user.displayName[0]}</div>
            )}
            <div className="user-text-box">
              <span className="user-name">{user.displayName}</span>
              <span className="user-email">{user.email}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            로그아웃
          </button>
        </div>

        {/* ✅ 브라우저로 접속 중일 때만 보이는 'APK 다운로드' 버튼 */}
        {!isInstalled && (
          <button onClick={handleInstallClick} className="install-app-btn">
            📲 안드로이드 앱(APK) 다운로드
          </button>
        )}

        <div className="view-toggle-group">
          <button
            className={viewMode === "list" ? "active" : ""}
            onClick={() => setViewMode("list")}
          >
            📋 리스트 뷰
          </button>
          <button
            className={viewMode === "calendar" ? "active" : ""}
            onClick={() => setViewMode("calendar")}
          >
            📆 캘린더 뷰
          </button>
        </div>

        <div className="sidebar-content">
          {viewMode === "list" ? (
            <>
              <h2 className="menu-title">달력 필터</h2>
              <CalendarWidget isLarge={false} />
            </>
          ) : (
            <div className="sidebar-detail-view">
              <h2 className="menu-title">
                {selectedDate ? `${selectedDate} 상세` : "날짜를 선택해주세요"}
              </h2>
              {selectedDate ? (
                <>
                  <ProgressBar />
                  <TodoInput />
                  <div style={{ marginTop: "24px" }}>
                    {renderListControls()}
                  </div>
                  <TodoList />
                </>
              ) : (
                <div className="empty-state">
                  오른쪽 달력에서
                  <br />
                  날짜를 클릭하여 일정을 관리하세요.
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* ➡️ 오른쪽 메인 작업 영역 */}
      <main className="app-main">
        {viewMode === "list" ? (
          <>
            <div className="main-header">
              <h2>{selectedDate ? `${selectedDate} 일정` : "📂 전체 일정"}</h2>
            </div>
            <div className="main-content">
              <section className="summary-dashboard">
                <div
                  className={`summary-card card-today ${selectedDate === todayStr ? "selected" : ""}`}
                  onClick={() =>
                    setSelectedDate(selectedDate === todayStr ? "" : todayStr)
                  }
                  title="클릭하여 오늘 일정만 보기 / 해제"
                >
                  <div className="summary-card-header">
                    <span className="summary-label">오늘 마감</span>
                    <span className="summary-icon">🔥</span>
                  </div>
                  <div className="summary-value">
                    {todayCount}
                    <span className="summary-unit">건</span>
                  </div>
                </div>

                <div className="summary-card card-overdue">
                  <div className="summary-card-header">
                    <span className="summary-label">지연된 일정</span>
                    <span className="summary-icon">🚨</span>
                  </div>
                  <div className="summary-value">
                    {overdueCount}
                    <span className="summary-unit">건</span>
                  </div>
                </div>

                <div className="summary-card card-pinned">
                  <div className="summary-card-header">
                    <span className="summary-label">중요 고정</span>
                    <span className="summary-icon">⭐</span>
                  </div>
                  <div className="summary-value">
                    {pinnedCount}
                    <span className="summary-unit">건</span>
                  </div>
                </div>

                <div
                  className={`summary-card card-active ${!selectedDate && filter === "active" ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedDate("");
                    setFilter("active");
                  }}
                  title="클릭하여 전체 남은 할 일 보기"
                >
                  <div className="summary-card-header">
                    <span className="summary-label">남은 할 일</span>
                    <span className="summary-icon">⏳</span>
                  </div>
                  <div className="summary-value">
                    {totalActiveCount}
                    <span className="summary-unit">건</span>
                  </div>
                </div>
              </section>

              <section className="registration-section">
                <ProgressBar />
                <TodoInput />
              </section>
              <section className="list-section">
                {renderListControls()}
                <TodoList />
              </section>
            </div>
          </>
        ) : (
          <>
            <div className="main-header" style={{ maxWidth: "100%" }}>
              <h2>📆 월간 캘린더</h2>
            </div>
            <div className="main-content" style={{ maxWidth: "100%" }}>
              <CalendarWidget isLarge={true} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
