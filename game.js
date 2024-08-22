import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { Player } from './player.js';
import { Monster } from './monster.js';
import { Item } from './item.js';

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
      chalk.blueBright(
        `| player hp = ${player.hp} damege = ${player.damage} ~ ${Math.round(player.damage * player.maxDamageMag)} defense = ${player.defense}`,
      ) +
      chalk.redBright(
        `| monster hp = ${monster.hp} damege = ${monster.damage} ~ ${Math.round(monster.damage * monster.maxDamageMag)} defense = ${monster.defense} |`,
      ),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

// 플레이어 로그
function handlePlayerLog(turnCnt, result, logs) {
  logs.push(
    chalk.green(
      `[${turnCnt}] 몬스터에게 ${result[1] ? '치명타로' : ''} ${result[0]}의 피해를 입혔습니다!`,
    ),
  );
}

// 몬스터 로그
function handleMonsterLog(turnCnt, result, logs) {
  logs.push(
    chalk.red(
      `[${turnCnt}] 플레이어가 ${result[1] ? '치명타로' : ''} ${result[0]}의 피해를 입었습니다!`,
    ),
  );
}

const battle = async (stage, player, monster) => {
  let logs = [];
  let turnCnt = 1;
  let aliveMonster = 1;
  let alivePlayer = true;

  // 스테이지 클리어 체력 회복
  if (stage > 1) {
    player.heal(50);
    logs.push(chalk.green(`체력이 50 회복되었습니다.`));
  }

  while (player.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(
      chalk.green(
        `\n1. 공격한다 2. 연속 공격 (${player.doubleAttackChance}% 확률)`,
        `3. 방어한다(${player.counterChance}% 확률) 4. 도망간다.(${player.runChance}% 확률)`,
        ` 5. 회복하기(1 ~ ${stage * 5})`,
      ),
    );
    // 몬스터의 공격
    const maResult = monster.attack(player, stage);

    // 플레이어의 선택에 따라 다음 행동 처리
    const choice = readlineSync.question('당신의 선택은? ');

    switch (choice) {
      // 1번 입력시
      case '1':
        // 공격
        const paResult = player.attack(monster);
        handlePlayerLog(turnCnt, paResult, logs);
        // 몬스터 공격
        handleMonsterLog(turnCnt, maResult, logs);
        break;

      case '2':
        // 연속 공격
        const dafResult = player.doubleAttack(monster);
        if (dafResult[0]) {
          logs.push(chalk.gray(`[${turnCnt}] 연속 공격에 성공했습니다!`));
          // 공격 2회
          handlePlayerLog(turnCnt, dafResult[1], logs);
          handlePlayerLog(turnCnt, dafResult[2], logs);
          // 몬스터 공격
          handleMonsterLog(turnCnt, maResult, logs);
        } else {
          logs.push(chalk.yellow(`[${turnCnt}] 연속 공격에 실패했습니다!`));

          // 몬스터 공격
          handleMonsterLog(turnCnt, maResult, logs);
        }
        break;

      case '3':
        // 방어
        const defResult = player.counter(monster);
        console.log(chalk.gray(`[${turnCnt}] ${defResult}`));
        if (defResult[0]) {
          player.heal(maResult[0]);

          logs.push(chalk.gray(`[${turnCnt}] 방어에 성공했습니다!`));
          logs.push(chalk.green(`[${turnCnt}] 몬스터에게 ${defResult[1]}의 피해를 입혔습니다!`));
        } else {
          logs.push(chalk.yellow(`[${turnCnt}] 방어에 실패했습니다!`));

          // 몬스터 공격
          handleMonsterLog(turnCnt, maResult, logs);
        }
        break;

      case '4':
        // 도망
        if (player.run()) {
          player.heal(maResult[0]);
          logs.push(chalk.green(`[${turnCnt}] 도망에 성공했습니다!`));
          monster.hp = 0;
          break;
        } else {
          logs.push(chalk.yellow(`[${turnCnt}] 도망에 실패했습니다!`));

          // 몬스터 공격
          handleMonsterLog(turnCnt, maResult, logs);
          break;
        }
      case '5':
        // 회복
        const healAmount = player.heal(1 + Math.floor(Math.random() * (5 * stage)));
        logs.push(chalk.yellow(`[${turnCnt}] ${healAmount}만큼 회복에 성공했습니다!`));
        // 몬스터 공격
        handleMonsterLog(turnCnt, maResult, logs);
        break;
      default:
        logs.push(chalk.red('올바른 선택을 입력해주세요'));
        break;
    }

    // 스테이지 클리어 조건 및 게임 종료 조건
    if (monster.hp <= 0 || player.hp <= 0) {
      console.clear();

      displayStatus(stage, player, monster);

      logs.forEach((log) => console.log(log));

      //게임 클리어
      if (stage == 10) {
        console.clear();

        displayStatus(stage, player, monster);

        readlineSync.question('게임 클리어를 축하드립니다.');
        return 0;
      }
      // 턴 카운트
      turnCnt++;

      // 스테이지 클리어
      if (monster.hp <= 0 && player.hp > 0) {
        // 20% 확률로 아이템 드랍
        if (Math.random() * 100 < 100) {
          const name = `리치왕의 분노`;
          const stats = Math.floor(Math.random() * 3);
          const itemStats = {};

          if (stats === 0) itemStats.damage = Math.ceil(Math.random() * 5);
          if (stats === 1) itemStats.defense = Math.ceil(Math.random() * 5);
          if (stats === 2) itemStats.criticalChance = Math.ceil(Math.random() * 20);

          const item = new Item(name, itemStats);
          console.log(chalk.yellow(`몬스터가 ${item.name}을/를 드랍했습니다!`));
          item.equipItem(player, item);
        }

        const reward = await player.reward(stage);
        console.log(
          chalk.green(`클리어 보상으로 ${reward.type}이/가 ${reward.amount} 상승했습니다.`),
        );
        readlineSync.question('스테이지 클리어! 아무키나 입력해주세요');
        // 몬스터 처치
        aliveMonster = 0;
        return aliveMonster;
        // 게임 오버
      } else {
        readlineSync.question('체력을 모두 소진했습니다. GAME OVER');
        // 플레이어 사망
        alivePlayer = false;
        return alivePlayer;
      }
    }
  }
};

export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 1;
  let result = 0;
  let increase = '';

  while (stage <= 10) {
    const monster = new Monster(stage);
    const clear = await battle(stage, player, monster, result, increase);

    // 스테이지 클리어 및 게임 종료 조건
    // 게임 종료 (플레이어 사망)
    if (clear === false) {
      break;
    }
    // 몬스터 hp가 0 이하가 되면 스테이지 클리어
    if (clear === 0) {
      stage++;
    }
  }
}
