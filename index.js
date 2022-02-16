let lastX=-1;
let lastY=-1;
let coordX=[];
let coordY=[];
//var s;
var count=0;
let time_step=10;
var t=0;
let series_idx=1;
var pixel_space=[];
var d;
var series=[];
function addallPoints(x1,x2,y1,y2){
 
  
  if (x1==x2){
    for (let i=Math.min(y1,y2);i<=Math.max(y1,y2);i++){
        if (i==y2){
          continue;
        }
        pixel_space.push([x1,i]);
      
    }

    return;
  }
  if (y1==y2){
    for (let i=Math.min(x1,x2);i<=Math.max(x1,x2);i++){
      if (i==x2){
        continue;
      }
      pixel_space.push([i,y1]);
      
    }

    return;
  }
  slope=(y2-y1)/(x2-x1);
  curr_x=Math.min(x1,x2);
  
  while (curr_x<=Math.max(x1,x2)){
    
    let curr_y=slope*(curr_x-x1)+y1;
    if ((curr_x==parseInt(curr_x) && parseInt(curr_y)==curr_y) && (curr_x!=x2 || curr_y!=y2)){
      pixel_space.push([curr_x,curr_y]);
    }
    curr_x++;
    
    
  }
  return;
}
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
//pixel_space.push([x,y]);
x2 = e.offsetX;
y2 = e.offsetY;
addallPoints(x,x2,y,y2);
lastX=x2;
lastY=y2;
ctx.strokeStyle = "rgb(255,255,255)";
ctx.lineWidth = 3;
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
function removeAllItems(){
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
  var div2=document.getElementById("div2");
  pixel_space=[];
  removeAllItems();
  resetAnimation();
  div2.appendChild(canvas);
  manageCanvas();
  addSumbitButton();
  
}

function displayImage(){
  removeAllItems();
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
function integrate(f){
  var ans=[0,0];
  var N=pixel_space.length;
  for (var i=0;i<pixel_space.length;i++){
    var x=pixel_space[i][0];
    var y=pixel_space[i][1];

    var val1=[x,y];
    var val2=[Math.cos(2*Math.PI/N*i*f),Math.sin(2*Math.PI/N*i*f)];
    var prod=mult(val1,val2);
    
    ans[0]+=prod[0]*1/N;
    ans[1]+=prod[1]*1/N;
   
  }
  
  return ans
}
function eval(idx,freq,c){
  var ans=[0,0];
  var N=pixel_space.length;
  for (var i=0;i<freq.length;i++){
    var f=freq[i];
    var val1=c[i];
    var val2=[Math.cos(2*Math.PI/N*idx*f),-1*Math.sin(2*Math.PI/N*idx*f)];
    var prod=mult(val1,val2);
    
    ans[0]+=prod[0]
    ans[1]+=prod[1]
  }
 
  return ans;
  
}

function getFourierSeries(numCircles){
  if (numCircles==-1 && count==parseInt(pixel_space.length/2+1)){
    clearInterval(d);
    return;
  }
  if (numCircles==-1){
    numCircles=count;
  };
  
  let freq=[];
  let c=[]
  series=[]
  numCircles=parseInt(numCircles);
  
  for (var i=-1*numCircles;i<numCircles+1;i++){
    
    freq.push(i);
  }
  
  for (var i=(-1*numCircles);i<numCircles+1;i++){
    
    it=integrate(i);
    c.push(it);
    

  }
  for (var i=0;i<pixel_space.length;i++){
   

    var add=eval(i,freq,c);
    if (i==0){
    }
    series.push([parseInt(add[0]),parseInt(add[1])]);
    
  }
  // draw fourier series
  
  var canvas=document.getElementById("draw");
  var ctx = canvas.getContext("2d", { alpha: false });
  ctx.fillStyle = "rgb(0,0,0)";
  series_idx=1;
  ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
  while (!draw()){
  }
  count++;
      
}
function draw(){
    
    if (series_idx==series.length){      
      return true;
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
    return false;
  }


function addSlider(){
  var slider=document.createElement("input");
  slider.type="range";
  slider.id="slider";
  slider.min="1";
  slider.max=parseInt(pixel_space.length/2)+1;
  slider.value=count;
  slider.onchange=function(){getFourierSeries(slider.value)};
  div2=document.getElementById("div2");
  div2.appendChild(slider);
}
function end(){
  console.log("EHJSDKF:LSJKDF");
  document.getElementById("div2").removeChild(document.getElementById("button3")); 
  clearInterval(d); 
  addSlider();
}
function addStopAnimation(){
  let button3=document.createElement("button");
  button3.id="button3";
  button3.textContent="Stop Animation";
  button3.onclick=function(){end()}
  document.getElementById("div2").append(button3);
}
function resetAnimation(){
  clearInterval(d);
  count=0;
}
function lockCanvas(){
  document.getElementById("div2").removeChild(document.getElementById("button2"));
  addStopAnimation();
  d=setInterval(getFourierSeries,15,-1);
}
function addSumbitButton(){
  var button=document.createElement("button");
  button.id="button2";
  button.textContent="Sumbit";
 
  button.onclick=function () {lockCanvas()};
  document.getElementById("div2").append(button);
  return;
}
