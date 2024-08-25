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
    this.runChance = 20;
    // 연속 공격 확률
    this.doubleAttackChance = 33;
    // 방어 수치
    this.defense = 0;
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
    // 아이템
    this.item = null;
  }

  /**
   * 랜덤 보상
   * @param {object} table
   * @returns {number}
   * @author 랜덤 능력치 상승 최소치 ~ 상한치
   */
  randomReward(table) {
    const type = {
      hp: [20, 50],
      damage: [1, 10],
      maxDamageMag: [0.1, 1],
      counterChance: [3, 10],
      runChance: [1, 3],
      doubleAttackChance: [3, 7],
      defense: [1, 3],
      criticalChance: [3, 7],
    };

    const [min, max] = type[table];
    if (table == 'maxDamageMag') {
      return Math.round((min + Math.random() * (max - min)) * 100) / 100;
    }
    return Math.round(min + Math.random() * (max - min));
  }

  /**
   * 스테이지 클리어 보상
   * @param {number} stage
   * @returns {object}
   * @author 스테이지 클리어 시 기본 능력치 상승 + 랜덤 능력치 (보상 테이블 중 한 개) 상승
   */
  reward(stage) {
    // 기본 보상
    this.damage += Math.round(stage / 2);
    this.defense += Math.floor(stage / 2);

    // 랜덤 추가 보상
    const rewardTable = this.rewardTable[Math.floor(Math.random() * this.rewardTable.length)];
    const amount = this.randomReward(rewardTable);
    this[rewardTable] += amount;

    const rewardTypes = {
      hp: '체력',
      damage: '최소 공격력',
      maxDamageMag: '최대 대미지 배율',
      counterChance: '방어 확률',
      runChance: '도망 확률',
      doubleAttackChance: '연속 공격 확률',
      defense: '방어력',
      criticalChance: '치명타 확률',
    };

    return { type: rewardTable, amount: amount, kType: rewardTypes[rewardTable] };
  }

  /**
   * 데미지 계산
   * @returns {number}
   * @author damege = 최소 공격력 + 난수 * 공격력 편차(최소공 * 최대공 배율 - 최소공)
   */
  calculDamage() {
    let damage =
      this.damage + Math.round(Math.random() * (this.damage * this.maxDamageMag - this.damage));

    return damage > 0 ? damage : 0;
  }

  /**
   * 크리티컬 성공 여부
   * @returns {number}
   */
  isCri() {
    return Math.random() * 100 < this.criticalChance;
  }

  /**
   * 입은 피해 계산
   * @param {number} damage
   * @returns {number}
   * @author 대미지가 0보다 낮을경우 0 = 최소 피해량
   */
  takeDamage(damage) {
    const receivedDamage = Math.max(damage - this.defense, 0);
    this.hp -= receivedDamage;
    return receivedDamage;
  }

  /**
   * 입은 피해 계산
   * @param {number} amount
   * @returns {number}
   */
  heal(amount) {
    this.hp += amount;
    return amount;
  }

  /**
   * 공격
   * @param {object} monster
   * @returns {Array}
   */
  attack(monster) {
    let damage = this.calculDamage(monster);
    const isCri = this.isCri();

    // 치명타 시 데미지 * 치명타 배율
    if (isCri) damage *= this.criticalMag;

    damage = monster.takeDamage(damage, isCri);

    return [damage, isCri];
  }

  /**
   * 방어/반격
   * @param {object} monster
   * @returns {Array}
   * @author 60%의 데미지만 반격
   */
  counter(monster) {
    const roll = Math.random() * 100 < this.counterChance;
    if (roll) {
      let counter = this.calculDamage(monster, true);
      const isCri = this.isCri();
      counter = Math.round(monster.takeDamage(counter, isCri) * 0.6);
      return [true, counter];
    }

    return [false, 0];
  }

  /**
   * 연속 공격
   * @param {object} monster
   * @returns {Array}
   * @author 공격 메소드 2번 실행
   */
  doubleAttack(monster) {
    const result = [];

    if (Math.random() * 100 < this.doubleAttackChance) {
      result.push(true);
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
