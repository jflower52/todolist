// 실시간 날짜 및 시간 표시 함수
function currentTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const date = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  // 실시간 날짜 및 시간 업데이트
  document.getElementById("clock").innerText = `${year}.${month}.${date}\n${hours}:${minutes}:${seconds}`;
}

// 1초마다 currentTime 함수 실행
setInterval(currentTime, 1000);

// HTML 요소 가져오기
const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskTime = document.getElementById("taskTime");
const addTask = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

// 현재 날짜 반환 함수 (형식: YYYY-MM-DD)
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const date = now.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${date}`;
}

// 현재 시간 반환 함수 (형식: HH:MM)
function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

// 오늘 날짜 이전 날짜 선택 불가 설정
taskDate.min = getCurrentDate();

// 날짜 선택 시, 해당 날짜가 오늘이면 시간 제한 설정
taskDate.addEventListener("change", function () {
  if (taskDate.value === getCurrentDate()) {
    taskTime.min = getCurrentTime(); // 오늘 날짜일 경우, 현재 시간 이후만 선택 가능
  } else {
    taskTime.min = ""; // 그 외 날짜는 시간 제한 없음
  }
});

// 기존 저장된 할 일 불러오기
function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach((task) => addTaskToDOM(task.text, task.date, task.time, task.completed));
}

// 할 일 추가 함수 (DOM에 추가하고 localStorage에도 저장)
function addTaskToDOM(task, date, time, completed = false) {
  const li = document.createElement("li");

  // 할 일 내용
  const taskContent = document.createElement("div");
  taskContent.innerHTML = `${task}`;
  // 할 일 클릭 시, 완료 상태 토글
  taskContent.onclick = () => {
    const currentCompleted = taskContent.style.textDecoration === "line-through";
    toggleTaskCompletion(task, date, time, !currentCompleted, li);
  };

  // 날짜 및 시간 표시
  const taskDatetime = document.createElement("div");
  taskDatetime.innerHTML = `📅 ${date} ⏰ ${time} 까지`;

  // 삭제 버튼 생성
  const deleteTask = document.createElement("button");
  deleteTask.innerHTML = "삭제";
  deleteTask.onclick = () => {
    taskList.removeChild(li); // 할 일 항목 삭제
    removeTaskFromStorage(task, date, time); // localStorage에서 삭제
  };

  // 완료된 할 일에는 줄 긋기 스타일 적용
  if (completed) {
    taskContent.style.textDecoration = "line-through";
    taskDatetime.style.textDecoration = "line-through";
  }

  // 생성된 요소들을 리스트 항목에 추가
  li.appendChild(taskContent);
  li.appendChild(taskDatetime);
  li.appendChild(deleteTask);
  taskList.appendChild(li);
}

// 할 일 완료 상태 변경 함수
function toggleTaskCompletion(task, date, time, completed, li) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map((t) => {
    // 해당 할 일을 찾아 완료 상태 업데이트
    if (t.text === task && t.date === date && t.time === time) {
      return { ...t, completed };
    }
    return t;
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // 스타일을 통해 완료 상태 표시 (줄 긋기)
  const taskContent = li.children[0];
  const taskDatetime = li.children[1];
  if (completed) {
    taskContent.style.textDecoration = "line-through";
    taskDatetime.style.textDecoration = "line-through";
  } else {
    taskContent.style.textDecoration = "none";
    taskDatetime.style.textDecoration = "none";
  }
}

// localStorage에서 할 일 삭제
function removeTaskFromStorage(task, date, time) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter((t) => t.text !== task || t.date !== date || t.time !== time);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// 할 일 추가 버튼 클릭 시 이벤트 처리
addTask.onclick = function () {
  const task = taskInput.value;
  const date = taskDate.value;
  const time = taskTime.value;

  // 입력 값이 모두 있는지 확인
  if (task && date && time) {
    // 현재 시간 이후로 설정되었는지 확인
    if (date === getCurrentDate() && time < getCurrentTime()) {
      alert("현재 시간 이후를 선택하세요.");
      return;
    }

    // 할 일 DOM에 추가
    addTaskToDOM(task, date, time);

    // localStorage에 할 일 저장
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ text: task, date, time, completed: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // 입력 필드 초기화
    taskInput.value = "";
    taskDate.value = "";
    taskTime.value = "";
  } else {
    alert("모두 입력해 주세요.");
  }
};

// 페이지 로드 시, 기존 데이터 불러오기 및 날짜 제한 설정
window.onload = function () {
  taskDate.min = getCurrentDate(); // 오늘 날짜로 날짜 제한 설정
  loadTasks(); // 저장된 할 일 불러오기
};
