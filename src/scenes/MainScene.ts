import constants from "../constants";
import Player from "../objects/Player";

export default class MainScene extends Phaser.Scene {
  private screenCenterX: number;
  private screenCenterY: number;

  public mapLevel: Phaser.Tilemaps.Tilemap;
  private paredesYSuelo: Phaser.Tilemaps.Tileset;
  private layerParedesYSuelo: Phaser.Tilemaps.TilemapLayer;
  private player: Player;
  private interactKey: Phaser.Input.Keyboard.Key;
  private numbersKeys: any;
  private numbersKeysArray: any[];
  private overlapLapiz: boolean = false;
  private overlapLapi: boolean = false;
  private lapizText: Phaser.GameObjects.BitmapText;
  private lapiText: Phaser.GameObjects.BitmapText;

  private width: number;
  private height: number;

  constructor() {
    super("MainScene");
  }

  init() {
    this.width = this.cameras.main.width;
    this.height = this.cameras.main.height;
    this.screenCenterX = this.cameras.main.worldView.x + this.width / 2;
    this.screenCenterY = this.cameras.main.worldView.y + this.height / 2;
  }

  preload() {}

  create() {
    this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.numbersKeys = this.input.keyboard.addKeys("ONE,TWO,THREE,FOUR,FIVE,SIX,SEVEN,EIGHT,NINE,ZERO");
    this.numbersKeysArray = [
      this.numbersKeys.ONE,
      this.numbersKeys.TWO,
      this.numbersKeys.THREE,
      this.numbersKeys.FOUR,
      this.numbersKeys.FIVE,
      this.numbersKeys.SIX,
      this.numbersKeys.SEVEN,
      this.numbersKeys.EIGHT,
      this.numbersKeys.NINE,
      this.numbersKeys.ZERO,
    ];
    // this.player = new Player({ scene: this, x: 500, y: 500 });
    //MAPA
    this.mapLevel = this.make.tilemap({
      key: "mapa",
      tileWidth: 32,
      tileHeight: 32,
    });

    this.mapLevel.findObject("player", (d: any) => {
      this.player = new Player({ scene: this, x: d.x, y: d.y });
    });

    this.physics.world.setBounds(0, 0, this.mapLevel.widthInPixels, this.mapLevel.heightInPixels);

    //paredes y suelo
    this.paredesYSuelo = this.mapLevel.addTilesetImage("floors", "sueloImg");
    this.layerParedesYSuelo = this.mapLevel.createLayer("capa", this.paredesYSuelo);
    this.layerParedesYSuelo.setCollisionByExclusion([-1]);

    this.cameras.main.setBounds(0, 0, this.mapLevel.widthInPixels, this.mapLevel.heightInPixels);

    //-----------------------------

    this.cameras.main.startFollow(this.player);
    this.physics.add.collider(this.player, this.layerParedesYSuelo);

    //poner objeto de tiled en la scena

    this.createObjectInteractive("lapiz", "lapiz", "LAPIZ", this.lapizText, this.overlapLapiz);
    this.createObjectInteractive("lapi", "lapi", "OTRO LAPIZ", this.lapiText, this.overlapLapi);
  }

  private createObjectInteractive(
    name: string,
    texture: string,
    textToolTip: string,
    objText: Phaser.GameObjects.BitmapText,
    overlap: boolean
  ) {
    let obj: any = this.mapLevel.createFromObjects("objetos", {
      name,
    })[0];
    this.physics.world.enable(obj);
    obj.body.setAllowGravity(false);
    obj.setTexture(texture);
    obj.body.setSize(16, 16);

    this.physics.add.overlap(this.player, obj, () => {
      //tooltip
      if (!overlap) {
        objText = this.add.bitmapText(obj.x, obj.y - 32, constants.FONTS.BITMAP, textToolTip).setOrigin(0.5);
        overlap = true;
      }
      if (this.interactKey.isDown) {
        if (this.player.addToInventory(obj)) {
          obj.destroy();
          objText.destroy();
        }
      }
    });
  }

  update() {
    this.player.update();

    this.numbersKeysArray.map((key: any, index) => {
      if (key.isDown) {
        this.player.setItem(index);
      }
    });
  }
}
