// 定义弹球计数变量

const para = document.querySelector('p');
let count = 0;

// 设置画布

// 获取canvas元素
const canvas = document.querySelector('canvas');
// 获取canvas的2D上下文
const ctx = canvas.getContext('2d');

// 设置canvas的宽度和高度为窗口的宽度和高度
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// 生成随机数的函数

// 定义一个函数，用于生成指定范围内的随机数
function random(min,max) {
  // 生成一个指定范围内的随机数
  const num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

// 生成随机颜色值的函数

// 生成随机颜色函数
function randomColor() {
  // 生成随机颜色值
  const color = 'rgb(' +
                random(0, 255) + ',' +
                random(0, 255) + ',' +
                random(0, 255) + ')';
  // 返回随机颜色值
  return color;
}

// 定义 Shape 构造器

// 定义一个Shape函数，用于创建一个形状对象
// 定义一个Shape函数，用于创建形状对象
function Shape(x, y, velX, velY, exists) {
  // x：形状对象的x坐标
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;
}

// 定义 Ball 构造器，继承自 Shape

function Ball(x, y, velX, velY, exists, color, size) {
  Shape.call(this, x, y, velX, velY, exists);

  this.color = color;
  this.size = size;
}

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

// 定义彩球绘制函数

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

// 定义彩球更新函数

Ball.prototype.update = function() {
  if((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
};

// 定义碰撞检测函数

Ball.prototype.collisionDetect = function() {
  for(var j = 0; j < balls.length; j++) {
    if(this !== balls[j]) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size && balls[j].exists) {
        balls[j].color = this.color = randomColor();
      }
    }
  }
};

// 定义 EvilCircle 构造器, 继承自 Shape

function EvilCircle(x, y, exists, name) {
  Shape.call(this, x, y, 20, 20, exists);
  this.color = 'red';
  this.size = 40;
  this.name = "派小星"; // 添加名字属性
}

EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

// 修改 EvilCircle 绘制方法
// 修改 EvilCircle 绘制方法
EvilCircle.prototype.draw = function() {
  ctx.beginPath();
  ctx.strokeStyle = this.color;
  ctx.lineWidth = 5;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();

  // 创建渐变
  var gradient = ctx.createLinearGradient(this.x - this.size / 2, this.y - this.size / 2, this.x + this.size / 2, this.y + this.size / 2);
  gradient.addColorStop(0, 'orange');    // 开始颜色
  gradient.addColorStop(1, 'blue');   // 结束颜色

  // 设置文本样式
  ctx.font = '20px Arial'; // 设置字体大小和类型
  ctx.textAlign = 'center'; // 设置文本对齐方式
  ctx.textBaseline = 'middle'; // 设置文本基线

  // 绘制渐变色文本
  ctx.fillStyle = gradient;
  ctx.fillText(this.name, this.x, this.y); // 将文本绘制在圆心位置
};

// 定义 EvilCircle 的边缘检测（checkBounds）方法

EvilCircle.prototype.checkBounds = function() {
  if((this.x + this.size) >= width) {
    this.x -= this.size;
  }

  if((this.x - this.size) <= 0) {
    this.x += this.size;
  }

  if((this.y + this.size) >= height) {
    this.y -= this.size;
  }

  if((this.y - this.size) <= 0) {
    this.y += this.size;
  }
};

// 定义 EvilCircle 控制设置（setControls）方法

EvilCircle.prototype.setControls = function() {
  window.onkeydown = e => {
    switch(e.key) {
      case 'a':
      case 'A':
      case 'ArrowLeft':
        this.x -= this.velX;
        break;
      case 'd':
      case 'D':
      case 'ArrowRight':
        this.x += this.velX;
        break;
      case 'w':
      case 'W':
      case 'ArrowUp':
        this.y -= this.velY;
        break;
      case 's':
      case 'S':
      case 'ArrowDown':
        this.y += this.velY;
        break;
    }
  };
};

// 定义 EvilCircle 冲突检测函数

EvilCircle.prototype.collisionDetect = function() {
  for(let j = 0; j < balls.length; j++) {
    if( balls[j].exists ) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].exists = false;
        count--;
        para.textContent = '剩余彩球数：' + count;
        this.size += 0.45;
        if (this.size > this.maxSize) {
          this.size = this.maxSize;
        }
      }
    }
  }
};


// 定义一个数组，生成并保存所有的球，

const balls = [];

while(balls.length < 221) {
  const size = random(1,17);
  let ball = new Ball(
    // 为避免绘制错误，球至少离画布边缘球本身一倍宽度的距离
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    true,
    randomColor(),
    size
  );
  balls.push(ball);
  count++;
  para.textContent = '剩余彩球数：' + count;
}

// 定义一个循环来不停地播放

let evil = new EvilCircle(random(0, width), random(0, height), true);
evil.setControls();

function loop() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);

  for(let i = 0; i < balls.length; i++) {
    if(balls[i].exists) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  }

// 渲染恶魔
  evil.draw();
// 检查恶魔的边界
  evil.checkBounds();
// 检测恶魔的碰撞
  evil.collisionDetect();

  requestAnimationFrame(loop);
}

loop();
