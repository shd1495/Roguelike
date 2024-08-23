export class Item {
  constructor(name, stat) {
    this.name = name;
    this.stat = stat;
  }

  // 인스턴스화하기 전에 사용하는 정적 메소드
  /**
   * 아이템 드랍
   * @returns {object}
   * @author 아이템 드랍 시 데미지, 방어, 크리티컬 배율 중 하나의 값을 가짐
   */
  static dropItem() {
    const name = `전설적인 무기`;
    const stats = Math.floor(Math.random() * 3);
    const itemStats = {};

    if (stats === 0) itemStats.damage = Math.ceil(Math.random() * 10);
    if (stats === 1) itemStats.defense = Math.ceil(Math.random() * 10);
    if (stats === 2) itemStats.criticalChance = Math.ceil(Math.random() * 40);

    const item = new Item(name, itemStats);
    return item;
  }

  /**
   * 아이템 장착 메소드
   * @param {object} player
   * @param {object} item
   */
  equipItem(player, item) {
    player.item = item;
    if (item.stat.damage) player.damage += item.stat.damage;

    if (item.stat.defense) player.defense += item.stat.defense;

    if (item.stat.criticalChance) player.criticalChance += item.stat.criticalChance;
  }

  /**
   * 아이템 교체 메소드
   * @param {object} player
   */
  unEquipItem(player) {
    const item = player.item;
    if (item.stat.damage) player.damage -= player.item.stat.damage;

    if (item.stat.defense) player.defense -= player.item.stat.defense;

    if (item.stat.criticalChance) player.criticalChance -= player.item.stat.criticalChance;

    player.item = null;
  }
}
