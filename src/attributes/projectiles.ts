export default class Projectiles {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public image: HTMLImageElement;
  public rotation: number;

  public constructor(x: number, y: number, width: number, height: number, imagePath: string, rotation: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = new Image();
    this.image.src = imagePath;
    this.rotation = rotation;
  }
  private bulletLeft(): void {
    this.x -= 10;
  }
  private bulletRight(): void {
    this.x += 10;
  }
  private bulletUp(): void {
    this.y -= 10;
  }
  private bulletDown(): void {
    this.y += 10;
  }

  public update(): void {
    if (this.rotation === 90) {
      this.bulletRight();
    } else if (this.rotation === 180) {
      this.bulletDown();
    } else if (this.rotation === -90) {
      this.bulletLeft();
    } else if (this.rotation === 0) {
      this.bulletUp();
    }
  }
  public render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();
  }
}
