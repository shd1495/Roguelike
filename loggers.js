import chalk from 'chalk';

// 현재 상태 창
export function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} | ${player.item ? player.item.name : ''}  \n`) +
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

// 플레이어 로그
export function handlePlayerLog(turnCnt, result, logs) {
  logs.push(
    chalk.green(
      `[${turnCnt}] 몬스터에게 ${result[1] ? '치명타로' : ''} ${result[0]}의 피해를 입혔습니다!`,
    ),
  );
}

// 몬스터 로그
export function handleMonsterLog(turnCnt, result, logs) {
  logs.push(
    chalk.red(
      `[${turnCnt}] 플레이어가 ${result[1] ? '치명타로' : ''} ${result[0]}의 피해를 입었습니다!`,
    ),
  );
}
