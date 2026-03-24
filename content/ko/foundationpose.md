---
headline: "🚧 물체가 3D 공간에서 정확히 어디에, 어떤 방향으로 있는지 확인하는 화면"
summary: "사이드바 이름: `GraspPose`. 카메라 영상에서 물체의 3D 위치(XYZ)와 방향(회전)을 AI가 추정합니다. 로봇이 물체를 잡으려면 정확한 위치·방향 정보가 필요한데, 이 화면에서 그 정보를 실시간으로 확인하고 테스트할 수 있습니다."
goal: "대상 물체의 정확한 3D 위치와 방향(6D 포즈)을 확인합니다."
done: "물체의 Position(위치), Quaternion(회전), Transform Matrix(변환 행렬)가 화면에 표시됩니다."
output:
  - name: "6D 포즈 결과 (화면 표시)"
    desc: "물체의 3D 위치와 방향이 세 가지 형태로 표시됩니다: Position(x, y, z 미터 단위), Quaternion(qx, qy, qz, qw 회전값), Transform Matrix(4x4 동차 변환 행렬). 로봇이 물체를 잡을 때 이 정보가 필요합니다"
  - name: "Raw Response JSON"
    desc: "FoundationPose 모델의 전체 응답이 JSON으로 표시됩니다. 포즈 추정 결과, 신뢰도, 사용된 프롬프트 정보 등이 포함됩니다. Latency(추정 소요 시간)도 함께 표시됩니다"
  - name: "Auto Run 연속 결과"
    desc: "Auto Run을 켜면 설정한 간격(ms)으로 반복 추정합니다. 물체를 움직이면서 포즈가 안정적으로 따라가는지 확인할 수 있습니다"
caution: "카메라 영상 품질이 나쁘거나 물체 프롬프트가 부정확하면 포즈 결과가 튀거나 불안정합니다. 깨끗한 영상 + 정확한 물체 이름이 핵심입니다. 조명이 어두운 환경에서는 결과가 불안정할 수 있습니다."
layout:
  - name: "카메라 선택"
    desc: "RGB Topic 드롭다운에서 카메라를 선택합니다. [btn:Refresh] 로 목록 갱신"
  - name: "물체 정보 입력"
    desc: "Object Name 텍스트 입력, Object Prompt 텍스트 입력, Mesh Path(선택) 텍스트 입력"
  - name: "임계값 조정"
    desc: "Box Threshold(0~1), Text Threshold(0~1), Fallback Radius(0.001~0.2) 숫자 입력"
  - name: "버튼 영역"
    desc: "[btn:Refresh] [btn:Prompt Assist] SAM2+DINO 자동 보조, [btn:Sync JSON] 요청 동기화, [btn:Estimate Once] 1회 추정"
  - name: "자동 실행"
    desc: "`Auto Run` 체크박스 + 실행 간격(ms) 설정으로 반복 추정"
  - name: "카메라 미리보기"
    desc: "오른쪽 상단 — 라이브 영상 [btn:Reload]"
  - name: "포즈 결과"
    desc: "오른쪽 하단 — Position(m), Quaternion, Transform Matrix(4x4), Raw Response JSON + Latency 표시"
---

1. [btn:Refresh] 를 눌러 카메라 목록을 불러오고, 물체가 보이는 카메라를 RGB Topic 드롭다운에서 선택합니다.

2. Object Name과 Object Prompt를 입력합니다. 물체를 정확하게 잡기 어렵다면 [btn:Prompt Assist] 를 눌러 SAM2 + Grounding DINO 기반 자동 보조를 사용합니다. 3D Mesh 파일이 있으면 Mesh Path도 입력하세요. Box Threshold와 Text Threshold로 검출 민감도를 조정합니다.

3. [btn:Estimate Once] 를 눌러 포즈 추정을 실행합니다. 반복 추정이 필요하면 `Auto Run` 체크박스를 켜고 간격(ms)을 설정하세요.

4. [area:포즈 결과] 에서 Position(XYZ 위치), Quaternion(회전), Transform Matrix(4x4 변환 행렬)를 확인합니다. Raw Response에서 전체 JSON 응답도 볼 수 있고, Latency로 추정 속도를 확인합니다.

![foundationpose 화면](../assets/foundationpose/screenshot.png)
