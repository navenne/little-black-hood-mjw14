import "phaser";
import constants from "../constants";

export default class Hud extends Phaser.Scene {
  private screenCenterX: number;
  private screenCenterY: number;
  private width: number;
  private height: number;

  private inventoryBar: Phaser.GameObjects.Image;
  private slotSelected: Phaser.GameObjects.Image;

  private dialogImg: Phaser.GameObjects.Image;
  private dialogTxt: Phaser.GameObjects.BitmapText;

  private inventoryBarPositions: [number, number][] = [];
  private itemsImgs: Phaser.GameObjects.Image[] = [];

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
      this.itemsImgs.push(this.add.image(x, y, item.name).setScale(1.5));
    });

    this.scene.get(constants.SCENES.MAIN).events.on("selectItem", (index) => {
      if (this.slotSelected) {
        this.slotSelected.destroy();
      }
      const [x, y] = this.inventoryBarPositions[index];
      this.slotSelected = this.add.image(x, y, "inventory_select").setScale(2);
    });

    this.scene.get(constants.SCENES.MAIN).events.on("newDialog", (text) => {
      if (this.dialogImg) {
        this.dialogImg.destroy();
      }
      if (this.dialogTxt) {
        this.dialogTxt.destroy();
      }
      this.dialogImg = this.add.image(this.screenCenterX, this.renderer.height * 0.75, "dialogPanel").setScale(2);
      this.dialogTxt = this.add.bitmapText(
        this.dialogImg.x - this.dialogImg.width / 2 - 30,
        this.renderer.height * 0.72,
        constants.FONTS.BITMAP,
        text
      );
    });

    this.scene.get(constants.SCENES.MAIN).events.on("deleteDialog", () => {
      if (this.dialogImg) {
        this.dialogImg.destroy();
      }
      if (this.dialogTxt) {
        this.dialogTxt.destroy();
      }
    });

    this.scene.get(constants.SCENES.MAIN).events.on("hideHud", () => {
      this.inventoryBar.destroy();
      if (this.slotSelected) {
        this.slotSelected.destroy();
      }
      if (this.dialogImg) {
        this.dialogImg.destroy();
      }
      if (this.dialogTxt) {
        this.dialogTxt.destroy();
      }
      setTimeout(() => {
        this.add.image(this.screenCenterX, this.screenCenterY - 100, "finalTitle");
        this.add.image(this.screenCenterX, this.screenCenterY, "textFinal").setScale(0.5);
        this.itemsImgs.forEach((item) => item.destroy());
        this.sound.play("soundtrack", { loop: true });
      }, 3000);
    });
  }
}
