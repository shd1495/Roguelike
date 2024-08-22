export class Item {
  constructor(name, stat) {
    this.name = name;
    this.stat = stat;
  }

  equipItem(player, item) {
    player.item = item;
    if (item.stat.damage) player.damage += item.stat.damage;
    if (item.stat.defense) player.defense += item.stat.defense;
    if (item.stat.criticalChance) player.criticalChance += item.stat.criticalChance;
  }
}
