---
headline: "에피소드 안에서 중간 목표(subgoal) 지점을 찍어주는 어노테이션 화면"
summary: "긴 에피소드를 재생하면서 핵심 키프레임에 subgoal 마커를 찍습니다. Rule-based(수동) 또는 Keyframe Detection(자동) 모드로 작업할 수 있습니다. 그리퍼 궤적, 속도/정밀도/분산 그래프를 함께 보면서 정확한 지점을 찾습니다."
goal: "에피소드 내 핵심 subgoal 프레임을 표시하고, 각 구간에 phase 라벨(approach, grasp, lift, transport, place, release 등)을 할당합니다."
done: "어노테이션이 저장되어 학습이나 분석에 사용할 수 있습니다. 배치 모드로 여러 에피소드를 한번에 처리할 수도 있습니다."
output:
  - name: "Subgoal 어노테이션 JSON"
    desc: "에피소드별 JSON 파일 1개가 생깁니다. 각 subgoal의 시작/끝 프레임 번호, phase 라벨(approach, grasp, lift, transport, place, release, open, close, push, turn_on), EEF 좌표 범위가 기록됩니다. 예: [{'start_frame': 0, 'end_frame': 45, 'phase': 'approach'}, {'start_frame': 46, 'end_frame': 90, 'phase': 'grasp'}, ...]"
    path: "annotations/task_sequences/episode_XXXX.json"
  - name: "배치 세그멘테이션 결과"
    desc: "배치 모드를 사용하면 여러 에피소드의 JSON이 한번에 생성됩니다. 에피소드 50개를 처리하면 50개의 JSON 파일이 annotations/task_sequences/ 에 저장됩니다"
caution: "자동 감지(Keyframe Detection)는 참고용입니다. 반드시 직접 재생하면서 결과를 확인하고 수정하세요. 특히 그리퍼가 열리고 닫히는 시점이 정확한지 확인이 중요합니다."
layout:
  - name: "데이터셋·에피소드 선택"
    desc: "[btn:Browse] 로 데이터셋을 선택하고 에피소드 드롭다운으로 에피소드를 고릅니다"
  - name: "멀티 카메라 뷰"
    desc: "해당 프레임의 카메라 이미지가 표시됩니다. 카메라를 전환하며 다른 각도에서 확인 가능"
  - name: "재생 컨트롤"
    desc: "[btn:Play] [btn:Pause] + 프레임 단위 이동([btn:Prev] [btn:Next]) + 프레임 슬라이더"
  - name: "어노테이션 모드"
    desc: "[btn:Rule-based] 수동 프레임 범위 지정 / [btn:Keyframe Detection] Grounding DINO 또는 action variance 기반 자동 감지"
  - name: "URDF 뷰어"
    desc: "재생과 동기화된 3D 로봇 모델이 현재 자세를 보여줍니다"
  - name: "분석 그래프"
    desc: "그리퍼 궤적 오버레이, 속도(velocity), 정밀도(precision), 분산(variance) 등 5가지 신호 시각화"
  - name: "Subgoal 타임라인"
    desc: "하단에 subgoal 마커와 phase 라벨이 타임라인으로 표시됩니다. 클릭으로 수정 가능"
---

1. [btn:Browse] 로 데이터셋을 선택하고 에피소드를 고릅니다. Task Instruction이 자동으로 로드되며, 해당 에피소드의 카메라 이미지와 URDF 뷰어가 표시됩니다.

2. 어노테이션 모드를 선택합니다:
   - [btn:Rule-based]: 직접 프레임을 보면서 수동으로 subgoal 지점을 설정합니다.
   - [btn:Keyframe Detection]: 자동 감지 방식을 선택합니다. Grounding DINO(객체 기반) 또는 action variance(동작 변화 기반) 중 선택하고, smoothing/threshold 파라미터를 조정합니다.

3. 자동 감지를 사용한 경우, [btn:Play] 로 에피소드를 재생하면서 감지된 subgoal이 맞는지 확인합니다. [area:분석 그래프] 에서 속도/정밀도/분산 플롯을 함께 보면 동작 변화 지점을 찾기 쉽습니다. 그리퍼 궤적 오버레이도 참고하세요.

4. Subgoal 타임라인에서 마커를 드래그하여 위치를 조정하거나, 새로운 마커를 추가합니다. 각 구간에 phase 라벨을 할당합니다: approach(접근), grasp(잡기), lift(들기), transport(이동), place(놓기), release(놓기) 등.

5. [area:URDF 뷰어] 에서 재생과 동기화된 로봇 자세를 확인합니다. 특정 프레임에서 로봇이 어떤 상태인지 3D로 볼 수 있어 어노테이션 정확도가 높아집니다.

6. 여러 에피소드를 한번에 처리하려면 배치 세그멘테이션 모드를 사용합니다. 진행률이 표시되며, 결과는 에피소드별로 저장됩니다.

7. 모든 어노테이션이 끝나면 [btn:Save] 로 저장합니다.
