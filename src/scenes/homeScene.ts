import CanvasRenderer from "../CanvasRenderer.js";
import MouseListener from "../MouseListener.js";
import Scene from "../Scene.js";
import mailScene from "./mailScene.js";
import TerminalScene from "./terminalScene.js";
import DefenderScene from "./defenderScene.js";
import VPNScene from "./vpnScene.js";
import ScoreManager from "../attributes/totalScore.js";
import instructionscene from "./instructionScene.js";

const scoreManager = ScoreManager.getInstance();

export default class homeScene extends Scene {
  private pcBackground: HTMLImageElement;
  private defender: HTMLImageElement;
  private terminal: HTMLImageElement;
  private mail: HTMLImageElement;
  private vpn: HTMLImageElement;
  private nextScene: Scene | null;
  private mailNoNotif: HTMLImageElement;

  private defenderBlocked: HTMLImageElement;
  private terminalBlocked: HTMLImageElement;
  private vpnBlocked: HTMLImageElement;

  public static setMailNoNotif: boolean = false;

  public static mailSceneEnabled: boolean = true;

  public static defenderEnabled: boolean = false;

  public static terminalEnabled: boolean = false;

  public static vpnEnabled: boolean = false;

  public static shoppingEnabled: boolean = false;

  public static instructionSceneShown: boolean = false;

  public constructor(maxX: number, maxY: number) {
    super(maxX, maxY);
    this.pcBackground = CanvasRenderer.loadNewImage("./assets/pcbackground.png");
    this.defender = CanvasRenderer.loadNewImage("./assets/defender.png");
    this.terminal = CanvasRenderer.loadNewImage("./assets/terminal.png");
    this.mail = CanvasRenderer.loadNewImage("./assets/mail.png");
    this.vpn = CanvasRenderer.loadNewImage("./assets/vpn.png");
    this.mailNoNotif = CanvasRenderer.loadNewImage("./assets/mail-no-notification.png");

    this.defenderBlocked = CanvasRenderer.loadNewImage("./assets/blockedIcon/defender.png");
    this.terminalBlocked = CanvasRenderer.loadNewImage("./assets/blockedIcon/terminal.png");
    this.vpnBlocked = CanvasRenderer.loadNewImage("./assets/blockedIcon/vpn.png");
  }

  /**
   * Process input from the mouse
   *
   * @param mouseListener mouse listener object
   */
  public processInput(mouseListener: MouseListener): void {
    if (mouseListener.getMousePosition().x > 0 && mouseListener.getMousePosition().x < 100 && mouseListener.getMousePosition().y > 20 && mouseListener.getMousePosition().y < 120) {
      if (mouseListener.buttonPressed(0)) {
        if (homeScene.mailSceneEnabled == true) {
          homeScene.mailSceneEnabled = false;
          this.nextScene = new mailScene(this.maxX, this.maxY);
        } else {
          alert("Mail scene already used");
        }
      }
    }
    if (mouseListener.getMousePosition().x > 120 && mouseListener.getMousePosition().x < 220 && mouseListener.getMousePosition().y > 20 && mouseListener.getMousePosition().y < 120) {
      if (mouseListener.buttonPressed(0)) {
        if (homeScene.defenderEnabled == true) {
          this.nextScene = new instructionscene(this.maxX, this.maxY);
        } else {
        }
      }
    }
    if (mouseListener.getMousePosition().x > 0 && mouseListener.getMousePosition().x < 100 && mouseListener.getMousePosition().y > 140 && mouseListener.getMousePosition().y < 240) {
      if (mouseListener.buttonPressed(0)) {
        if (homeScene.terminalEnabled == true) {
          this.nextScene = new TerminalScene(this.maxX, this.maxY);
        } else {
        }
      }
    }
    if (mouseListener.getMousePosition().x > 120 && mouseListener.getMousePosition().x < 220 && mouseListener.getMousePosition().y > 140 && mouseListener.getMousePosition().y < 240) {
      if (mouseListener.buttonPressed(0)) {
        if (homeScene.vpnEnabled == true) {
          this.nextScene = new VPNScene(this.maxX, this.maxY);
        } else {
        }
      }
    }
  }

  /**5
   *
   * @returns the next scene to be rendered. null if no change
   */
  public getNextScene(): Scene | null {
    if (this.nextScene instanceof mailScene) {
      return this.nextScene;
    } else if (this.nextScene instanceof instructionscene) {
      if (homeScene.instructionSceneShown) {
        return new DefenderScene(this.maxX, this.maxY);
      } else {
        return new instructionscene(this.maxX, this.maxY);
      }
    } else if (this.nextScene instanceof TerminalScene) {
      return new TerminalScene(this.maxX, this.maxY);
    } else if (this.nextScene instanceof VPNScene) {
      return new VPNScene(this.maxX, this.maxY);
    } else {
      return null;
    }
  }

  public renderIcon(canvas: HTMLCanvasElement, icon: HTMLImageElement, x: number, y: number): void {
    CanvasRenderer.drawImage(canvas, icon, x, y);
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
    document.body.style.backgroundImage = `url(${this.pcBackground.src})`;
    CanvasRenderer.clearCanvas(canvas);
    if (homeScene.setMailNoNotif) {
      this.renderIcon(canvas, this.mailNoNotif, 0, 20);
    } else {
      this.renderIcon(canvas, this.mail, 0, 20);
    }
    if (homeScene.defenderEnabled == true) {
      this.renderIcon(canvas, this.defender, 120, 20);
    } else {
      this.renderIcon(canvas, this.defenderBlocked, 120, 20);
    }
    if (homeScene.terminalEnabled == true) {
      this.renderIcon(canvas, this.terminal, 0, 140);
    } else {
      this.renderIcon(canvas, this.terminalBlocked, 0, 140);
    }
    if (homeScene.vpnEnabled == true) {
      this.renderIcon(canvas, this.vpn, 120, 140);
    } else {
      this.renderIcon(canvas, this.vpnBlocked, 120, 140);
    }
    CanvasRenderer.writeText(canvas, `Score: ${scoreManager.getTotalScore()}`, canvas.width - 100, 50, "center", "Pixelated", 45, "White");
  }
}
