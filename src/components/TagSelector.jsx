import { useState, useRef, useEffect } from "react";
import { useTodoStore } from "@/store/useTodoStore";

// 빠르게 고를 수 있는 추천 프리셋 색상 8종
const PRESET_COLORS = [
  "#3b82f6", // 파랑
  "#8b5cf6", // 보라
  "#10b981", // 초록
  "#f59e0b", // 주황
  "#ef4444", // 빨강
  "#ec4899", // 핑크
  "#06b6d4", // 민트/청록
  "#6b7280", // 회색
];

export const TagSelector = ({ selectedTag, onSelectTag }) => {
  const categories = useTodoStore((state) => state.categories);
  const addCategory = useTodoStore((state) => state.addCategory);
  const deleteCategory = useTodoStore((state) => state.deleteCategory);

  const [isOpen, setIsOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#3b82f6");
  const wrapperRef = useRef(null);

  // 현재 선택된 태그의 색상 찾기
  const currentCatObj = categories.find((c) => c.name === selectedTag) || {
    name: selectedTag || "기타",
    color: "#6b7280",
  };

  // 바깥 영역 클릭 시 팝오버 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 새 커스텀 태그 생성 및 즉시 선택
  const handleCreateTag = () => {
    const trimmed = newTagName.trim();
    if (!trimmed) {
      alert("태그 이름을 입력해주세요!");
      return;
    }
    addCategory(trimmed, newTagColor);
    onSelectTag(trimmed, newTagColor);
    setNewTagName("");
    setIsOpen(false);
  };

  const handleDeleteTag = (e, tagName) => {
    e.stopPropagation();
    if (categories.length <= 1) {
      alert("최소 1개의 태그는 남겨두어야 합니다.");
      return;
    }
    deleteCategory(tagName);
    if (selectedTag === tagName) {
      const remaining = categories.filter((c) => c.name !== tagName);
      if (remaining.length > 0) {
        onSelectTag(remaining[0].name, remaining[0].color);
      }
    }
  };

  return (
    <div className="tag-selector-wrapper" ref={wrapperRef}>
      {/* 현재 선택된 태그 표시 버튼 */}
      <button
        type="button"
        className="tag-selector-btn"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="tag-btn-left">
          <span
            className="tag-color-dot"
            style={{ backgroundColor: currentCatObj.color }}
          />
          <span className="tag-btn-name">{currentCatObj.name}</span>
        </span>
        <span className="tag-btn-arrow">▾</span>
      </button>

      {/* 클릭 시 열리는 태그 선택 & 직접 생성 팝오버 */}
      {isOpen && (
        <div className="tag-popover">
          <div className="tag-popover-section">
            <div className="tag-popover-title">태그 선택</div>
            <div className="tag-list">
              {categories.map((cat) => (
                <div
                  key={cat.name}
                  className={`tag-option ${selectedTag === cat.name ? "active" : ""}`}
                  onClick={() => {
                    onSelectTag(cat.name, cat.color);
                    setIsOpen(false);
                  }}
                >
                  <span
                    className="tag-badge-preview"
                    style={{
                      backgroundColor: `${cat.color}24`,
                      color: cat.color,
                      border: `1px solid ${cat.color}40`,
                    }}
                  >
                    ● {cat.name}
                  </span>
                  <button
                    type="button"
                    className="tag-delete-btn"
                    onClick={(e) => handleDeleteTag(e, cat.name)}
                    title="태그 삭제"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="tag-popover-divider" />

          {/* 새 태그 직접 입력 & 색상 지정 영역 */}
          <div className="tag-popover-section">
            <div className="tag-popover-title">✨ 새 태그 직접 만들기</div>
            <div className="new-tag-input-row">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCreateTag();
                  }
                }}
                placeholder="태그 이름 입력 (예: 운동)"
                className="new-tag-input"
                maxLength={12}
              />
              <button
                type="button"
                className="new-tag-add-btn"
                onClick={handleCreateTag}
              >
                적용
              </button>
            </div>

            {/* 색상 팔레트 & 자유 컬러 피커 */}
            <div className="color-picker-row">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`color-swatch ${newTagColor === color ? "selected" : ""}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewTagColor(color)}
                  title={color}
                />
              ))}
              {/* 사용자가 모든 색상을 직접 고를 수 있는 네이티브 컬러 피커 */}
              <label className="custom-color-label" title="직접 색상 조합하기">
                🎨
                <input
                  type="color"
                  value={newTagColor}
                  onChange={(e) => setNewTagColor(e.target.value)}
                  className="hidden-color-input"
                />
              </label>
            </div>

            {/* 만들어질 태그 미리보기 */}
            {newTagName.trim() && (
              <div className="new-tag-preview-box">
                <span className="preview-label">미리보기:</span>
                <span
                  className="tag-badge-preview"
                  style={{
                    backgroundColor: `${newTagColor}24`,
                    color: newTagColor,
                    border: `1px solid ${newTagColor}40`,
                  }}
                >
                  {newTagName.trim()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
