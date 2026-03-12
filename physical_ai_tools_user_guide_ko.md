# PRISM AI Tools 사용자 가이드 초안

이 문서는 `/home/user/LG-AI-PA/physical_ai_tools` 레포를 실제 사용자 관점에서 다시 풀어쓴 버전이다.  
핵심은 "무슨 기능이 있나"보다 "내가 지금 무엇을 하려면 어디부터 들어가야 하나"에 맞춰 설명하는 것이다.  
기술적인 세부사항은 아래쪽 부록에 따로 정리했다.

## 1. 이 레포로 할 수 있는 일

PRISM AI Tools는 실로봇 대상 Physical AI 작업을 한 화면에서 이어서 할 수 있게 만든 통합 워크스페이스다.

- 로봇과 카메라를 연결하고 상태를 확인한다.
- 텔레오퍼레이션으로 데이터를 수집한다.
- 수집한 데이터셋을 검사, 정리, 병합, 삭제, 업로드한다.
- LeRobot 기반 정책을 학습한다.
- 학습한 정책을 실제 로봇에 올려 추론한다.
- 필요하면 SAM2, Grounding DINO, 서브태스크/키프레임 도구로 후처리와 주석 작업을 한다.

한마디로 정리하면:

> "로봇 데이터 수집 -> 데이터 정리 -> 정책 학습 -> 실기기 추론"을 한 레포에서 이어서 처리하는 도구다.

## 2. 어떤 사용자에게 맞는가

이 레포는 아래 사용자에게 맞다.

- 이미 ROS 2 Jazzy 기반 로봇 환경이 있다.
- RealSense 같은 카메라 스트림을 함께 다룬다.
- LeRobot 포맷 데이터셋으로 imitation learning 또는 VLA 학습을 하고 싶다.
- 웹 UI에서 작업 상태를 보면서 운영하고 싶다.

반대로, 순수 시뮬레이션만 하거나 ROS 없이 단일 파이썬 스크립트만 원하는 경우에는 이 레포가 꽤 무겁다.

## 3. 가장 쉬운 시작 방법

추천은 Docker 실행이다.

### 빠른 시작

```bash
git clone -b jazzy https://github.com/LG-AI-PA/physical_ai_tools.git --recursive
cd physical_ai_tools/docker
docker-compose up
```

브라우저에서 `http://localhost:3000`을 열면 된다.

이 구성이 좋은 이유는 다음과 같다.

- 웹 UI와 ROS 2 서버가 같이 올라간다.
- GPU 런타임, Hugging Face 캐시, dataset 경로가 이미 연결돼 있다.
- 웹 UI가 필요로 하는 `rosbridge`와 `web_video_server`까지 서버 쪽에서 함께 쓸 수 있다.

## 4. 처음 쓸 때의 실제 순서

이 레포는 메뉴가 많지만, 실제로는 아래 순서로 쓰면 된다.

### 1) Home에서 로봇 타입 선택

가장 먼저 해야 할 일은 **로봇 타입 선택**이다.  
코드상 `Record`, `Training`, `Inference`, `Data Tools`, `Augment` 페이지는 로봇 타입이 비어 있으면 진입이 막히거나 정상 동작하지 않는다.

추천 순서:

1. `Home`
2. `Select Hardware Target`
3. 내 로봇 선택
4. `Devices`로 이동

하드웨어가 아직 없거나 ROS 연결 없이 문서/화면만 먼저 보고 싶다면 `offline_robot`도 선택 가능하다.

무엇을 누르면 되는가:

1. 로봇 카드가 안 보이면 `Refresh`
2. 사용할 로봇 카드를 클릭
3. 하단 `Launch PRISM` 클릭
4. 빠르게 특정 단계로 가고 싶으면 아래 `Record`, `Augment`, `Train`, `Inference` 워크플로 카드 클릭

### 2) Devices에서 연결 상태 확인

`Devices`는 실제 운용 전 점검 화면이다.

- 연결된 하드웨어 확인
- 카메라 상태 점검
- 조인트 상태 확인
- 시스템 리소스 확인

실제 작업 전에는 여기서 "카메라가 들어오는지", "조인트 상태가 갱신되는지", "ROS 연결이 붙는지"를 먼저 보는 편이 안전하다.

무엇을 누르면 되는가:

1. 이 페이지는 별도 `Start` 버튼 없이 자동 스캔을 기다리면 된다
2. 왼쪽 `Cameras` 목록에서 카메라 개수와 이름 확인
3. 가운데 `Joint Structure`에서 조인트 이름을 클릭해 URDF 하이라이트 확인
4. 로봇이 안 보이면 `Home`으로 돌아가 로봇 타입부터 다시 선택

### 3) Record에서 데이터 수집

`Record`는 텔레오퍼레이션 기반 데이터 수집 화면이다.

기본적으로 아래를 입력해야 시작할 수 있다.

- Task Name
- Task Instruction
- User ID
- FPS
- Warmup Time
- Episode Time
- Reset Time
- Num Episodes

화면에서 할 수 있는 일:

- 다중 카메라 영상 확인
- URDF 기반 로봇 자세 확인
- 조인트 상태 그래프 확인
- 녹화 시작/중지/재시도/다음 에피소드/초기자세 이동
- 에피소드 성공/실패 어노테이션 저장
- 필요 시 rosbag2도 같이 기록

사용 흐름은 보통 이렇다.

1. 태스크 이름과 instruction 입력
2. 사용자 ID와 에피소드 설정 입력
3. `Start`
4. 텔레오퍼레이션 수행
5. 에피소드 종료 후 성공/실패 기록
6. 다음 에피소드 진행

무엇을 누르면 되는가:

1. 필수 입력을 채운 뒤 하단 컨트롤 패널의 `Start`
2. 현재 에피소드를 중단하거나 저장 타이밍을 만들려면 `Stop`
3. 같은 에피소드를 다시 하려면 `Retry`
4. 저장 후 다음 에피소드로 넘기려면 `Next`
5. 전체 작업을 끝내려면 `Finish`
6. 로봇을 초기 자세로 보내려면 `Go to Initial`
7. 에피소드 결과 팝업이 뜨면 `SUCCESS` 또는 `FAIL` 선택
8. 실패라면 reason 버튼 선택 후 `Confirm & Continue`

자주 쓰는 단축키:

- `Space`: `Start` 또는 `Stop`
- `←`: `Retry`
- `→`: `Next`
- `Ctrl+Shift+X`: `Finish`
- `Ctrl+Shift+H`: `Go to Initial`

### 4) Data Tools에서 정리

데이터를 바로 학습에 넣기 전에 `Data Tools`를 한 번 거치는 게 좋다.

현재 UI 기준으로 가능한 작업:

- Quality Check
- Filter Dataset
- Upload & Download data
- Merge Dataset
- Delete Episodes
- Change Task Instruction
- Mask Timeline QA
- Scatter Plot

실전에서는 아래 순서를 추천한다.

1. `Quality Check`로 데이터셋 이상 여부 확인
2. 실패 에피소드나 문제 구간 정리
3. 필요하면 여러 데이터셋 병합
4. instruction 수정 또는 통일
5. Hugging Face 업로드/다운로드

무엇을 누르면 되는가:

1. 상단에서 원하는 섹션 타일을 먼저 클릭
2. `Quality Check`: 경로 입력 또는 `Browse` 후 `Check Quality`
3. `Merge Dataset`: `Add Dataset`으로 항목 추가, 각 행의 폴더 버튼으로 경로 선택, 출력 경로 지정 후 `Merge`
4. `Delete Episodes`: 데이터셋 선택, episode 번호 입력, `Preview Episodes`로 확인 후 `Delete`
5. 업로드/다운로드가 목적이면 `Upload & Download data` 섹션으로 이동

### 5) Augment에서 증강

`Augment`는 데이터 증강용 화면이다.

지금 코드 기준으로는:

- 기존 데이터셋 대상 배치 증강이 기본 흐름
- 이미지 밝기, 노이즈, 가림 등 픽셀 기반 증강이 실제 사용 가능
- "Interactive World Model" 경로는 UI는 잘 만들어져 있지만 일부는 아직 prototype 성격이 강함
- language 쪽 instruction 변형 흐름도 포함돼 있다

즉, 지금 바로 안정적으로 기대할 수 있는 것은 "오프라인 데이터셋 증강" 쪽이다.

무엇을 누르면 되는가:

1. 비전 증강이면 상단 `Vision` 클릭 후 보통 `Batch`를 사용
2. 왼쪽에서 `Pixel Augment` 또는 `Interactive World Model` 선택
3. 필요한 augmentation 체크박스를 켠다
4. 오른쪽에서 dataset 선택, ratio 조정, output folder 입력
5. 실행은 `Start Augment` 또는 `Start Synthesis`
6. instruction 증강이면 상단 `Language` 모드로 전환
7. dataset path를 잡고 `Load Tasks`
8. 수동이면 `Add instruction` 후 `Apply to Dataset`
9. LLM이면 `Generate with EXAONE` 후 `Apply Generated Instructions to Dataset`

### 6) Training에서 학습

`Training`은 학습 설정과 모니터링 화면이다.

새 학습에서 보통 필요한 항목:

- Dataset
- Policy
- Device
- Output Folder
- batch size / steps / save freq / eval freq 같은 옵션

화면에서 할 수 있는 일:

- 사용자별 데이터셋 선택
- 정책 선택
- 새 학습 / 이어서 학습 전환
- GPU 상태 확인
- loss/progress 모니터링
- 실험 이력 확인

사용 흐름:

1. 데이터셋 선택
2. 정책 선택
3. 저장 폴더 지정
4. 옵션 조정
5. `Start Training`
6. 대시보드와 history로 진행 상태 확인

무엇을 누르면 되는가:

1. `Dataset Selection`에서 `Local` 또는 `HuggingFace` 선택
2. `Refresh Users` 클릭
3. 사용자 폴더를 클릭해 펼치고 원하는 dataset 행을 클릭
4. `Policy Selection`에서 policy와 device를 선택하고 필요하면 `Refresh`
5. `Output folder name`에 이름을 적고 `Check duplicate`
6. 새 학습이면 하단 `New` 상태에서 `Start Training`
7. 이어서 학습이면 `Resume` 클릭 후 `Browse` 또는 `Edit`, 다음 `Load`, 마지막으로 `Resume Training`
8. 중지하려면 `Stop Training`
9. 지난 실험을 보려면 우측 상단 `History`

### 7) Inference에서 실제 로봇 실행

`Inference`는 학습된 정책을 실제 로봇에 올리는 화면이다.

핵심 입력:

- Task Instruction
- Policy Path

기능:

- 정책 로딩 상태 표시
- 로딩 로그 확인
- 다중 카메라 스트림 확인
- URDF 뷰어와 조인트 그래프 확인
- 추론 시작/종료
- Human Override 후 재개

즉, 운영자 입장에서는 "실기기에서 정책을 감시하면서 실행하는 화면"에 가깝다.

무엇을 누르면 되는가:

1. 오른쪽 `Task Information`에서 `Task Instruction` 입력
2. 모델 경로는 `Browse Policy Path` 또는 `Download Policy`
3. 필요하면 `FPS` 조정
4. 하단 컨트롤 패널의 `Start`로 추론 시작
5. 중간 정지는 `Stop`, 종료는 `Finish`
6. 로봇을 원위치로 보낼 때는 `Go to Initial`
7. 운영 중 사람이 개입해야 하면 `Steering` 또는 Human Override 관련 화면으로 넘어가 상태를 확인

## 5. 화면 구조를 실제 UI 기준으로 보면

이 UI는 크게 두 덩어리로 이해하면 쉽다.

- 메인 메뉴: `Home`, `Devices`, `Record`, `Training`, `Inference`
- Tools 메뉴: `Pre`, `Data`, `Annotation`, `Online`, `Advanced`

메인 메뉴는 "주 작업", Tools 메뉴는 "보조 작업"에 가깝다.  
즉, 사용자는 보통 메인 메뉴로 큰 흐름을 따라가고, 중간에 필요할 때만 Tools 쪽으로 들어간다.

무엇을 누르면 되는가:

1. 먼저 왼쪽 메인 메뉴에서 `Home` 또는 `Record` 같은 큰 작업 화면으로 들어간다
2. 후처리나 분석이 필요하면 같은 사이드바 아래쪽 `Tools` 영역으로 내려간다
3. `Pre`, `Data`, `Annotation`, `Online`, `Advanced` 아래 원하는 버튼을 누른다
4. 로봇 타입을 아직 안 골랐다면 일부 버튼은 막히므로 먼저 `Home`에서 로봇을 선택한다

### 메인 메뉴

- `Home`: 로봇 타입 선택, 전체 워크플로 진입
- `Devices`: 카메라, 조인트, 시스템 상태 확인
- `Record`: 실기기 데이터 수집
- `Training`: 정책 학습
- `Inference`: 학습 정책 실행

### Tools > Pre

이 영역은 "실험 전에 기준을 맞추는 도구"라고 생각하면 된다.

- `Calibration`: 카메라 extrinsic/TF 보정
- `GraspPose`: grasp pose 또는 foundation-pose 성격의 실험용 화면
- `Kinematics`: joint 값과 EEF pose 변환 확인

이럴 때 들어간다:

- 카메라 좌표계가 안 맞을 때
- 손끝 위치와 조인트 관계를 확인하고 싶을 때
- 실제 수집 전에 좌표계/기구학 검증이 필요할 때

### Tools > Data

이 영역은 "수집한 데이터를 보고 고치고 확인하는 도구"다.

- `Data Tools`: 품질 검사, merge, delete, instruction 수정, 업로드/다운로드
- `Visualize`: 데이터셋 구조와 프레임을 시각적으로 확인

이럴 때 들어간다:

- 학습 전에 데이터셋을 한 번 정리하고 싶을 때
- 여러 dataset을 합치고 싶을 때
- frame timeline이나 mask QA를 보고 싶을 때

### Tools > Annotation

이 영역은 "기존 데이터에 의미를 붙이는 후처리"다.

- `SAM2`: 마스크 세그멘테이션 및 추적
- `Subtask`: 에피소드를 subtask segment로 분할
- `Augment`: vision/language augmentation

이럴 때 들어간다:

- object mask가 필요할 때
- 한 에피소드를 `pick`, `place`, `push` 같은 구간으로 나누고 싶을 때
- task instruction을 늘리거나 변형하고 싶을 때

### Tools > Online

이 영역은 "실시간 실행 또는 사람 개입"에 가까운 도구다.

- `Steering`: human override/조작 보조
- `RT-SAM`: 실시간 SAM2 추적
- `RAIN`: instruction 기반 온라인 task authoring/workflow

이럴 때 들어간다:

- 정책 실행 중 사람이 개입해야 할 때
- 실시간 마스크 추적이 필요할 때
- 온라인 task sequence를 만들거나 조정할 때

### Tools > Advanced

이 영역은 상대적으로 연구/실험 성격이 강하다.

- `Detection`: Grounding DINO 기반 detection 저장
- `Embedding`: latent/feature space 분석

이럴 때 들어간다:

- frame별 detection 결과를 별도 저장하고 싶을 때
- 데이터셋이나 모델 feature를 분석하고 싶을 때

참고:

- UI에서 `GraspPose`, `Steering`, `Detection`, `Embedding`은 개발 중 표기가 붙어 있는 항목이 있다
- 따라서 "화면은 보이지만 바로 production 용도로 쓰기엔 이른 기능"이 섞여 있다고 보는 편이 안전하다

### 페이지별 핵심 기능 사용법

아래는 "각 페이지에 들어갔을 때 가장 먼저 어떤 기능을 써야 하는가" 기준으로 다시 정리한 것이다.

#### Main > `Home`

- 쓰는 이유: 로봇 타입을 고르고 전체 워크플로를 시작하는 관문이다.
- 이렇게 쓴다: `Refresh`로 목록 갱신 -> 로봇 카드 선택 -> `Launch PRISM` 클릭.
- 자주 쓰는 기능: 하단 workflow 카드를 누르면 `Record`, `Augment`, `Train`, `Inference`로 바로 이동할 수 있다.

#### Main > `Devices`

- 쓰는 이유: 뒤 페이지로 가기 전에 하드웨어/ROS 상태를 확인한다.
- 이렇게 쓴다: 카메라 스트림이 실제로 들어오는지 보고, `Joint Structure`에서 joint를 눌러 URDF highlight를 확인한다.
- 확인 포인트: 이 화면에서 stream이나 joint update가 멈춰 있으면 `Record`나 `Inference`로 바로 넘어가지 않는 편이 안전하다.

#### Main > `Record`

- 쓰는 이유: 실기기 teleop 데이터 수집의 중심 페이지다.
- 이렇게 쓴다: task/user/fps/time 설정 -> `Start` -> 작업 수행 -> `Stop` -> `SUCCESS`/`FAIL` 기록 -> `Next` 또는 `Retry`.
- 자주 쓰는 기능: `Go to Initial`은 다음 episode 전에 자세를 원위치로 보낼 때, `Finish`는 세션 전체 종료 때 쓴다.

#### Main > `Training`

- 쓰는 이유: dataset 선택, policy 설정, 새 학습/이어하기를 모두 여기서 한다.
- 이렇게 쓴다: `Local`/`HuggingFace` 선택 -> `Refresh Users` -> dataset 클릭 -> policy/device 선택 -> `Output folder name` 입력 -> `Check duplicate` -> `Start Training`.
- 이어서 학습: `Resume` -> `Browse` 또는 `Edit` -> `Load` -> `Resume Training` 순서로 간다.

#### Main > `Inference`

- 쓰는 이유: 학습된 policy를 실제 로봇에 올리고 감시하면서 실행한다.
- 이렇게 쓴다: `Task Instruction` 입력 -> `Browse Policy Path` 또는 `Download Policy` -> 로딩 로그 확인 -> `Start`.
- 자주 쓰는 기능: `Stop`은 일시 정지, `Finish`는 실행 종료, `Go to Initial`은 자세 복귀다.

#### Tools > Pre > `Calibration`

- 쓰는 이유: 카메라 extrinsic drift를 복구하거나 TF를 다시 맞출 때 쓴다.
- 이렇게 쓴다: camera/base/target/port 확인 -> `Start in Prism` -> Embedded UI에서 tip 클릭 + `Capture`를 6~10회 반복 -> `Solve`/`Compute` -> `tf_offset` 복사 -> camera YAML 반영 후 bringup 재시작.
- 보조 기능: `Copy`는 실행 명령 복사, `Open Tab`은 외부 탭으로 calibration UI 열기, `Copy Checklist`는 후처리 체크리스트 복사다.

#### Tools > Pre > `GraspPose`

- 쓰는 이유: 실시간 6D pose estimation이나 prompt-assisted pose 검증에 가깝다.
- 이렇게 쓴다: `Refresh camera topics` -> 카메라 topic 선택 -> 필요하면 SAM2 + Grounding DINO prompt assist 사용 -> pose estimate 실행 -> 오른쪽 pose result를 읽는다.
- 주의: 연구/실험 성격이 강하므로, production 기본 경로보다는 검사 워크스페이스로 보는 편이 맞다.

#### Tools > Pre > `Kinematics`

- 쓰는 이유: dataset의 joint space를 end-effector space로 바꾸거나, 이미 있는 EEF 정보를 점검한다.
- 이렇게 쓴다: dataset `Browse` -> summary와 feature 확인 -> `base_frame`, `target_frame` 선택 -> `Convert to EEF Space`.
- 다음 단계: 변환 후 `Open 3D EEF Trajectory in Visualize`로 넘어가면 trajectory를 더 직관적으로 볼 수 있다.

#### Tools > Data > `Data Tools`

- 쓰는 이유: 수집한 dataset을 학습 전에 정리하는 관리 페이지다.
- 섹션별로 이렇게 쓴다: `Quality Check`는 dataset path 지정 후 품질 검증, `Merge Dataset`은 여러 dataset을 추가해 하나로 합치기, `Delete Episodes`는 episode preview 후 삭제다.
- 나머지 기능: `Task Instruction`은 instruction 수정, `Mask Timeline QA`는 frame timeline과 SAM2 mask 비교, `Scatter Plot`은 feature 분포 확인에 쓴다.

#### Tools > Data > `Visualize`

- 쓰는 이유: dataset을 편집하지 않고 "읽기 전용으로 이해"할 때 좋다.
- 이렇게 쓴다: dataset path 선택 후 view mode를 고른다.
- 모드 해석: `Joint Graph`는 시계열, `Data Table`은 parquet raw row, `Scatter Plot`은 feature 분포, `HDF5 Viewer`는 구조/attribute, `3D EEF Trajectory`는 EEF 경로 확인용이다.

#### Tools > Annotation > `SAM2`

- 쓰는 이유: object mask를 frame/episode 단위로 만들고 추적해서 저장한다.
- 이렇게 쓴다: dataset/episode/camera 선택 -> 필요하면 `Preload SAM2` -> `Add object` -> positive/negative point 또는 box prompt 입력 -> `Predict`.
- 저장 흐름: 결과가 괜찮으면 `Track Camera` -> `Save` 또는 `Save All` -> `meta/sam2_masks/` 아래 저장.

#### Tools > Annotation > `Subtask`

- 쓰는 이유: 한 episode를 `pick`, `place`, `move` 같은 segment로 나눠 학습용 subtask annotation을 만든다.
- 이렇게 쓴다: dataset 선택 -> EEF trajectory가 로드되는지 확인 -> `Generate Subtasks (Recommended)` -> marker 수동 수정 -> `Save Subtask Annotations`.
- 실전 팁: instruction prior가 믿을 만하면 켜고, mismatch가 보이면 prior를 끄고 trajectory 기반 split만 쓰는 편이 낫다.

#### Tools > Annotation > `Augment`

- 쓰는 이유: vision 증강과 language instruction 증강을 한 화면에서 한다.
- Vision 모드 사용법: `Pixel Augment` 또는 `Interactive World Model` 선택 -> dataset/output 설정 -> `Start Augment` 또는 `Start Synthesis`.
- Language 모드 사용법: dataset 선택 -> `Load Tasks` -> 수동 추가 또는 `Generate with EXAONE` -> `Apply to Dataset`.

#### Tools > Online > `Steering`

- 쓰는 이유: inference 중 사람이 빠르게 takeover/resume 할 때 쓰는 운영자 패널이다.
- 이렇게 쓴다: 먼저 `Inference` 페이지에서 policy를 실제로 시작한 뒤 이 페이지로 온다 -> 문제가 보이면 `Take Over Now` -> 사람이 교정 -> `Return To Policy`.
- 보조 기능: intervention reason을 남길 수 있고, 최근 override event를 timeline처럼 볼 수 있다.

#### Tools > Online > `RT-SAM`

- 쓰는 이유: offline mask cache를 만든 뒤 실시간 tracking loop를 돌리는 페이지다.
- 이렇게 쓴다: `Refresh`로 camera topic 로드 -> object 추가 -> stream 위에서 click/box로 lock -> 필요하면 `Load SAM2` -> `Start Tracking` 또는 `Track Once`.
- 추천 사용법: 처음엔 `Auto Track`을 켠 상태로 `lock -> track` 흐름을 쓰고, drift가 있으면 `Track Once`로 수동 점검한다.

#### Tools > Online > `RAIN`

- 쓰는 이유: instruction, object lock, realtime tracking, sequence 저장을 한곳에서 다루는 온라인 authoring/workflow 화면이다.
- 이렇게 쓴다: camera topic `Refresh` -> task/객체 준비 -> SAM2 warmup(`Load SAM2`) -> object lock -> `Start Tracking` -> step을 정리해 `Save Sequence JSON`.
- 성격: 단순 inference page보다 실험적이지만, 온라인 task sequence authoring까지 묶어 보려는 화면이다.

#### Tools > Advanced > `Detection`

- 쓰는 이유: text prompt 기반 object detection을 여러 camera/frame에 저장하고 싶을 때 쓴다.
- 이렇게 쓴다: dataset/episode/frame 선택 -> object prompt 입력 -> threshold 조정 -> `Detect on All Cameras`.
- 저장/배치: 결과가 맞으면 `Save to meta/detections/`, dataset 전체로 돌리고 싶으면 `Batch Process All Frames`.

#### Tools > Advanced > `Embedding`

- 쓰는 이유: 학습된 model의 feature/embedding을 dataset 여러 개에 대해 비교 분석한다.
- 이렇게 쓴다: model path 선택 -> dataset 1개 이상 추가 -> `t-SNE`/`PCA`/`UMAP` 등 방법 선택 -> sample 수와 frame skip 설정 -> extraction 실행.
- 결과 해석: scatter plot을 zoom/pan 하면서 dataset별, episode별, task별로 feature cluster가 어떻게 갈리는지 본다.

## 6. 제일 자주 쓰는 3가지 시나리오

### 시나리오 A. 실로봇 데이터 수집만 하고 싶다

1. `Home`에서 로봇 선택
2. `Devices`에서 카메라/조인트 확인
3. `Record`에서 태스크와 에피소드 설정
4. 수집 후 `Data Tools -> Quality Check`

### 시나리오 B. 이미 데이터가 있고 학습만 하고 싶다

1. `Home`에서 로봇 선택
2. `Data Tools`에서 데이터셋 확인
3. `Training`에서 dataset/policy/output 설정
4. `Start Training`
5. 필요하면 `Inference`에서 체크포인트 실행

### 시나리오 C. 이미 학습된 모델을 로봇에 올리고 싶다

1. `Home`에서 로봇 선택
2. `Devices`에서 센서/조인트 확인
3. `Inference`에서 policy path 지정
4. 로딩 상태 확인
5. 실행 중 필요 시 human override 사용

## 7. 사용자 관점에서 꼭 알아둘 점

### `physical_ai_server.launch.py`만 띄우면 UI가 불완전할 수 있다

코드 기준으로 웹 UI는 `rosbridge` 웹소켓과 `web_video_server`를 기대한다.  
그래서 수동 실행 시에는 `physical_ai_server.launch.py`보다 `physical_ai_server_bringup.launch.py` 기준으로 생각하는 편이 실제 사용에 맞다.

### 브라우저는 "같은 호스트 이름" 기준으로 ROS에 붙는다

프론트엔드는 현재 브라우저 주소의 host를 읽어서 `ws://<host>:9100`으로 접속한다.  
즉, 원격 서버에서 띄웠다면 브라우저 주소도 그 서버 IP/호스트 기준으로 열어야 연결이 자연스럽다.

### 학습과 추론에서 기대할 수 있는 정책 범위가 완전히 같지는 않다

- 학습 쪽은 `act`, `diffusion`, `tdmpc`, `vqbet`, `pi0`, `pi05`, `smolvla`, `groot`가 보인다.
- 추론 로더 쪽은 현재 코드 기준 `groot`가 구현돼 있지 않다.

즉, README 수준의 "지원"과 실제 추론 경로의 "바로 동작"은 구분해서 보는 게 안전하다.

### 데이터셋은 LeRobot 구조를 기대한다

기본적으로 `meta/`, `data/`, `videos/` 같은 구조를 가진 LeRobot 데이터셋을 기준으로 설계돼 있다.  
특히 training, visualization, quality check는 이 전제를 강하게 사용한다.

## 8. 이 페이지를 쓰면 어떤 파일이 남는가

작업 후 어디를 확인해야 하는지만 먼저 빠르게 정리하면 아래와 같다.

### Training

- 기본 위치: `/root/ros2_ws/src/physical_ai_tools/lerobot/outputs/train/<output_folder>/`
- 내가 `Training` 페이지에서 넣은 `Output folder name`이 `<output_folder>`가 된다
- 여기 아래에 `train_config.json`, `logs/`, checkpoint/모델 폴더가 생긴다

### Subgoal Annotation

- 저장 위치: `<dataset_path>/annotations/episode_000000.json`
- 한 에피소드의 subgoal frame, phase, description, gripper trajectory를 저장한다

### Subtask

- 저장 위치: `<dataset_path>/annotations/task_sequences/episode_0000.json`
- 한 에피소드를 여러 subtask segment로 나눈 결과를 저장한다

### SAM2

- 저장 위치: `<dataset_path>/meta/sam2_masks/episode_0000/<camera>/`
- 저장 형식은 `masks.npz` 또는 `frame_000123.png` 묶음이 될 수 있다
- 같이 `object_map.json`, `bboxes.json`, `objects/` 하위 폴더가 생긴다

### Detection

- 저장 위치: `<dataset_path>/meta/detections/episode_0000/frame_0000/<camera>/`
- `detections.json`, `visualization.png`, `annotated_image.png`, object mask PNG들이 저장된다

### Augment > Language

- 저장 위치: 보통 `<dataset_path>/meta/tasks.parquet`
- 구버전 호환 데이터셋이면 `<dataset_path>/meta/tasks.jsonl`도 함께 갱신된다
- 내용은 `task_index`, `task` 쌍의 리스트다

## 9. 기술 부록

아래는 구현 관점에서 알아두면 좋은 내용이다.

### 아키텍처

상단은 React 웹 UI, 중간은 ROS 2 Python 서버, 하단은 실제 로봇/카메라/LeRobot/Hugging Face로 이어진다.

- 프론트엔드: `physical_ai_manager`
- 백엔드: `physical_ai_server`
- 인터페이스 정의: `physical_ai_interfaces`
- rosbag 기록기: `rosbag_recorder`
- 학습 라이브러리: `lerobot` 서브트리

### 주요 포트

- 웹 UI: `3000`
- rosbridge websocket: `9100`
- web_video_server: `8081`

### Docker 쪽에서 연결되는 주요 볼륨

- `./huggingface -> /root/.cache/huggingface`
- `../ -> /root/ros2_ws/src/physical_ai_tools/`
- `./workspace -> /workspace`
- `/dev -> /dev`

즉, 데이터셋과 Hugging Face 캐시를 컨테이너 안팎에서 함께 쓰는 구조다.

### 수동 실행 시 기본 흐름

```bash
colcon build --symlink-install
source install/setup.bash
ros2 launch physical_ai_server physical_ai_server_bringup.launch.py

cd physical_ai_manager
npm install
npm start
```

### 현재 코드 기준 지원 로봇 설정 파일

- `physical_ai_server/config/omy_f3m_config.yaml`
- `physical_ai_server/config/omx_f_config.yaml`
- `physical_ai_server/config/ffw_bg2_rev4_config.yaml`
- `physical_ai_server/config/ffw_sg2_rev1_config.yaml`

### 학습 정책

`TrainingManager` 기준:

- `act`
- `diffusion`
- `tdmpc`
- `vqbet`
- `pi0`
- `pi0fast`
- `pi05`
- `smolvla`
- `groot`

추가로, 코드상 아래 정책은 새 학습 시작 시 Hugging Face Hub 접근을 전제로 둔다.

- `pi0`
- `pi05`
- `pi0fast`
- `smolvla`
- `groot`

### 추론 정책

`InferenceManager` 기준:

- `act`
- `diffusion`
- `tdmpc`
- `vqbet`
- `pi0`
- `pi05`
- `pi0fast`
- `smolvla`

추론용 policy 폴더는 최소한 아래 파일을 갖고 있어야 검증을 통과한다.

- `config.json`
- `policy_preprocessor.json`
- `policy_postprocessor.json`

### UI에서 실제로 호출하는 핵심 서비스

- `/task/command`
- `/training/command`
- `/get_robot_types`
- `/set_robot_type`
- `/training/get_dataset_list`
- `/training/get_user_list`
- `/training/get_training_info`
- `/system/gpu_status`

### 데이터 경로 관련 기본값

프론트엔드 기본 경로 기준:

- dataset root: `/root/ros2_ws/src/physical_ai_tools/docker/huggingface/lerobot/`
- policy output root: `/root/ros2_ws/src/physical_ai_tools/lerobot/outputs/train/`

백엔드 학습 매니저는 로컬 데이터셋을 찾을 때 아래 경로를 순서대로 탐색한다.

- `/workspace/datasets`
- `/root/ros2_ws/src/physical_ai_tools/docker/huggingface/lerobot`
- `/root/.cache/huggingface/lerobot`
- `~/.cache/huggingface/lerobot`

### Training 페이지 output과 파일 형식

가장 먼저 보는 기준은 아래 두 파일이다.

- `train_config.json`: resume/load용 원본 학습 설정
- `logs/training_summary.json`: 학습 결과 요약

보통 결과 폴더는 아래처럼 생긴다.

```text
/root/ros2_ws/src/physical_ai_tools/lerobot/outputs/train/<output_folder>/
  train_config.json
  logs/
    training_config.json
    training_metrics.csv
    checkpoints.csv
    evaluation_log.csv
    training_summary.json
```

참고:

- `evaluation_log.csv`는 eval이 실제로 돌았을 때만 생길 수 있다
- 모델/체크포인트 폴더 구조는 LeRobot 출력 구조를 따라 추가로 생긴다
- `Inference` 페이지에 넣는 경로는 실험 루트 전체가 아니라 `config.json`, `policy_preprocessor.json`, `policy_postprocessor.json`이 있는 실제 policy 디렉토리여야 한다

#### 1) `train_config.json`

`Training` 페이지의 `Resume`와 설정 복원 쪽에서 사실상 기준이 되는 파일이다.  
코드상 최소한 아래 필드들이 있으면 UI 복원이 가능하다.

```json
{
  "dataset": {
    "repo_id": "lg_ai_pa/pick_red_cup",
    "root": "/root/ros2_ws/src/physical_ai_tools/docker/huggingface/lerobot/lg_ai_pa/pick_red_cup"
  },
  "policy": {
    "type": "act",
    "device": "cuda",
    "push_to_hub": false
  },
  "output_dir": "/root/ros2_ws/src/physical_ai_tools/lerobot/outputs/train/pick_red_cup_act_001",
  "seed": 1000,
  "num_workers": 4,
  "batch_size": 8,
  "steps": 100000,
  "eval_freq": 20000,
  "log_freq": 200,
  "save_freq": 1000
}
```

실제 파일은 이보다 더 길 수 있다.  
특히 policy/dataset 내부에 LeRobot 설정 필드가 더 들어갈 수 있다.

#### 2) `logs/training_config.json`

이 파일은 `TrainingLogger`가 별도로 남기는 요약형 설정 파일이다.

```json
{
  "policy_type": "act",
  "dataset": "lg_ai_pa/pick_red_cup",
  "start_time": "2026-03-11T10:15:03.123456",
  "output_dir": "/root/ros2_ws/src/physical_ai_tools/lerobot/outputs/train/pick_red_cup_act_001",
  "config": {
    "policy": {
      "type": "act",
      "device": "cuda"
    },
    "dataset": {
      "repo_id": "lg_ai_pa/pick_red_cup"
    },
    "batch_size": 8,
    "steps": 100000
  }
}
```

읽는 법:

- 위쪽 4개 필드는 실험 목록 카드에서 보기 좋은 요약
- `config` 아래는 실제 학습 설정 전체를 JSON 가능한 형태로 직렬화한 값

#### 3) `logs/training_summary.json`

학습이 끝나면 남는 최종 요약 파일이다.

```json
{
  "policy_type": "act",
  "dataset": "lg_ai_pa/pick_red_cup",
  "start_time": "2026-03-11T10:15:03.123456",
  "end_time": "2026-03-11T12:02:44.456789",
  "duration_seconds": 6461.33,
  "duration_formatted": "1:47:41.333333",
  "total_steps": 100000,
  "best_loss": 0.0214,
  "best_step": 84200,
  "final_loss": 0.0241,
  "avg_loss": 0.0837,
  "status": "completed",
  "error": null
}
```

실패하면 `status`가 `error`가 되고 `error` 문자열이 채워진다.

#### 4) `logs/training_metrics.csv`

step별 로그는 CSV로 저장된다.  
기본 컬럼은 아래와 같다.

```text
timestamp,step,loss,gradient_norm,learning_rate,update_time_s,data_time_s,samples,epochs
```

추가 metric이 있으면 뒤에 컬럼이 더 붙는다.

### Annotation 계열 페이지 output과 파일 형식

실제로 많이 보게 되는 것은 `Subgoal`, `Subtask`, `SAM2`, `Augment > Language`다.  
`Detection`은 UI상 `Advanced`에 있지만 결과 파일은 annotation workflow에서 함께 보는 경우가 많다.

#### 1) Subgoal Annotation JSON

저장 위치:

```text
<dataset_path>/annotations/episode_000000.json
```

대표 예시는 아래와 같다.

```json
{
  "episode_index": 0,
  "camera": "observation.images.top",
  "fps": 30,
  "total_frames": 150,
  "subgoals": [
    {
      "frame": 15,
      "phase": "approach",
      "description": "cup 쪽으로 접근",
      "confidence": 0.92,
      "is_manual": false,
      "gripper_position": [128.0, 200.0]
    },
    {
      "frame": 54,
      "phase": "grasp",
      "description": "cup grasp",
      "confidence": 1.0,
      "is_manual": true,
      "gripper_position": [133.0, 214.0]
    }
  ],
  "gripper_trajectory": [
    [0, 126.0, 198.0],
    [1, 127.0, 199.0]
  ],
  "object_tracks": {},
  "annotated_at": "2026-03-11T02:33:10.000000Z",
  "annotator": "manual"
}
```

핵심 필드:

- `subgoals`: 프레임 단위 핵심 시점 목록
- `phase`: `approach`, `grasp`, `move`, `place` 같은 단계명
- `gripper_position`: 해당 frame의 2D gripper 위치
- `gripper_trajectory`: `[frame, u, v]` 형식의 전체 궤적

#### 2) Subtask JSON

저장 위치:

```text
<dataset_path>/annotations/task_sequences/episode_0000.json
```

대표 예시는 아래와 같다.

```json
{
  "episodes": {
    "12": {
      "episode_index": 12,
      "frames": {},
      "subtask_segments": [
        {
          "start_frame": 18,
          "end_frame": 54,
          "skill_type": "pick",
          "action_type": "grasp",
          "primary_object_id": "1",
          "primary_object": "cup",
          "target_object_id": "",
          "target_object": "",
          "description": "pick up cup",
          "action_change_frame": 54,
          "phases": ["approach", "grasp"]
        },
        {
          "start_frame": 55,
          "end_frame": 103,
          "skill_type": "place",
          "action_type": "release",
          "primary_object_id": "1",
          "primary_object": "cup",
          "target_object_id": "2",
          "target_object": "tray",
          "description": "place cup on tray",
          "action_change_frame": 92,
          "phases": ["transport", "release"]
        }
      ]
    }
  }
}
```

읽는 법:

- top-level `episodes`는 episode index를 문자열 key로 쓴다
- 실제 핵심은 `subtask_segments` 배열이다
- 각 segment는 `start_frame`, `end_frame`, `skill_type`, object 정보, 설명을 가진다

#### 3) SAM2 저장 결과

저장 위치:

```text
<dataset_path>/meta/sam2_masks/episode_0000/<camera>/
  object_map.json
  bboxes.json
  masks.npz
  objects/
    object_0001_cup/
      masks.npz
      bboxes.json
```

또는 PNG 저장 모드면 `masks.npz` 대신 `frame_000123.png` 묶음이 생긴다.

`object_map.json` 예시:

```json
{
  "objects": {
    "1": {
      "object_id": 1,
      "object_name": "cup",
      "folder": "object_0001_cup"
    }
  }
}
```

`bboxes.json` 예시:

```json
{
  "format": "xyxy",
  "normalized": true,
  "image_width": 640,
  "image_height": 480,
  "object_name_map": {
    "1": "cup"
  },
  "frames": {
    "frame_000042": {
      "1": {
        "x1": 76,
        "y1": 86,
        "x2": 217,
        "y2": 268,
        "x1_norm": 0.119,
        "y1_norm": 0.180,
        "x2_norm": 0.340,
        "y2_norm": 0.560
      }
    }
  }
}
```

읽는 법:

- root `bboxes.json`은 "프레임 기준" bbox 모음
- `objects/<object_name>/bboxes.json`은 "객체 기준" bbox 모음
- `masks.npz`는 frame key별 index mask를 압축 저장한 묶음

#### 4) Detection 저장 결과

저장 위치:

```text
<dataset_path>/meta/detections/episode_0003/frame_0042/top/
  detections.json
  visualization.png
  annotated_image.png
  mask_index.png
  object_001_red_cup_0_mask.png
```

`detections.json` 예시:

```json
{
  "timestamp": "2026-03-11T12:34:56",
  "episode_index": 3,
  "frame_index": 42,
  "camera": "observation.images.top",
  "image_shape": [480, 640, 3],
  "mask_encoding": "object_id_index",
  "detections": [
    {
      "index": 0,
      "object_id": 1,
      "label": "red cup",
      "confidence": 0.91,
      "bbox_normalized": [0.12, 0.18, 0.34, 0.56],
      "has_mask": true,
      "bbox_pixels": [76, 86, 217, 268],
      "mask_file": "object_001_red_cup_0_mask.png"
    }
  ],
  "object_name_map": {
    "1": "red cup"
  },
  "mask_index_file": "mask_index.png"
}
```

읽는 법:

- `bbox_normalized`는 0~1 기준 좌표
- `bbox_pixels`는 실제 이미지 픽셀 좌표
- `mask_index_file`은 object id를 픽셀값으로 가지는 합성 마스크

#### 5) Augment > Language task 파일

저장 위치:

```text
<dataset_path>/meta/tasks.parquet
<dataset_path>/meta/tasks.jsonl
```

코드상 task schema는 아래 리스트 형식이다.

```json
[
  {
    "task_index": 0,
    "task": "pick up the red cup"
  },
  {
    "task_index": 1,
    "task": "place the cup on the tray"
  }
]
```

동작 특징:

- 저장할 때 `task_index`는 연속 번호로 다시 정렬된다
- v3 데이터셋이면 `tasks.parquet`가 기본
- v2.1 호환 파일이 있으면 `tasks.jsonl`도 함께 갱신된다

## 10. 짧게 결론

이 레포는 "로봇용 LeRobot 운영 콘솔"로 이해하면 가장 쉽다.

- 하드웨어를 고르고
- 데이터를 모으고
- 데이터를 정리하고
- 정책을 학습하고
- 실제 로봇에서 다시 실행한다

처음 쓰는 사용자에게는 `Home -> Devices -> Record -> Data Tools -> Training -> Inference` 순서가 가장 쉽고,  
조금 익숙해진 뒤에는 `Tools > Pre / Data / Annotation / Online / Advanced`를 "보조 작업 묶음"으로 이해하면 헷갈림이 줄어든다.
