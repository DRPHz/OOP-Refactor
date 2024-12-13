import CanvasRenderer from "../CanvasRenderer.js";
import MouseListener from "../MouseListener.js";
import Scene from "../Scene.js";
import homeScene from "./homeScene.js";
import winSceneTerminal from "./winSceneTerminal.js";
import Player from "../attributes/player.js";
import Projectile from "../attributes/projectiles.js";
import Enemy from "../attributes/enemies.js";
import portal from "../attributes/portals.js";
import PowerUpItems from "../attributes/PowerUpItems.js";
import Coin from "../attributes/powerup/Coin.js";
import Turbo from "../attributes/powerup/Turbo.js";
import Firewall from "../attributes/powerup/Firewall.js";
import Barrier from "../attributes/powerup/Barrier.js";
import Scan from "../attributes/powerup/Scan.js";

import ScoreManager from "../attributes/totalScore.js";

import loseScene from "./loseScene.js";

export default class TerminalScene extends Scene {
  private keyMap: { [key: string]: boolean };

  private currentDirection: string | null;

  private terminalBackground: HTMLImageElement;

  private player: Player;

  private projectiles: Projectile[] = [];

  private enemies: Enemy[] = [];

  private portals: portal[] = [];

  private powerUpItems: PowerUpItems[] = [];

  private escapeClicked: boolean = false;

  private lifes: number = 5;

  private timeLimit: number = 90000;

  private terminalScore = 0;

  private turboActive: boolean = false;

  private turboTimer: number = 0;

  private firewallActive: boolean = false;

  private barriers: Barrier[] = [];

  private timeUntilNextItem: number = 0;

  private showTurboCard: boolean = false;

  private showFirewallCard: boolean = false;

  private showScanCard: boolean = false;

  private turboCardTimer: number = 0;

  private turboCardShown: boolean = false;

  private firewallCardShown: boolean = false;

  private scanCardShown: boolean = false;

  private firewallCardTimer: number = 0;

  private scanCardTimer: number = 0;

  private portalSpawnTimer: number = 0;

  private enemySpawnTimer: number = 0;

  // Function to calculate the time score
  private timeScoreMinutesandSeconds(): string {
    let minutes: number = Math.floor((this.timeLimit / (1000 * 60)) % 60);
    let seconds: number = Math.floor((this.timeLimit / 1000) % 60);
    let minutesString: string = minutes < 10 ? "0" + minutes.toString() : minutes.toString();
    let secondsString: string = seconds < 10 ? "0" + seconds.toString() : seconds.toString();
    return minutesString + ":" + secondsString;
  }

  public constructor(maxX: number, maxY: number) {
    super(maxX, maxY);

    this.keyMap = {
      ArrowLeft: false,
      ArrowRight: false,
      ArrowUp: false,
      ArrowDown: false,
      KeyA: false,
      KeyS: false,
      KeyD: false,
      KeyW: false,
    };
    this.currentDirection = null;

    this.terminalBackground = CanvasRenderer.loadNewImage("./assets/terminal_background.png");
    this.player = new Player(maxX / 2, maxY / 2, 100, 100, "./assets/player.png");

    // Add event listener for keydown events
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this));
    document.addEventListener("click", this.handleClick.bind(this));
  }
  // Add event listener for space keydown events

  // Handle keydown events
  private handleKeyDown(event: KeyboardEvent): void {
    if (this.keyMap.hasOwnProperty(event.code)) {
      event.preventDefault();
      this.keyMap[event.code] = true;
      this.updateDirection();
    } else if (event.key === "Escape") {
      this.escapeClicked = true;
    } else if (event.key === " ") {
      this.projectiles.push(new Projectile(this.fixPositionX(), this.fixPositionY(), 30, 30, "./assets/bullet-green.png", this.player.rotation));
    }
  }

  // Handle keyup events
  private handleKeyUp(event: KeyboardEvent): void {
    if (this.keyMap.hasOwnProperty(event.code)) {
      event.preventDefault();
      this.keyMap[event.code] = false;
      this.updateDirection();
    }
  }

  // Function to fix the position of the projectile
  private fixPositionX(): number {
    if (this.player.rotation === 0) {
      return this.player.x + 34;
    } else if (this.player.rotation === 180) {
      return this.player.x + 36;
    } else if (this.player.rotation === 90) {
      return this.player.x + 58;
    }
    return this.player.x;
  }

  // Function to fix the position of the projectile
  private fixPositionY(): number {
    if (this.player.rotation === 180) {
      return this.player.y + 58;
    } else if (this.player.rotation === 90) {
      return this.player.y + 34;
    } else if (this.player.rotation === -90) {
      return this.player.y + 36;
    }
    return this.player.y;
  }

  // Function to handle the click event
  private handleClick(event: MouseEvent): void {
    this.projectiles.push(new Projectile(this.fixPositionX(), this.fixPositionY(), 30, 30, "./assets/bullet-green.png", this.player.rotation));
  }

  // Function to update the direction of the player
  private updateDirection(): void {
    const keys = Object.keys(this.keyMap).filter((key) => this.keyMap[key]);

    const prioritizedKeys = ["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"];

    const firstMatchingKey = prioritizedKeys.find((key) => keys.includes(key));

    this.currentDirection = firstMatchingKey || null;
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

  /**
   * Get the next scene to run
   */
  public getNextScene(): Scene | null {
    if (this.timeLimit <= 0) {
      ScoreManager.terminalScore = this.terminalScore;
      homeScene.vpnEnabled = true;
      return new winSceneTerminal(this.maxX, this.maxY);
    } else if (this.escapeClicked === true) {
      return new homeScene(this.maxX, this.maxY);
    } else if (this.lifes <= 0) {
      return new loseScene(this.maxX, this.maxY);
    } else return null;
  }

  // Method to end the game

  public portalsSpawn(): void {
    const maxPortals = 4;
    const portalCount = this.portals.length;

    if (portalCount < maxPortals) {
      this.spawnPortal();
    }

    const spawnInterval = 5000; // spawn interval
    const minSpawnDelay = 5000; // Minimum time before next spawn
    const maxSpawnDelay = 15000; // Maximum time before next spawn

    const spawnAdditionalPortal = () => {
      const newPortalCount = this.portals.length;
      if (newPortalCount < maxPortals) {
        this.spawnPortal();
      }

      if (newPortalCount < maxPortals) {
        const nextSpawnDelay = Math.floor(Math.random() * (maxSpawnDelay - minSpawnDelay + 1)) + minSpawnDelay;
        setTimeout(spawnAdditionalPortal, nextSpawnDelay);
      }
    };

    setTimeout(spawnAdditionalPortal, spawnInterval);
  }

  private spawnPortal(): void {
    const minX = 100;
    const minY = 100;
    const maxX = window.innerWidth - 100;
    const maxY = window.innerHeight - 100;

    const randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
    const randomY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

    const newPortal = new portal(randomX, randomY, 100, 100, "./assets/portal-gray.png");
    this.portals.push(newPortal);
  }

  /**
   *
   * @param elapsed elapsed ms since last update
   */
  // ...

  public update(elapsed: number): void {
    if (this.timeLimit > 0 || this.lifes > 0) {
      this.timeLimit -= elapsed;
    } else {
      this.getNextScene();
    }

    this.projectiles.forEach((projectile) => {
      projectile.update();
    });

    if (this.currentDirection === "ArrowLeft" || this.currentDirection === "KeyA") {
      if (this.player.x > 0) {
        if (this.turboActive === true) {
          this.player.turboMoveLeft();
        } else {
          this.player.moveLeft();
        }
      }
    } else if (this.currentDirection === "ArrowRight" || this.currentDirection === "KeyD") {
      if (this.player.x < this.maxX - this.player.width) {
        if (this.turboActive === true) {
          this.player.turboMoveRight();
        } else {
          this.player.moveRight();
        }
      }
    } else if (this.currentDirection === "ArrowUp" || this.currentDirection === "KeyW") {
      if (this.player.y > 0) {
        if (this.turboActive === true) {
          this.player.turboMoveUp();
        } else {
          this.player.moveUp();
        }
      }
    } else if (this.currentDirection === "ArrowDown" || this.currentDirection === "KeyS") {
      if (this.player.y < this.maxY - this.player.height) {
        {
          if (this.player.y < this.maxY - this.player.height) {
            if (this.turboActive === true) {
              this.player.turboMoveDown();
            } else {
              this.player.moveDown();
            }
          }
        }
      }
    }
    const playerBox = {
      x: this.player.x + 12,
      y: this.player.y + 12,
      width: this.player.width - 22,
      height: this.player.height - 22,
    };

    this.enemies.forEach((enemy, index) => {
      enemy.update(playerBox.x, playerBox.y);
      if (playerBox.x < enemy.x + enemy.width && playerBox.x + playerBox.width > enemy.x && playerBox.y < enemy.y + enemy.height && playerBox.y + playerBox.height > enemy.y) {
        this.enemies.splice(index, 1);
        if (this.firewallActive === true) {
          this.barriers.splice(0, 1);
          if (this.barriers.length === 0) {
            this.firewallActive = false;
          }
        } else this.lifes--;
      }
    });

    for (let i = 0; i < this.projectiles.length; i++) {
      const projectile = this.projectiles[i];
      for (let j = 0; j < this.enemies.length; j++) {
        const enemy = this.enemies[j];

        // Check for overlap between bounding boxes
        if (projectile.x < enemy.x + enemy.width && projectile.x + projectile.width > enemy.x && projectile.y < enemy.y + enemy.height && projectile.y + projectile.height > enemy.y) {
          // Remove the enemy from the array when hit by the projectile
          this.terminalScore++;
          this.enemies.splice(j, 1);
          this.projectiles.splice(i, 1);
          j--;
        }
      }
    }

    // Collision detection between projectiles and portals
    for (let i = 0; i < this.projectiles.length; i++) {
      const projectile = this.projectiles[i];
      for (let j = 0; j < this.portals.length; j++) {
        const portal = this.portals[j];

        // Check for overlap between bounding boxes
        if (projectile.x < portal.x + portal.width && projectile.x + projectile.width > portal.x && projectile.y < portal.y + portal.height && projectile.y + projectile.height > portal.y) {
          // Remove the portal from the array when hit by the projectile
          this.portals.splice(j, 1);
          this.projectiles.splice(i, 1);
          this.terminalScore += 3;
          j--;
        }
      }
    }

    // Portal spawn
    this.portalSpawnTimer += elapsed;
    if (this.portalSpawnTimer >= 6000 + Math.floor(Math.random() * 5000)) {
      this.portalSpawnTimer = 0;
      this.portalsSpawn();
    }

    // Enemy spawn
    this.enemySpawnTimer += elapsed;
    if (this.enemySpawnTimer >= 4000 + Math.floor(Math.random() * 3000)) {
      this.enemySpawnTimer = 0;
      this.spawnEnemiesFromPortals();
    }

    // Power up items spawn timer
    const randomItemChance = Math.random() * 100;
    const randomItemInterval = Math.random() * 2000 + 5000;
    this.timeUntilNextItem += elapsed;
    if (this.timeUntilNextItem >= randomItemInterval) {
      this.timeUntilNextItem = 0;
      if (randomItemChance <= 60) {
        this.powerUpItems.push(new Coin());
      } else if (randomItemChance <= 85) {
        this.powerUpItems.push(new Turbo());
      } else if (randomItemChance <= 95) {
        this.powerUpItems.push(new Firewall());
      } else {
        this.powerUpItems.push(new Scan());
      }
    }

    //power up collision detection
    this.powerUpItems.forEach((item) => {
      if (this.player.collidesWithItem(item) === true) {
        if (item instanceof Coin) {
          this.terminalScore += item.getScore();
        }
        if (item instanceof Turbo) {
          if (this.turboCardShown === false) {
            this.turboCardShown = true;
            this.showTurboCard = true;
            this.showFirewallCard = false;
            this.showScanCard = false;
          }
          this.turboActive = true;
          this.turboTimer += 3000;
        }
        if (item instanceof Firewall) {
          if (this.firewallCardShown === false) {
            this.firewallCardShown = true;
            this.showFirewallCard = true;
            this.showTurboCard = false;
            this.showScanCard = false;
            this.firewallCardTimer += 15000;
          }
          if (this.firewallActive === false) {
            this.barriers.push(new Barrier(this.player.x, this.player.y));
            this.firewallActive = true;
          } else if (this.firewallActive === true) {
            this.lifes++;
          }
        }
        if (item instanceof Scan) {
          if (this.scanCardShown === false) {
            this.scanCardShown = true;
            this.showScanCard = true;
            this.showFirewallCard = false;
            this.showTurboCard = false;
            this.scanCardTimer += 15000;
          }

          this.terminalScore += this.enemies.length * 1;
          this.terminalScore += this.portals.length * 3;
          this.enemies = [];
          this.portals = [];
        }
        this.powerUpItems.splice(this.powerUpItems.indexOf(item), 1);
      }
    });

    //Turbo Timer
    if (this.turboTimer > 0) {
      this.turboTimer -= elapsed;
    }
    if (this.turboTimer <= 0) {
      this.turboActive = false;
      this.turboTimer = 0;
    }
    if (this.showTurboCard) {
      this.turboCardTimer += elapsed;
      if (this.turboCardTimer >= 15000) {
        this.showTurboCard = false;
        this.turboCardTimer = 0;
      }
    }

    // Firewall Timer
    if (this.firewallCardTimer > 0) {
      this.firewallCardTimer -= elapsed;
    }
    if (this.firewallCardTimer <= 0) {
      this.showFirewallCard = false;
      this.firewallCardTimer = 0;
    }

    // Scan Timer
    if (this.scanCardTimer > 0) {
      this.scanCardTimer -= elapsed;
    }
    if (this.scanCardTimer <= 0) {
      this.showScanCard = false;
      this.scanCardTimer = 0;
    }

    this.barriers.forEach((barrier) => {
      barrier.update(this.player.x, this.player.y);
    });
  }

  // Function to spawn enemies from existing portals
  private spawnEnemiesFromPortals(): void {
    this.portals.forEach((portal) => {
      const spawnX = portal.x;
      const spawnY = portal.y;
      this.spawnEnemiesFromSpawnPoint(1, spawnX, spawnY, 0); // Spawn instantly from portals
    });
  }

  // Function to spawn enemies from the spawn point
  public spawnEnemiesFromSpawnPoint(numberOfEnemies: number, spawnX: number, spawnY: number, spawnInterval: number): void {
    const enemyImagePath = "./assets/enemy-red.png";
    let enemyCount = 0;

    // Spawn an enemy every spawnInterval milliseconds
    const spawnTimer = setInterval(() => {
      if (enemyCount >= numberOfEnemies) {
        clearInterval(spawnTimer);
        return;
      }

      // Create a new enemy at the spawn point
      const newEnemy = new Enemy(spawnX, spawnY, 70, 70, enemyImagePath);

      // Add the new enemy to the enemies array
      this.enemies.push(newEnemy);

      enemyCount++;
    }, spawnInterval);
  }

  /**
   * Render the scene to the canvas
   * @param canvas canvas to render to
   */
  public render(canvas: HTMLCanvasElement): void {
    document.body.style.backgroundImage = `url(${this.terminalBackground.src})`;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      this.player.render(canvas, ctx);
      this.projectiles.forEach((projectile) => {
        projectile.render(canvas, ctx);
      });
      this.enemies.forEach((enemy) => {
        enemy.render(canvas, ctx);
      });

      this.portals.forEach((portal) => {
        portal.render(canvas, ctx);
      });

      this.powerUpItems.forEach((powerUpItem) => {
        powerUpItem.render(canvas);
      });

      this.barriers.forEach((barrier) => {
        barrier.render(canvas);
      });

      CanvasRenderer.writeText(canvas, this.timeScoreMinutesandSeconds(), canvas.width / 2, canvas.height * 0.07, "center", "Pixelated", 75, "White");
      CanvasRenderer.writeText(canvas, `Score: ${this.terminalScore}`, canvas.width * 0.15, canvas.height * 0.07, "center", "Pixelated", 75, "White");
      CanvasRenderer.writeText(canvas, `Lives: ${this.lifes}`, canvas.width * 0.8, canvas.height * 0.07, "center", "Pixelated", 75, "White");

      if (this.showTurboCard) {
        const cardWidth = 340;
        const cardHeight = 191;
        const cardPadding = 10;
        const cardX = canvas.width - cardWidth - cardPadding + 5;
        const cardY = canvas.height - cardHeight - cardPadding + 5;

        const cardImage = CanvasRenderer.loadNewImage("./assets/turboPowerUp.jpg");
        CanvasRenderer.drawImage(canvas, cardImage, cardX, cardY);
      }
      if (this.showFirewallCard) {
        const cardWidth = 340;
        const cardHeight = 191;
        const cardPadding = 10;
        const cardX = canvas.width - cardWidth - cardPadding + 5;
        const cardY = canvas.height - cardHeight - cardPadding + 5;

        const cardImage = CanvasRenderer.loadNewImage("./assets/firewallPowerUp.jpg");
        CanvasRenderer.drawImage(canvas, cardImage, cardX, cardY);
      }
      if (this.showScanCard) {
        const cardWidth = 340;
        const cardHeight = 191;
        const cardPadding = 10;
        const cardX = canvas.width - cardWidth - cardPadding + 5;
        const cardY = canvas.height - cardHeight - cardPadding + 5;

        const cardImage = CanvasRenderer.loadNewImage("./assets/scanPowerUp.jpg");
        CanvasRenderer.drawImage(canvas, cardImage, cardX, cardY);
      }
    }
  }
}
