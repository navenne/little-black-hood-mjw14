import "phaser";
import constants from "../constants";

export default class Load extends Phaser.Scene {
  //Load bar
  private loadBar: Phaser.GameObjects.Graphics;

  //Load bar
  private progressBar: Phaser.GameObjects.Graphics;

  constructor() {
    super("Load");
  }

  preload(): void {
    //Background color back
    this.cameras.main.setBackgroundColor(0x000);
    this.createBars();

    this.load.on("progress", (value: number) => {
      this.updateBar(value);
    });

    this.load.on("complete", () => {
      this.loadFont();
      this.scene.start(constants.SCENES.MENU);
    });

    this.load.tilemapTiledJSON("mapa", "assets/levels/mapa.json");

    this.load.image("sueloImg", "assets/levels/floors.png");
    // this.load.image("paredesImg", "assets/levels/moqueta.png");

    this.load.json(constants.FONTS.JSON, "assets/Fonts/font.json");
    this.load.image(constants.FONTS.IMAGE, "assets/Fonts/font.png");

    this.load.atlas("player", "assets/Character/player.png", "assets/Character/player.json");

    this.load.image("inventory_bar", "assets/Inventory/Inventory_Bar.png");
    this.load.image("inventory_select", "assets/Inventory/Inventory_select.png");

    this.load.image("lapiz", "assets/Objects/lapiz.png");
    this.load.image("lapi", "assets/Objects/lapiz.png");
  }

  private updateBar(value: number): void {
    this.progressBar.clear();
    this.progressBar.fillStyle(0x260, 1);
    this.progressBar.fillRect(
      this.cameras.main.width / 4,
      this.cameras.main.height / 2 - 16,
      (this.cameras.main.width / 2) * value,
      16
    );
  }

  private createBars(): void {
    this.loadBar = this.add.graphics();
    this.loadBar.fillStyle(0xffffff, 1);
    this.loadBar.fillRect(
      this.cameras.main.width / 4 - 2,
      this.cameras.main.height / 2 - 18,
      this.cameras.main.width / 2 + 4,
      20
    );
    this.progressBar = this.add.graphics();
  }

  private loadFont() {
    const fontJson = this.cache.json.get(constants.FONTS.JSON);
    this.cache.bitmapFont.add(constants.FONTS.BITMAP, Phaser.GameObjects.RetroFont.Parse(this, fontJson));
  }
}
