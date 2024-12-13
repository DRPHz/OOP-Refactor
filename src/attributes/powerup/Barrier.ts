import CanvasRenderer from "../../CanvasRenderer.js";
import PowerUpItems from "../PowerUpItems.js";

export default class Barrier extends PowerUpItems {
  public constructor(x: number, y: number) {
    super();
    this.image = CanvasRenderer.loadNewImage("./assets/barrier.png");
    this.posX = x;
    this.posY = y;
  }

  public update(x: number, y: number): void {
    this.posX = x;
    this.posY = y;
  }
}
