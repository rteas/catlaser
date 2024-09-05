const Colors = Object.freeze({
  RED: Symbol('red'),
  BLUE: Symbol('blue'),
  GREEN: Symbol('green'),
});

const STATE = Object.freeze({
  IDLE: Symbol('IDLE'),
});

export default class LaserBall {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.history = [];
    // contains [x, y] coordinates
    // used to interpolate movement at a 60th of a second
    this.path = [];
    this.movement = 'stationary';
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  drawHistory(ctx) {
    this.history.forEach((histBall) => {
      histBall.draw(ctx);
    });
  }

  dashMove(duration, xDest, yDest) {
    let dx = (xDest - this.x) / (duration * 60);
    let dy = (yDest - this.y) / (duration * 60);

    let moveX = this.x;
    let moveY = this.y;

    while (Math.abs(moveX - xDest) > Math.abs(dx)) {
      moveX += dx;
      moveY += dy;
      this.path.push([moveX, moveY]);
    }
    this.path.push([xDest, yDest]);
  }

  /**
   *
   * @param {*} duration
   * @param {*} xDest
   * @param {*} yDest
   * @param {*} approximate
   */
  curveMovement(
    duration,
    xDest,
    yDest,
    amp = 100,
    freqx = 1,
    freqy = 4,
    approximate
  ) {
    let dx = (xDest - this.x) / (duration * 60);
    let dy = (yDest - this.y) / (duration * 60);

    let moveX = this.x;
    let moveY = this.y;

    let loopCount = 1;

    while (Math.abs(moveX - xDest) > Math.abs(dx)) {
      moveX += dx;
      moveY += dy;
      this.path.push([
        moveX +
          amp *
            Math.cos(
              (freqx * dx * loopCount * Math.PI) / Math.abs(xDest - this.x)
            ),
        moveY +
          amp *
            Math.sin(
              (freqy * dy * loopCount * Math.PI) / Math.abs(yDest - this.y)
            ),
      ]);
      loopCount++;
    }
    if (!approximate) {
      this.path.push([xDest, yDest]);
    }
  }

  update() {
    if (this.path.length > 0) {
      let moveCoords = this.path.shift();
      this.move(moveCoords[0], moveCoords[1]);
    }
    for (let i = 0; i < this.history.length; i++) {
      let histBall = this.history[i];
      histBall.radius -= 0.25;
      if (histBall.radius < 0.3) {
        this.history.splice(i, 1);
        i--;
      }
    }
  }

  changeColor() {}

  move(x, y) {
    let xdist = Math.abs(x - this.x);
    let ydist = Math.abs(y - this.y);
    let clones = Math.max(xdist, ydist);
    let dx = (x - this.x) / (clones + this.radius / 2);
    let dy = (y - this.y) / (clones + this.radius / 2);

    while (Math.abs(this.x - x) > 1) {
      this.x += dx;
      this.y += dy;
      this.history.push(new LaserBall(this.x, this.y, this.radius, this.color));
    }
  }
}
