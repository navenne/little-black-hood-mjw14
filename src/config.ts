import Hud from "./scenes/Hud";
import Load from "./scenes/Load";
import MainScene from "./scenes/MainScene";
import Menu from "./scenes/Menu";

const config = {
  type: Phaser.AUTO,
  scale: {
    parent: "game",
    mode: Phaser.Scale.ENVELOP,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 800,
      height: 600,
    },
    max: {
      width: 1600,
      height: 1200,
    },
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 600 },
      debug: false,
    },
  },
  pixelArt: true,
  scene: [Load, Menu, Hud, MainScene],
};

export default config;
