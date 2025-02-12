//  각 태그를 자바스크립트로 가져오기
const taskInput = document.getElementById("taskInput");
const addTask = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

addTask.addEventListener("click", () => {
  const task = taskInput.value;

  if (task) {
    const li = document.createElement("li");
    const deleteTask = document.createElement("button");

    deleteTask.innerHTML = "삭제";
    deleteTask.onclick = () => {
      taskList.removeChild(li);
    };

    li.innerHTML = task;
    li.appendChild(deleteTask);
    taskList.appendChild(li);
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
