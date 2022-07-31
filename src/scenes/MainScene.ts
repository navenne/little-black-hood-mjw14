import constants from "../constants";
import Player from "../objects/Player";

export default class MainScene extends Phaser.Scene {
  private screenCenterX: number;
  private screenCenterY: number;

  public mapLevel: Phaser.Tilemaps.Tilemap;
  private tileSetFloors: Phaser.Tilemaps.Tileset;
  private tileSetFurnis: Phaser.Tilemaps.Tileset;
  private layerFurnis: Phaser.Tilemaps.TilemapLayer;
  private layerSuelo: Phaser.Tilemaps.TilemapLayer;
  private layerFondo: Phaser.Tilemaps.TilemapLayer;
  private layerTunel: Phaser.Tilemaps.TilemapLayer;
  private player: Player;
  private interactKey: Phaser.Input.Keyboard.Key;
  private numbersKeys: any;
  private numbersKeysArray: any[];
  private overlapLapiz: boolean = false;
  private overlapEscobilla: boolean = false;
  private overlapTaburete: boolean = false;
  private lapizText: Phaser.GameObjects.BitmapText;
  private escobillaText: Phaser.GameObjects.BitmapText;
  private tabureteText: Phaser.GameObjects.BitmapText;
  private doors: any[] = [];
  private lapizTaken: boolean = false;
  private colliderPlayerAlfombra;
  private mesa;
  private alfombra;
  private escalera;
  private escaleraText;
  private mesaMoved: boolean = false;

  private lapiz: Phaser.Physics.Arcade.Sprite;
  private escobilla: Phaser.Physics.Arcade.Sprite;
  private taburete: Phaser.Physics.Arcade.Sprite;

  private width: number;
  private height: number;
  rtFOV: Phaser.GameObjects.RenderTexture;
  vision: any;

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
    this.sound.add("scaryAmbience").play({ loop: true, volume: 0.5 });
    this.sound.add("doorClose").play();
    this.cameras.main.zoom = 1.5;
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
    this.tileSetFloors = this.mapLevel.addTilesetImage("floors", "sueloImg");
    this.tileSetFurnis = this.mapLevel.addTilesetImage("furnis", "furnisImg");
    this.layerFondo = this.mapLevel.createLayer("fondo", this.tileSetFloors);
    this.layerFurnis = this.mapLevel.createLayer("furnis", this.tileSetFurnis);
    this.layerSuelo = this.mapLevel.createLayer("suelo", [this.tileSetFloors, this.tileSetFurnis]);
    this.layerTunel = this.mapLevel.createLayer("tunel", this.tileSetFloors);
    this.layerTunel.setCollisionByExclusion([-1]);
    this.layerFurnis.setCollisionByExclusion([-1]);
    this.layerSuelo.setCollisionByExclusion([-1]);
    this.layerFondo.setCollisionByExclusion([-1]);
    this.mapLevel.findObject("player", (d: any) => {
      this.player = new Player({ scene: this, x: d.x, y: d.y });
    });

    this.physics.world.setBounds(0, 0, this.mapLevel.widthInPixels, this.mapLevel.heightInPixels);

    //paredes y suelo

    this.cameras.main.setBounds(0, 0, this.mapLevel.widthInPixels, this.mapLevel.heightInPixels);

    //-----------------------------

    this.cameras.main.startFollow(this.player);
    this.physics.add.collider(this.player, this.layerSuelo);

    //poner objeto de tiled en la scena

    this.createObjectInteractive("lapiz", "lapiz", "LAPIZ", this.lapizText, this.overlapLapiz);
    this.createObjectInteractive("escobilla", "escobilla", "ESCOBILLA", this.escobillaText, this.overlapEscobilla);
    this.createObjectInteractive("taburete", "taburete", "TABURETE", this.tabureteText, this.overlapTaburete);

    for (let i = 1; i <= 4; i++) {
      this.createDoorInteractive(`puerta_${i}`);
    }

    this.mesa = this.mapLevel.createFromObjects("objetos", {
      name: "mesa",
    })[0];
    this.physics.world.enable(this.mesa);
    //obj dont move
    this.mesa.body.setAllowGravity(false);
    this.mesa.body.setImmovable(true);
    this.mesa.setTexture("mesa");
    this.mesa.body.setSize(22, 16);

    this.physics.add.collider(this.layerSuelo, this.mesa);

    this.alfombra = this.mapLevel.createFromObjects("objetos", {
      name: "alfombra",
    })[0];
    this.physics.world.enable(this.alfombra);
    //obj dont move
    this.alfombra.body.setAllowGravity(false);
    this.alfombra.body.setImmovable(true);
    this.alfombra.setTexture("alfombra");
    this.alfombra.body.setSize(46, 8);

    this.colliderPlayerAlfombra = this.physics.add.collider(this.player, this.alfombra);

    let alfombra2: any = this.mapLevel.createFromObjects("objetos", {
      name: "alfombra2",
    })[0];
    this.physics.world.enable(alfombra2);
    //obj dont move
    alfombra2.body.setAllowGravity(false);
    alfombra2.body.setImmovable(true);
    alfombra2.setTexture("alfombra");
    alfombra2.body.setSize(46, 8);

    this.escalera = this.mapLevel.createFromObjects("objetos", {
      name: "escaleras",
    })[0];
    this.physics.world.enable(this.escalera);

    this.escalera.body.setAllowGravity(false);
    this.escalera.body.setImmovable(true);
    this.escalera.setTexture("escalera");
    this.escalera.body.setSize(35, 35);
    this.escalera.setVisible(false);

    this.physics.add.overlap(this.player, this.escalera, () => {
      //tooltip
      this.escaleraText = this.add
        .bitmapText(this.escalera.x, this.escalera.y - 32, constants.FONTS.BITMAP, "SUBIR")
        .setOrigin(0.5);
      if (this.interactKey.isDown) {
        // escaleraText.destroy();
        this.player.y = 900;
        this.player.x = this.player.x + 100;
      }
    });

    this.events.on("useTaburete", () => {
      this.taburete.body.setSize(22, 35);
      this.physics.world.enable(this.taburete);
      this.taburete.body.setAllowGravity(false);
      this.taburete.body.setImmovable(true);
      this.physics.add.collider(this.player, this.taburete);
      this.taburete.setVisible(true);
      this.taburete.x = 470;
      this.taburete.y = 975;
      this.player.x = this.taburete.x;
      this.player.y = this.taburete.y - 100;
      if (!this.player.inventory.find((item: any) => item.name === "escobilla")) {
        this.newDialog("NO ALCANZO LA CUERDA");
      }
    });

    this.events.on("useEscobilla", () => {
      if (this.player.body.touching.down && this.taburete.body.touching.up) {
        this.events.emit("deleteDialog");
        this.player.x = 440;
        this.player.y = 840;
      }
    });
    //FOV
    const width = this.layerSuelo.width;
    const height = this.layerSuelo.height;

    // make a RenderTexture that is the size of the screen
    this.rtFOV = this.make.renderTexture(
      {
        width,
        height,
      },
      true
    );

    // fill it with black
    this.rtFOV.fill(0x000000, 1);

    // draw the floorLayer into it
    this.rtFOV.draw(this.layerSuelo);

    // set a dark blue tint
    this.rtFOV.setTint(0x0a2948);

    this.vision = this.make.image({
      x: this.player.x,
      y: this.player.y,
      key: "fov",
      add: false,
    });
    this.vision.scale = 5;
    this.rtFOV.mask = new Phaser.Display.Masks.BitmapMask(this, this.vision);
    this.rtFOV.mask.invertAlpha = true;
  }

  private newDialog(text: string) {
    this.events.emit("newDialog", text);
  }

  private createDoorInteractive(name: string) {
    let obj: any = this.mapLevel.createFromObjects("puertas", {
      name,
    })[0];
    this.physics.world.enable(obj);
    //obj dont move
    obj.body.setAllowGravity(false);
    obj.body.setImmovable(true);
    obj.setTexture("doorClose");
    obj.body.setSize(16, 48);
    const collider = this.physics.add.collider(obj, this.player);

    this.doors.push({ obj, collider });
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

    if (obj.name === "lapiz") {
      this.lapiz = obj;
    }

    if (obj.name === "taburete") {
      this.taburete = obj;
    }

    if (obj.name === "escobilla") {
      this.escobilla = obj;
    }

    this.physics.add.overlap(this.player, obj, () => {
      //tooltip
      if (!overlap) {
        objText = this.add.bitmapText(obj.x, obj.y - 32, constants.FONTS.BITMAP, textToolTip).setOrigin(0.5);
        overlap = true;
      }
      if (this.interactKey.isDown) {
        if (this.player.addToInventory(obj)) {
          if (obj.name === "lapiz") {
            this.lapizTaken = true;
          }
          obj.setVisible(false);
          objText.destroy();
        }
      }
    });
  }

  update() {
    this.player.update();

    this.vision.x = this.player.x;
    this.vision.y = this.player.y;
    this.numbersKeysArray.map((key: any, index) => {
      if (key.isDown) {
        this.player.setItem(index);
      }
    });

    const overlap = this.physics.overlapRect(
      this.player.x - 25,
      this.player.y - 25,
      this.player.width + 5,
      this.player.height + 5
    );

    this.doors.map(({ obj, collider }) => {
      if (overlap.includes(obj.body)) {
        if (this.interactKey.isDown) {
          if (obj.name === "puerta_4") {
            this.finalScene();
          }
          if (obj.texture !== "doorOpen") {
            this.sound.play("doorOpen");
            obj.setTexture("doorOpen");
          }

          //quiat la colision con el player
          this.physics.world.removeCollider(collider);
        }
      }
    });

    if (this.lapizTaken) {
      this.physics.add.overlap(this.player, this.mesa, () => {
        if (this.interactKey.isDown) {
          this.mesa.body.setVelocityX(10);
          this.mesaMoved = true;
        }
      });
    }

    if (this.mesaMoved) {
      if (overlap.includes(this.alfombra.body)) {
        this.physics.world.removeCollider(this.colliderPlayerAlfombra);
      }
    }
  }
  private finalScene() {
    //hide hud
    this.events.emit("hideHud");
    //musica tenebrosa

    setTimeout(() => {
      this.sound.play("killSwitch");
    }, 1000);

    setTimeout(() => {
      this.sound.play("scream");
    }, 3000);

    //fade in black screen
    this.cameras.main.fadeOut(3500, 0, 0, 0);
  }
}
