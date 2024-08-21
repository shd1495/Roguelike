export class Monster {
  constructor(stage) {
    this.hp = stage * 25;
    this.damege = stage * 5;
  }

  attack(player) {
    player.hp -= this.damege;
  }
}
