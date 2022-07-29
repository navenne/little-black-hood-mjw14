import MainScene from "./scenes/MainScene";

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
  pixelArt: true,
  backgroundColor: "#125555",
  scene: [MainScene],
};

export default config;
