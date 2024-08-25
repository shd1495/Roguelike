import chalk from 'chalk';
import figlet from 'figlet';
import readlineSync from 'readline-sync';
/**
 * 아이템 능력치 이름
 * @param {object} player 
 * @returns {string}
 */
function whatIsKey(player) {
  if (Object.keys(player.item.stat) == 'damage') return '최소 공격력';
  if (Object.keys(player.item.stat) == 'defense') return '방어력';
  if (Object.keys(player.item.stat) == 'criticalChance') return '치명타 확률';
}

/**
 * 현재 상태 창
 * @param {number} stage
 * @param {object} player
 * @param {object} monster
 */
export function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(
      `| Stage: ${stage} | ${player.item ? player.item.name + ` =` : ''}`,
      `${player.item ? whatIsKey(player) + ` +` : ''}`,
      `${player.item ? Object.values(player.item.stat) : ''} \n`,
    ) +
      chalk.blueBright(
        `| player  체력 = ${player.hp} 공격력 = ${player.damage} ~ ${Math.round(player.damage * player.maxDamageMag)}`,
        ` 방어력 = ${player.defense} 치명타 확률 = ${player.criticalChance}`,
        ` 최대 공격력 배율 = ${player.maxDamageMag} |`,
      ) +
      chalk.redBright(
        `\n| monster 체력 = ${monster.hp} 공격력 = ${monster.damage} ~ ${Math.round(monster.damage * monster.maxDamageMag)}`,
        ` 방어력 = ${monster.defense} 치명타 확률 = ${monster.criticalChance}`,
        ` 최대 공격력 배율 = ${monster.maxDamageMag} |`,
      ),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

/**
 * 플레이어 로그
 * @param {number} turnCnt
 * @param {Array} result
 * @param {Array} logs
 */
export function handlePlayerLog(turnCnt, result, logs) {
  logs.push(
    chalk.green(
      `[${turnCnt}] 몬스터에게 ${result[1] ? '치명타로' : ''} ${result[0]}의 피해를 입혔습니다!`,
    ),
  );
}

/**
 * 몬스터 로그
 * @param {number} turnCnt
 * @param {Array} result
 * @param {Array} logs
 */
export function handleMonsterLog(turnCnt, result, logs) {
  logs.push(
    chalk.red(
      `[${turnCnt}] 플레이어가 ${result[1] ? '치명타로' : ''} ${result[0]}의 피해를 입었습니다!`,
    ),
  );
}

/**
 * 게임 클리어 문구
 * @returns {number}
 */
export function displayClear() {
  console.clear();
  console.log(chalk.magentaBright(`========================================================\n`));
  console.log(
    chalk.cyan(
      figlet.textSync('Game Clear\n', {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default',
      }),
    ),
  );
  console.log(chalk.magentaBright(`========================================================\n`));

  readlineSync.question(chalk.blue('[ 게임 클리어를 축하드립니다. ]'));
  return 0;
}

/**
 * 드랍된 아이템 로그
 * @param {string} choice
 * @param {object} player
 * @param {object} item
 * @returns {string}
 */
export function dropItemLog(choice, player, item) {
  switch (choice) {
    case '1':
      console.log(chalk.green(`${item.name}을/를 장착했습니다!`));
      if (player.item) item.unEquipItem(player);

      item.equipItem(player, item);
      break;
    case '2':
      console.log(chalk.red(`${item.name}을/를 포기했습니다.`));
      break;
    default:
      console.log(chalk.red('올바른 선택을 입력해주세요'));
      break;
  }
  return choice;
}
