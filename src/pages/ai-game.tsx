"use client";
import { useState, useEffect } from "react";
import { GameState } from "@/types/game";
import { generateScene } from "@/utils/game";
import { Button } from "@/components/ui/button";

export default function GamePage() {
  const [gameState, setGameState] = useState<GameState>({
    scene: {
      description: "你站在一个神秘森林的入口...",
      options: [],
    },
    health: 100,
    level: 1,
  });

  const [isLoading, setIsLoading] = useState(false);

  // 初始化第一个场景
  useEffect(() => {
    if (gameState.scene.options.length === 0) {
      generateInitialScene();
    }
  }, []);

  const generateInitialScene = async () => {
    setIsLoading(true);
    try {
      const newScene = await generateScene("游戏开始");
      setGameState((prev) => ({
        ...prev,
        scene: newScene,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChoice = async (optionId: number) => {
    setIsLoading(true);
    try {
      const newScene = await generateScene(`
        当前状态: 等级 ${gameState.level} / 生命 ${gameState.health}
        最后选择: ${optionId}
      `);

      setGameState((prev) => ({
        ...prev,
        scene: newScene,
        health: prev.health - Math.floor(Math.random() * 10), // 简单扣血机制
        level: prev.level + 1,
      }));
    } catch (error) {
      console.error("生成失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        {/* 状态栏 */}
        <div className="mb-6 flex gap-4 text-lg">
          <div>❤️ 生命: {gameState.health}</div>
          <div>⭐ 等级: {gameState.level}</div>
        </div>

        {/* 场景描述 */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-gray-800">{gameState.scene.description}</p>
        </div>

        {/* 选项按钮 */}
        <div className="space-y-3">
          {gameState.scene.options.map((option) => (
            <Button
              key={option.id}
              onClick={() => handleChoice(option.id)}
              disabled={isLoading}
              className="w-full p-3 bg-blue-500 text-white rounded-lg
                       hover:bg-blue-600 transition-colors
                       disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {option.text}
            </Button>
          ))}
        </div>

        {isLoading && (
          <div className="mt-4 text-center text-gray-500">
            AI 正在生成剧情...
          </div>
        )}
      </div>
    </div>
  );
}
