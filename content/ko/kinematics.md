---
headline: "관절 데이터를 '로봇 팔끝이 어디에 있었는지' 좌표로 바꿔주는 화면"
summary: "녹화된 데이터에는 관절 각도만 있고, 로봇 팔끝(End-Effector)이 3D 공간에서 어디에 있었는지는 없습니다. 이 화면에서 [btn:Convert to EEF Space]를 누르면 관절 각도 → XYZ 좌표로 변환해서 데이터셋에 추가합니다. 이 좌표가 있어야 Visualize의 3D 궤적이나 Subtask의 단계 분할이 작동합니다."
goal: "데이터셋에 팔끝 좌표(EEF pose)를 추가합니다."
done: "변환이 끝나면 Visualize에서 3D 궤적을 볼 수 있고, Subtask에서 작업 단계를 나눌 수 있습니다."
caution: "Base Link와 Target Link의 프레임 이름이 틀리면, 변환은 성공하지만 좌표가 완전히 엉뚱합니다. 로봇 모델(URDF)의 실제 link 이름을 확인하고, 보통은 기본값이 맞지만 다른 로봇이면 주의하세요."
layout:
  - name: "데이터셋 선택"
    desc: "[btn:Browse] 를 눌러 데이터셋 경로를 지정합니다"
  - name: "데이터셋 정보"
    desc: "에피소드 수, 프레임 수, FPS, 로봇 종류, feature 목록, task 수가 자동으로 요약됩니다"
  - name: "프레임 설정"
    desc: "Base Link URDF(예: link0), Target Link URDF(예: end_effector_link) 이름을 텍스트 입력"
  - name: "변환 결과"
    desc: "변환된 컬럼 목록, 샘플 데이터 표(frame_index, state, eef_pose, action), EEF 궤적 미리보기(XY, XZ)"
---

1. [btn:Browse] 를 눌러 변환할 데이터셋을 선택합니다. 선택하면 [area:데이터셋 정보] 에 에피소드 수, 프레임 수, FPS, feature 목록이 자동으로 표시됩니다.

2. `Base Link URDF`와 `Target Link URDF` 이름을 확인합니다. 보통은 기본값(link0, end_effector_link)이 맞지만, 다른 종류의 로봇이라면 URDF 파일에서 실제 link 이름을 찾아 입력해야 합니다.

3. [btn:Convert to EEF Space] 를 누르면 변환이 시작됩니다. 진행률 바가 표시되고, 데이터가 많으면 시간이 걸릴 수 있습니다.

4. 변환이 끝나면 [area:변환 결과] 에 컬럼 목록과 샘플 데이터가 표시됩니다. [btn:Open 3D EEF Trajectory in Visualize] 를 눌러 결과를 바로 3D로 확인하세요. 궤적이 자연스럽게 이어지면 성공, 끊기거나 튀는 곳이 있으면 프레임 이름이나 데이터를 다시 확인합니다.

<!-- 스크린샷을 추가하려면 아래처럼 작성하세요:
![화면 설명](../assets/kinematics/screenshot.png)
-->
