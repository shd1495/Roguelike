export class Player {
  constructor() {
    this.hp = 100;
    this.minDamege = 1;
    this.maxDamege = 5;
  }

  // 공격
  attack(monster) {
    const result = this.minDamege + Math.floor(Math.random() * (this.maxDamege - this.minDamege));

    monster.hp -= result;

    return result;
  }

  // 도망
  run() {
    // 25% 확률로 도망
    const run = Math.floor(Math.random() * 100);

    return run < 100 ? true : false;
  }
}
