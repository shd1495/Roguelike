import chalk from 'chalk';
import figlet from 'figlet';
import readlineSync from 'readline-sync';
import { Player } from './player.js';
import { Monster } from './monster.js';
import { Item } from './item.js';
import { displayStatus } from './loggers.js';
import { handlePlayerLog } from './loggers.js';
import { handleMonsterLog } from './loggers.js';
import { start } from './server.js';

const battle = async (stage, player, monster) => {
  let logs = [];
  let turnCnt = 1;
  let aliveMonster = 1;
  let alivePlayer = true;
  let isRun = false;

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
        const daResult = player.doubleAttack(monster);
        if (daResult[0]) {
          logs.push(chalk.gray(`[${turnCnt}] 연속 공격에 성공했습니다!`));
          // 공격 2회
          handlePlayerLog(turnCnt, daResult[1], logs);
          handlePlayerLog(turnCnt, daResult[2], logs);
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
          isRun = true;
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
        logs.push(chalk.gray(`[${turnCnt}] ${healAmount}만큼 회복에 성공했습니다!`));
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
        console.log(
          chalk.cyan(
            figlet.textSync('Game Clear\n', {
              font: 'Standard',
              horizontalLayout: 'default',
              verticalLayout: 'default',
            }),
          ),
        );

        readlineSync.question(chalk.blue('[ 게임 클리어를 축하드립니다. ]'));
        return 0;
      }

      // 스테이지 클리어
      if (monster.hp <= 0 && player.hp > 0) {
        if (!isRun) console.log(chalk.yellow(`[${turnCnt}] 몬스터를 처치했습니다!`));

        // 아이템 드랍
        // 5 ~ 50% 확률로 아이템 드랍
        if (Math.random() * 100 < 5 * stage) {
          const item = Item.dropItem();
          console.log(chalk.yellow(`몬스터가 ${item.name}을/를 드랍했습니다!`));
          console.log(
            chalk.yellow(
              `${item.name}의 효과 ${Object.keys(item.stat)} + ${Object.values(item.stat)}`,
            ),
          );
          let choice;
          do {
            choice = readlineSync.question(
              ` ${player.item ? '1. 교체한다.' + '2. 교체하지 않는다.' : '1. 장착한다.' + '2. 장착하지 않는다.'} `,
            );

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
          } while (choice !== '1' && choice !== '2');
        }

        // 클리어 보상
        const reward = await player.reward(stage);
        console.log(
          chalk.green(
            `클리어 보상으로 ${reward.type}이/가 ${reward.amount} 상승했습니다.`,
            `현재 ${reward.type} = ${player[reward.type]}`,
          ),
        );
        readlineSync.question('[ 스테이지 클리어! 아무키나 입력해주세요 ]');
        // 몬스터 처치
        aliveMonster = 0;
        return aliveMonster;
        // 게임 오버
      } else {
        console.log(chalk.gray('[ 체력을 모두 소진했습니다. GAME OVER ]'));
        readlineSync.question('[ 로비로 이동합니다. ]');
        // 플레이어 사망
        alivePlayer = false;
        return alivePlayer;
      }
    }
    // 턴 카운트
    turnCnt++;
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
    // 로비로 다시 이동
    if (clear === false) {
      start();
      break;
    }
    // 몬스터 hp가 0 이하가 되면 스테이지 클리어
    if (clear === 0) {
      stage++;
    }
  }
}
