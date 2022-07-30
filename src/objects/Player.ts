import "phaser";
import constants from "../constants";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  private inventory: any[];
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private keysWASD: any;
  private spaceBarKey: Phaser.Input.Keyboard.Key;
  private itemSelected: number;

  public scene: Phaser.Scene;

  constructor(config: any) {
    super(config.scene, config.x, config.y, "player");
    this.scene = config.scene;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);

    this.setScale(2);
    this.setCollideWorldBounds(true); // para que no se salga del juego :)

    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.keysWASD = this.scene.input.keyboard.addKeys("W,A,S,D");
    this.spaceBarKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.anims.create({
      key: "player-idle",
      frames: this.anims.generateFrameNames("player", { prefix: "idle_", start: 1, end: 5 }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "player-run",
      frames: this.anims.generateFrameNames("player", { prefix: "run_", start: 1, end: 5 }),
      frameRate: 5,
      repeat: -1,
    });

    this.play("player-idle");

    this.inventory = [];
  }

  update() {
    this.body.setSize(this.width, this.height);
    if (this.keysWASD.A.isDown || this.cursors.left.isDown) {
      this.setVelocityX(-200);
      this.setFlipX(true);
      if (this.body.blocked.down) {
        this.anims.play("player-run", true);
      }
    } else if (this.keysWASD.D.isDown || this.cursors.right.isDown) {
      this.setVelocityX(200);
      this.setFlipX(false);
      if (this.body.blocked.down) {
        this.anims.play("player-run", true);
      }
    } else {
      this.setVelocityX(0);
      this.anims.play("player-idle", true);
    }

    if ((this.spaceBarKey.isDown || this.cursors.up.isDown || this.keysWASD.W.isDown) && this.body.blocked.down) {
      this.setVelocityY(-300);
      this.anims.stop();
    }
  }

  public addToInventory(Item: any): boolean {
    if (this.inventory.find((item) => item.name === Item.name)) {
      return false;
    }
    this.inventory.push(Item);
    this.scene.events.emit("updateInventory", { item: Item, emptySlots: this.getEmptySlots() });
    return true;
  }

  public setItem(item: any) {
    this.itemSelected = item;

    //agregar el objeto al jugador en la mano
    this.scene.events.emit("selectItem", item);
  }
  private getEmptySlots(): number {
    console.log(this.inventory);
    return 11 - this.inventory.length;
  }
}
