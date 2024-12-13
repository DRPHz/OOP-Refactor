export default class Enemies {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public image: HTMLImageElement;
  public rotation: number;

  constructor(x: number, y: number, width: number, height: number, imagePath: string) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = new Image();
    this.image.onload = () => {};
    this.image.src = imagePath;
    this.rotation = 0;
  }

  public update(playerX: number, playerY: number): void {
    // Calculate the direction vector from the enemy to the player
    const dx = playerX - this.x;
    const dy = playerY - this.y;

    // Calculate the distance between enemy and player
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Normalize the direction vector to create a unit vector
    const directionX = dx / distance;
    const directionY = dy / distance;

    // Enemys moving speed
    const speed = 2;
    this.x += directionX * speed;
    this.y += directionY * speed;
  }

  render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();
  }
}
