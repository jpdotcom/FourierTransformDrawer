
let dataExists=false;

function manageCanvas(){
let draw = false;
var c = document.getElementById("draw");
var ctx = c.getContext("2d", { alpha: false });
var x = 0;
var y = 0;

function canDraw(e) {
draw = true;
x = e.offsetX;
y = e.offsetY;

}

function cantDraw() {
draw = false;
}

myCanvas = document.getElementById("draw");
myCanvas.addEventListener("mousedown", canDraw, false);
myCanvas.addEventListener("mouseup", cantDraw, false);
myCanvas.addEventListener("mousemove", drawLine, false);
myCanvas.addEventListener("mouseleave", cantDraw, false);
myCanvas.width=800;
myCanvas.height=500;
function clearCanvas() {
ctx.fillStyle = "rgb(0,0,0)";
ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);

}

clearCanvas();

function drawLine(e) {
if (!draw) {
  return;
}

x2 = e.offsetX;
y2 = e.offsetY;

ctx.strokeStyle = "rgb(255,255,255)";
ctx.lineWidth = 1;
a = [0];
b = a;

for (i = 0; i < a.length; i++) {
  for (j = 0; j < b.length; j++) {
    ctx.beginPath();
    ctx.moveTo(x + a[i], y + b[j]);
    ctx.lineTo(x2 + a[i], y2 + b[j]);
    ctx.stroke();
  }
}

x = x2;
y = y2;
}
}
function removeLastItem(){
  dateExists=false;
  var div2=document.getElementById("div2");
  while (div2.childElementCount!=0){
    div2.removeChild(div2.lastChild);
  }
  return;
}
function createCanvas(){
	console.log("Creating Canvas")
	var canvas=document.createElement("canvas");
  canvas.id="draw";


	var div2=document.getElementById("div2")
  removeLastItem();
	div2.appendChild(canvas);
  manageCanvas();
  dateExists=true;
  addSumbitButton();
}

function displayImage(){
  removeLastItem();
  var file=document.getElementById("upload");
  var fr = new FileReader();
  fr.readAsDataURL(file.files[0]);
  fr.onload = function(e){
    var img = document.createElement("img");
    img.src=e.target.result;
    document.getElementById("div2").appendChild(img);
    addSumbitButton();
  }
  dateExists=true;
  
  return;
}

function addSumbitButton(){
  var button=document.createElement("button1");
  button.id="button1";
  button.style.height="50px";
  button.style.width="100px";
  button.textContent="Sumbit";
  button.style.fontSize="20px";
  document.getElementById("div2").append(button);
  return;
}

function getFourierSeries(){
  console.log("Processing");
}



