export default class Portals {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public image: HTMLImageElement;
  public lives: number;
  public isAlive: boolean;

  constructor(x: number, y: number, width: number, height: number, imagePath: string) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = new Image();
    this.image.src = imagePath;
  }

  render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();
  }
}
