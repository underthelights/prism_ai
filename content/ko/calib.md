---
headline: "카메라가 보는 좌표와 로봇이 쓰는 좌표를 맞추는 캘리브레이션 화면"
summary: "사이드바 이름: `Calibration`. 카메라와 로봇은 각자 다른 좌표계를 씁니다. 이 화면에서 로봇 자세를 여러 번 바꿔가며 점을 찍으면, 두 좌표계 사이의 보정값을 계산합니다. 이 값을 설정에 반영하면 카메라가 본 물체 위치를 로봇이 정확히 이해할 수 있어요."
goal: "카메라와 로봇 사이의 위치 보정값(tf_offset)을 구합니다."
done: "보정값을 얻어서 YAML 설정에 반영하고, 카메라를 재시작하면 완료입니다."
caution: "비슷한 자세로만 점을 찍으면 수치상 오차(RMSE)는 낮아 보이지만, 실제 현장에서 큰 오차가 납니다. 로봇 자세를 최대한 다양하게 바꿔가며 6~10회 이상 찍어야 실용적인 결과가 나옵니다."
layout:
  - name: "설정 입력"
    desc: "Camera 드롭다운(cam_top, cam_third, cam_wrist), Base Frame, Target Frame, Port 텍스트 입력"
  - name: "높이 프리셋"
    desc: "[btn:Standard] / [btn:Tall (Recommended)] 선택"
  - name: "서버 제어"
    desc: "[btn:Copy] 명령어 복사, [btn:Start in Prism] 서버 시작, [btn:Restart] 재시작, [btn:Stop] 중단, [btn:Status] 상태 확인"
  - name: "캘리브레이션 UI"
    desc: "캘리브레이션 도구가 화면 안에 표시됩니다 [btn:Auto Fill URL] [btn:Reload] [btn:Open Tab]"
  - name: "결과 패널"
    desc: "오른쪽 — Quick Guide(접기/펴기 가능) + 보정값 체크리스트 [btn:Copy Checklist]"
---

1. Camera 드롭다운에서 캘리브레이션할 카메라를 고르고, Base Frame과 Target Frame 이름을 확인합니다. 높이 프리셋은 [btn:Standard] 또는 [btn:Tall (Recommended)] 를 선택하세요.

2. [btn:Start in Prism] 을 눌러 캘리브레이션 서버를 시작합니다. 서버 상태가 초록색으로 바뀌면 정상입니다. 화면 아래에 캘리브레이션 UI가 나타납니다. 안 뜨면 [btn:Auto Fill URL] → [btn:Reload] 를 눌러보세요.

3. 로봇 자세를 다양하게 바꿔가며 6~10회 이상 점을 찍습니다. 팔을 쭉 뻗거나, 접거나, 옆으로 돌리는 등 최대한 다양한 자세로 찍어야 결과가 정확합니다.

4. 점을 다 찍으면 캘리브레이션 UI에서 [btn:Capture], [btn:Solve] 또는 [btn:Compute] 를 진행합니다.

5. 결과가 나오면 [btn:Copy] 또는 [btn:Copy Checklist] 로 보정값을 복사해서 YAML 설정에 반영하고, 카메라를 재시작합니다.

![calib 화면](../assets/calib/screenshot.png)
