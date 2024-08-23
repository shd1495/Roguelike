export class Item {
  constructor(name, stat) {
    this.name = name;
    this.stat = stat;
  }
  /**
   * 아이템 이름 생성
   * @param {object} stat
   * @returns {Array}
   */
  static dropItemName(stat) {
    let name = [];
    const type = Math.floor(Math.random() * 3);

    if (stat.damage) {
      if (stat.damage < 3) name.push('녹슨');
      else if (stat.damage < 8) name.push('평범한');
      else name.push('전설적인');
    }

    if (stat.defense) {
      if (stat.defense < 3) name.push('녹슨');
      else if (stat.defense < 8) name.push('평범한');
      else name.push('전설적인');
    }
    if (stat.criticalChance) {
      if (stat.criticalChance < 15) name.push('녹슨');
      else if (stat.criticalChance < 30) name.push('평범한');
      else name.push('전설적인');
    }

    if (type === 0) name.push('도끼');
    if (type === 1) name.push('검');
    if (type === 2) name.push('창');
    return name;
  }

  // 인스턴스화하기 전에 사용하는 정적 메소드
  /**
   * 아이템 드랍
   * @returns {object}
   * @author 아이템 드랍 시 데미지, 방어, 크리티컬 배율 중 하나의 값을 가짐
   */
  static dropItem() {
    const stats = Math.floor(Math.random() * 3);
    const itemStats = {};

    if (stats === 0) itemStats.damage = Math.ceil(Math.random() * 10);
    if (stats === 1) itemStats.defense = Math.ceil(Math.random() * 10);
    if (stats === 2) itemStats.criticalChance = Math.ceil(Math.random() * 40);

    const name = Item.dropItemName(itemStats).join(' ');

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
