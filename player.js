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
  calculDamage(counter = false) {
    let damage =
      // 최소 공격력 + 난수 * 공격력 편차(최소공 * 최대공 배율 - 최소공)
      this.damage + Math.round(Math.random() * (this.damage * this.maxDamageMag - this.damage));

    // 반격 대미지 계산
    if (counter) damage = Math.round(damage * 0.6);

    return damage > 0 ? damage : 0;
  }

  // 크리티컬 확률 계산
  isCri() {
    return Math.random() * 100 < this.criticalChance;
  }

  // 입은 피해 계산
  takeDamage(damage) {
    // 대미지가 0보다 낮을경우 0 = 최소 피해량
    const receivedDamage = Math.max(damage - this.defense, 0);
    this.hp -= receivedDamage;
    return receivedDamage;
  }

  // 공격
  attack(monster) {
    let damage = this.calculDamage(monster);
    const isCri = this.isCri();

    // 치명타 시 데미지 * 치명타 배율
    if (isCri) damage *= this.criticalMag;

    damage = monster.takeDamage(damage, isCri);

    return [damage, isCri];
  }

  // 방어/반격
  counter(monster) {
    const roll = Math.random() * 100 < this.defenseChance;
    // 확률 체크
    if (roll) {
      let counter = this.calculDamage(monster, true);
      const isCri = this.isCri();
      counter = monster.takeDamage(counter, isCri);
      return [roll, counter];
    }

    return [roll, 0];
  }

  // 연속 공격
  doubleAttack(monster) {
    const result = [];

    // 확률 체크
    if (Math.random() * 100 < this.doubleAttackChance) {
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
