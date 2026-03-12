---
headline: "로봇에게 '이렇게 하는 거야'를 직접 보여주면서 녹화하는 화면"
summary: "로봇을 손으로 직접 움직이면서, 그 동작을 카메라 영상·관절 데이터와 함께 녹화합니다. 이 데이터가 나중에 AI 학습의 교재가 됩니다. 작업 이름과 설정을 입력하고 [btn:Start]를 누르면 녹화가 시작되고, 한 번의 시연이 끝나면 성공/실패를 기록합니다."
goal: "좋은 품질의 시연 영상과 정확한 성공/실패 기록을 함께 남깁니다."
done: "학습에 바로 쓸 수 있는 에피소드 데이터와 라벨이 저장됩니다. 녹화가 끝나면 다음 단계(Data Tools, Visualize 등)로 안내됩니다."
caution: "에피소드가 끝나면 성공/실패를 묻는 팝업이 뜹니다. 여기서 대충 누르면 안 됩니다! 실패한 시연을 성공으로 표시하면, 나중에 AI가 잘못된 동작을 '정답'으로 배웁니다. 학습 품질이 심하게 떨어지는 가장 흔한 원인이에요."
layout:
  - name: "카메라 2x2 그리드"
    desc: "왼쪽 — Wrist, Third, Top, Depth 영상이 실시간으로 나옵니다"
  - name: "3D 뷰어 + 관절 그래프"
    desc: "가운데 — 로봇 자세와 관절값 변화를 실시간으로 볼 수 있습니다"
  - name: "작업 정보 패널"
    desc: "오른쪽 — Task Name, Instruction, FPS 등 녹화 설정을 입력하는 곳 [screenshot:오른쪽 패널]"
  - name: "녹화 컨트롤"
    desc: "하단 — [btn:Start] [btn:Stop] [btn:Retry] [btn:Next] [btn:Finish] [btn:Go to Initial]"
---

1. 먼저 [area:작업 정보 패널] 에서 녹화 설정을 입력합니다. Task Name(작업 이름)은 나중에 데이터를 찾을 때 쓰이니 알아보기 쉽게 적어주세요. Task Instruction(작업 설명), User ID, FPS도 입력하고, [area:카메라 2x2 그리드] 에서 카메라 영상이 정상으로 나오는지 확인합니다.

2. 준비가 되면 [btn:Start] 를 누릅니다. 화면 아래 상태 표시가 `WARMING_UP`(준비 중) → `RECORDING`(녹화 중) → `RESETTING`(초기화 중) 순서로 바뀝니다. 녹화 도중에 쓸 수 있는 버튼들: [btn:Stop] 은 현재 에피소드를 저장하고 중단, [btn:Retry] 는 지금 시연을 버리고 다시, [btn:Next] 는 바로 다음 에피소드로 넘어가기, [btn:Finish] 는 전체 녹화를 끝냅니다.

3. 에피소드 하나가 끝나면 성공/실패 팝업이 뜹니다. 시연이 잘 됐으면 [btn:SUCCESS], 실패했으면 [btn:FAIL] 을 누르고 실패 이유를 적습니다. 이 기록이 나중에 데이터 정리와 학습 품질에 직접 영향을 주니, 솔직하게 기록하세요.

4. 녹화를 모두 마치면 "다음에 뭘 할까요?" 안내 모달이 뜹니다. [btn:Data Tools · Quality Check] 로 데이터 품질 확인, [btn:Visualize] 로 궤적 확인, [btn:Kinematics] 로 좌표 변환, [btn:SAM2] 로 마스크 생성 중 필요한 것을 선택하세요.

<!-- 스크린샷을 추가하려면 아래처럼 작성하세요:
![화면 설명](../assets/record/screenshot.png)
-->
