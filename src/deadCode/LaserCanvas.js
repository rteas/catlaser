import React, { useRef, useEffect, useCallback } from 'react';

const LaserCanvas = (props) => {
  const canvasRef = useRef(null);

  const draw = useCallback((ctx, frameCount) => {
    ctx.fillStyle = 'rgb(0 0 0 / 15%)';

    ctx.fillRect(0, 0, 500, 500);
    ctx.beginPath();
    ctx.arc(5, 5, 7, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = 'blue';
    ctx.fill();
  }, frameCount);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let frameCount = 0;
    let animationFrameId;

    const render = () => {
      frameCount++;
      draw(context, frameCount);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  return <canvas ref={canvasRef} />;
};

export default LaserCanvas;
