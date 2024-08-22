import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { Player } from './player.js';
import { Monster } from './monster.js';

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

const battle = async (stage, player, monster, result, increase) => {
  let logs = [];
  let turnCnt = 1;
  let aliveMonster = 1;
  let alivePlayer = true;

  // 스테이지 클리어 보상 로그
  if (stage > 1) {
    logs.push(chalk.green(`${increase}이/가 ${result} 상승했습니다.`));
    player.hp += 50;
    logs.push(chalk.green(`체력이 50 회복되었습니다.`));
  }

  while (player.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(
      chalk.green(
        `\n1. 공격한다 2. 연속 공격 (${player.doubleAttackChance}% 확률) 3. 방어한다(${player.defenseChance}% 확률) 4. 도망간다.(${player.runChance}% 확률)`,
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
        // 치명타 여부
        if (paResult[1]) {
          logs.push(
            chalk.green(`[${turnCnt}] 몬스터에게 치명타로 ${paResult[0]}의 피해를 입혔습니다!`),
          );
        } else {
          logs.push(chalk.green(`[${turnCnt}] 몬스터에게 ${paResult[0]}의 피해를 입혔습니다.`));
        }

        // 몬스터 치명타 여부
        if (maResult[1]) {
          logs.push(
            chalk.red(
              `[${turnCnt}] 플레이어가 몬스터에게 치명타로 ${maResult[0]}의 피해를 입었습니다.`,
            ),
          );
        } else {
          logs.push(
            chalk.red(`[${turnCnt}] 플레이어가 몬스터에게 ${maResult[0]}의 피해를 입었습니다.`),
          );
        }
        if (monster.hp <= 0) logs.push(`[${turnCnt}] 몬스터를 처치 했습니다!`);

        // 턴 카운트
        turnCnt++;
        break;

      case '2':
        // 연속 공격
        const dafResult = player.doubleAttack(monster);
        if (dafResult[0]) {
          logs.push(chalk.gray(`[${turnCnt}] 연속 공격에 성공했습니다!`));

          // 치명타 여부
          if (dafResult[1][0]) {
            logs.push(
              chalk.green(`[${turnCnt}] 몬스터에게 치명타로 ${dafResult[1]}의 피해를 입혔습니다!`),
            );
          } else {
            logs.push(chalk.green(`[${turnCnt}] 몬스터에게 ${dafResult[1]}의 피해를 입혔습니다.`));
          }

          // 치명타 여부
          if (dafResult[2][0]) {
            logs.push(
              chalk.green(`[${turnCnt}] 몬스터에게 치명타로 ${dafResult[2]}의 피해를 입혔습니다!`),
            );
          } else {
            logs.push(chalk.green(`[${turnCnt}] 몬스터에게 ${dafResult[2]}의 피해를 입혔습니다.`));
          }
          // 몬스터 치명타 여부
          if (maResult[1]) {
            logs.push(
              chalk.red(
                `[${turnCnt}] 플레이어가 몬스터에게 치명타로 ${maResult[0]}의 피해를 입었습니다.`,
              ),
            );
          } else {
            logs.push(
              chalk.red(`[${turnCnt}] 플레이어가 몬스터에게 ${maResult[0]}의 피해를 입었습니다.`),
            );
          }
        } else {
          logs.push(chalk.yellow(`[${turnCnt}] 연속 공격에 실패했습니다!`));

          // 몬스터 치명타 여부
          if (maResult[1]) {
            logs.push(
              chalk.red(
                `[${turnCnt}] 플레이어가 몬스터에게 치명타로 ${maResult[0]}의 피해를 입었습니다.`,
              ),
            );
          } else {
            logs.push(
              chalk.red(`[${turnCnt}] 플레이어가 몬스터에게 ${maResult[0]}의 피해를 입었습니다.`),
            );
          }
        }
        // 턴 카운트
        turnCnt++;
        break;

      case '3':
        // 방어
        const defResult = player.counter(monster);
        if (defResult[0]) {
          player.hp += maResult;
          logs.push(chalk.gray(`[${turnCnt}] 방어에 성공했습니다!`));
          // 치명타 여부
          if (defResult[1]) {
            logs.push(
              chalk.green(`[${turnCnt}] 몬스터에게 치명타로 ${defResult[3]}의 피해를 입혔습니다!`),
            );
          } else {
            logs.push(chalk.green(`[${turnCnt}] 몬스터에게 ${defResult[3]}의 피해를 입혔습니다.`));
          }
        } else {
          logs.push(chalk.yellow(`[${turnCnt}] 방어에 실패했습니다!`));

          // 몬스터 치명타 여부
          if (maResult[1]) {
            logs.push(
              chalk.red(
                `[${turnCnt}] 플레이어가 몬스터에게 치명타로 ${maResult[0]}의 피해를 입었습니다.`,
              ),
            );
          } else {
            logs.push(
              chalk.red(`[${turnCnt}] 플레이어가 몬스터에게 ${maResult[0]}의 피해를 입었습니다.`),
            );
          }
        }
        // 턴 카운트
        turnCnt++;
        break;

      case '4':
        // 도망
        if (player.run()) {
          player.hp += maResult;
          logs.push(chalk.green(`[${turnCnt}] 도망에 성공했습니다!`));
          monster.hp = 0;
          break;
        } else {
          logs.push(chalk.yellow(`[${turnCnt}] 도망에 실패했습니다!`));

          // 몬스터 치명타 여부
          if (maResult[1]) {
            logs.push(
              chalk.red(
                `[${turnCnt}] 플레이어가 몬스터에게 치명타로 ${maResult[0]}의 피해를 입었습니다.`,
              ),
            );
          } else {
            logs.push(
              chalk.red(`[${turnCnt}] 플레이어가 몬스터에게 ${maResult[0]}의 피해를 입었습니다.`),
            );
          }
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

      // 스테이지 클리어
      if (monster.hp <= 0 && player.hp > 0) {
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
    // 게임 종료
    if (clear === false) {
      break;
    }
    // 몬스터 hp가 0 이하가 되면 스테이지 클리어
    if (clear === 0) {
      stage++;
      // 기본 보상
      player.damege += 1;
      player.defense += 1;

      // 클리어 보상
      // 6가지 중 한가지 랜덤으로 선정
      let rn = Math.floor(Math.random() * (Object.keys(player).length - 1));

      // player 인스턴스에 키 배열의 인덱스 키 이름 구하기
      const stat = Object.keys(player)[rn];

      // 클리어 보상 랜덤 로직 시행
      switch (rn) {
        // 체력
        case 0:
          // 20 ~ 50
          increase = '체력';
          result = 20 + Math.round(Math.random() * 31);
          player[stat] += result;
          break;
        // 최소 공격력
        case 1:
          // 5 ~ 20
          increase = '최소 공격력';
          result = 5 + Math.round(Math.random() * 16);
          player[stat] += result;
          break;
        // 최대 공격력 배율
        case 2:
          // 0.1 ~ 1
          increase = '최대 공격력 배율';
          result = Math.ceil(Math.random() * 100) / 100;
          player[stat] += result;
          break;
        // 방어 확률
        case 3:
          // 3 ~ 10
          increase = '방어 확률';
          result = 3 + Math.round(Math.random() * 7);
          player[stat] += result;
          break;
        // 도망 확률
        case 4:
          // 1 ~ 3
          increase = '도망 확률';
          result = 1 + Math.round(Math.random() * 2);
          player[stat] += result;
          break;
        // 연속 공격 확률
        case 5:
          // 3 ~ 7
          increase = '연속 공격 확률';
          result = 3 + Math.round(Math.random() * 4);
          player[stat] += result;
          break;
        // 방어 수치
        case 6:
          // 1 ~ 3
          increase = '방어 수치';
          result = 1 + Math.round(Math.random() * 2);
          player[stat] += result;
          break;
        // 치명타 확률
        case 7:
          // 3 ~ 7
          increase = '치명타 확률';
          result = 3 + Math.round(Math.random() * 4);
          player[stat] += result;
          break;
      }
    }
  }
}
