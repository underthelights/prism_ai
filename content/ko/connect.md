---
headline: "새 로봇을 PRISM에 처음 연결할 때 따라가는 설정 안내"
summary: "Home 화면에 내 로봇이 안 보인다면, 아직 PRISM에 등록되지 않은 겁니다. 이 페이지는 새 로봇을 PRISM에 붙이기 위해 어떤 파일을 만들고, 로봇 쪽에서 무엇을 준비해야 하는지 알려줍니다. 개발자 또는 관리자가 한 번만 하면 이후 다른 사용자는 신경 쓸 필요 없습니다."
goal: "Home 화면에 새 로봇 카드가 나타나고, Devices에서 카메라와 관절이 정상으로 보이는 것까지 확인합니다."
done: "Home에서 새 로봇을 선택할 수 있고, Devices에서 카메라 영상·관절 상태·3D 모델이 모두 실제와 일치합니다."
output:
  - name: "로봇 설정 YAML 파일"
    desc: "config/ 폴더에 새 로봇의 설정 파일이 생깁니다. 카메라 토픽, 관절 토픽, 관절 순서, 관절 이름, 초기 자세, 그리퍼 설정 등이 들어갑니다. 파일 이름이 곧 로봇 타입 이름이 됩니다. UR5 예시: camera topics(Wrist/Third/Top), joint_names(shoulder_pan~wrist_3), initial_pose([0.0, -1.5708, 1.5708, -1.5708, -1.5708, 0.0])"
    path: "config/{robot_name}.yaml"
  - name: "Home 화면에 로봇 카드 추가"
    desc: "YAML 설정이 올바르면 PRISM 재시작 후 Home 화면에 새 로봇 카드가 나타납니다. 카드에 로봇 이름, DoF, 카메라 수 등이 표시됩니다"
caution: "설정 파일(YAML)만 만들면 끝이 아닙니다. 로봇마다 3D 모델(URDF) 경로, 관절 순서, 카메라 제어 방식이 다를 수 있어서 코드 수정이 추가로 필요한 경우가 많습니다. 처음이라면 기존 로봇의 YAML 파일을 복사해서 수정하는 것이 가장 안전합니다."
---

1. `config/` 폴더에 새 로봇용 YAML 파일을 만듭니다. 파일 이름이 곧 로봇 타입 이름이 됩니다. 안에는 카메라 topic, 관절 topic, 관절 순서, 초기 자세를 입력합니다. 기존 로봇 파일을 복사해서 수정하면 실수를 줄일 수 있어요.

2. 로봇 쪽에서 카메라 영상은 `CompressedImage`, 관절 상태는 `JointState`, 관절 명령은 `JointTrajectory` 형식으로 보내도록 ROS adapter를 준비합니다. 형식이 다르면 PRISM이 데이터를 인식하지 못합니다.

3. PRISM을 재시작하고 Home에서 새 로봇 카드가 보이는지 확인합니다. 카드가 보이면 선택 후 Devices 화면으로 이동해서 카메라 영상이 나오는지, 관절 상태가 맞는지, 3D 모델이 실제 로봇과 같은지 하나씩 점검하세요.

![connect 화면](../assets/connect/screenshot.png)
