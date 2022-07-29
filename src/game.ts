import "phaser";
import config from "./config";

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const game = new Game(config);
});
