export class Player {
  constructor() {
    // 체력
    this.hp = 50 + Math.round(Math.random() * 50);
    // 최소 공격력
    this.damege = 1 + Math.round(Math.random() * 5);
    // 최대 공격력 배율
    this.maxDamegeMag = 1.5 + Math.round(Math.random() * 2);
    // 방어 확률
    this.defenseChance = 55;
    // 도망 확률
    this.runChance = 5;
    // 연속 공격 확률
    this.doubleAttackChance = 33;
    // 방어 수치
    this.Defense = 1;
  }

  // 공격
  attack(monster) {
    // 최소 공격력 + 난수 * 공격력 편차(최소공 * 최대공 배율 - 최소공)
    const result =
      this.damege + Math.round(Math.random() * (this.damege * this.maxDamegeMag - this.damege));

    monster.hp -= result;

    return result;
  }

  // 방어
  counter(monster) {
    const roll = Math.random() * 100;
    const result = [];

    // 확률 체크
    if (roll < this.defenseChance) {
      let counter =
        this.damege + Math.round(Math.random() * (this.damege * this.maxDamegeMag - this.damege));

      counter = Math.round(counter * 0.6);
      monster.hp -= counter;

      result.push(true);
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
    // 25% 확률로 도망
    const run = Math.floor(Math.random() * 100);

    return run < 100 ? true : false;
  }
}
