// 실시간 날짜 및 시간
function currentTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const date = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  document.getElementById("clock").innerText = `${year}.${month}.${date}\n${hours}:${minutes}:${seconds}`;
}
// 1초마다 업데이트
setInterval(() => {
  currentTime();
}, 1000);

// HTML 요소들을 자바스크립트로 가져오기
const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskTime = document.getElementById("taskTime");
const addTask = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

// 할 일 추가
addTask.onclick = function () {
  // 입력한 할 일, 날짜, 시간
  const task = taskInput.value;
  const date = taskDate.value;
  const time = taskTime.value;

  if (task && date && time) {
    // 새로운 <li> 요소 생성
    const li = document.createElement("li");
    
    // 할 일 내용 추가
    const taskContent = document.createElement("div");
    taskContent.innerHTML = `${task}`;

    // 날짜 및 시간 추가
    const taskDatetime = document.createElement("div");
    taskDatetime.innerHTML = `📅 ${date} ⏰ ${time} 까지`;

    // 삭제 버튼 생성
    const deleteTask = document.createElement("button");
    deleteTask.innerHTML = "삭제";
    // 삭제 버튼 클릭 시 할 일 항목 삭제
    deleteTask.onclick = () => {
      taskList.removeChild(li);
    };

    // 생성한 요소들 <li>에 추가
    li.appendChild(taskContent);
    li.appendChild(taskDatetime);
    li.appendChild(deleteTask);

    // <li>를 할 일 목록에 추가
    taskList.appendChild(li);

    // 입력 필드 초기화
    taskInput.value = "";
    taskDate.value = "";
    taskTime.value = "";
  } else {
    alert("모두 입력해 주세요.");
  }
};
