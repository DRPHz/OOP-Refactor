import CanvasRenderer from "../CanvasRenderer.js";
import MouseListener from "../MouseListener.js";
import Scene from "../Scene.js";
import DefenderScene from "./defenderScene.js";
import homeScene from "./homeScene.js";

export default class SceneStart extends Scene {
  private starting: boolean;

  private background: HTMLImageElement;

  public constructor(maxX: number, maxY: number) {
    super(maxX, maxY);
    this.background = CanvasRenderer.loadNewImage("./assets/key-instructions.png");
    this.starting = false;
  }

  /**
   * Process input from the mouse
   *
   * @param mouseListener mouse listener object
   */
  public processInput(mouseListener: MouseListener): void {
    if (mouseListener.buttonPressed(0)) {
      homeScene.instructionSceneShown = true;
      this.starting = true;
    }
  }

  /**
   *
   * @param elapsed elapsed ms since last update
   */
  public update(elapsed: number): void {}

  /**
   *
   * @returns the next scene to be rendered. null if no change
   */
  public getNextScene(): Scene | null {
    if (this.starting) {
      return new DefenderScene(this.maxX, this.maxY);
    } else {
      return null;
    }
  }

  /**
   * Render the scene to the canvas
   * @param canvas canvas to render to
   */
    public render(canvas: HTMLCanvasElement): void {
      document.body.style.backgroundImage = `url(${this.background.src})`;
    }
  }
