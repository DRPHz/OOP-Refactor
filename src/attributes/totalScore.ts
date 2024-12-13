export default class totalScore {
  private totalScore: number;

  private static instance: totalScore;

  public static VPNScore: number = 0;

  public static defenderScore: number = 0;

  public static terminalScore: number = 0;

  public static getInstance(): totalScore {
    if (!totalScore.instance) {
      totalScore.instance = new totalScore();
    }
    return totalScore.instance;
  }

  public updateTotalScore(gameScore: number): void {
    this.totalScore += gameScore;
  }

  public getTotalScore(): number {
    this.totalScore = totalScore.VPNScore + totalScore.defenderScore + totalScore.terminalScore;
    return this.totalScore;
  }
}
