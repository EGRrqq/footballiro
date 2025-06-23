import { Scene } from "phaser";

export class Game extends Scene {
  private player: Phaser.GameObjects.Rectangle;

  constructor() {
    super("Game");
  }

  preload() {
    this.load.setPath("assets");
    this.player = this.add.rectangle(400, 400, 100, 100, 0x5555ff);
  }

  create() {}
}
