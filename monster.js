export class Monster {
  constructor(stage) {
    // 체력
    this.hp = 15 * stage + Math.round(Math.random() * 12 * stage);
    // 최소 공격력
    this.damage = stage + Math.round(Math.random() * 4 * stage);
    // 최대 공격력 배율
    this.maxDamageMag = 1 + Math.round(Math.random() * 2);
    // 방어 수치
    this.defense = Math.floor(stage / 2);
    // 치명타 확률
    this.criticalChance = 10 + stage;
    // 치명타 배율
    this.criticalMag = 2;
  }

  // 공격력 계산
  calculDamage() {
    let damage =
      // 최소 공격력 + 난수 * 공격력 편차(최소공 * 최대공 배율 - 최소공)
      this.damage + Math.round(Math.random() * (this.damage * this.maxDamageMag - this.damage));

    return damage > 0 ? damage : 0;
  }

  // 입은 피해 계산
  takeDamage(damage) {
    // 대미지가 0보다 낮을경우 0 = 최소 피해량
    const receivedDamage = Math.max(damage - this.defense, 0);
    this.hp -= receivedDamage;
    return receivedDamage;
  }

  // 크리티컬 확률 계산
  isCri() {
    return Math.random() * 100 < this.criticalChance;
  }

  // 공격
  attack(player) {
    let damage = this.calculDamage(player);
    const isCri = this.isCri();

    // 치명타 시 데미지 * 치명타 배율
    if (isCri) damage *= this.criticalMag;

    damage = player.takeDamage(damage, isCri);

    return [damage, isCri];
  }
}
