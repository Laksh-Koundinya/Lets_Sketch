let canvas = document.querySelector("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
let drawTool = canvas.getContext("2d");
drawTool.strokeStyle = "blue"
drawTool.lineWidth = 4;
drawTool.beginPath();
drawTool.moveTo(10,10);
drawTool.lineTo(150,150);
drawTool.stroke();


drawTool.moveTo(400,50);
drawTool.lineTo(200,400);
drawTool.stroke();

