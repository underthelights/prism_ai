---
headline: "녹화 이미지에서 물체를 자동으로 찾아 박스와 마스크를 그려주는 화면"
summary: "찾고 싶은 물체의 이름(예: cup, gripper)을 입력하면, AI가 각 카메라 이미지에서 해당 물체를 자동으로 찾아 검출 박스와 마스크를 그려줍니다. SAM2처럼 직접 클릭할 필요 없이 텍스트만으로 검출이 가능해요."
goal: "데이터셋 이미지에 물체 검출 결과(위치, 마스크)를 자동으로 붙입니다."
done: "`meta/detections/` 폴더에 검출 결과와 마스크 파일이 저장됩니다."
output:
  - name: "검출 결과 JSON"
    desc: "프레임마다 검출된 물체의 바운딩 박스 좌표(x1, y1, x2, y2), 신뢰도 점수(confidence), 물체 이름(label)이 JSON으로 저장됩니다. 카메라별로 분리됩니다"
    path: "meta/detections/episode_XXXX/frame_XXXX/{Wrist,Third,Top}/"
  - name: "검출 마스크 이미지"
    desc: "Grounding DINO + SAM이 만든 물체 마스크(PNG)도 함께 저장됩니다. SAM2의 마스크와 비슷하지만, 여기서는 텍스트 프롬프트 기반으로 자동 생성된 것입니다"
  - name: "Batch Process 결과"
    desc: "[btn:Batch Process All Frames]를 사용하면 에피소드의 모든 프레임에 일괄 적용됩니다. 프레임 수만큼 검출 결과가 생깁니다"
caution: "물체 이름 표현이 조금만 달라져도 검출 품질이 크게 달라집니다. 예를 들어 'cup'과 'mug'는 결과가 다릅니다. 반드시 한 프레임에서 먼저 결과를 확인하고, 만족스러울 때만 전체 프레임에 적용하세요."
layout:
  - name: "데이터 선택"
    desc: "데이터셋, 에피소드, 프레임을 선택합니다"
  - name: "프롬프트 입력"
    desc: "찾을 물체 이름을 입력하거나 프리셋 사용: [btn:Robot Gripper] [btn:Cup] [btn:Box] [btn:Bottle] [btn:Food] [btn:Tool]"
  - name: "임계값 조정"
    desc: "Box Threshold, Text Threshold 슬라이더로 검출 민감도를 조절합니다"
  - name: "카메라별 결과"
    desc: "각 카메라 이미지에 검출 박스와 마스크가 표시됩니다"
---

1. 데이터셋 경로를 지정하고, 확인하고 싶은 에피소드와 프레임을 선택합니다.

2. 찾을 물체 이름을 입력합니다. 자주 쓰는 물체는 [btn:Robot Gripper], [btn:Cup], [btn:Box], [btn:Bottle], [btn:Food], [btn:Tool] 프리셋 버튼을 누르면 자동 입력되어 편리합니다.

3. [btn:Detect on All Cameras] 를 눌러 한 프레임에서 먼저 결과를 확인합니다. 검출이 잘 안 되면 물체 이름을 다른 표현으로 바꿔보거나, 임계값 슬라이더를 조정해 보세요. 만족스러운 결과가 나올 때까지 이 단계를 반복합니다.

4. 한 프레임에서 결과가 좋으면, [btn:Save to meta/detections/] 로 저장하거나, [btn:Batch Process All Frames] 로 모든 프레임에 한번에 적용합니다.

![detection 화면](../assets/detection/screenshot.png)
