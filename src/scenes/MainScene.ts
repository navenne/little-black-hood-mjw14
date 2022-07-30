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
  private overlapLapiz: boolean = false;
  private lapizText: Phaser.GameObjects.BitmapText;

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
    // this.player = new Player({ scene: this, x: 200, y: 200 });
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

    //MOQUETA
    // this.moqueta = this.mapLevel.addTilesetImage("floors", "moquetaImg");
    //paredes y suelo
    this.paredesYSuelo = this.mapLevel.addTilesetImage("floors", "sueloImg");

    // this.layerMoqueta = this.mapLevel.createLayer("moqueta", this.moqueta);
    this.layerParedesYSuelo = this.mapLevel.createLayer("capa", this.paredesYSuelo);
    this.layerParedesYSuelo.setCollisionByExclusion([-1]);
    // this.layerMoqueta.setCollisionByExclusion([-1]);

    this.cameras.main.setBounds(0, 0, this.mapLevel.widthInPixels, this.mapLevel.heightInPixels);

    //-----------------------------

    this.cameras.main.startFollow(this.player);
    this.physics.add.collider(this.player, this.layerParedesYSuelo);

    //poner objeto de tiled en la scena

    let lapiz: any = this.mapLevel.createFromObjects("objetos", {
      name: "lapiz",
    })[0];
    this.physics.world.enable(lapiz);
    lapiz.body.setAllowGravity(false);
    lapiz.setTexture("lapiz");
    lapiz.body.setSize(16, 16);

    this.physics.add.overlap(this.player, lapiz, () => {
      //tooltip

      if (!this.overlapLapiz) {
        this.lapizText = this.add.bitmapText(lapiz.x, lapiz.y - 32, constants.FONTS.BITMAP, "LAPIZ").setOrigin(0.5);
        this.overlapLapiz = true;
      }
      if (this.interactKey.isDown) {
        if (this.player.addToInventory(lapiz)) {
          lapiz.destroy();
          this.lapizText.destroy();
        }
      }
    });
  }

  update() {
    this.player.update();
  }
}
