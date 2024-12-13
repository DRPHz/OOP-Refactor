import CanvasRenderer from "../CanvasRenderer.js";
import MouseListener from "../MouseListener.js";
import Scene from "../Scene.js";
import homeScene from "./homeScene.js";
import facts from "../attributes/facts.js";


export default class loseScene extends Scene {
  private Facts = new facts();
  private loseBackground: HTMLImageElement;
  private clickNext: boolean = false;

  public constructor(maxX: number, maxY: number) {
    super(maxX, maxY);
    this.loseBackground = CanvasRenderer.loadNewImage("./assets/black-background.jpg");
  }

  /**
   * Process input from the mouse
   *
   * @param mouseListener mouse listener object
   */
  public processInput(mouseListener: MouseListener): void {
    if (mouseListener.buttonPressed(0)) {
      this.clickNext = true;
    }
  }

  public getNextScene(): Scene | null {
    if (this.clickNext === true) {
      return new homeScene(this.maxX, this.maxY);
    }
    return null;
  }

  /**
   *
   * @param elapsed elapsed ms since last update
   */
  public update(elapsed: number): void {
    if (this.clickNext) {
      this.getNextScene();
    }
  }

  private getRandomFacts(count: number): string[] {
    const randomFacts: string[] = [];
    const shuffledFacts = facts.factsList.sort(() => Math.random() - 0.5);
    for (let i = 0; i < count; i++) {
      randomFacts.push(shuffledFacts[i]);
    }
    return randomFacts;
  }

  private randomFacts = this.getRandomFacts(3);

  /**
   * Render the scene to the canvas
   * @param canvas canvas to render to
   */
  public render(canvas: HTMLCanvasElement): void {
    document.body.style.backgroundImage = `url(${this.loseBackground.src})`;
    CanvasRenderer.writeText(canvas, "Did you know?", canvas.width / 2, canvas.height / 4, "center", "Pixelated", 75, "Red");
    CanvasRenderer.writeText(canvas, "You Lost!", canvas.width / 2, canvas.height / 8, "center", "Pixelated", 75, "Red");
    for (let i = 0; i < this.randomFacts.length; i++) {
      const x = this.Facts.paddingX;
      const y = this.Facts.paddingY + i * 100;

      CanvasRenderer.writeText(canvas, this.randomFacts[i], x, y, this.Facts.textStyle.textAlign, this.Facts.textStyle.font, this.Facts.textStyle.fontSize, this.Facts.textStyle.fillStyle);
    }
    CanvasRenderer.writeText(canvas, "Click to continue", canvas.width / 2, canvas.height - 30, "center", "Pixelated", 75, "Red");
  }
}
