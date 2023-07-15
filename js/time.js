/**
 * 初始化
 */
function init() {
  // scheduleArray = [{ id: 1, title: "一会吃饭", time: "18:30:00" }];
  scheduleArray = [];
}

function renderCurrentTime() {
  var currentTimeElement = document.getElementById("current-time");
  var currentTime = new Date();
  var hours = currentTime.getHours();
  var minutes = currentTime.getMinutes();
  var seconds = currentTime.getSeconds();

  // 添加前导零
  hours = addLeadingZero(hours);
  minutes = addLeadingZero(minutes);
  seconds = addLeadingZero(seconds);

  // 格式化时间
  var formattedTime = hours + ":" + minutes + ":" + seconds;

  // 渲染到页面
  currentTimeElement.textContent = formattedTime;

  // console.log(scheduleArray);

  if (scheduleArray.length > 0) {
    // 循环遍历日程数组
    for (var i = 0; i < scheduleArray.length; i++) {
      // 获取当前时间和日程时间
      // const scheduleTime = revolutionSeconds(scheduleArray[i].time);
      // console.log("scheduleTime", scheduleTime);
      // 计算日程时间与当前时间的时间差（以毫秒为单位）
      var timeDiff = scheduleArray[i].time - currentTime.getTime();
      console.log("我调用一次");
      // 如果时间差大于等于0，则设置定时器，在时间差过后进行提醒
      if (timeDiff >= 0) {
        setTimeout(
          function (schedule) {
            // 在定时器回调函数中显示提醒消息
            // alert("Reminder: " + schedule.title);
            reminderBar[0].style.display = "block";
          },
          timeDiff,
          scheduleArray[i]
        ); // 使用闭包保存当前的日程对象
        setTimeout(renderCurrentTime, 1000);
      }
    }
  } else {
    // 每个一秒更新一次时间
    setTimeout(renderCurrentTime, 1000);
  }
}

function addLeadingZero(number) {
  return number < 10 ? "0" + number : number;
}

function revolutionSeconds(timeString) {
  // 创建一个新的日期对象
  var dateTime = new Date();
  console.log("timeString: ", timeString);
  // 使用正则表达式匹配并提取时间字符串中的小时、分钟和秒数
  var match = timeString.match(/^(\d{2}):(\d{2}):(\d{2})$/);
  var hours = parseInt(match[1]);
  var minutes = parseInt(match[2]);
  var seconds = parseInt(match[3]);

  // 设置日期对象的小时、分钟和秒数
  dateTime.setHours(hours);
  dateTime.setMinutes(minutes);
  dateTime.setSeconds(seconds);

  return dateTime.getTime();
}

function getTime() {
  const timePicker = document.getElementById("timePicker");
  const selectedTime = timePicker.value;
  timePicker.value = selectedTime;
}

/**
 * 输入日程内容 检测函数
 */
function inputListener() {
  const saveButton = document.getElementById("modal-save");
  const timePicker = document.getElementById("timePicker");
  const value = this.value;

  const length = [...value].reduce(
    (total, char) => total + (char.charCodeAt(0) > 255 ? 2 : 1),
    0
  );

  if (length > 36) {
    this.value = value.slice(0, -1); // 如果超过36个字符，则删除最后一个字符
  }

  if (length === 0) {
    saveButton.disabled = false;
    saveButton.style.color = "#433d60";
    errorMessage[0].innerHTML = "请输入至少一个汉字";
  } else {
    if (timePicker.value != "") {
      saveButton.disabled = true;
      saveButton.style.color = "#fff";
      errorMessage[0].innerHTML = "";
    } else {
      errorMessage[0].innerHTML = "请选择提醒时间";
    }
  }
}

/**
 * 保存日程函数
 */
function saveListener() {
  console.log(timePicker.value + ":00");
  var jsonData = {
    id: scheduleArray.length + 1,
    title: modalInput[0].value,
    time: revolutionSeconds(timePicker.value + ":00"),
  };
  scheduleArray.push(jsonData);
  addModalListElement();
  renderCurrentTime();
}

/**
 * 删除日程函数
 */
function deleteListener() {
  const dataId = this.getAttribute("data-id");
  scheduleArray.splice(dataId, 1);
  addModalListElement();
  renderCurrentTime();
}

function closeListener() {
  const modal = document.getElementsByClassName("modal");
  modal[0].style.display = "none";
}

/**
 * 创建模态框内容
 */
function addModalListElement() {
  const modalListElement = document.getElementsByClassName("modal-list");

  while (modalListElement[0].firstChild) {
    modalListElement[0].removeChild(modalListElement[0].firstChild);
  }

  var closeButton = document.createElement("a");
  closeButton.classList.add("close-button");
  closeButton.textContent = "×";
  closeButton.addEventListener("click", closeListener);
  modalListElement[0].appendChild(closeButton);

  if (scheduleArray.length > 0) {
    for (var i = 0; i < scheduleArray.length; i++) {
      var jsonItem = scheduleArray[i];
      var listItemElement = document.createElement("li");
      listItemElement.classList.add("modal-tab");

      // 创建 span 元素并插入内容
      var titleElement = document.createElement("span");
      titleElement.classList.add("modal-title");
      titleElement.textContent = jsonItem.title;

      // 创建 a 元素
      var deleteLinkElement = document.createElement("a");
      deleteLinkElement.classList.add("modal-delete");
      deleteLinkElement.setAttribute("data-id", i);
      deleteLinkElement.addEventListener("click", deleteListener);

      // 将子元素添加到 li 元素中
      listItemElement.appendChild(titleElement);
      listItemElement.appendChild(deleteLinkElement);

      // 将 li 元素添加到父容器中
      modalListElement[0].appendChild(listItemElement);
    }
  }

  // 创建 li 元素
  var listItemElement = document.createElement("li");
  listItemElement.classList.add("modal-tab");

  // 创建 input 元素
  var inputElement = document.createElement("input");
  inputElement.classList.add("modal-title", "modal-input");
  inputElement.placeholder = "日程内容";
  inputElement.addEventListener("input", inputListener);

  var inputPicker = document.createElement("input");
  inputPicker.id = "timePicker";
  inputPicker.type = "time";
  inputPicker.addEventListener("click", getTime);
  inputPicker.addEventListener("input", inputListener);

  // 创建保存按钮元素
  var saveButtonElement = document.createElement("span");
  saveButtonElement.id = "modal-save";
  saveButtonElement.textContent = "保存";
  saveButtonElement.addEventListener("click", saveListener);
  saveButtonElement.disabled = false;

  // 将子元素添加到 li 元素中
  listItemElement.appendChild(inputElement);
  listItemElement.appendChild(inputPicker);
  listItemElement.appendChild(saveButtonElement);

  // 将 li 元素添加到父容器中
  modalListElement[0].appendChild(listItemElement);

  // 创建错误消息元素
  var errorMessageElement = document.createElement("span");
  errorMessageElement.classList.add("error-message");

  // 将错误消息元素添加到页面中
  modalListElement[0].appendChild(errorMessageElement);
}

function main() {
  init();
  addModalListElement();

  addSchedule = document.getElementById("add-schedule");
  modal = document.getElementsByClassName("modal");
  modalInput = document.getElementsByClassName("modal-input");
  timePicker = document.getElementById("timePicker");
  errorMessage = document.getElementsByClassName("error-message");
  modalDelete = document.getElementsByClassName("modal-delete");
  reminderBar = document.getElementsByClassName("reminder-bar");

  btnBol = false;
}

// 在页面加载完成后开始渲染时间
window.addEventListener("load", function () {
  main();
  renderCurrentTime();

  modalInput[0].addEventListener("input", function () {
    console.log("我执行了");
  });

  addSchedule.addEventListener("click", function () {
    modal[0].style.display = "block";
  });
});
