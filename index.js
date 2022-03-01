let lastX = -1;
let lastY = -1;
let coordX = [];
let coordY = [];
var discont = [];
var count = 1;
let time_step = 10;
var t = 0;
let series_idx = 1;
var pixel_space = [];
var d;
var series = [];
var dt = 1;
adj = {};
var f;
pixel_IMG = new Set();
function addallPoints(x1, x2, y1, y2) {
  if (x1 == x2) {
    for (let i = Math.min(y1, y2); i <= Math.max(y1, y2); i++) {
      if (i == y2) {
        continue;
      }
      pixel_space.push([x1, i]);
    }

    return;
  }
  if (y1 == y2) {
    for (let i = Math.min(x1, x2); i <= Math.max(x1, x2); i++) {
      if (i == x2) {
        continue;
      }
      pixel_space.push([i, y1]);
    }

    return;
  }
  slope = (y2 - y1) / (x2 - x1);
  curr_x = Math.min(x1, x2);

  while (curr_x <= Math.max(x1, x2)) {
    let curr_y = slope * (curr_x - x1) + y1;
    if (
      curr_x == parseInt(curr_x) &&
      parseInt(curr_y) == curr_y &&
      (curr_x != x2 || curr_y != y2)
    ) {
      pixel_space.push([curr_x, curr_y]);
    }
    curr_x++;
  }
  return;
}
function manageCanvas() {
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
  function clearCanvas() {
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
  }

  clearCanvas();

  function drawLine(e) {
    if (!draw) {
      return;
    }

    pixel_space.push([x, y]);
    x2 = e.offsetX;
    y2 = e.offsetY;
    //addallPoints(x,x2,y,y2);
    lastX = x2;
    lastY = y2;
    ctx.strokeStyle = "rgb(0,0,0)";
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
function removeAllItems() {
  dateExists = false;
  var div2 = document.getElementById("div2");
  while (div2.childElementCount != 0) {
    div2.removeChild(div2.lastChild);
  }

  return;
}
function createCanvas(w, h, strokeWidth, removeAll = true, DrawTime = 1) {
  console.log("Creating Canvas");
  var canvas = document.createElement("canvas");
  canvas.id = "draw";
  canvas.width = w;
  canvas.height = h;
  dt = DrawTime;
  var div2 = document.getElementById("div2");
  if (removeAll) {
    pixel_space = [];
  }
  if (removeAll) {
    removeAllItems();
  }
  resetAnimation();
  div2.appendChild(canvas);
  manageCanvas();
  addSumbitButton(strokeWidth);
}

function displayImage() {
  removeAllItems();
  pixel_space = [];
  adj = {};
  pixel_IMG = new Set();
  var file = document.getElementById("upload");
  var fr = new FileReader();
  fr.readAsDataURL(file.files[0]);
  dt = 0.01;
  fr.onload = function (e) {
    var img = new Image(300, 300);
    img.src = e.target.result;

    img.id = "myIMG";

    document.getElementById("div2").appendChild(img);
    createCanvas(300, 300, 1, false, 0.01);
    img.onload = function () {
      drawImage();
    };
  };
  dateExists = true;

  return;
}
function isBlack(a, b, c, background) {
  return a + b + c < background;
}
function drawImage() {
  var img = document.getElementById("myIMG");
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = 300;
  canvas.height = 300;

  ctx.drawImage(img, 0, 0, 300, 300);
  let rgb = ctx.getImageData(0, 0, 300, 300);
  var numPixels = 0;
  var idx = 0;

  //document.getElementById("div2").removeChild(document.getElementById("myIMG"));
  canvas = document.getElementById("draw");
  var ctx = canvas.getContext("2d");
  ctx.strokeStyle = "rgb(0,0,0)";

  background = rgb.data[0] + rgb.data[1] + rgb.data[2] - 20;
  begin = [];
  var numWhitePixels = 0;
  for (var i = 0; i < 300; i++) {
    for (var j = 0; j < 300; j++) {
      var c = rgb.data[idx] + rgb.data[idx + 1] + rgb.data[idx + 2];
      if (c >= 0 && c < background) {
        pixel_IMG.add(numPixels);
        if (begin.length == 0 && numWhitePixels > 300) {
          //s>300 check so it is less likely you hit a random white pixel
          begin = [i, j];
        }
        rgb.data[idx] = 0;
        rgb.data[idx + 2] = 0;
        rgb.data[idx + 1] = 0;
        numWhitePixels++;
      } else {
        rgb.data[idx] = 255;
        rgb.data[idx + 2] = 255;
        rgb.data[idx + 1] = 255;
      }
      numPixels += 1;
      idx += 4;
    }
  }
  var shiftx = (canvas.width - 300) / 2;
  var shifty = (canvas.height - 300) / 2;
  ctx.putImageData(rgb, shiftx, shifty);
  fill_dict(begin);
  add_pixels(begin[0] * 300 + begin[1], shiftx, shifty);
  console.log(pixel_space.length);
}
function add_pixels(u, shiftx, shifty, s = 0, m = 1) {
  //traverse through the spanning tree

  var x = u % 300;
  var y = Math.floor(u / 300);
  if (s % m == 0) {
    pixel_space.push([parseInt(1 * x + shiftx), parseInt(1 * y + shifty)]);
  }
  if (!(u in adj)) {
    return;
  }
  for (let i = 0; i < adj[u].length; i++) {
    add_pixels(adj[u][i], shiftx, shifty, s + 1);
    if (s % m == 0) {
      pixel_space.push([x + shiftx, y + shifty]);
    }
  }
}
function fill_dict(u) {
  // generate spanning tree of the drawing

  var stack = [u];
  var processed = new Array(300 * 300).fill(false);
  var seen = new Array(300 * 300).fill(false);
  seen[u[0] * 300 + u[1]] = true;
  while (stack.length != 0) {
    var coor = stack.pop();
    var x = coor[0];
    var y = coor[1];
    for (let i = -1; i <= 1; i += 1) {
      for (let j = -1; j <= 1; j += 1) {
        if (isValid(x + i, y + j)) {
          var val = (x + i) * 300 + (y + j);
          if (pixel_IMG.has(val) && !seen[val]) {
            degreeOne = false;
            if (!(x * 300 + y in adj)) {
              adj[x * 300 + y] = [];
            }
            seen[val] = true;
            adj[x * 300 + y].push(val);
            stack.push([x + i, y + j]);
          }
        }
      }
    }
    processed[x * 300 + y] = true;
  }
}
function isValid(x, y) {
  return 0 <= x && x <= 299 && 0 <= y && y <= 299;
}

function mult(val1, val2) {
  var a, b, c, d;
  a = val1[0];
  b = val1[1];
  c = val2[0];
  d = val2[1];

  return [a * c - b * d, a * d + b * c];
}
function integrate(f) {
  var ans = [0, 0];
  var N = pixel_space.length;
  for (var i = 0; i < pixel_space.length; i++) {
    var x = pixel_space[i][0];
    var y = pixel_space[i][1];

    var val1 = [x, y];
    var val2 = [
      Math.cos(((2 * Math.PI) / N) * i * f),
      Math.sin(((2 * Math.PI) / N) * i * f),
    ];
    var prod = mult(val1, val2);

    ans[0] += (prod[0] * 1) / N;
    ans[1] += (prod[1] * 1) / N;
  }

  return ans;
}
function eval(idx, freq, c) {
  var ans = [0, 0];
  var N = pixel_space.length;
  for (var i = 0; i < freq.length; i++) {
    var f = freq[i];
    var val1 = c[i];
    var val2 = [
      Math.cos(((2 * Math.PI) / N) * idx * f),
      -1 * Math.sin(((2 * Math.PI) / N) * idx * f),
    ];
    var prod = mult(val1, val2);

    ans[0] += prod[0];
    ans[1] += prod[1];
  }

  return ans;
}

function getFourierSeries(numCircles, strokeWidth, doDraw = true) {
  if (numCircles == -1 && count > pixel_space.length) {
    clearInterval(d);
    return;
  }
  if (numCircles == -1) {
    numCircles = count;
  }

  let freq = new Array(numCircles);
  let c = new Array(numCircles);
  series = new Array(pixel_space.length);
  numCircles = parseInt(numCircles);
  var left, right;
  let idx = 0;
  if (numCircles % 2) {
    left = (-1 * (numCircles - 1)) / 2;
    right = -1 * left;
  } else {
    left = (-1 * numCircles) / 2;
    right = numCircles / 2 - 1;
  }
  for (var i = left; i <= right; i++) {
    freq[idx] = i;
    idx += 1;
  }
  idx = 0;
  for (var i = left; i <= right; i++) {
    it = integrate(i);
    c[idx] = it;
    idx += 1;
  }
  idx = 0;
  for (var i = 0; i < pixel_space.length; i++) {
    var add = eval(i, freq, c);
    series[i] = [parseInt(add[0]), parseInt(add[1])];
    idx += 1;
  }
  //series=pixel_space
  // draw fourier series
  if (doDraw) {
    var canvas = document.getElementById("draw");
    var ctx = canvas.getContext("2d", { alpha: false });
    ctx.fillStyle = "rgb(255,255,255)";

    series_idx = 1;
    ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
    while (!draw(strokeWidth)) {}
    count += 1 / dt;
  }
}
function draw(strokeWidth) {
  if (series_idx == series.length) {
    return true;
  }
  var x0 = series[0][0];
  var y0 = series[0][1];
  var x1 = series[series_idx - 1][0];
  var y1 = series[series_idx - 1][1];
  var x2 = series[series_idx][0];
  var y2 = series[series_idx][1];
  var canvas = document.getElementById("draw");
  var ctx = canvas.getContext("2d", { alpha: false });
  ctx.lineWidth = strokeWidth;
  ctx.beginPath();

  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  series_idx++;
  return false;
}

function drawOnePicture(numCircles) {
  clearInterval(f);
  let canvas = document.getElementById("draw");
  let ctx = canvas.getContext("2d", { alpha: false });
  let strokeWidth = canvas.lineWidth;
  getFourierSeries(numCircles, strokeWidth, false);
  ctx.fillStyle = "rgb(255,255,255)";
  series_idx = 1;
  ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
  f = setInterval(function () {
    let out = draw(strokeWidth);
    if (out) {
      series_idx = 1;
      ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
    }
  }, 10);
}

function addSlider() {
  var slider = document.createElement("input");
  slider.type = "range";
  slider.id = "slider";
  slider.min = "1";
  slider.max = pixel_space.length;
  slider.value = count;
  slider.onchange = function () {
    drawOnePicture(slider.value);
  };
  div2 = document.getElementById("div2");
  div2.appendChild(slider);
}
function end() {
  document
    .getElementById("div2")
    .removeChild(document.getElementById("button3"));
  clearInterval(d);
  addSlider();
}
function addStopAnimation() {
  let button3 = document.createElement("button");
  button3.id = "button3";
  button3.textContent = "Stop Animation";
  button3.onclick = function () {
    end();
  };
  document.getElementById("div2").append(button3);
}
function resetAnimation() {
  clearInterval(d);
  count = 1;
}
function lockCanvas(strokeWidth) {
  document
    .getElementById("div2")
    .removeChild(document.getElementById("button2"));
  //add animation
  d = setInterval(getFourierSeries, 5, -1, strokeWidth);
  addStopAnimation();
}
function addSumbitButton(strokeWidth) {
  var button = document.createElement("button");
  button.id = "button2";
  button.textContent = "Sumbit";

  button.onclick = function () {
    lockCanvas(strokeWidth);
  };
  document.getElementById("div2").append(button);
  return;
}
