const sketch_letter = (p) => {
    let lines = [];
    const numLines = 50;
    const lineSegments = 35;
    const gravity = 0.1;
    const damping = 0.98;
    const mouseInfluence = 1.5;
    const mouseRadius = 90;

    const letterSpeed = 1.5;
    const letterSpacing = 25;
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
    const letterSize = 14;

    p.setup = () => {
        const canvas = p.createCanvas(690, 700);
        canvas.parent("canvas-container");

        for (let i = 0; i < numLines; i++) {
            lines.push(new Line(i * (p.width / (numLines - 1))));
        }

        p.textSize(letterSize);
        p.textAlign(p.CENTER, p.CENTER);
    };

    p.draw = () => {
        p.background(26, 26, 46, 50);

        for (let line of lines) {
            line.update();
            line.display();
            line.updateLetters();
            line.displayLetters();
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
            this.letters = [];

            for (let i = 0; i < lineSegments; i++) {
                this.points.push({
                    x: x,
                    y: i * this.segmentLength,
                    oldX: x,
                    oldY: i * this.segmentLength,
                });
            }
            this.points[0].pinned = true;
            this.initLetters();
        }

        initLetters() {
            this.letters = [];
            for (let y = 0; y < p.height; y += letterSpacing) {
                this.addLetter(y);
            }
        }

        addLetter(startY) {
            const char = letters.charAt(Math.floor(p.random(letters.length)));
            this.letters.push({
                char: char,
                segmentIndex: 0,
                progress: 0,
                position: p.createVector(this.points[0].x, startY),
                targetY: startY,
                brightness: p.random(150, 255),
            });
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

        updateLetters() {
            for (let letter of this.letters) {
                letter.targetY += letterSpeed;
                if (letter.targetY > p.height) {
                    letter.targetY = 0;
                    letter.char = letters.charAt(Math.floor(p.random(letters.length)));
                    letter.brightness = p.random(150, 255);
                }

                let targetSegment = 0;
                for (let i = 0; i < this.points.length - 1; i++) {
                    if (
                        letter.targetY >= this.points[i].y &&
                        letter.targetY <= this.points[i + 1].y
                    ) {
                        targetSegment = i;
                        break;
                    }
                }

                const segment = targetSegment;
                const y1 = this.points[segment].y;
                const y2 = this.points[segment + 1].y;
                const t = (letter.targetY - y1) / (y2 - y1);
                const x1 = this.points[segment].x;
                const x2 = this.points[segment + 1].x;
                letter.position.x = p.lerp(x1, x2, t);
                letter.position.y = letter.targetY;
            }
        }

        displayLetters() {
            for (let letter of this.letters) {
                p.fill(100, 255, 150, letter.brightness);
                p.noStroke();
                p.text(letter.char, letter.position.x, letter.position.y);
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
