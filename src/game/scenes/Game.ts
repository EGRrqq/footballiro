import { Scene } from "phaser";

// Character direction type
type Direction = "left" | "right" | "up" | "down";

export class Game extends Scene {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private hero: Phaser.Physics.Matter.Sprite;
  private direction: Direction = "down";
  private camera: Phaser.Cameras.Scene2D.Camera;

  // Constants
  private readonly VELOCITY = 10;
  private readonly BOUNDS = {
    w: 3072,
    h: 2048,
  };

  constructor() {
    super("Game");
  }

  private createWall(
    x: number,
    y: number,
    angle: number,
    scale: number
  ): Phaser.Physics.Matter.Image {
    const wall = this.matter.add.image(x, y, "wall", undefined, {
      isStatic: true,
    });
    wall.setAngle(angle);
    wall.scale = scale;

    return wall;
  }

  // Load assets
  preload() {
    this.load.setPath("assets");
    this.load.image("wall", "platform.png");
    this.load.image("trophy", "gold_trophy_32x32_2");
    this.load.spritesheet("hero", "character_base_48x48.png", {
      frameWidth: 48,
      frameHeight: 48,
    });
  }

  // Static
  create() {
    // Set physics world bounds
    this.matter.world.setBounds(0, 0, this.BOUNDS.w, this.BOUNDS.h);

    // Create controls
    this.cursors = this.input.keyboard!.createCursorKeys();

    // Create platforms
    this.createWall(400, 50, 90, 2);
    this.createWall(400, 1150, 90, 2);
    this.createWall(400, 2250, 90, 2);

    this.createWall(2600, 50, 90, 2);
    this.createWall(2600, 1150, 90, 2);
    this.createWall(2600, 2250, 90, 2);

    this.createWall(800, 25, 0, 2);
    this.createWall(1600, 25, 0, 2);
    this.createWall(2200, 25, 0, 2);

    this.createWall(800, 2023, 0, 2);
    this.createWall(1600, 2023, 0, 2);
    this.createWall(2200, 2023, 0, 2);

    // Create player
    this.hero = this.matter.add.sprite(1600, 200, "hero", undefined, {
      chamfer: { radius: 12 }, // Optional: Rounded corners
    });
    this.hero.setFixedRotation(); // Prevent character rotation on collision

    // Create camera
    this.camera = this.cameras.main;
    this.camera.startFollow(this.hero);
    this.camera.setZoom(1.75);
    this.camera.setBounds(0, 0, this.BOUNDS.w, this.BOUNDS.h);
    this.camera.roundPixels = true;
    this.camera.setDeadzone(25, 25);
    this.camera.setLerp(0.1, 0.1);

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
  }

  // Update = requestAnimationFrame
  update(): void {
    // Create movement vector
    const movement = new Phaser.Math.Vector2(0, 0);

    // Apply direction inputs to vector
    if (this.cursors.left?.isDown) movement.x -= 1;
    if (this.cursors.right?.isDown) movement.x += 1;
    if (this.cursors.up?.isDown) movement.y -= 1;
    if (this.cursors.down?.isDown) movement.y += 1;

    // Handle movement
    if (movement.length() > 0) {
      // Normalize and scale vector for consistent diagonal speed
      movement.normalize().scale(this.VELOCITY);

      // Apply velocity
      this.hero.setVelocity(movement.x, movement.y);

      // Determine primary direction for animation (prioritize horizontal)
      if (movement.x < 0) this.direction = "left";
      else if (movement.x > 0) this.direction = "right";
      else if (movement.y < 0) this.direction = "up";
      else if (movement.y > 0) this.direction = "down";

      this.hero.anims.play(this.direction, true);
    }
    // Handle idle state
    else {
      this.hero.setVelocity(0, 0);
      this.hero.anims.play(`turn_${this.direction[0]}`, true);
    }
  }
}
