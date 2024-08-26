# Rogue

## 로그라이크 텍스트 게임

### 게임 메인

![main1](https://github.com/user-attachments/assets/b6abc2b8-29f8-4d21-8485-d595c1f54f5a)

---

### 필수 기능

#### 1. 단순 행동 패턴 2가지 - 공격하기, 도망가기

![공격](https://github.com/user-attachments/assets/aa129561-79b3-45da-942d-1e380be40ea8)

![도망](https://github.com/user-attachments/assets/0fddec2a-334d-4b8f-bfe4-e53fc6f7130d)

#### 2. 플레이어 클래스에서 플레이어 스탯 관리
```js
export class Player {
  constructor() {
    // 체력
    this.hp = 50 + Math.round(Math.random() * 50);
    // 최소 공격력
    this.damage = 1 + Math.round(Math.random() * 5);
    // 최대 공격력 배율
    this.maxDamageMag = 1 + Math.round(Math.random() * 2);
    // 방어 확률
    this.counterChance = 55;
    // 도망 확률
    this.runChance = 5;
    // 연속 공격 확률
    this.doubleAttackChance = 33;
    // 방어 수치
    this.defense = 0;
    // 치명타 확률
    this.criticalChance = 10;
    // 치명타 배율
    this.criticalMag = 2;
    // 보상 테이블
    this.rewardTable = [
      'hp',
      'damage',
      'maxDamageMag',
      'counterChance',
      'runChance',
      'doubleAttackChance',
      'defense',
      'criticalChance',
    ];
    // 아이템
    this.item = null;
  }
}
```

#### 3. 간단한 전투 로직 구현 - 공격, 피격
![공격](https://github.com/user-attachments/assets/aa129561-79b3-45da-942d-1e380be40ea8)

#### 4. 스테이지 클리어 시 유저 체력 회복
![클리어 회복](https://github.com/user-attachments/assets/91bdbdab-f6b6-47c4-b150-be3e2439bb00)

#### 5. 스테이지 진행과 비례해서 몬스터의 체력과 공격력 증가 시키기
![1스테](https://github.com/user-attachments/assets/c3d315d8-ef09-4f35-baa3-b386418d8cd5)
![2스테](https://github.com/user-attachments/assets/f90ca3fe-0b5a-4df1-880a-d36db5413494)

### 도전 기능

#### 1. 확률 로직 적용
![행동](https://github.com/user-attachments/assets/d6f74a5f-52e3-492e-8169-17e627f33294)

공격 - 최소 ~ 최대 공격력 사이의 랜덤 데미지

방어 - 기본 55% 확률로 방어

연속 공격 - 기본 33% 확률로 공격 2번 사용

도망 - 기본 20% 확률로 도망

회복 - 1 ~ 5 * stage 사이의 양만큼  회복

#### 2. 복잡한 행동 패턴 구현
![연속공격](https://github.com/user-attachments/assets/8b308661-d6f4-403d-aa5a-4b4012d9dadc)

연속 공격 - 성공 시 2번 연속으로 공격 시전

![방어](https://github.com/user-attachments/assets/31f6698c-0c9a-4251-9eb3-aba4c203e9f1)

방어 - 적의 공격을 방어. 성공 시 피해를 무효로하고 60%의 데미지로 반격

![도망 및 회복](https://github.com/user-attachments/assets/6350e1cb-2ae3-4660-abab-a2acb201bae6)

도망 - 20% 확률로 다음 스테이지로 이동. 보상 및 아이템 획득x

회복 - 1 ~ stage * 5 만큼 회복

---
### 추가 기능

#### 1. 스테이지 클리어 시 랜덤 보상
![보상](https://github.com/user-attachments/assets/b9e0ef7e-122d-4b34-ae92-4b5d624b1f36)

- 체력 - 20 ~ 50

- 최소 공격력 - 1 ~ 10

- 최대 공격력 배율 - 0.1 ~ 1

- 방어 확률 - 3 ~ 10

- 도망 확률 - 5 ~ 10

- 연속 공격 확률 - 3 ~ 7

- 방어력 - 1 ~ 3

- 치명타 확률 - 3 ~ 7

중 랜덤하게 획득

5 * stage 확률로 아이템 획득
장착 및 교체 가능

#### 2. 크리티컬 기능
![크리티컬](https://github.com/user-attachments/assets/a4918519-62a6-4c72-a340-eeca9a72f9f8)

치명타 - 기본 10% 확률
치명타 배율 - 기본 2배

#### 3. 회복 기능
![회복기능](https://github.com/user-attachments/assets/bc60c20f-9b3a-400e-b663-2980cd6d2f67)

회복 - 1 ~ stage * 5 만큼 회복

#### 4. 아이템 기능

![드랍](https://github.com/user-attachments/assets/7a9a6c47-425c-4de3-9c5f-40c2586b60d7)

5 * stage 확률로 아이템 드랍

아이템 능력치

- 최소 공격력 - 1 ~ 10   녹슨 < 3 | 평범한 < 8 | 8 >= 전설적인

- 방어력 - 1 ~ 10   녹슨 < 3 | 평범한 < 8 | 8 >= 전설적인 

- 치명타 확률 - 1 ~ 40   녹슨 < 15 | 평범한 < 30 | 30 >= 전설적인 


종류 

도끼 | 검 | 창

![교체](https://github.com/user-attachments/assets/7e382e44-bcb0-4e1e-acdb-642f6d363cc7)

기존 장착한 아이템의 효과가 더 마음에 들 경우 획득한 아이템을 포기 가능

![상태창](https://github.com/user-attachments/assets/5a2a88c1-71ee-4491-a9f2-f126717c1993)

아이템의 이름과 적용되는 효과를 확인 가능

#### 5. 방어력

보유한 방어력 당 데미지 -1 

데미지 계산 메소드로 데미지 계산 후

받은 피해 메소드로 방어력만큼 감소 시킨 후 최종 데미지를 플레이어 혹은 몬스터에게 적용
