---
headline: "녹화한 시연 데이터를 AI에게 학습시키는 화면"
summary: "Record에서 모은 데이터로 AI 정책(모델)을 학습시킵니다. 데이터셋과 정책 종류를 고르고, 저장 폴더를 정한 뒤 [btn:Start Training]을 누르면 학습이 시작됩니다. 학습 중에는 loss 그래프와 GPU 상태를 실시간으로 확인할 수 있어요."
goal: "올바른 데이터와 설정으로 학습을 시작하고, 완료될 때까지 진행 상태를 확인합니다."
done: "학습이 끝나면 지정한 폴더에 체크포인트 파일이 저장됩니다. 이 파일을 Inference 화면에서 불러오면 로봇이 학습한 대로 움직입니다."
caution: "학습을 시작하기 전에, 데이터 품질을 Data Tools에서 먼저 확인하셨나요? 데이터에 문제가 있는 상태로 학습하면 GPU 시간만 낭비하고 쓸 수 있는 결과가 나오지 않습니다. 정책 종류(act, diffusion, pi0 등)와 데이터셋 형식이 맞는지도 확인하세요."
layout:
  - name: "왼쪽 설정 패널"
    desc: "데이터셋 선택, 정책 종류, 저장 폴더, 학습 옵션을 설정하는 곳"
  - name: "메인 모니터링"
    desc: "학습 진행 대시보드 — loss 그래프가 여기에 표시됩니다. [btn:History] 로 이전 실험 기록도 볼 수 있습니다"
  - name: "GPU 상태"
    desc: "GPU 사용률과 메모리를 실시간으로 표시 — 메모리가 부족하면 배치 사이즈를 줄여야 합니다"
  - name: "하단 컨트롤"
    desc: "[btn:Start Training] 으로 시작, [btn:Stop] 으로 중단, 진행률 바로 진행 상태 확인"
---

1. [area:왼쪽 설정 패널] 에서 학습할 데이터를 선택합니다. [btn:Local] 탭은 로컬에 저장된 데이터, [btn:HuggingFace] 탭은 온라인 데이터입니다. 목록이 비어 있으면 [btn:Refresh Users] 를 누른 뒤, 원하는 데이터셋 행을 클릭합니다.

2. 정책 종류(act, diffusion, pi0, pi05 등)와 device(GPU)를 고릅니다. `Output folder name` 에 나중에 알아볼 수 있는 이름을 입력하고, [btn:Check duplicate] 로 같은 이름이 이미 있는지 확인합니다. 이름이 겹치면 이전 결과를 덮어쓸 수 있어요.

3. [btn:Start Training] 을 누르면 학습이 시작됩니다. [area:메인 모니터링] 에서 loss 그래프가 점점 내려가는지 확인하고, [area:GPU 상태] 에서 메모리가 가득 차지 않았는지 함께 봅니다. loss가 안 내려가면 데이터나 설정에 문제가 있을 수 있습니다.

4. 이전에 중단했던 학습을 이어서 하고 싶다면: 상단에서 [btn:Resume] 모드로 전환하고, [btn:Browse] 또는 [btn:Edit] 로 기존 출력 폴더를 선택한 뒤 [btn:Load] → [btn:Resume Training] 순서로 진행합니다.

![training 화면](../assets/training/screenshot.png)
