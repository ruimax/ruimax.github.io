const canvas = document.getElementById('canvas');
const context = canvas.getContext("2d");
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"];

let balls = [];
let window_width = window.innerWidth || 1024;
let window_height = window.innerHeight || 768;
let r = Math.round(window_width*4/5/108) - 1; //半径
let window_left = Math.round(window_width/10) || 60;
let window_top = Math.round(window_height/5) || 30;


canvas.width = window_width;
canvas.height = window_height;

// 获取当前时间
let curShowTimeSeconds = new Date();

// let interval = setInterval(function(){
//   render();
//   update();
// }, 50);

// 更新时间，产生小球
function update() {
  var nextShowTimeSeconds = new Date();

  var nextH = nextShowTimeSeconds.getHours();
  var nextM = nextShowTimeSeconds.getMinutes();
  var nextS = nextShowTimeSeconds.getSeconds(); 

  var curH = curShowTimeSeconds.getHours();
  var curM = curShowTimeSeconds.getMinutes();
  var curS = curShowTimeSeconds.getSeconds();

  if(nextS != curS){
    if(parseInt(curH/10) != parseInt(nextH/10)){ // 小时的十位数变化
      addBalls(window_left, window_top,parseInt(nextH/10));
    }
    if(parseInt(curH%10) != parseInt(nextH%10)){ // 小时的各位数变化
      addBalls(window_left + 15*(r+1), window_top,parseInt(nextH%10));
    }
    if(parseInt(curM/10) != parseInt(nextM/10)){ // 分钟的十位数变化
      addBalls(window_left + 39*(r+1), window_top,parseInt(nextM/10));
    }
    if(parseInt(curM%10) != parseInt(nextM%10)){ // 分钟的个位数变化
      addBalls(window_left + 54*(r+1), window_top,parseInt(nextM%10));
    }
    if(parseInt(curS/10) != parseInt(nextS/10)){ // 秒的十位数变化
      addBalls(window_left + 78*(r+1), window_top,parseInt(nextS/10));
    }
    if(parseInt(curS%10) != parseInt(nextS%10)){ // 秒的个位数变化
      addBalls(window_left + 93*(r+1), window_top,parseInt(nextS%10));
    }
    curShowTimeSeconds = nextShowTimeSeconds;
  }

  updateBalls();

  console.log(balls.length);

}
function updateBalls(){
  for(var i = 0; i < balls.length; i++){
    balls[i].x += balls[i].vx;
    balls[i].y += balls[i].vy;
    balls[i].vy += balls[i].g;

    if(balls[i].y >= window_height - r){
      balls[i].y = window_height - r;
      balls[i].vy = -balls[i].vy * 0.8;
    }
  }

  var cnt = 0;
  for(var i = 0;i < balls.length; i++){
    if(balls[i].x + r > 0 && balls[i].x - r < window_width){
      balls[cnt++] = balls[i];
    }
  }
  while(balls.length > Math.min(500, cnt)){
    balls.pop();
  }
}
//设置小球物理运动初值
function addBalls(x, y, num){
  for(var i = 0;i < digit[num].length; i++){
    for(var j = 0;j < digit[num][i].length; j++){
      if(digit[num][i][j] == 1){
        var aBall = {
          x: x + j*2*(r+1) + (r+1),
          y: y + i*2*(r+1) + (r+1),
          g: 1.5 + Math.random(),//1.5-2.5
          vx: Math.pow(-1,Math.ceil(Math.random()*1000))*4,//-1,Math.ceil(Math.random()*1000)求得-1或1
          vy: -5,//小球向上的速度
          color: colors[Math.floor(Math.random() * colors.length)]
        } 
        balls.push(aBall);
      }
    }
  }

}

//绘制画布
function render(){
  context.clearRect(0, 0, window_width, window_height); //清空canvas画布

  var h = curShowTimeSeconds.getHours();
  var m = curShowTimeSeconds.getMinutes();
  var s = curShowTimeSeconds.getSeconds();
  
  //绘制小时
  renderDigit(parseInt(h/10), window_left, window_top);
  renderDigit(parseInt(h%10), window_left + 15*(r+1), window_top, );
  renderDigit(10,             window_left + 30*(r+1), window_top);
  //绘制分钟
  renderDigit(parseInt(m/10), window_left + 39*(r+1), window_top);
  renderDigit(parseInt(m%10), window_left + 54*(r+1), window_top);
  renderDigit(10,             window_left + 69*(r+1), window_top);
  //绘制秒
  renderDigit(parseInt(s/10), window_left + 78*(r+1), window_top);
  renderDigit(parseInt(s%10), window_left + 93*(r+1), window_top);

  for(var i = 0;i < balls.length; i++){
    context.fillStyle = balls[i].color;

    context.beginPath();
    context.arc(balls[i].x, balls[i].y, r, 0, 2*Math.PI,true);
    context.closePath();

    context.fill();
  }
  update();
  requestAnimationFrame(render);
}

function renderDigit(num, x, y){
  context.fillStyle = "rgb(0,102,153)";

  for(let i = 0; i < digit[num].length; i++){
    for(let j = 0; j < digit[num][i].length; j++){
      if (digit[num][i][j] == 1) {
        context.beginPath();
        let rX = x+j*2*(r+1)+(r+1);
        let rY = y+i*2*(r+1)+(r+1);
        context.arc(rX, rY, r, 0, 2*Math.PI); //圆心x，y 半径 起始弧度 终止弧度
        context.closePath();
        context.fill();
      }
    }
  }
}

requestAnimationFrame(render);
