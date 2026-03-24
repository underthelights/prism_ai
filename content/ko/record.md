---
headline: "로봇에게 '이렇게 하는 거야'를 직접 보여주면서 녹화하는 화면"
summary: "로봇을 손으로 직접 움직이면서, 그 동작을 카메라 영상·관절 데이터와 함께 녹화합니다. 이 데이터가 나중에 AI 학습의 교재가 됩니다. 작업 이름과 설정을 입력하고 [btn:Start]를 누르면 녹화가 시작되고, 한 번의 시연이 끝나면 성공/실패를 기록합니다."
goal: "좋은 품질의 시연 영상과 정확한 성공/실패 기록을 함께 남깁니다."
done: "학습에 바로 쓸 수 있는 에피소드 데이터와 라벨이 저장됩니다. 녹화가 끝나면 다음 단계(Data Tools, Visualize 등)로 안내됩니다."
output:
  - name: "LeRobot v2.1 Parquet 파일 (에피소드 데이터)"
    desc: "에피소드 하나당 parquet 파일 1개가 생깁니다. 안에는 프레임별 관절 각도(observation.state — UR5 기준 float32 x 6), 행동 명령(action — float32 x 6), 작업 지시문(language_instruction), 프레임 번호(frame_index), 타임스탬프, 성공 여부(success)가 한 행씩 기록됩니다. 예: 30fps로 10초 녹화하면 약 300행"
    path: "data/chunk-000/episode_000000.parquet"
  - name: "카메라 영상 MP4 (카메라별)"
    desc: "Wrist(손목), Third(측면), Top(위) 카메라마다 MP4 영상이 저장됩니다. UR5 기준 640x480 해상도, 30fps. 영상은 parquet과 프레임 단위로 동기화되어 있어서 frame_index로 매칭 가능합니다"
    path: "videos/chunk-000/{Wrist,Third,Top}/episode_000000.mp4"
  - name: "데이터셋 메타정보 (info.json)"
    desc: "전체 데이터셋의 요약 정보: LeRobot 버전(v2.1), 로봇 종류(ur5), FPS(30), 총 에피소드 수, 총 프레임 수, feature 목록과 각 shape/dtype이 기록됩니다. 학습 시 자동으로 읽어서 정규화 등에 사용됩니다"
    path: "meta/info.json"
  - name: "에피소드 목록 (episodes.jsonl)"
    desc: "에피소드별 메타데이터가 한 줄씩 기록됩니다: 에피소드 번호, 작업 번호, 프레임 수, 소요 시간. 나중에 Data Tools에서 필터링·삭제할 때 이 파일을 참조합니다"
    path: "meta/episodes.jsonl"
  - name: "작업 목록 (tasks.jsonl)"
    desc: "작업 번호와 작업 이름의 매핑 파일입니다. 예: {task_index: 0, task: 'pick_cup'}. Record 설정에서 입력한 Task Name이 여기에 기록됩니다"
    path: "meta/tasks.jsonl"
  - name: "HDF5 파일 (선택)"
    desc: "parquet 외에 HDF5 포맷으로도 저장될 수 있습니다. action, observations/joint_positions, observations/images 등이 계층 구조로 들어갑니다. 일부 학습 프레임워크에서 이 포맷을 사용합니다"
    path: "hdf5/episode_000000.hdf5"
caution: "에피소드가 끝나면 성공/실패를 묻는 팝업이 뜹니다. 여기서 대충 누르면 안 됩니다! 실패한 시연을 성공으로 표시하면, 나중에 AI가 잘못된 동작을 '정답'으로 배웁니다."
layout:
  - name: "카메라 피드 그리드"
    desc: "왼쪽 — 2x2 그리드로 카메라 영상이 실시간 표시됩니다. UR5의 경우 3:1 비율 레이아웃. 클릭하면 해당 카메라 확대"
  - name: "3D URDF 뷰어"
    desc: "가운데 상단 — 로봇의 현재 자세를 실시간 3D로 표시합니다"
  - name: "관절 그래프"
    desc: "가운데 하단 — 관절값 변화를 시간 축으로 보여줍니다. 튀는 값이 보이면 녹화 품질에 문제가 있을 수 있습니다"
  - name: "작업 정보 패널 (접을 수 있음)"
    desc: "오른쪽 — Task Name, Task Instruction, User ID, Duration, FPS, Episode Count 등 녹화 설정 입력"
  - name: "녹화 컨트롤"
    desc: "하단 — [btn:Start] [btn:Stop] [btn:Retry] [btn:Next] [btn:Finish] [btn:Skip Task]. 키보드 단축키: Space(시작/정지), →(다음), Ctrl+Shift+X(스킵)"
  - name: "에피소드 상태 바"
    desc: "하단 — 현재 녹화 단계(READY → WARMING_UP → RESETTING → RECORDING → SAVING)와 진행 상황 표시"
---

1. 먼저 [area:작업 정보 패널] 에서 녹화 설정을 입력합니다. Task Name(작업 이름)은 나중에 데이터를 찾을 때 쓰이니 알아보기 쉽게 적어주세요. Task Instruction(작업 설명)은 AI가 학습할 때 참고하는 지시문입니다 — 구체적으로 적을수록 좋습니다. User ID, FPS(프레임 레이트), Duration(최대 녹화 시간)도 설정합니다.

2. [area:카메라 피드 그리드] 에서 카메라 영상이 정상으로 나오는지 확인합니다. 영상이 안 나오면 Devices 화면으로 돌아가 카메라 상태를 점검하세요. 연결이 끊긴 경우 상단에 노란색 경고 배너가 표시됩니다.

3. 준비가 되면 [btn:Start] 를 누릅니다 (또는 Space 키). 상태가 `WARMING_UP` → `RESETTING` → `RECORDING` 순서로 바뀝니다. 녹화 중 사용 가능한 버튼: [btn:Stop] 현재 에피소드 저장 후 중단, [btn:Retry] 현재 시연 버리고 재시작, [btn:Next] 바로 다음 에피소드로 (→ 키), [btn:Finish] 전체 녹화 종료.

4. 에피소드 하나가 끝나면 성공/실패 팝업이 뜹니다. 시연이 잘 됐으면 [btn:SUCCESS], 실패했으면 [btn:FAIL] 을 누르고 실패 이유를 적습니다. 이 기록이 데이터 품질과 학습 결과에 직접 영향을 주니, 솔직하게 기록하세요.

5. 여러 에피소드를 녹화할 때는 [btn:Next] 로 다음 에피소드로 넘어갑니다. 에피소드 카운터가 자동으로 증가하며, 각 에피소드의 성공/실패 통계가 우측에 표시됩니다.

6. 녹화를 모두 마치면 "다음에 뭘 할까요?" 안내 모달이 뜹니다: [btn:Data Tools] 데이터 품질 확인, [btn:Visualize] 궤적 확인, [btn:Kinematics] 좌표 변환, [btn:SAM2] 마스크 생성 중 필요한 것을 선택하세요.
