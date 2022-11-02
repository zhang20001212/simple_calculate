/* 
    动态生成键盘,封装成JSON格式包括
    按键的类型   按键的value值  按键的内容
    总共15个按键
    command  命令键
    operation  运算键
    number    数字键
*/
const keyboardList = [
  // 命令键   清空
  { type: "command", value: "clear", label: "C" },
  // 命令键   数字变换正负
  { type: "command", value: "toggle-minus", label: "+/-" },
  // 命令键   将数字变为百分比模式
  { type: "command", value: "percentage", label: "%" },
  // 运算键   数字运算符
  { type: "operation", value: "division", label: "÷" },
  // 数字键   数字
  { type: "number", value: "7", label: "7" },
  { type: "number", value: "8", label: "8" },
  { type: "number", value: "9", label: "9" },
  // 运算键   数字运算符
  { type: "operation", value: "multiple", label: "×" },
  // 数字键   数字
  { type: "number", value: "4", label: "4" },
  { type: "number", value: "5", label: "5" },
  { type: "number", value: "6", label: "6" },
  // 运算键   数字运算符
  { type: "operation", value: "minus", label: "—" },
  // 数字键   数字
  { type: "number", value: "1", label: "1" },
  { type: "number", value: "2", label: "2" },
  { type: "number", value: "3", label: "3" },
  // 运算键   数字运算符
  { type: "operation", value: "plus", label: "+" },
  // 数字键   数字
  { type: "number", value: "0", label: "0" },
  // 命令建   小数点
  { type: "command", value: ".", label: "." },
  // 命令建   等于号
  { type: "command", value: "equal", label: "=" },
];

/* 
    拿到键盘区域
*/
const keyboardElement = document.querySelector("#keyboard-area");
// 声明一个最终要经行运算的数字变量
let lastNumber = 0;
// 声明一个最终要进行运算的符号变量
let lastOperation = "";
// 进行运算后的结果
let operationNumber = 0;
// 声明一个用于存放是不是最后一个运算符号的变量
let isLastKeyOperation = false;
// 调用动态生成键盘的方法
buildKeyboard();
// 动态生成键盘函数
function buildKeyboard() {
  // 可以用for 也可用简便的数组遍历方法 forEach
  keyboardList.forEach((item) => {
    // 动态生成每个KeyDom节点
    const element = document.createElement("div");
    // 利用dataset进行存储JSON中的键盘属性，便于后续直接从dataset中取得值
    element.dataset.type = item.type;
    element.dataset.value = item.value;
    // 为生成的每一个DOM节点动态添加类名classList.add('名字')
    element.classList.add(item.value);
    element.classList.add("key");
    element.textContent = item.label;
    // 为每一个DOM节点添加点击监听事件，事件函数为clickKey
    element.addEventListener("click", clickKey);
    keyboardElement.appendChild(element);
  });
}

// 每个按钮点击的方法
function clickKey(e) {
  // 这一步不懂可以自己打印一下e，然后找到target里的dataset
  const dataset = e.target.dataset;
  //进行逻辑判断，为了减少代码量，采用了switch方法进行开关判断
  switch (dataset.type) {
    // 判断是什么类型的键，执行不同的方法
    case "command":
      handleCommand(dataset.value);
      break;
    case "operation":
      handleOperation(dataset.value);
      break;
    case "number":
      handleNumber(dataset.value);
      break;
    default:
      throw new Error("当前类型不存在！");
  }
}

// 获取resultDOM节点
const resultElement = document.querySelector("#result");
// 触发command命令键函数
function handleCommand(commandValue) {
  // 触发clear 清空
  if (commandValue === "clear") {
    resultElement.textContent = "0";
    clear();
    return;
  }
  //触发正负数形式
  else if (commandValue === "toggle-minus") {
    resultElement.textContent = -Number.parseFloat(resultElement.textContent);
    return;
  }
  //触发百分比形式
  else if (commandValue === "percentage") {
    resultElement.textContent =
      Number.parseFloat(resultElement.textContent) / 100;
    return;
  }
  //位数字加上小数点
  else if (commandValue === ".") {
    // 使用indexof进行判断(||)如果有小数点就不执行后面操作，如果没有执行前面操作
    resultElement.textContent.indexOf(".") !== -1 ||
      (resultElement.textContent += ".");
    return;
  }
  //   触发等于运算
  else if (commandValue === "equal") {
    calculate();
  }
}

//触发number数字键函数
function handleNumber(numberValue) {
  if (resultElement.textContent === "0" || isLastKeyOperation) {
    resultElement.textContent = numberValue;
    isLastKeyOperation = false;
  } else {
    resultElement.textContent += numberValue;
  }
  operationNumber = Number.parseFloat(resultElement.textContent);
}

// 触发operation运算键函数
function handleOperation(operationValue) {
  if (lastNumber !== 0 && operationNumber !== 0) {
    calculate();
  }
  //   使用parseFloat转换为浮点数
  lastNumber = Number.parseFloat(resultElement.textContent);
  lastOperation = operationValue;
  isLastKeyOperation = true;
  //   调用四则运算函数
}

// 四则运算函数
function calculate() {
  let result = "";
  switch (lastOperation) {
    // 加法
    case "plus":
      result = lastNumber + operationNumber;
      break;
    //   减法
    case "minus":
      result = lastNumber - operationNumber;
      break;
    //   乘法
    case "multiple":
      result = lastNumber * operationNumber;
      break;
    //   除法
    case "division":
      result = lastNumber / operationNumber;
      break;
    default:
      throw new Error("操作不存在！");
  }
  resultElement.textContent = result;
  lastNumber = result;
}

function clear() {
  lastNumber = 0;
  lastOperation = "";
  operationNumber = 0;
  isLastKeyOperation = false;
  console.log('1231');
}
