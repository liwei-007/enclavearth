export interface GameScene {
  description: string;
  options: {
    id: number;
    text: string;
  }[];
}

export interface GameState {
  scene: GameScene;
  health: number;
  level: number;
}
