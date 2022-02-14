let lastX=-1;
let lastY=-1;
let coordX=[];
let coordY=[];
var s;
const dt=0.001;
var t=0;
let series_idx=1;
var stopCallback = null;



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
lastX=x2;
lastY=y2;
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
  addSumbitButton();
  collectCords();
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
function mult(val1,val2){
  var a,b,c,d;
  a=val1[0];
  b=val1[1];
  c=val2[0];
  d=val2[1];
  
  return [a*c-b*d,a*d+b*c];
}
function integrate(f,pixel_space,step){
  var ans=[0,0];
  var t=0;
  for (var i=0;i<pixel_space.length;i++){
    var x=pixel_space[i][0];
    var y=pixel_space[i][1];

    var val1=[x,y];
    var val2=[Math.cos(-2*Math.PI*f*t),Math.sin(-2*Math.PI*f*t)];
    var prod=mult(val1,val2);
    
    ans[0]+=prod[0]*step;
    ans[1]+=prod[1]*step;
    t+=step;
   
  }
  
  return ans
}
function eval(t,freq,c){
  var ans=[0,0];
  for (var i=0;i<freq.length;i++){
    var f=freq[i];
    var val1=c[i];
    var val2=[Math.cos(2*Math.PI*f*t),Math.sin(2*Math.PI*f*t)];
    var prod=mult(val1,val2);
    
    ans[0]+=prod[0]
    ans[1]+=prod[1]
  }
 
  return ans;
  
}

function getFourierSeries(){
  console.log("Processing");

  clearInterval(s);
  let pixel_space=[]
  let freq=[];
  let c=[]
  const numCircles=250;
  var series=[];
  t=coordX.length*dt;
  let step=(dt/(t-dt));
  console.log(step);
  for (var i=0;i<1;i+=step){

    let idx=parseInt(i*(t-dt)/dt);
    pixel_space.push([coordX[idx],coordY[idx]]);
    
  }
 
  for (var i=-1*numCircles;i<numCircles+1;i++){
    
    freq.push(i);
  }
  
  for (var i=(-1*numCircles);i<numCircles+1;i++){
    it=integrate(i,pixel_space,step);
    c.push([it[0],it[1]]);
    

  }
  
  for (var i=0;i<1;i+=step){
   

    var add=eval(i,freq,c,pixel_space);
    
    series.push([parseInt(add[0]),parseInt(add[1])]);
    
  }
  console.log(series.length,pixel_space.length);
  // draw fourier series
  series_idx=1;
  var canvas=document.getElementById("draw");
  var ctx = canvas.getContext("2d", { alpha: false });
  ctx.fillStyle = "rgb(0,0,0)";
  ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
  
  var d = setInterval((series) => {
    
    if (series_idx==series.length){
      clearInterval(d);
      
      return;
    }
    var x1=series[series_idx-1][0];
    var y1=series[series_idx-1][1];
    var x2=series[series_idx][0];
    var y2=series[series_idx][1];
    var canvas=document.getElementById("draw");
    var ctx = canvas.getContext("2d", { alpha: false });
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
    series_idx++;
    }
    ,1000*dt,series);
    
}

function addSumbitButton(){
  var button=document.createElement("button1");
  button.id="button1";
  button.style.height="50px";
  button.style.width="100px";
  button.textContent="Sumbit";
  button.style.fontSize="20px";
  button.onclick=function () {getFourierSeries()};
  document.getElementById("div2").append(button);
  return;
}



function addCord(){
  
  if (lastX!=-1){
    coordX.push(lastX);
    coordY.push(lastY);
    
  }

  
}



function collectCords(){

  coordX=[];
  coordY=[];
  lastX=-1;
  lastY=-1;
  t=0;
  s = setInterval(addCord,dt*1000);
}