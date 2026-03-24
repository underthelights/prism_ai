---
headline: "녹화한 데이터를 학습에 넘기기 전에 정리하고 검수하는 도구 모음"
summary: "Record에서 모은 데이터를 바로 학습에 넣으면 안 됩니다. 이 화면에서 먼저 품질을 확인하고, 필요하면 에피소드를 지우거나 합치거나 수정합니다. 8가지 도구가 타일 형태로 있으니, 필요한 것을 골라 쓰면 됩니다."
goal: "학습에 넘기기 전에 데이터 품질을 확인하고, 문제가 있으면 여기서 정리합니다."
done: "깨끗하고 정확한 데이터가 Training에 넘겨질 준비가 됩니다."
output:
  - name: "Quality Check 결과 (화면 표시)"
    desc: "에피소드 수, 총 프레임 수, 성공/실패 비율, 이상 데이터 여부가 요약됩니다. 파일로 저장되지는 않고 화면에서 확인합니다"
  - name: "Delete Episodes 결과"
    desc: "선택한 에피소드의 parquet, 영상(MP4), 메타데이터가 영구 삭제됩니다. episodes.jsonl과 info.json의 에피소드 수도 자동 업데이트됩니다. 되돌릴 수 없으니 삭제 전 백업 필수"
  - name: "Merge Dataset 결과"
    desc: "두 데이터셋이 하나로 합쳐집니다. 에피소드 번호가 자동 재정렬되고, episodes.jsonl과 tasks.jsonl이 병합됩니다. 예: 데이터셋A(50 에피소드) + 데이터셋B(30 에피소드) → 합친 데이터셋(80 에피소드, 번호 0~79)"
  - name: "Change Task Instruction 결과"
    desc: "parquet 파일 내 language_instruction 컬럼과 tasks.jsonl의 task 이름이 수정됩니다. 학습 시 AI가 참고하는 지시문이 변경되는 것이니 신중하게 수정하세요"
  - name: "Upload/Download 결과"
    desc: "HuggingFace Hub에 데이터셋이 업로드되거나, Hub에서 로컬로 다운로드됩니다. 데이터셋 전체(parquet + 영상 + 메타)가 하나의 HF 리포지토리로 관리됩니다"
caution: "[btn:Delete Episodes]와 [btn:Merge Dataset]은 실행하면 되돌리기 어렵습니다. 특히 Delete는 에피소드가 영구 삭제됩니다. 중요한 데이터라면 반드시 먼저 백업해 두세요."
layout:
  - name: "도구 선택 타일"
    desc: "상단에 8개 도구 아이콘 타일이 나열됩니다 — 클릭하면 아래 작업 영역이 해당 도구로 전환됩니다"
  - name: "Filter Dataset"
    desc: "전문가(Expert), 카메라, 품질 기준으로 에피소드를 필터링합니다"
  - name: "Upload & Download"
    desc: "HuggingFace 또는 내부 서버와 데이터를 주고받습니다. HF 토큰 등록이 필요합니다"
  - name: "Merge Dataset"
    desc: "여러 데이터셋을 하나로 합칩니다. 에피소드 번호가 자동으로 재정렬됩니다"
  - name: "Delete Episodes"
    desc: "특정 에피소드를 선택하여 영구 삭제합니다. 삭제 전 미리보기 제공"
  - name: "Change Task Instruction"
    desc: "데이터셋의 작업 지시문을 확인하고 수정합니다. 폴더별로 현재 지시문이 표시됩니다"
  - name: "Scatter Plot"
    desc: "Feature 분포를 산점도로 시각화합니다. 에피소드 간 데이터 편차를 확인할 수 있습니다"
  - name: "작업 영역"
    desc: "선택한 도구의 세부 화면이 아래에 표시됩니다"
---

1. 데이터 상태부터 확인하고 싶으면 [btn:Quality Check] 타일을 먼저 누르세요. 데이터셋 경로를 지정하면 전체 품질 요약이 나옵니다 — 에피소드 수, 프레임 수, 성공/실패 비율, 이상 데이터 여부를 한눈에 볼 수 있습니다.

2. 문제가 발견되면 상황에 맞는 도구를 씁니다: [btn:Delete Episodes] 로 실패한 에피소드를 삭제하거나, [btn:Filter Dataset] 로 특정 전문가·카메라 조건에 맞는 에피소드만 골라냅니다. 삭제 전에는 반드시 미리보기를 확인하세요.

3. 여러 세션에서 모은 데이터를 하나로 합치려면 [btn:Merge Dataset] 을 사용합니다. 두 데이터셋의 경로를 지정하면 에피소드 번호가 자동으로 재정렬되어 하나의 데이터셋으로 합쳐집니다.

4. 작업 지시문을 수정해야 하면 [btn:Change Task Instruction] 을 사용합니다. 현재 폴더별 지시문이 표시되고, 직접 수정할 수 있습니다. 지시문이 정확해야 AI가 올바른 동작을 배웁니다.

5. 데이터 분포를 확인하려면 [btn:Scatter Plot] 을 사용합니다. X축/Y축에 원하는 Feature를 선택하면 에피소드별 데이터 분포가 산점도로 표시됩니다. 이상치(outlier)를 빠르게 발견할 수 있습니다.

6. 외부와 데이터를 공유하려면 [btn:Upload & Download] 를 사용합니다. HuggingFace에 업로드하거나 내부 서버에서 데이터를 가져올 수 있습니다. 처음 사용 시 HF 토큰 등록이 필요합니다.

7. 모든 정리가 끝나면 Training 화면으로 넘어갑니다. 데이터가 깨끗할수록 학습 결과가 좋습니다.
