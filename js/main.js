// 현재 시각
function currentTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  document.getElementById("clock").innerText = `${hours}시 ${minutes}분 ${seconds}초`;
}
setInterval(() => {
  currentTime();
}, 1000);

//  각 태그를 자바스크립트로 가져오기
const taskInput = document.getElementById("taskInput");
const addTask = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

addTask.addEventListener("click", () => {
  const task = taskInput.value;

  if (task) {
    const li = document.createElement("li");
    li.innerHTML = task;

    const deleteTask = document.createElement("button");
    deleteTask.innerHTML = "삭제";
    deleteTask.onclick = () => {
      taskList.removeChild(li);
    };

    li.appendChild(deleteTask);
    taskList.appendChild(li);

    // 입력 필드 초기화
    taskInput.value = "";
  }
});

/*
// Dummy Data(가짜 데이터)
const todos = [
  { title: "자바스크립트 공부", content: "배열메서드", date: "오늘까지" },
  { title: "자바스크립트 공부", content: "DOM", date: "내일까지" },
];
function loadTodos() {}
*/
