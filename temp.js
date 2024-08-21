export class Player {
  constructor() {
    this.hp = 100;
    this.damege = 1;
  }

  // 공격
  attack(monster) {
    const damegeDiviation = Math.floor(Math.random() * 4);

    const result = this.damege + damegeDiviation;
    monster.hp -= result;

    return result;
  }

  // 도망
  run() {
    // 5% 확률로 도망
    const run = Math.floor(Math.random() * 100);

    return run < 5 ? true : false;
  }
}

export class Monster {
  constructor(stage) {
    this.hp = stage * 25;
    this.damege = stage * 5;
  }

  attack(player) {
    player.hp -= this.damege;
  }
}

const player = new Player();

const monster = new Monster();

console.log(player.attack(monster));
