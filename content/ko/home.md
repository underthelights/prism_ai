---
headline: "PRISM의 시작점 — 내 로봇을 골라서 모든 준비를 시작하는 곳"
summary: "PRISM을 처음 켜면 이 화면이 나옵니다. 내가 쓸 로봇을 목록에서 골라 [btn:Launch PRISM]을 누르면, 이후 녹화·학습·실행 등 모든 화면이 그 로봇에 맞춰 동작합니다. 로봇을 고르지 않으면 다음 단계로 넘어갈 수 없어요."
goal: "내 로봇이 목록에 있는지 확인하고, 정확히 골라서 다음 화면(Devices)으로 넘어갑니다."
done: "화면 상단에 내 로봇 이름이 표시되고, 자동으로 Devices 화면으로 이동합니다."
caution: "로봇을 잘못 고르면 이후 카메라 배치, 관절 정보, 3D 모델이 전부 엉뚱하게 나옵니다. 나중에 녹화한 데이터도 못 쓰게 될 수 있으니, 반드시 실제 연결된 로봇과 같은 이름의 카드를 선택하세요."
layout:
  - name: "상단 헤더"
    desc: "PRISM 로고, 버전 뱃지(v1.0.0), [btn:Documentation] 링크 — 이 매뉴얼로 돌아오는 버튼"
  - name: "로봇 카드 영역"
    desc: "사용 가능한 로봇들이 카드로 나열됩니다. [btn:Refresh] 로 목록 갱신. 카드를 클릭하면 테두리 색이 바뀌며 선택됩니다"
  - name: "연결 상태"
    desc: "선택한 로봇의 연결 상태가 초록(정상)/주황(미연결)으로 표시됩니다"
  - name: "Launch 버튼"
    desc: "[btn:Launch PRISM] — 로봇을 고른 뒤 이 버튼을 눌러야 시작됩니다 (로봇 미선택 시 비활성)"
  - name: "워크플로우 바로가기"
    desc: "[btn:Record](01 Dataset Acquisition) → [btn:Augment](02 Data Synthesis) → [btn:Train](03 Neural Training) → [btn:Inference](04 Edge Deployment)"
---

1. 화면에 로봇 카드가 보이지 않나요? [btn:Refresh] 를 눌러 목록을 새로고침하세요. 로봇이 켜져 있고 네트워크에 연결되어 있어야 카드가 나타납니다.

2. 내 로봇 카드를 클릭합니다. 선택되면 카드 테두리 색이 바뀌면서 강조되고, 연결 상태 표시가 초록색으로 바뀝니다. 카드에 적힌 로봇 이름과 실제 로봇이 일치하는지 꼭 확인하세요.

3. [btn:Launch PRISM] 을 누르면 Devices 화면으로 넘어갑니다. 만약 특정 작업으로 바로 가고 싶다면, 아래쪽 워크플로우 카드 [btn:Record], [btn:Augment], [btn:Train], [btn:Inference] 중 하나를 눌러도 됩니다.

![home 화면](../assets/home/screenshot.png)
