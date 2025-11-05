// sketch_grass.js - 重力向上的绿色线条模拟
const sketch_grass = (p) => {
  let lines = [];
  const numLines = 3000; // 增加线条数量以覆盖整个画布
  const lineSegments = 4; // 保持分割次数不变
  const gravity = -0.3; // 重力向上（负值）
  const damping = 0.96; // 阻尼
  const mouseInfluence = 2.5; // 鼠标影响
  const mouseRadius = 75; // 鼠标影响范围

  p.setup = () => {
    const canvas = p.createCanvas(600, 600); // 高度从500增加到600
    canvas.parent("canvas-container");

    // 在整个画布区域随机初始化线条，但保持原来的高度范围
    for (let i = 0; i < numLines; i++) {
      lines.push(
        new Line(
          p.random(50, p.width - 50), // x坐标：整个画布宽度范围
          p.random(150, p.height - 5) // y坐标：保持原来的500高度范围，而不是p.height
        )
      );
    }
  };

  p.draw = () => {
    // 白色背景（整个画布）
    p.background(248, 248, 255);
    // p.background(68, 99, 63);

    // 更新和显示所有线条
    for (let line of lines) {
      line.update();
      line.display();
    }
  };

  // p.draw = () => {
  //   // 绿色渐变背景 - 从浅绿到深绿
  //   let topColor = p.color(106, 168, 79); // 浅绿色
  //   let bottomColor = p.color(68, 99, 63); // 深绿色

  //   for (let y = 0; y < p.height; y++) {
  //     let inter = p.map(y, 0, p.height, 0, 1);
  //     let c = p.lerpColor(topColor, bottomColor, inter);
  //     p.stroke(c);
  //     p.line(0, y, p.width, y);
  //   }

  //   // 更新和显示所有线条
  //   for (let line of lines) {
  //     line.update();
  //     line.display();
  //   }
  // };

  p.mousePressed = () => {
    // 点击重置模拟
    lines = [];
    for (let i = 0; i < numLines; i++) {
      lines.push(
        new Line(
          p.random(50, p.width - 50),
          p.random(150, p.height - 5) // 同样保持原来的500高度范围
        )
      );
    }
  };

  class Line {
    constructor(startX, startY) {
      this.points = [];
      this.segmentLength = 50; // 线段长度

      // 创建固定长度的线条
      for (let i = 0; i < lineSegments; i++) {
        this.points.push({
          x: startX,
          y: startY - i * this.segmentLength, // 向上生长
          oldX: startX,
          oldY: startY - i * this.segmentLength,
        });
      }
      // 只有起点固定
      this.points[0].pinned = true;
    }

    update() {
      // 物理更新
      for (let i = 1; i < this.points.length; i++) {
        let point = this.points[i];
        if (!point.pinned) {
          let tempX = point.x;
          let tempY = point.y;
          let vx = (point.x - point.oldX) * damping;
          let vy = (point.y - point.oldY) * damping;

          // 添加微风效果 - 随机水平摆动
          let windForce =
            p.noise(point.x * 0.01, point.y * 0.01, p.frameCount * 0.01) - 0.5;
          windForce *= 0.3; // 控制风力强度

          point.x += vx + windForce;
          point.y += vy + gravity; // 重力向上
          point.oldX = tempX;
          point.oldY = tempY;
        }
      }

      // 约束求解（保持线段长度）
      for (let j = 0; j < 3; j++) {
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

      // 鼠标影响
      for (let i = 1; i < this.points.length; i++) {
        let point = this.points[i];
        let dx = point.x - p.mouseX;
        let dy = point.y - p.mouseY;
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
        if (point.x > p.width) point.x = p.width;
        if (point.y < 0) point.y = 0;
        if (point.y > p.height) point.y = p.height;
      }
    }

    // display() {
    //   // 绿色渐变 - 从深绿到浅绿
    //   for (let i = 0; i < this.points.length - 1; i++) {
    //     let alpha = p.map(i, 0, this.points.length - 1, 150, 255);
    //     let greenValue = p.map(i, 0, this.points.length - 1, 100, 220);

    //     p.stroke(50, greenValue, 80, alpha);
    //     p.strokeWeight(p.map(i, 0, this.points.length - 1, 2, 1));

    //     let point1 = this.points[i];
    //     let point2 = this.points[i + 1];
    //     p.line(point1.x, point1.y, point2.x, point2.y);
    //   }
    // }

    display() {
      // 麦穗颜色渐变 - 从金黄色到浅黄色
      for (let i = 0; i < this.points.length - 1; i++) {
        let alpha = p.map(i, 0, this.points.length - 1, 180, 255);
        let goldValue = p.map(i, 0, this.points.length - 1, 160, 220);

        p.stroke(218, goldValue, 32, alpha); // 金黄色调
        p.strokeWeight(p.map(i, 0, this.points.length - 1, 2, 1));

        let point1 = this.points[i];
        let point2 = this.points[i + 1];
        p.line(point1.x, point1.y, point2.x, point2.y);
      }
    }

    // display() {
    //   // 麦穗的深金黄色
    //   p.stroke(255, 242, 135); // 深金黄色
    //   p.strokeWeight(1.5);
    //   p.noFill();

    //   p.beginShape();
    //   for (let i = 0; i < this.points.length; i++) {
    //     p.curveVertex(this.points[i].x, this.points[i].y);
    //   }
    //   p.endShape();
    // }

    /*
      display() {
      // 深绿色 - 整条曲线使用统一颜色
      p.stroke(34, 139, 34); // 森林绿
      p.strokeWeight(1.5);
      p.noFill();

      // 使用curveVertex绘制平滑曲线
      p.beginShape();
      for (let i = 0; i < this.points.length; i++) {
        p.curveVertex(this.points[i].x, this.points[i].y);
      }
      p.endShape();
    }*/
  }
};
