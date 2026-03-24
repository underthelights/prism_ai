---
headline: "녹화 영상 속 물체에 마스크를 입히는 화면 — AI가 '이것이 물체'라는 걸 알게 해줍니다"
summary: "로봇이 다루는 물체(컵, 도구 등)가 영상 어디에 있는지 AI에게 알려주려면 마스크가 필요합니다. 이 화면에서 첫 프레임에 물체를 클릭하면 SAM2가 나머지 프레임도 자동으로 추적해서 마스크를 만들어 줍니다."
goal: "녹화 데이터의 모든 프레임에 정확한 물체 마스크를 붙입니다."
done: "`meta/sam2_masks/` 폴더에 마스크 파일이 저장됩니다. 이 마스크는 학습, Detection, Subtask 등 여러 곳에서 활용됩니다."
output:
  - name: "물체 마스크 PNG 파일"
    desc: "프레임마다 PNG 파일 1개가 생깁니다. 흰색=물체, 검은색=배경인 이진 마스크입니다. 카메라별, 에피소드별로 폴더가 나뉩니다. 예: 300프레임 에피소드에서 Wrist 카메라로 추적하면 PNG 300장이 생깁니다"
    path: "meta/sam2_masks/episode_XXXX/{Wrist,Third,Top}/frame_XXXXX.png"
  - name: "Save All 결과"
    desc: "[btn:Save All]을 누르면 모든 카메라의 마스크가 한번에 저장됩니다. 카메라 3개 x 300프레임이면 총 900개 PNG 파일이 생깁니다"
caution: "첫 프레임에서 물체를 정확하게 지정하는 것이 가장 중요합니다. 첫 프레임 마스크가 부정확하면 이후 수백 프레임 마스크가 전부 틀어집니다. 반드시 첫 프레임에서 마스크가 물체를 정확히 덮는지 확인하고 나서 추적을 시작하세요."
layout:
  - name: "데이터 선택"
    desc: "데이터셋 경로, 에피소드, 카메라를 드롭다운에서 선택합니다"
  - name: "프롬프트 모드"
    desc: "물체를 지정하는 방법: [btn:Positive](+) 포함, [btn:Negative](-) 제외, [btn:Erase](.) 지우기, [btn:Box](B) 박스 — 키보드 단축키로도 전환"
  - name: "이미지 뷰어"
    desc: "가운데 — 프레임 이미지 위에 마스크가 색으로 겹쳐 표시됩니다"
  - name: "프레임 이동"
    desc: "[btn:First] [btn:Previous] [btn:Next] [btn:Last] [btn:Skip Previous] [btn:Skip Next] + Play/Pause"
  - name: "마스크 컨트롤"
    desc: "[btn:Add object] [btn:Track Camera] [btn:Save] [btn:Save All]"
  - name: "표시 옵션"
    desc: "Show Mask Overlay, Show Only Active Mask, Show Tracked BBoxes, Auto Track on Prompt 토글 + Mask Opacity 슬라이더"
---

1. 데이터셋, 에피소드, 카메라를 선택합니다. SAM2 모델이 아직 안 올라와 있으면 [btn:Warmup SAM2] 를 먼저 누르세요. 모델 로딩에 잠깐 시간이 걸립니다.

2. [btn:Add object] 를 눌러 마스크를 만들 물체를 추가합니다. 프롬프트 모드를 고릅니다: [btn:Positive] (`+` 키)는 '이 점이 물체야', [btn:Negative] (`-` 키)는 '여기는 물체가 아니야', [btn:Box] (`B` 키)는 물체를 박스로 감쌉니다. [btn:Erase] (`.` 키)는 잘못 찍은 점을 지웁니다.

3. 현재 프레임의 마스크를 확인합니다. 빠진 부분이 있으면 [btn:Positive] 점을 추가하고, 넘친 부분이 있으면 [btn:Negative] 점을 찍으세요. Mask Opacity 슬라이더로 마스크 투명도를 조정할 수 있습니다.

4. 첫 프레임 마스크가 만족스러우면 [btn:Track Camera] 를 누릅니다. 전체 프레임에 마스크가 자동으로 퍼집니다. Play 버튼이나 프레임 이동 버튼으로 여러 프레임을 넘겨보면서 마스크가 계속 유지되는지 확인하세요.

5. 결과가 좋으면 [btn:Save] (현재 카메라만) 또는 [btn:Save All] (모든 카메라)로 저장합니다.

![sam2 화면](../assets/sam2/screenshot.png)
