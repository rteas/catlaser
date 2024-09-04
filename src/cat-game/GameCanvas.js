import React, { useState, useRef, useEffect } from 'react';
import Canvas from './Canvas';
import LaserBall from './LaserBall';

const GameCanvas = (props) => {
  // const draw = (ctx, frameCount) => {
  //   ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  //   ctx.fillStyle = '#000000';
  //   ctx.beginPath();
  //   ctx.arc(50, 100, 20 * Math.sin(frameCount * 0.015) ** 2, 0, 2 * Math.PI);
  //   ctx.fill();
  // };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  let ball = new LaserBall(7, 7, 7, 'yellow');

  useEffect(() => {
    let timer;
    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setWindowWidth(window.innerWidth);
        setWindowHeight(window.innerHeight);
      }, 250);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  const mouse = {
    x: 0,
    y: 0,
  };

  const onMouseMove = (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  };

  const onClick = (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    ball.curveMovement(0.5, mouse.x, mouse.y, true);
  };

  /**
   * Generates a random place to move to,
   * giving slightly more weight to closer distances
   * target midscreen
   *
   * 0-10 = close
   * 10-79 = mid
   * 80-99 = far
   *
   * These will each have their random values still but within range
   *
   * @param {*} x
   * @param {*} y
   */
  const generateRandomMove = (x, y) => {
    const dist = Math.random();
    if (dist < 0.2) {
    } else if (dist < 0.89) {
    } else {
    }
  };

  const generateDuration = () => {
    const duration = Math.random();
    if (duration < 0.25) {
      return 1.5;
    } else if (duration < 0.5) {
      return 0.5;
    } else if (duration < 0.75) {
      return 0.75;
    } else {
      return 1;
    }
  };

  /**
   * The tick 'loop' which occurs at 60hz / 60 frames per second
   * @param {*} ctx
   * @param {*} frameCount
   */
  const draw = (ctx, frameCount) => {
    ctx.clearRect(0, 0, windowWidth, windowHeight);

    ball.update();
    ball.drawHistory(ctx);
    ball.draw(ctx);
  };

  const options = { context: '2d' };

  return (
    <Canvas
      draw={draw}
      width={windowWidth}
      height={windowHeight}
      // onMouseMove={onMouseMove}
      onClick={onClick}
      options={options}
    />
  );
};

export default GameCanvas;
