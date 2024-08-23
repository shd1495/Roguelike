# Rogue

## 로그라이크 텍스트 게임

### 게임 메인

![main1](https://github.com/user-attachments/assets/b6abc2b8-29f8-4d21-8485-d595c1f54f5a)

---

### 필수 기능

#### 1. 단순 행동 패턴 2가지 - 공격하기, 도망가기

![공격](https://github.com/user-attachments/assets/aa129561-79b3-45da-942d-1e380be40ea8)

![도망](https://github.com/user-attachments/assets/0fddec2a-334d-4b8f-bfe4-e53fc6f7130d)

---
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

---
#### 3. 간단한 전투 로직 구현 - 공격, 피격
![공격](https://github.com/user-attachments/assets/aa129561-79b3-45da-942d-1e380be40ea8)

---
#### 4. 스테이지 클리어 시 유저 체력 회복
![클리어 회복](https://github.com/user-attachments/assets/91bdbdab-f6b6-47c4-b150-be3e2439bb00)

---
#### 5. 스테이지 진행과 비례해서 몬스터의 체력과 공격력 증가 시키기
![1스테](https://github.com/user-attachments/assets/c3d315d8-ef09-4f35-baa3-b386418d8cd5)
![2스테](https://github.com/user-attachments/assets/f90ca3fe-0b5a-4df1-880a-d36db5413494)

---
### 도전 기능

#### 1. 확률 로직 적용
![확률](https://github.com/user-attachments/assets/c01711d1-9883-4240-b2d9-38e3cc0c01e2)

#### 2. 스테이지 클리어 시 랜덤 보상
![클리어 보상](https://github.com/user-attachments/assets/d4bcb366-127a-4df8-a5ab-f33eb92b1ce1)


#### 3. 크리티컬 기능
![크리티컬](https://github.com/user-attachments/assets/a4918519-62a6-4c72-a340-eeca9a72f9f8)

#### 4. 회복 기능
![회복기능](https://github.com/user-attachments/assets/bc60c20f-9b3a-400e-b663-2980cd6d2f67)

#### 5. 아이템 기능
![아이템 장착](https://github.com/user-attachments/assets/be530cb3-bdfa-46bb-b641-cafac2a4de3d)
![아이템 포기](https://github.com/user-attachments/assets/b5f8dc27-e839-49e2-8e18-bd1aabd644a4)
![아이템 로그](https://github.com/user-attachments/assets/9bcb883f-862b-4c88-acf6-a724865c593b)
