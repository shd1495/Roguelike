export class Player {
  constructor() {
    // 체력
    this.hp = 100;
    // 최소 공격력
    this.minDamege = 1 + Math.round(Math.random() * 5);
    // 최대 공격력 배율
    this.maxDamegeMag = 1 + Math.round(Math.random() * 3);
    // 최대 공격력
    this.maxDamege = Math.round(this.minDamege * this.maxDamegeMag);
    // 방어 확률
    this.defenseChance = 55;
    // 도망 확률
    this.runChance = 5;
    // 연속 공격 확률
    this.doubleAttackChance = 20;
    // 방어 수치
    this.Defense = 1;
  }

  // 공격
  attack(monster) {
    // 최소 공격력 + (최대공-최소공 차이) * 난수 == 공격력 편차
    const result = this.minDamege + Math.round(Math.random() * (this.maxDamege - this.minDamege));

    monster.hp -= result;

    return result;
  }

  // 방어
  counter(monster) {
    const roll = Math.random() * 100;
    const result = [];

    // 55% 확률
    if (roll < this.defenseChance) {
      let counter = this.minDamege + Math.round(Math.random() * (this.maxDamege - this.minDamege));

      counter = Math.round(counter * 0.6);
      monster.hp -= counter;

      result.push(true);
      result.push(counter);
    }

    return result;
  }

  // 도망
  run() {
    // 25% 확률로 도망
    const run = Math.floor(Math.random() * 100);

    return run < 100 ? true : false;
  }
}
