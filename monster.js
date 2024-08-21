export class Monster {
  constructor(stage) {
    this.hp = stage * 10 + Math.floor(2 * Math.random() * (10 * stage));
    this.damege = stage + Math.floor(Math.random() * (5 * stage));
  }

  attack(player, stage) {
    const damegeDiviation = Math.floor(Math.random() * (5 + stage));

    const result = this.damege + damegeDiviation;
    player.hp -= result;

    return result;
  }
}
