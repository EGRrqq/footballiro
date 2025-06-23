import { Scene } from "phaser";

export class Game extends Scene {
  //   private player: Phaser.GameObjects.Rectangle;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private direction: "left" | "right" | "up" | "down" = "down";
  private platforms;

  constructor() {
    super("Game");
  }

  preload() {
    this.load.setPath("assets");
    this.load.image("ground", "platform.png");

    this.load.spritesheet("hero", "character_base_48x48.png", {
      frameWidth: 48,
      frameHeight: 48,
    });
  }

  create() {
    // controls
    this.cursors = this.input.keyboard?.createCursorKeys();

    // create platforms
    this.platforms = this.physics.add.staticGroup();

    this.platforms.create(400, 700, "ground").setScale(2).refreshBody();

    // create player
    this.player = this.physics.add.sprite(300, 450, "hero");
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    // anim player
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("hero", { start: 12, end: 15 }),
      frameRate: 10,
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("hero", { start: 8, end: 11 }),
      frameRate: 10,
    });
    this.anims.create({
      key: "up",
      frames: this.anims.generateFrameNumbers("hero", { start: 4, end: 7 }),
      frameRate: 10,
    });
    this.anims.create({
      key: "down",
      frames: this.anims.generateFrameNumbers("hero", { start: 0, end: 3 }),
      frameRate: 10,
    });

    this.anims.create({
      key: "turn_l",
      frames: [{ key: "hero", frame: 12 }],
      frameRate: 10,
    });
    this.anims.create({
      key: "turn_r",
      frames: [{ key: "hero", frame: 8 }],
      frameRate: 10,
    });
    this.anims.create({
      key: "turn_u",
      frames: [{ key: "hero", frame: 4 }],
      frameRate: 10,
    });
    this.anims.create({
      key: "turn_d",
      frames: [{ key: "hero", frame: 0 }],
      frameRate: 10,
    });

    // platform + player
    this.physics.add.collider(this.player, this.platforms);
  }

  update(): void {
    const VELOCITY = 160;

    switch (true) {
      case this.cursors.left.isDown:
        this.player.setVelocityX(-VELOCITY);
        this.player.setVelocityY(0);

        this.direction = "left";
        this.player.anims.play(this.direction, true);
        break;
      case this.cursors.right.isDown:
        this.player.setVelocityX(+VELOCITY);
        this.player.setVelocityY(0);

        this.direction = "right";
        this.player.anims.play(this.direction, true);
        break;
      case this.cursors.up.isDown:
        this.player.setVelocityY(-VELOCITY);
        this.player.setVelocityX(0);

        this.direction = "up";
        this.player.anims.play(this.direction, true);
        break;
      case this.cursors.down.isDown:
        this.player.setVelocityY(+VELOCITY);
        this.player.setVelocityX(0);

        this.direction = "down";
        this.player.anims.play(this.direction, true);
        break;
      default:
        this.player.setVelocityX(0);
        this.player.setVelocityY(0);

        this.player.anims.play("turn_" + this.direction[0], true);
        break;
    }

    // if (this.cursors.up.isDown && this.player.body.touching.down) {
    //   this.player_two.setVelocityY(-330);
    // }
  }
}
