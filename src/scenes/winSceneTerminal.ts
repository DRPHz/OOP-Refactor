import CanvasRenderer from "../CanvasRenderer.js";
import MouseListener from "../MouseListener.js";
import Scene from "../Scene.js";
import homeScene from "./homeScene.js";
import ScoreManager from "../attributes/totalScore.js";
import Facts from "../attributes/facts.js";

export default class winSceneTerminal extends Scene {
  private winBackground: HTMLImageElement;
  private clickNext: boolean = false;
  private facts = new Facts();

  public constructor(maxX: number, maxY: number) {
    super(maxX, maxY);
    this.winBackground = CanvasRenderer.loadNewImage("./assets/black-background.jpg");
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
    const shuffledFacts = Facts.factsList.sort(() => Math.random() - 0.5);
    for (let i = 0; i < count; i++) {
      randomFacts.push(shuffledFacts[i]);
    }
    shuffledFacts.splice(0, count);
    return randomFacts;
  }

  private randomFacts = this.getRandomFacts(3);
  /**
   * Render the scene to the canvas
   * @param canvas canvas to render to
   */
  public render(canvas: HTMLCanvasElement): void {
    document.body.style.backgroundImage = `url(${this.winBackground.src})`;
    CanvasRenderer.writeText(canvas, "You completed Level 2", canvas.width / 2, canvas.height / 8, "center", "Pixelated", 75, "Green");
    CanvasRenderer.writeText(canvas, "Did you know?", canvas.width / 2, canvas.height / 4, "center", "Pixelated", 75, "Green");

    for (let i = 0; i < this.randomFacts.length; i++) {
      const x = this.facts.paddingX;
      const y = this.facts.paddingY + i * 100; 

      CanvasRenderer.writeText(canvas, this.randomFacts[i], x, y, this.facts.textStyle.textAlign, this.facts.textStyle.font, this.facts.textStyle.fontSize, this.facts.textStyle.fillStyle);
    }
    CanvasRenderer.writeText(canvas, "Click to continue", canvas.width / 2, canvas.height - 30, "center", "Pixelated", 75, "Green");
    console.log(ScoreManager.defenderScore);
    CanvasRenderer.writeText(canvas, `Terminal score:  ${ScoreManager.terminalScore}`, canvas.width / 2, canvas.height - 80, "center", "Pixelated", 75, "Green");
  }
}
