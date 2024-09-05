import React, { useState, useRef, useEffect } from 'react';
import Canvas from './Canvas';
import LaserBall from './LaserBall';

const GameCanvas = (props) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  let ball = new LaserBall(7, 7, 7, 'red');

  let pause = false;

  const togglePause = () => {
    pause = !pause;
    // change the color of the ball
    // randomly
    if (!pause) {
      let val = Math.random();
      if (val < 0.33) {
        ball.color = 'red';
      } else if (val < 0.66) {
        ball.color = 'yellow';
      } else {
        ball.color = 'blue';
      }
    }
  };

  useEffect(() => {
    let timer;
    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setWindowWidth(window.innerWidth);
        setWindowHeight(window.innerHeight);
      }, 250);
    };

    let pauseInterval = setInterval(togglePause, 6000);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
      clearInterval(pauseInterval);
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
    // ball.curveMovement(0.5, mouse.x, mouse.y, true);
    let [x, y] = generateRandomMove(mouse.x, mouse.y);
    let duration = generateMoveDuration();
    let approximate = Math.random() < 0.5;
    ball.curveMovement(duration, x, y, approximate);
  };

  const startRandomMovement = () => {
    const [x, y] = generateRandomMove();
    const duration = generateMoveDuration();
    const approximate = Math.random() < 0.5;
    const xFreq = Math.random() * 4;
    const yFreq = Math.random() * 4;

    ball.curveMovement(duration, x, y, 100, xFreq, yFreq, approximate);
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
    // first check if its off the screen
    // if it is, pick a random place on the screen instead

    // if (x < 0 || x > windowWidth || y < 0 || y > windowHeight) {
    //   const nextx = Math.floor(Math.random() * windowWidth);
    //   const nexty = Math.floor(Math.random() * windowHeight);
    //   return [nextx, nexty];
    // }

    // const dist = Math.random();
    // let nextx;
    // let nexty;

    // // close 15%
    // if (dist < 0.4) {
    //   nextx = Math.floor(Math.random() * (windowWidth * 0.25));
    //   nexty = Math.floor(Math.random() * (windowHeight * 0.25));
    // }
    // // medium (16-60%)
    // else if (dist < 0.5) {
    //   nextx = Math.floor(
    //     Math.random() * (windowWidth * 0.45) + windowWidth * 0.25
    //   );
    //   nexty = Math.floor(
    //     Math.random() * (windowHeight * 0.15) + windowHeight * 0.5
    //   );
    // }
    // // far (51-85%)
    // else {
    //   nextx = Math.floor(
    //     Math.random() * (windowWidth * 0.3) + windowWidth * 0.7
    //   );
    //   nexty = Math.floor(
    //     Math.random() * (windowHeight * 0.3) + windowHeight * 0.7
    //   );
    // }

    const nextx = Math.floor(Math.random() * windowWidth);
    const nexty = Math.floor(Math.random() * windowHeight);
    return [nextx, nexty];
  };

  const generateMoveDuration = () => {
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

    // if (pause && ball.history.length == 0) {
    //   return;
    // }

    if (ball.history.length == 0) {
      setTimeout(startRandomMovement(), 1500);
    }

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
