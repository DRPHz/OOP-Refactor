import CanvasRenderer from "../../CanvasRenderer.js";
import PowerUpItems from "../PowerUpItems.js";

export default class Scan extends PowerUpItems {
  public constructor() {
    super();
    this.image = CanvasRenderer.loadNewImage("./assets/radar_scan.png");
    this.posX = Math.random() * (window.innerWidth - this.image.width) + this.image.width;
    this.posY = Math.random() * (window.innerHeight - this.image.height) + this.image.height;
  }
}
