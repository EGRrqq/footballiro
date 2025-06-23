import { Scene } from "phaser";

// Movement type
type Movement = {
  key: Phaser.Input.Keyboard.Key;
  x: number;
  y: number;
  anim: string;
};

export class Game extends Scene {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private direction: "left" | "right" | "up" | "down" = "down";
  private platforms: Phaser.Physics.Arcade.StaticGroup;
  private movements: Movement[]; // Mapped movement controls
  private VELOCITY = 160; // Constant velocity

  constructor() {
    super("Game");
  }

  // Load assets
  preload() {
    this.load.setPath("assets");
    this.load.image("ground", "platform.png");
    this.load.spritesheet("hero", "character_base_48x48.png", {
      frameWidth: 48,
      frameHeight: 48,
    });
  }

  // Static
  create() {
    // Create controls
    this.cursors = this.input.keyboard!.createCursorKeys();

    // Setup movement mappings
    this.movements = [
      { key: this.cursors.left, x: -1, y: 0, anim: "left" },
      { key: this.cursors.right, x: 1, y: 0, anim: "right" },
      { key: this.cursors.up, x: 0, y: -1, anim: "up" },
      { key: this.cursors.down, x: 0, y: 1, anim: "down" },
    ];

    // Create platforms
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 700, "ground").setScale(2).refreshBody();

    // Create player
    this.player = this.physics.add.sprite(300, 450, "hero");
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    // Store animations data
    const animsData = [
      { key: "left", frames: { start: 12, end: 15 } },
      { key: "right", frames: { start: 8, end: 11 } },
      { key: "up", frames: { start: 4, end: 7 } },
      { key: "down", frames: { start: 0, end: 3 } },
      { key: "turn_l", frames: { frames: [12] } },
      { key: "turn_r", frames: { frames: [8] } },
      { key: "turn_u", frames: { frames: [4] } },
      { key: "turn_d", frames: { frames: [0] } },
    ];

    // Create animations
    animsData.forEach((anim) => {
      this.anims.create({
        key: anim.key,
        frames: this.anims.generateFrameNumbers("hero", anim.frames),
        frameRate: 10,
      });
    });

    // Add collisions
    this.physics.add.collider(this.player, this.platforms);
  }

  // Update = requestAnimationFrame
  update(): void {
    let moved = false;

    // Check all movement options
    for (const move of this.movements) {
      if (move.key.isDown) {
        this.player.setVelocity(move.x * this.VELOCITY, move.y * this.VELOCITY);
        this.direction = move.anim as typeof this.direction;
        this.player.anims.play(move.anim, true);
        moved = true;
        break; // Prioritize first pressed direction
      }
    }

    // Handle idle state
    if (!moved) {
      this.player.setVelocity(0, 0);
      this.player.anims.play(`turn_${this.direction[0]}`, true);
    }
  }
}
