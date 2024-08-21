export class Player {
  constructor() {
    this.hp = 100;
    this.damege = 5;
  }

  attack(monster) {
    monster.hp -= this.damege;
  }
}
