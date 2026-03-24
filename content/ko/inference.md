---
headline: "학습된 AI를 실제 로봇에 올려서 '혼자 해봐'라고 시키는 화면"
summary: "Training에서 만든 정책(모델)을 실제 로봇에 올려서 자율 동작을 테스트합니다. 정책 폴더를 지정하고 모델이 로딩되면 [btn:Start]를 눌러 로봇을 움직이게 합니다. 카메라로 로봇을 지켜보다가, 이상하면 바로 [btn:Stop]을 누르세요."
goal: "학습된 정책을 실제 로봇에서 안전하게 테스트하고, 동작 결과를 확인합니다."
done: "로봇이 학습한 대로 움직이는 것을 확인했거나, 문제가 있으면 즉시 중단할 수 있는 상태입니다."
output:
  - name: "로봇 실행 궤적"
    desc: "학습된 정책이 실시간으로 관절 명령을 생성합니다. UR5 기준 30Hz로 6개 관절의 목표 위치/속도가 RTDE를 통해 로봇에 전달됩니다. 화면의 관절 그래프에서 실제 동작을 확인할 수 있습니다"
  - name: "Ghost 예측 미리보기 (화면 표시)"
    desc: "[btn:Start Ghost ON]을 켜면 3D 뷰어에서 정책이 예측한 다음 동작이 반투명 'Ghost'로 미리 표시됩니다. 실제 동작 전에 어디로 움직일지 예측을 볼 수 있어 안전 확인에 유용합니다"
  - name: "에피소드 녹화 (선택)"
    desc: "Inference 중 동작을 녹화하면 Record와 같은 LeRobot v2.1 포맷으로 데이터가 저장됩니다. 정책 성능 분석이나 추가 학습 데이터로 활용할 수 있습니다"
caution: "흔한 실수 두 가지: (1) 학습 출력 폴더 전체를 선택하는 것 — 안에 `config.json`이 있는 실제 정책 폴더를 선택해야 합니다. (2) 페이지가 열리자마자 바로 Start를 누르는 것 — 모델 로딩이 끝나야(`COMPLETED` 표시) 정상 동작합니다. 로딩 상태를 반드시 확인하세요."
layout:
  - name: "카메라 2x2 그리드"
    desc: "왼쪽 — Wrist, Third, Top, Depth 실시간 영상. [btn:Depth] 토글로 깊이 영상 켜기/끄기"
  - name: "3D 뷰어 + 관절 그래프"
    desc: "가운데 — [btn:Start Ghost ON/OFF] 로 예상 동작 미리보기. 관절 그래프에서 [btn:All]/[btn:None] 으로 관절 선택"
  - name: "Inference 패널"
    desc: "오른쪽 — Task Instruction 입력, [btn:Browse Policy Path] 정책 선택, [btn:Download Policy] HuggingFace 다운로드"
  - name: "모델 로딩 상태"
    desc: "터미널 스타일 로그 — Idle → Validating → Loading → Completed 순서로 진행"
  - name: "하단 컨트롤"
    desc: "[btn:Start] [btn:Stop] [btn:Retry] [btn:Next] [btn:Skip Task] [btn:Finish] [btn:Go to Initial] + 키보드 단축키"
---

1. [area:Inference 패널] 에서 `Task Instruction`(작업 지시)을 입력하고, [btn:Browse Policy Path] 로 학습된 정책 폴더를 선택합니다. HuggingFace에서 내려받고 싶으면 [btn:Download Policy] 를 눌러 User ID와 Repository ID를 입력합니다.

2. [area:모델 로딩 상태] 를 지켜봅니다. `Idle` → `Validating` → `Loading Policy Class` → `Loading Model Weights` → `COMPLETED` 순서로 진행됩니다. 로딩 중에 오류가 나오면 정책 경로가 맞는지 확인하세요. **로딩이 끝나기 전에 Start를 누르면 동작하지 않습니다.**

3. 로딩 완료 후 [btn:Start] (또는 `Space` 키)를 누르면 로봇이 움직이기 시작합니다. [area:카메라 2x2 그리드] 에서 로봇 동작을 계속 지켜보세요.

4. 이상한 움직임이 보이면 즉시 [btn:Stop] (또는 `Space` 키)을 누르세요. 다른 컨트롤: [btn:Retry] (`←`) 다시 시도, [btn:Next] (`→`) 다음 에피소드, [btn:Go to Initial] (`Ctrl+Shift+H`) 초기 자세 복귀, [btn:Finish] (`Ctrl+Shift+X`) 전체 종료.

![inference 화면](../assets/inference/screenshot.png)
