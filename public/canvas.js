let canvas = document.querySelector("canvas");
let penColorList = document.querySelectorAll(".color-choice");
let pencilSize = document.querySelector(".pencil-width");
let eraserSize = document.querySelector(".eraser-width");
let download = document.querySelector(".download");
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
let drawTool = canvas.getContext("2d");
let mouseClicked = false;
let defaultColor = "black";
let defaultPencilSize = 2;
drawTool.strokeStyle = defaultColor;
drawTool.lineWidth = defaultPencilSize;
let defaultEraserWidth = 2;
let canvasSketchTracker = [];
let trackPointer = 0;

canvas.addEventListener("mousedown", (e) => {
  mouseClicked = true;
  let data = { x: e.clientX, y: e.clientY };
  socket.emit("beginPath", data);
});

canvas.addEventListener("mousemove", (e) => {
  if (mouseClicked) {
    let data = { x: e.clientX, y: e.clientY };
    socket.emit("drawPath", data);
  }
});

canvas.addEventListener("mouseup", (e) => {
  mouseClicked = false;
  let url = canvas.toDataURL();
  canvasSketchTracker.push(url);
  trackPointer = canvasSketchTracker.length - 1;
});

function beginPath(data) {
  drawTool.beginPath();
  drawTool.moveTo(data.x, data.y);
}

function drawPath(data) {
  drawTool.lineTo(data.x, data.y);
  drawTool.stroke();
}

penColorList.forEach((elem) => {
  elem.addEventListener("click", (ev) => {
    defaultColor = elem.classList[0];
    drawTool.strokeStyle = defaultColor;
  });
});

pencilSize.addEventListener("change", (e) => {
  defaultPencilSize = pencilSize.value;
  drawTool.lineWidth = defaultPencilSize;
});

eraserSize.addEventListener("change", (e) => {
  defaultEraserWidth = eraserSize.value;
  drawTool.lineWidth = defaultEraserWidth;
});

eraser.addEventListener("click", (e) => {
  if (eraserOpen) {
    drawTool.strokeStyle = "white";
    drawTool.lineWidth = defaultEraserWidth;
  } else {
    drawTool.strokeStyle = defaultColor;
    drawTool.lineWidth = defaultPencilSize;
  }
});

download.addEventListener("click", (e) => {
  let aTag = document.createElement("a");
  aTag.href = canvas.toDataURL();
  aTag.download = "sketch.jpg";
  aTag.click();
});

redo.addEventListener("click", (e) => {
  if (trackPointer < canvasSketchTracker.length - 1) {
    trackPointer++;
    let data = { trackPointer, canvasSketchTracker };
    socket.emit("undoRedoCanvas", data);
  }
});

undo.addEventListener("click", (e) => {
  if (trackPointer > 0) {
    trackPointer--;
    let data = { trackPointer, canvasSketchTracker };
    socket.emit("undoRedoCanvas", data);
  }
});

function undoRedoCanvas(data) {
  let { trackPointer, canvasSketchTracker } = data;
  drawTool.clearRect(0, 0, canvas.width, canvas.height);
  let url = canvasSketchTracker[trackPointer];
  let image = new Image();
  image.src = url;
  image.onload = (e) => {
    drawTool.drawImage(image, 0, 0, canvas.width, canvas.height);
  };
}

socket.on("beginPath", (data) => {
  beginPath(data);
});

socket.on("drawPath", (data) => {
  drawPath(data);
});

socket.on("undoRedoCanvas", (data) => {
  undoRedoCanvas(data);
});
