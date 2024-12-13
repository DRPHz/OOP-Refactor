import CanvasRenderer from "./CanvasRenderer.js";
import Scene from "./Scene.js";
import MouseListener from "./MouseListener.js";
import homeScene from "./scenes/homeScene.js";

export default class Level extends Scene {

  public constructor(maxX: number, maxY: number) {
    super(maxX, maxY);
  }

  /**
   * Process input from the mouse
   *
   * @param mouseListener mouse listener object
   */

  public processInput(mouseListener: MouseListener): void {
  }

  /**
   *
   * @param elapsed elapsed ms since last update
   */
  public update(elapsed: number): void {
  }

  /**
   *
   * @returns new scene to switch to, or null to keep current scene
   */
  public override getNextScene(): Scene | null {
    return new homeScene(this.maxX, this.maxY);
  }

  /**
   * Render the scene to the canvas
   * @param canvas canvas to render to
   */
  public render(canvas: HTMLCanvasElement): void {
  }
}
