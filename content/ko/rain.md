---
headline: "🚧 실시간 물체 추적 + 작업 단계 정의를 한 화면에서 하는 도구"
summary: "사이드바 이름: `RAIN`. RT-SAM의 실시간 물체 추적 기능과 작업 단계(step) 작성 기능을 합쳐 놓은 화면입니다. 물체를 추적하면서 동시에 '지금 이 단계는 접근이다, 다음은 잡기다' 같은 작업 순서를 정의하고, RAIN 모델로 추론까지 할 수 있습니다."
goal: "물체 추적 상태와 작업 단계를 함께 정리하여 실험용 sequence를 만듭니다."
done: "물체 추적 상태와 단계 정보가 담긴 task sequence가 저장됩니다."
caution: "추적이 불안정한 상태에서 sequence를 저장하면, 나중에 단계별 물체 위치가 실제와 맞지 않게 됩니다. 반드시 추적이 안정적인 것을 먼저 확인하고 나서 저장하세요."
layout:
  - name: "카메라 + 추적"
    desc: "[btn:Load Topics] 카메라 선택, [btn:Warmup] 모델 로드, [btn:Cache] [btn:Start] [btn:Stop] [btn:Track Once] 추적 제어"
  - name: "프롬프트 모드"
    desc: "[btn:Positive] [btn:Negative] [btn:Erase] [btn:Box] [btn:Rect] [btn:Draw] — RT-SAM과 동일"
  - name: "RAIN 모델"
    desc: "Progress/Action Checkpoint 경로 입력, [btn:Load Model] [btn:Run Inference]"
  - name: "작업 단계"
    desc: "[btn:Add Step] [btn:Delete Step] 으로 단계 추가/삭제, Source/Target 물체와 관계(On/In) 선택"
  - name: "Task Sequence"
    desc: "[btn:Save Task Sequence] 로 정의한 순서를 저장, [btn:Execute Step] 으로 개별 단계 실행"
---

1. [btn:Load Topics] 로 카메라 목록을 불러오고, 추적할 카메라를 선택합니다. [btn:Warmup] 으로 추적 모델을 로드합니다.

2. 영상에서 추적할 물체를 프롬프트 모드([btn:Positive], [btn:Box] 등)로 지정하고, [btn:Cache] → [btn:Start] 로 추적이 안정적인지 먼저 확인합니다. 마스크가 물체를 잘 따라가면 다음으로 넘어갑니다.

3. 작업 단계를 정의합니다. [btn:Add Step] 으로 단계를 추가하고, Source Object(잡을 물체)와 Target Object(놓을 곳)를 선택합니다. 관계는 드롭다운에서 `On`(위에) 또는 `In`(안에)을 고릅니다.

4. RAIN 모델을 사용하려면: Progress/Action Checkpoint 경로를 입력하고 [btn:Load Model] → [btn:Run Inference] 로 추론합니다. [btn:Execute Step] 으로 개별 단계를 실행할 수도 있습니다.

5. 모든 단계를 정의했으면 [btn:Save Task Sequence] 로 결과를 저장합니다.

<!-- 스크린샷을 추가하려면 아래처럼 작성하세요:
![화면 설명](../assets/rain/screenshot.png)
-->
