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
    /**
     * 아이템 품질 결정
     * @param {number} amount
     * @param {Array} quality
     * @returns {Array}
     */
    function quality(amount, quality) {
      if (amount < quality[0]) return '녹슨';
      if (amount < quality[1]) return '평범한';
      return '전설적인';
    }

    if (stat.damage) name.push(quality(stat.damage, [3, 8]));
    if (stat.defense) name.push(quality(stat.defense, [3, 8]));
    if (stat.criticalChance) name.push(quality(stat.criticalChance, [15, 30]));

    const type = Math.floor(Math.random() * 3);
    const weapon = ['도끼', '검', '창'];
    name.push(weapon[type]);

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
   * 아이템 장착
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
   * 아이템 교체
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

/**
 * 아이템 능력치 한글 변환
 * @param {object} player
 * @returns {string}
 */
export function itemTranslate(object) {
  let key;

  if (object.item && object.item.stat) key = Object.keys(object.item.stat);
  else if (object.stat) key = Object.keys(object.stat);

  if (key == 'damage') return '최소 공격력';
  if (key == 'defense') return '방어력';
  if (key == 'criticalChance') return '치명타 확률';
}
