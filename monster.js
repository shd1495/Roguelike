export class Monster {
  constructor(stage) {
    // 체력
    this.hp = 15 * stage + Math.round(Math.random() * 5 * stage);
    // 최소 공격력
    this.damage = stage + Math.round(Math.random() * 3 * stage);
    // 최대 공격력 배율
    this.maxDamageMag = 1 + Math.round(Math.random() * 2);
    // 방어 수치
    this.defense = stage;
    // 치명타 확률
    this.criticalChance = 10;
    // 치명타 배율
    this.criticalMag = 2;
  }

  // 공격력 계산
  calculDamage(player) {
    let damage =
      // 최소 공격력 + 난수 * 공격력 편차(최소공 * 최대공 배율 - 최소공)
      this.damage +
      Math.round(Math.random() * (this.damage * this.maxDamageMag - this.damage)) -
      player.defense;

    return damage > 0 ? damage : 0;
  }

  // 크리티컬 확률 계산
  isCri() {
    return Math.random() * 100 < this.criticalChance;
  }

  attack(player) {
    const result = [];
    const isCri = this.isCri();
    let damage = this.calculDamage(player);

    if (damage > 0 && isCri) {
      damage *= this.criticalMag;
    }

    player.hp -= damage;

    result.push(damage);
    result.push(isCri);

    return result;
  }
}
