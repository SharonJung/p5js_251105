let lines = [];
const numLines = 50; // 增加线条数量，更密集
const lineSegments = 35; // 增加线段数量，线条更平滑
const gravity = 0.1; // 减小重力，让线条更轻
const damping = 0.98; // 增加阻尼，减少能量损失，让线条摆动更久
const mouseInfluence = 1.5; // 减小鼠标影响，避免过度干扰
const mouseRadius = 90; // 增加鼠标影响范围

function setup() {
  const canvas = createCanvas(690, 700);
  canvas.parent("canvas-container");

  // 初始化线条
  for (let i = 0; i < numLines; i++) {
    lines.push(new Line(i * (width / (numLines - 1))));
  }
}

function draw() {
  background(26, 26, 46);

  // 更新并绘制所有线条
  for (let line of lines) {
    line.update();
    line.display();
  }
}

function mousePressed() {
  // 点击时重置模拟
  lines = [];
  for (let i = 0; i < numLines; i++) {
    lines.push(new Line(i * (width / (numLines - 1))));
  }
}

class Line {
  constructor(x) {
    this.points = [];
    this.segmentLength = height / lineSegments;

    // 初始化线条上的点
    for (let i = 0; i < lineSegments; i++) {
      this.points.push({
        x: x,
        y: i * this.segmentLength,
        oldX: x,
        oldY: i * this.segmentLength,
      });
    }

    // 固定顶部点
    this.points[0].pinned = true;
  }

  update() {
    // 应用重力
    for (let i = 1; i < this.points.length; i++) {
      let point = this.points[i];

      // 如果不是固定点，则应用物理效果
      if (!point.pinned) {
        // 保存当前位置
        let tempX = point.x;
        let tempY = point.y;

        // 计算速度
        let vx = (point.x - point.oldX) * damping;
        let vy = (point.y - point.oldY) * damping;

        // 更新位置（添加重力）
        point.x += vx;
        point.y += vy + gravity;

        // 保存旧位置
        point.oldX = tempX;
        point.oldY = tempY;
      }
    }

    // 约束点之间的距离
    for (let j = 0; j < 2; j++) {
      // 减少迭代次数，让线条更柔软
      for (let i = 0; i < this.points.length - 1; i++) {
        let point1 = this.points[i];
        let point2 = this.points[i + 1];

        let dx = point2.x - point1.x;
        let dy = point2.y - point1.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let difference = this.segmentLength - distance;
        let percent = difference / distance / 2;

        let offsetX = dx * percent;
        let offsetY = dy * percent;

        if (!point1.pinned) {
          point1.x -= offsetX;
          point1.y -= offsetY;
        }

        if (!point2.pinned) {
          point2.x += offsetX;
          point2.y += offsetY;
        }
      }
    }

    // 鼠标交互
    for (let i = 1; i < this.points.length; i++) {
      let point = this.points[i];
      let dx = point.x - mouseX;
      let dy = point.y - mouseY;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouseRadius && !point.pinned) {
        let angle = Math.atan2(dy, dx);
        let force = (mouseRadius - distance) / mouseRadius;

        point.x += Math.cos(angle) * force * mouseInfluence;
        point.y += Math.sin(angle) * force * mouseInfluence;
      }
    }

    // 边界约束
    for (let i = 1; i < this.points.length; i++) {
      let point = this.points[i];
      if (point.x < 0) point.x = 0;
      if (point.x > width) point.x = width;
      if (point.y > height) point.y = height;
    }
  }

  display() {
    // 绘制线条 - 使用更细的线条
    stroke(120, 180, 255, 180); // 稍微调整颜色
    strokeWeight(1.5); // 减小线条粗细
    noFill();

    beginShape();
    for (let i = 0; i < this.points.length; i++) {
      curveVertex(this.points[i].x, this.points[i].y);
    }
    endShape();

    /*
    // 可选：绘制点（现在点更小）
    fill(180, 200, 255, 150);
    noStroke();
    for (let i = 0; i < this.points.length; i++) {
      if (i === 0) {
        // 固定点用不同颜色显示
        fill(255, 100, 100, 200);
        ellipse(this.points[i].x, this.points[i].y, 6, 6);
      } else {
        fill(180, 200, 255, 120);
        ellipse(this.points[i].x, this.points[i].y, 3, 3);
      }
    }
    */
  }
}
