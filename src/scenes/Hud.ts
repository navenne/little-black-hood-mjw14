import "phaser";
import constants from "../constants";

export default class Hud extends Phaser.Scene {
  private screenCenterX: number;
  private screenCenterY: number;
  private width: number;
  private height: number;

  private inventoryBar: Phaser.GameObjects.Image;
  private slotSelected: Phaser.GameObjects.Image;

  private inventoryBarPositions: [number, number][] = [];

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
    this.inventoryBar = this.add
      .image(this.renderer.width / 2, this.renderer.height * 0.85, "inventory_bar")
      .setScale(2);
    let slotWidth = this.inventoryBar.x - this.inventoryBar.width / 2 - 70;
    for (let i = 0; i < 10; i++) {
      this.inventoryBarPositions.push([slotWidth, this.renderer.height * 0.85]);
      slotWidth += 38;
    }

    this.scene.get(constants.SCENES.MAIN).events.on("updateInventory", ({ item, emptySlots }) => {
      console.log(emptySlots);
      const [x, y] = this.inventoryBarPositions[this.inventoryBarPositions.length - emptySlots];
      this.add.image(x, y, item.name).setScale(1.5);
    });

    this.scene.get(constants.SCENES.MAIN).events.on("selectItem", (index) => {
      if (this.slotSelected) {
        this.slotSelected.destroy();
      }
      const [x, y] = this.inventoryBarPositions[index];
      this.slotSelected = this.add.image(x, y, "inventory_select").setScale(2);
    });
  }
}
