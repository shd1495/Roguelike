export class Monster {
  constructor(stage) {
    // 체력
    this.hp = 15 * stage + Math.round(Math.random() * 5 * stage);
    // 최소 공격력
    this.damege = stage + Math.round(Math.random() * 3 * stage);
    // 최대 공격력 배율
    this.maxDamegeMag = 1 + Math.round(Math.random() * 2);
    // 방어 수치
    this.defense = stage;
  }

  attack(player) {
    const result =
      this.damege + Math.round(Math.random() * (this.damege * this.maxDamegeMag - this.damege));

    player.hp -= result - player.defense;

    return result;
  }
}
