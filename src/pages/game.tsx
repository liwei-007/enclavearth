import { useState, useEffect, useCallback } from "react";

type Position = {
  x: number;
  y: number;
};

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // 生成新食物
  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    setFood(newFood);
  }, []);

  // 游戏逻辑
  const moveSnake = useCallback(() => {
    if (gameOver) return;

    setSnake((prevSnake) => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case "UP":
          head.y = head.y - 1;
          break;
        case "DOWN":
          head.y = head.y + 1;
          break;
        case "LEFT":
          head.x = head.x - 1;
          break;
        case "RIGHT":
          head.x = head.x + 1;
          break;
      }

      // 边框碰撞检测
      if (
        head.x < 0 ||
        head.x >= GRID_SIZE ||
        head.y < 0 ||
        head.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return prevSnake;
      }

      // 自身碰撞检测
      if (
        newSnake.some((segment) => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true);
        return prevSnake;
      }

      newSnake.unshift(head);

      // 吃食物检测
      if (head.x === food.x && head.y === food.y) {
        setScore((s) => s + 1);
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food.x, food.y, gameOver, generateFood]);

  // 键盘控制
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          setDirection((prev) => (prev !== "DOWN" ? "UP" : prev));
          break;
        case "ArrowDown":
          setDirection((prev) => (prev !== "UP" ? "DOWN" : prev));
          break;
        case "ArrowLeft":
          setDirection((prev) => (prev !== "RIGHT" ? "LEFT" : prev));
          break;
        case "ArrowRight":
          setDirection((prev) => (prev !== "LEFT" ? "RIGHT" : prev));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // 游戏循环
  useEffect(() => {
    const gameInterval = setInterval(moveSnake, 150);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  // 重置游戏
  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection("RIGHT");
    setGameOver(false);
    setScore(0);
    generateFood();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="mb-4 text-2xl font-bold text-gray-800">得分: {score}</div>

      <div
        className="relative bg-white border-4 border-gray-300 rounded-lg"
        style={{ width: `${GRID_SIZE * 20}px`, height: `${GRID_SIZE * 20}px` }}
      >
        {/* 蛇 */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className="absolute bg-green-500 rounded-sm"
            style={{
              width: "20px",
              height: "20px",
              left: `${segment.x * 20}px`,
              top: `${segment.y * 20}px`,
              zIndex: 10,
            }}
          />
        ))}

        {/* 食物 */}
        <div
          className="absolute bg-red-500 rounded-full animate-pulse"
          style={{
            width: "16px",
            height: "16px",
            left: `${food.x * 20 + 2}px`,
            top: `${food.y * 20 + 2}px`,
          }}
        />

        {/* 游戏结束提示 */}
        {gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
            <div className="text-white text-2xl font-bold">
              游戏结束！
              <button
                onClick={resetGame}
                className="block mt-4 px-4 py-2 bg-green-500 rounded hover:bg-green-600 transition-colors"
              >
                再玩一次
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-gray-600 text-sm">使用方向键控制移动</div>
    </div>
  );
}
