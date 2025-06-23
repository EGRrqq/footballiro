import { Scene } from "phaser";

export class Game extends Scene {
  //   private player: Phaser.GameObjects.Rectangle;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private platforms;

  constructor() {
    super("Game");
  }

  preload() {
    // controls
    this.cursors = this.input.keyboard?.createCursorKeys();

    // this.load.setPath("assets");
    this.load.spritesheet("dude", "assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
    this.load.image("ground", "assets/platform.png");
  }

  create() {
    // create platforms
    this.platforms = this.physics.add.staticGroup();

    this.platforms.create(400, 600, "ground").setScale(2).refreshBody();

    // create player
    this.player = this.physics.add.sprite(100, 450, "dude");
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    // anim player
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    this.player.body.setGravityY(300);

    // platform + player
    this.physics.add.collider(this.player, this.platforms);
  }

  update(): void {
    // controls
    if (this.cursors?.left.isDown) {
      this.player.setVelocityX(-160);

      this.player.anims.play("left", true);
    } else if (this.cursors?.right.isDown) {
      this.player.setVelocityX(160);

      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);

      this.player.anims.play("turn");
    }

    if (this.cursors?.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }
}
