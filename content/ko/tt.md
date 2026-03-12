---
headline: "긴 작업을 '접근 → 잡기 → 들기 → 놓기' 같은 단계로 나누는 화면"
summary: "사이드바 이름: `Subtask`. 하나의 긴 에피소드를 의미 있는 작업 단계(subtask)로 나눕니다. 로봇 팔끝 궤적 그래프를 보면서 자동으로 구간을 나누고, 경계와 설명을 직접 수정한 뒤 저장합니다."
goal: "긴 작업을 의미 있는 단계(접근, 잡기, 들기, 이동, 놓기 등)로 나누어 기록합니다."
done: "`annotations/task_sequences/` 폴더에 sequence JSON 파일이 저장됩니다. 이 파일은 다른 분석이나 학습에 활용됩니다."
caution: "자동 분할은 참고용 초안일 뿐입니다. AI가 나눈 경계가 반드시 맞는 것은 아니에요. 직접 궤적 그래프를 보면서 경계를 조정하지 않으면, 나중에 이 sequence를 쓸 때 단계가 어긋납니다."
layout:
  - name: "데이터셋 선택"
    desc: "[btn:Open File Browser] 로 경로를 지정하고, 에피소드 드롭다운에서 선택합니다"
  - name: "프레임 이동"
    desc: "[btn:First] [btn:Previous] [btn:Next] [btn:Last] [btn:Skip Previous] [btn:Skip Next] + Play/Pause + 프레임 슬라이더"
  - name: "카메라 뷰"
    desc: "카메라 드롭다운으로 Wrist/Third/Top 등 선택, 해당 프레임 이미지가 표시됩니다"
  - name: "궤적 뷰어"
    desc: "EEF 궤적이 3D로 표시됩니다. 투영 축 선택: [btn:X-Z] [btn:X-Y] [btn:Y-Z]. URDF 로봇 모델도 함께 표시"
  - name: "Subtask 편집"
    desc: "[btn:Add Subtask] 추가, [btn:Delete Subtask] 삭제, [btn:Lock]/[btn:Unlock] 잠금. 각 단계의 시작/끝 프레임, 타입(grasp, release, open, close, push 등) 설정"
  - name: "저장"
    desc: "[btn:Save Subtasks] 로 결과를 저장합니다"
---

1. [btn:Open File Browser] 로 데이터셋을 선택하고, 에피소드를 고릅니다. 팔끝(EEF) 궤적이 3D 뷰어에 자동으로 로드됩니다. 궤적이 안 보이면 먼저 Kinematics 화면에서 EEF 변환을 해야 합니다.

2. [btn:Generate Subtasks (Recommended)] 를 눌러 AI가 자동으로 단계를 나누게 합니다. 이건 초안이니 반드시 직접 확인이 필요합니다.

3. 프레임 이동 버튼이나 Play로 영상을 넘기면서, 궤적 뷰어에서 각 단계의 경계가 맞는지 확인합니다. 투영 축을 [btn:X-Z], [btn:X-Y], [btn:Y-Z] 로 바꿔가며 다른 각도에서도 봅니다. 각 단계에 타입(grasp, release, open, close, push, turn_on 등)을 지정합니다.

4. 경계가 틀리면 [btn:Add Subtask] / [btn:Delete Subtask] 로 단계를 추가/삭제하고, 시작/끝 프레임을 수정합니다. 확정된 단계는 [btn:Lock] 으로 잠가서 실수로 수정되지 않게 합니다.

5. 수정이 끝나면 [btn:Save Subtasks] 를 눌러 저장합니다. 저장 경로가 화면에 표시됩니다.

![tt 화면](../assets/tt/screenshot.png)
