import "phaser";
import constants from "../constants";

export default class Hud extends Phaser.Scene {
  private screenCenterX: number;
  private screenCenterY: number;
  private width: number;
  private height: number;

  private inventoryBar: Phaser.GameObjects.Image;

  constructor() {
    super(constants.SCENES.HUD);
  }

  init() {
    this.width = this.cameras.main.width;
    this.height = this.cameras.main.height;
    this.screenCenterX = this.cameras.main.worldView.x + this.width / 2;
    this.screenCenterY = this.cameras.main.worldView.y + this.height / 2;
  }

  create() {
    this.add.image(this.screenCenterX, this.height - 150, "inventory_bar").setScale(2);
    //split inventory bar into 10 slots
    for (let i = 0; i < 10; i++) {
      this.add.image(this.screenCenterX + i * 50, this.height - 150, "lapiz").setScale(2);
    }
  }
}
