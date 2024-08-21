import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { Player } from './player.js';
import { Monster } from './monster.js';

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
      chalk.blueBright(
        `| player hp = ${player.hp} damege = ${player.minDamege} ~ ${player.maxDamege}`,
      ) +
      chalk.redBright(
        `| monster hp = ${monster.hp} damege = ${monster.damege} ~ ${monster.damege + 5 + stage} |`,
      ),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
  let logs = [];
  let turnCnt = 1;
  let aliveMonster = 1;
  let alivePlayer = true;

  // 스테이지 클리어 보상 로그
  if (stage > 1) {
    player.hp += 50;
    logs.push(chalk.green(`체력이 50 회복되었습니다.`));
  }

  while (player.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(chalk.green(`\n1. 공격한다 2. 도망간다.(5% 확률)`));
    // 몬스터의 공격
    const maResult = monster.attack(player, stage);

    // 플레이어의 선택에 따라 다음 행동 처리
    const choice = readlineSync.question('당신의 선택은? ');

    switch (choice) {
      // 1번 입력시
      case '1':
        // 공격 메소드
        const paResult = player.attack(monster);
        logs.push(chalk.green(`[${turnCnt}] 몬스터에게 ${paResult}의 피해를 입혔습니다.`));
        logs.push(chalk.red(`[${turnCnt}] 플레이어가 몬스터에게 ${maResult}의 피해를 입었습니다.`));
        if (monster.hp <= 0) logs.push(`[${turnCnt}] 몬스터를 처치 했습니다!`);

        // 턴 카운트
        turnCnt++;
        break;

      case '2':
        if (player.run()) {
          logs.push(chalk.green(`[${turnCnt}] 도망에 성공했습니다!`));
          monster.hp = 0;
          break;
        } else {
          logs.push(chalk.yellow(`[${turnCnt}] 도망에 실패했습니다!`));
          logs.push(
            chalk.red(`[${turnCnt}] 플레이어가 몬스터에게 ${maResult}의 피해를 입었습니다.`),
          );
          // 턴 카운트
          turnCnt++;
          break;
        }

      default:
        logs.push(chalk.red('올바른 선택을 입력해주세요'));
        break;
    }
    // 스테이지 클리어 조건 및 게임 클리어 조건
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

      if (monster.hp <= 0) {
        readlineSync.question('스테이지 클리어! 아무키나 입력해주세요');
        // 몬스터 처치
        aliveMonster = 0;
        return aliveMonster;
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

  while (stage <= 10) {
    const monster = new Monster(stage);
    const clear = await battle(stage, player, monster);

    // 스테이지 클리어 및 게임 종료 조건
    // 게임 종료
    if (clear === false) {
      break;
    }
    // 몬스터 hp가 0 이하가 되면 스테이지 클리어
    if (clear === 0) {
      stage++;
    }
  }
}
