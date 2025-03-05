import React, { useState, useEffect, useRef } from "react";

const GoldMinerGame = () => {
  const [ropeAngle, setRopeAngle] = useState(0);
  const [isRopeMoving, setIsRopeMoving] = useState(false);
  const [ropeLength, setRopeLength] = useState(50);
  const [direction, setDirection] = useState(1);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasCaughtGold, setHasCaughtGold] = useState(false);
  const [goldPosition, setGoldPosition] = useState({ x: 200, y: 300 });
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current as any;
    const ctx = canvas.getContext("2d");

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 绘制钩子
      const centerX = canvas.width / 2;
      const centerY = 50;
      const endX = centerX + ropeLength * Math.sin((ropeAngle * Math.PI) / 180);
      const endY = centerY + ropeLength * Math.cos((ropeAngle * Math.PI) / 180);

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.stroke();

      // 绘制黄金
      if (!hasCaughtGold) {
        const { x, y } = goldPosition;
        const goldRadius = 20;
        ctx.beginPath();
        ctx.arc(x, y, goldRadius, 0, 2 * Math.PI);
        ctx.fillStyle = "gold";
        ctx.fill();
      }

      // 绘制分数
      ctx.font = "20px Arial";
      ctx.fillStyle = "black";
      ctx.fillText(`Score: ${score}`, 10, 30);

      if (isGameOver) {
        ctx.font = "40px Arial";
        ctx.fillStyle = "red";
        ctx.fillText("Game Over!", canvas.width / 2 - 100, canvas.height / 2);
      }

      requestAnimationFrame(draw);
    };

    draw();

    const moveRope = () => {
      if (isRopeMoving) {
        if (hasCaughtGold) {
          setRopeLength((prevLength) => {
            if (prevLength > 50) {
              return prevLength - 2;
            } else {
              setIsRopeMoving(false);
              setHasCaughtGold(false);
              setScore((prevScore) => prevScore + 1);
              // 生成新的黄金位置
              const canvas: any = canvasRef.current;
              const newX = Math.floor(Math.random() * (canvas.width - 40)) + 20;
              const newY =
                Math.floor(Math.random() * (canvas.height - 100)) + 100;
              setGoldPosition({ x: newX, y: newY });
              return 50;
            }
          });
        } else {
          setRopeLength((prevLength) => {
            if (prevLength < canvas.height - 50) {
              const centerX = canvas.width / 2;
              const centerY = 50;
              const endX =
                centerX + prevLength * Math.sin((ropeAngle * Math.PI) / 180);
              const endY =
                centerY + prevLength * Math.cos((ropeAngle * Math.PI) / 180);

              const { x, y } = goldPosition;
              const goldRadius = 20;
              const distance = Math.sqrt((endX - x) ** 2 + (endY - y) ** 2);

              if (distance <= goldRadius) {
                setHasCaughtGold(true);
              }
              return prevLength + 2;
            } else {
              setIsGameOver(true);
              setIsRopeMoving(false);
              return prevLength;
            }
          });
        }
      } else {
        if (!isGameOver) {
          const newAngle = ropeAngle + direction * 1;
          if (newAngle >= 45 || newAngle <= -45) {
            setDirection((prevDirection) => -prevDirection);
          }
          setRopeAngle(newAngle);
        }
      }
    };

    const intervalId = setInterval(moveRope, 20);

    return () => clearInterval(intervalId);
  }, [
    ropeAngle,
    isRopeMoving,
    ropeLength,
    direction,
    score,
    isGameOver,
    hasCaughtGold,
    goldPosition,
  ]);

  const handleClick = () => {
    if (!isRopeMoving && !isGameOver) {
      setIsRopeMoving(true);
    }
  };

  const handleRestart = () => {
    setRopeAngle(0);
    setIsRopeMoving(false);
    setRopeLength(50);
    setDirection(1);
    setScore(0);
    setIsGameOver(false);
    setHasCaughtGold(false);
    // 重置黄金位置
    setGoldPosition({ x: 200, y: 300 });
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="border border-gray-400"
      />
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleClick}
        disabled={isRopeMoving || isGameOver}
      >
        发射钩子
      </button>
      {isGameOver && (
        <button
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={handleRestart}
        >
          重新开始
        </button>
      )}
    </div>
  );
};

export default GoldMinerGame;
