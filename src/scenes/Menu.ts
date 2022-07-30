import "phaser";
import constants from "../constants";
import MainScene from "./MainScene";

export default class Menu extends Phaser.Scene {
  private width: number;
  private height: number;

  private screenCenterX: number;
  private screenCenterY: number;

  private playTxt: Phaser.GameObjects.BitmapText;

  constructor() {
    super("Menu");
  }

  init() {
    this.width = this.cameras.main.width;
    this.height = this.cameras.main.height;
    this.screenCenterX = this.cameras.main.worldView.x + this.width / 2;
    this.screenCenterY = this.cameras.main.worldView.y + this.height / 2;
  }

  create() {
    this.playTxt = this.add
      .bitmapText(this.screenCenterX, this.screenCenterY, constants.FONTS.BITMAP, "PLAY", 25)
      .setOrigin(0.5)
      .setInteractive({ cursor: "pointer" });

    this.chageScene(this.playTxt, constants.SCENES.MAIN);
  }

  private chageScene(playTxt: Phaser.GameObjects.BitmapText, scene: string) {
    playTxt.on("pointerdown", () => {
      this.scene.start(scene);
      this.scene.start(constants.SCENES.HUD);
      this.scene.bringToTop(constants.SCENES.HUD);
    });
  }
}
