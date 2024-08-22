export class Player {
  constructor() {
    // 체력
    this.hp = 50 + Math.round(Math.random() * 50);
    // 최소 공격력
    this.damage = 1 + Math.round(Math.random() * 5);
    // 최대 공격력 배율
    this.maxDamageMag = 1 + Math.round(Math.random() * 2);
    // 방어 확률
    this.defenseChance = 55;
    // 도망 확률
    this.runChance = 5;
    // 연속 공격 확률
    this.doubleAttackChance = 33;
    // 방어 수치
    this.defense = 1;
    // 치명타 확률
    this.criticalChance = 10;
    // 치명타 배율
    this.criticalMag = 2;
  }

  // 공격력 계산
  calculDamage(monster, counter = false) {
    let damage =
      // 최소 공격력 + 난수 * 공격력 편차(최소공 * 최대공 배율 - 최소공)
      this.damage +
      Math.round(Math.random() * (this.damage * this.maxDamageMag - this.damage)) -
      monster.defense;

    // 반격 대미지 계산
    if (counter) damage = Math.round(damage * 0.6);

    return damage > 0 ? damage : 0;
  }

  // 크리티컬 확률 계산
  isCri() {
    return Math.random() * 100 < this.criticalChance;
  }

  // 공격
  attack(monster) {
    const result = [];
    let damage = this.calculDamage(monster);
    const isCri = this.isCri();

    if (damage > 0 && isCri) {
      damage *= this.criticalMag;
    }

    monster.hp -= damage;

    result.push(damage);
    result.push(isCri);

    return result;
  }

  // 방어
  counter(monster) {
    const roll = Math.random() * 100;
    const result = [];

    // 확률 체크
    if (roll < this.defenseChance) {
      let counter = this.calculDamage(monster, true);
      const isCri = this.isCri();

      if (counter > 0 && isCri) counter *= this.criticalMag;

      monster.hp -= counter;

      result.push(true);
      result.push(isCri);
      result.push(counter);
    }

    return result;
  }

  // 연속 공격
  doubleAttack(monster) {
    const roll = Math.random() * 100;
    const result = [];

    // 확률 체크
    if (roll < this.doubleAttackChance) {
      result.push(true);
      // 공격 2번 실행
      result.push(this.attack(monster));
      result.push(this.attack(monster));
    }
    return result;
  }

  // 도망
  run() {
    return Math.random() * 100 < this.runChance;
  }
}
