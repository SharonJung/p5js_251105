const sketch = (p) => {
  let lines = [];
  const numLines = 50; // 增加线条数量，更密集
  const lineSegments = 35; // 增加线段数量，线条更平滑
  const gravity = 0.1; // 减小重力，让线条更轻
  const damping = 0.98; // 增加阻尼，减少能量损失，让线条摆动更久
  const mouseInfluence = 1.5; // 减小鼠标影响，避免过度干扰
  const mouseRadius = 90; // 增加鼠标影响范围

  p.setup = () => {
    const canvas = p.createCanvas(690, 700);
    canvas.parent("canvas-container");

    for (let i = 0; i < numLines; i++) {
      lines.push(new Line(i * (p.width / (numLines - 1))));
    }
  };

  p.draw = () => {
    p.background(26, 26, 46);

    for (let line of lines) {
      line.update();
      line.display();
    }
  };

  p.mousePressed = () => {
    lines = [];
    for (let i = 0; i < numLines; i++) {
      lines.push(new Line(i * (p.width / (numLines - 1))));
    }
  };

  class Line {
    constructor(x) {
      this.points = [];
      this.segmentLength = p.height / lineSegments;

      for (let i = 0; i < lineSegments; i++) {
        this.points.push({
          x: x,
          y: i * this.segmentLength,
          oldX: x,
          oldY: i * this.segmentLength,
        });
      }
      this.points[0].pinned = true;
    }

    update() {
      for (let i = 1; i < this.points.length; i++) {
        let point = this.points[i];
        if (!point.pinned) {
          let tempX = point.x;
          let tempY = point.y;
          let vx = (point.x - point.oldX) * damping;
          let vy = (point.y - point.oldY) * damping;
          point.x += vx;
          point.y += vy + gravity;
          point.oldX = tempX;
          point.oldY = tempY;
        }
      }

      for (let j = 0; j < 2; j++) {
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

      for (let i = 1; i < this.points.length; i++) {
        let point = this.points[i];
        if (point.x < 0) point.x = 0;
        if (point.x > p.width) point.x = p.width;
        if (point.y > p.height) point.y = p.height;
      }
    }

    display() {
      p.stroke(120, 180, 255, 180);
      p.strokeWeight(1.5);
      p.noFill();
      p.beginShape();
      for (let i = 0; i < this.points.length; i++) {
        p.curveVertex(this.points[i].x, this.points[i].y);
      }
      p.endShape();
    }
  }
};
