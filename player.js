export class Player {
  constructor() {
    // 체력
    this.hp = 50 + Math.round(Math.random() * 50);
    // 최소 공격력
    this.damage = 1 + Math.round(Math.random() * 5);
    // 최대 공격력 배율
    this.maxDamageMag = 1 + Math.round(Math.random() * 2);
    // 방어 확률
    this.counterChance = 55;
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
    // 보상 테이블
    this.rewardTable = [
      'hp',
      'damage',
      'maxDamageMag',
      'counterChance',
      'runChance',
      'doubleAttackChance',
      'defense',
      'criticalChance',
    ];
  }

  // 스테이지 클리어 보상
  reward(stage) {
    // 기본 보상
    this.damage += Math.round(stage / 2);
    this.defense += Math.round(stage / 2);

    // 랜덤 추가 보상
    const rewardTable = this.rewardTable[Math.floor(Math.random() * this.rewardTable.length)];

    switch (rewardTable) {
      // 체력
      case 'hp':
        // 20 ~ 50
        const hp = 20 + Math.round(Math.random() * 31);
        this.hp += hp;
        return { type: '체력', amount: hp };
      // 최소 공격력
      case 'damage':
        // 5 ~ 20
        const damage = 5 + Math.round(Math.random() * 16);
        this.damage += damage;
        return { type: '최소 공격력', amount: damage };
      // 최대 공격력 배율
      case 'maxDamageMag':
        // 0.1 ~ 1
        const maxDamageMag = Math.ceil(Math.random() * 100) / 100;
        this.maxDamageMag += maxDamageMag;
        return { type: '최대 공격력 배율', amount: maxDamageMag };
      // 방어 확률
      case 'counterChance':
        // 3 ~ 10
        const counterChance = 3 + Math.round(Math.random() * 7);
        this.counterChance += counterChance;
        return { type: '방어 확률', amount: counterChance };
      // 도망 확률
      case 'runChance':
        // 1 ~ 3
        const runChance = 1 + Math.round(Math.random() * 2);
        this.runChance += runChance;
        return { type: '도망 확률', amount: runChance };
      // 연속 공격 확률
      case 'doubleAttackChance':
        // 3 ~ 7
        const doubleAttackChance = 3 + Math.round(Math.random() * 4);
        this.doubleAttackChance += doubleAttackChance;
        return { type: '연속 공격 확률', amount: doubleAttackChance };
      // 방어 수치
      case 'defense':
        // 1 ~ 3
        const defense = 1 + Math.round(Math.random() * 2);
        this.defense += defense;
        return { type: '방어 수치', amount: defense };
      // 치명타 확률
      case 'criticalChance':
        // 3 ~ 7
        const criticalChance = 3 + Math.round(Math.random() * 4);
        this.criticalChance += criticalChance;
        return { type: '치명타 확률', amount: criticalChance };
    }
  }

  // 공격력 계산
  calculDamage() {
    let damage =
      // 최소 공격력 + 난수 * 공격력 편차(최소공 * 최대공 배율 - 최소공)
      this.damage + Math.round(Math.random() * (this.damage * this.maxDamageMag - this.damage));

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

  heal(amount) {
    this.hp += amount;
    return amount;
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
    const roll = Math.random() * 100 < this.counterChance;
    // 확률 체크
    if (roll) {
      let counter = this.calculDamage(monster, true);
      const isCri = this.isCri();
      // 60% 데미지만
      counter = Math.round(monster.takeDamage(counter, isCri) * 0.6);
      return [true, counter];
    }

    return [false, 0];
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
