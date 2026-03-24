---
headline: "녹화한 데이터를 눈으로 직접 확인하는 시각화 화면"
summary: "데이터에 이상이 없는지 직접 눈으로 봅니다. 관절값 그래프, 원본 수치 표, 데이터 분포 산점도, 파일 구조, 3D 팔끝 궤적 등 5가지 보기 모드를 제공합니다. 학습 전에 한 번은 꼭 봐두세요."
goal: "데이터에 튀는 값이나 이상한 구간이 없는지 시각적으로 확인합니다."
done: "문제가 있는 에피소드나 프레임을 특정하여, Data Tools/Kinematics/Subtask 등 다른 도구로 넘길 수 있습니다."
output:
  - name: "시각화 결과 (화면 표시만)"
    desc: "파일로 저장되는 건 없습니다. 5가지 보기 모드로 데이터를 눈으로 확인하는 화면입니다"
  - name: "Joint Graph"
    desc: "UR5 기준 6개 관절(shoulder_pan, shoulder_lift, elbow, wrist_1, wrist_2, wrist_3)의 위치값이 시간 축 그래프로 표시됩니다. 급격히 튀는 구간이 있으면 녹화 품질 문제일 수 있습니다"
  - name: "Data Table"
    desc: "parquet 파일의 원본 수치를 표로 보여줍니다. frame_index, observation.state[6], action[6], language_instruction, success 등 모든 컬럼을 확인할 수 있습니다"
  - name: "3D EEF Trajectory"
    desc: "Kinematics에서 변환한 팔끝 좌표(observation.eef_pose)를 3D 공간에 궤적으로 그려줍니다. 로봇이 실제로 어떤 경로로 움직였는지 직관적으로 볼 수 있습니다. Kinematics 변환이 선행되어야 합니다"
caution: "숫자만 보고 '이상 데이터'라고 단정짓지 마세요. 수치가 이상해 보여도 해당 프레임의 카메라 이미지를 함께 확인하면 정상인 경우가 많습니다. 항상 영상과 수치를 같이 봐야 정확한 판단이 됩니다."
layout:
  - name: "데이터셋 선택"
    desc: "경로를 직접 입력하거나 [btn:Browse] 로 선택"
  - name: "보기 모드 탭"
    desc: "[btn:Joint Graph] 관절값 그래프 / [btn:Data Table] 원본 수치 표 / [btn:Scatter Plot] 데이터 분포 / [btn:HDF5 Viewer] 파일 구조 / [btn:3D EEF Trajectory] 팔끝 궤적"
  - name: "에피소드 선택"
    desc: "에피소드 드롭다운 + Feature/Column 선택 드롭다운"
  - name: "프레임 이동"
    desc: "[btn:First] [btn:Previous] [btn:Next] [btn:Last] + 페이지네이션 (Data Table 모드)"
  - name: "분석 영역"
    desc: "선택한 모드에 따라 그래프, 표, 3D 뷰가 표시됩니다"
---

1. 데이터셋 경로를 입력하거나 [btn:Browse] 로 선택합니다. 에피소드 드롭다운에서 확인할 에피소드를 고릅니다.

2. 상단에서 보고 싶은 모드를 고릅니다:
   - [btn:Joint Graph]: 관절값이 시간에 따라 어떻게 변하는지 그래프로 보여줍니다. 특정 관절만 보고 싶으면 관절 버튼을 클릭해서 선택/해제합니다.
   - [btn:Data Table]: 원본 수치를 표로 보여줍니다. 페이지네이션으로 많은 데이터를 넘겨볼 수 있습니다.
   - [btn:Scatter Plot]: X축/Y축 Feature를 드롭다운에서 골라 데이터 분포를 산점도로 봅니다.
   - [btn:HDF5 Viewer]: 데이터 파일 내부 구조(datasets, attributes)를 확인합니다.
   - [btn:3D EEF Trajectory]: 로봇 팔끝이 그린 궤적을 3D로 보여줍니다 (Kinematics에서 EEF 변환 필요).

3. 이상한 값이 보이면 에피소드 번호와 프레임 번호를 기억해 두세요. 그 다음 Data Tools에서 해당 에피소드를 삭제하거나, Kinematics에서 좌표를 재확인하거나, Subtask에서 구간을 나눌 수 있습니다.

![visualize 화면](../assets/visualize/screenshot.png)
