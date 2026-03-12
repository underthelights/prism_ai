---
headline: "녹화한 데이터를 학습에 넘기기 전에 정리하고 검수하는 도구 모음"
summary: "Record에서 모은 데이터를 바로 학습에 넣으면 안 됩니다. 이 화면에서 먼저 품질을 확인하고, 필요하면 에피소드를 지우거나 합치거나 수정합니다. 8가지 도구가 타일 형태로 있으니, 필요한 것을 골라 쓰면 됩니다."
goal: "학습에 넘기기 전에 데이터 품질을 확인하고, 문제가 있으면 여기서 정리합니다."
done: "깨끗하고 정확한 데이터가 Training에 넘겨질 준비가 됩니다."
caution: "[btn:Delete Episodes]와 [btn:Merge Dataset]은 실행하면 되돌리기 어렵습니다. 특히 Delete는 에피소드가 영구 삭제됩니다. 중요한 데이터라면 반드시 먼저 백업해 두세요."
layout:
  - name: "도구 선택 타일"
    desc: "상단에 8개 도구 버튼이 나열됩니다 — 클릭하면 아래 작업 영역이 바뀝니다"
  - name: "도구 목록"
    desc: "[btn:Quality Check] 품질 검사, [btn:Filter Dataset] 조건 필터링, [btn:Upload & Download data] HuggingFace 연동, [btn:Merge Dataset] 데이터셋 합치기, [btn:Delete Episodes] 에피소드 삭제, [btn:Change Task Instruction] 지시문 수정, [btn:Mask Timeline QA] 마스크 품질 확인, [btn:Scatter Plot] 데이터 분포"
  - name: "작업 영역"
    desc: "선택한 도구의 세부 화면이 아래에 표시됩니다"
---

1. 데이터 상태부터 확인하고 싶으면 [btn:Quality Check] 타일을 먼저 누르세요. 데이터셋 경로를 지정하면 전체 품질 요약이 나옵니다. 어떤 에피소드에 문제가 있는지 한눈에 볼 수 있습니다.

2. 문제가 발견되면 상황에 맞는 도구를 씁니다: [btn:Delete Episodes] 로 실패한 에피소드를 삭제하거나, [btn:Filter Dataset] 로 조건에 맞는 에피소드만 골라내거나, [btn:Merge Dataset] 으로 여러 데이터셋을 하나로 합칩니다. 삭제 전에는 미리보기를 꼭 확인하세요.

3. 작업 지시문이나 마스크 품질도 점검해야 한다면: [btn:Change Task Instruction] 으로 지시문 수정, [btn:Mask Timeline QA] 로 마스크 품질 확인, [btn:Scatter Plot] 으로 데이터 분포를 확인합니다. [btn:Upload & Download data] 는 HuggingFace 등과 데이터를 주고받을 때 씁니다.

4. 모든 정리가 끝나면 Training 화면으로 넘어갑니다. 데이터가 깨끗할수록 학습 결과가 좋습니다.

<!-- 스크린샷을 추가하려면 아래처럼 작성하세요:
![화면 설명](../assets/datatools/screenshot.png)
-->
