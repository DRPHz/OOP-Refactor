import PowerUpItems from "./PowerUpItems.js";

export default class Player {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public image: HTMLImageElement;
  public rotation: number;

  public constructor(x: number, y: number, width: number, height: number, imagePath: string) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = new Image();
    this.image.src = imagePath;
    this.rotation = 0;
  }

  // Move Functions For The Player
  public moveLeft(): void {
    this.x -= 6;
    this.rotation = -90;
  }

  public moveRight(): void {
    this.x += 6;
    this.rotation = 90;
  }

  public moveUp(): void {
    this.y -= 6;
    this.rotation = 0;
  }

  public moveDown(): void {
    this.y += 6;
    this.rotation = 180;
  }

  public turboMoveLeft(): void {
    this.x -= 9;
    this.rotation = -90;
  }

  public turboMoveRight(): void {
    this.x += 9;
    this.rotation = 90;
  }

  public turboMoveUp(): void {
    this.y -= 9;
    this.rotation = 0;
  }

  public turboMoveDown(): void {
    this.y += 9;
    this.rotation = 180;
  }

  public collidesWithItem(item: PowerUpItems): boolean {
    if (this.y <= item.getPosY() + item.getHeight() && this.y + this.height >= item.getPosY() && this.x + this.width >= item.getPosX() && this.x <= item.getPosX() + item.getWidth()) {
      return true;
    }
    return false;
  }

  public render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();
  }
}
