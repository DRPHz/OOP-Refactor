import CanvasRenderer from "../CanvasRenderer.js";
import MouseListener from "../MouseListener.js";
import Scene from "../Scene.js";
import homeScene from "./homeScene.js";

export default class mailScene extends Scene {
  private mailBackground: HTMLImageElement;
  private newsarticle: HTMLImageElement;
  private newsarticleUpdated: boolean = false;
  private pcBackgroundDarkened: HTMLImageElement;
  private canClickAway: boolean = false;
  private nextScene: boolean = false;
  public MailSceneUsed: boolean = false;

  public constructor(maxX: number, maxY: number) {
    super(maxX, maxY);
    this.mailBackground = CanvasRenderer.loadNewImage("./assets/pcbackground.png");
    this.newsarticle = CanvasRenderer.loadNewImage("./assets/newsarticle.png");
    this.pcBackgroundDarkened = CanvasRenderer.loadNewImage("./assets/pcbackgrounddarkend.png");
    this.MailSceneUsed = false;
  }

  /**
   * Process input from the mouse
   *
   * @param mouseListener mouse listener object
   */
  public processInput(mouseListener: MouseListener): void {
    if (mouseListener.buttonPressed(0)) {

    }
  }

  public getNextScene(): Scene | null {
    if (this.nextScene) {
      homeScene.defenderEnabled = true;
      return new homeScene(this.maxX, this.maxY);
    } else {
      return null;
    }
  }

  /**
   *
   * @param elapsed elapsed ms since last update
   */
  public update(elapsed: number): void {}

  /**
   * Render the scene to the canvas
   * @param canvas canvas to render to
   */

  public render(canvas: HTMLCanvasElement): void {

    if (this.newsarticleUpdated == false) {
      this.newsarticleUpdated = true;
      homeScene.setMailNoNotif = true;

      const image = document.createElement("img");
      setTimeout(() => {
        image.src = this.newsarticle.src;
        document.body.style.backgroundImage = `url(${this.pcBackgroundDarkened.src})`;
        const container = document.createElement("div");
        container.style.position = "absolute";
        container.style.width = `${this.newsarticle.width}px`;
        container.style.height = `${this.newsarticle.height}px`;
        container.style.left = `${canvas.width / 2 - this.newsarticle.width / 2}px`;
        container.style.top = `${canvas.height / 2 - this.newsarticle.height / 2}px`;
        container.style.transition = "all 0.5s ease-in-out";
        document.body.style.transition = "all 0.5s ease-in-out";

        image.style.width = "100%";
        image.style.height = "100%";
        image.style.objectFit = "cover";

        container.appendChild(image);
        document.body.appendChild(container);

        container.style.opacity = "0";
        container.style.transform = "scale(0)";

        void container.offsetWidth;

        container.style.opacity = "1";
        container.style.transform = "scale(1)";
        this.canClickAway = false;
        setTimeout(() => {
          this.canClickAway = true;
        }, 2000);

        document.addEventListener("click", () => {
          if (this.canClickAway == true) {
            container.style.opacity = "0";
            container.style.transform = "scale(0)";
            document.body.style.backgroundImage = `url(${this.mailBackground.src})`;
            this.nextScene = true;
            this.MailSceneUsed = true;
          }
        });
      }, 50);
    }
  }
}
