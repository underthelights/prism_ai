---
headline: "실시간 카메라로 물체를 잠그고 따라가는 추적 테스트 화면"
summary: "사이드바 이름: `RT-SAM`. SAM2와 달리 녹화된 영상이 아니라 지금 라이브 카메라 영상에서 물체를 추적합니다. 물체를 클릭해서 잠그면, 카메라가 움직이거나 물체가 이동해도 마스크가 따라갑니다. 추적 품질을 실시간으로 테스트할 때 사용합니다."
goal: "실시간 카메라 영상에서 물체 마스크가 안정적으로 유지되는지 확인합니다."
done: "추적이 안정적인지, 표류(drift)가 있는지 실시간으로 판단할 수 있습니다."
caution: "카메라 영상이 끊기거나 지연이 큰 상태에서 물체를 잠그면 추적이 처음부터 불안정합니다. 영상이 매끄럽게 나올 때 잠금하세요. 또한 물체가 화면 밖으로 나가면 추적이 끊길 수 있습니다."
layout:
  - name: "카메라 선택"
    desc: "[btn:Load Topics] 로 사용 가능한 카메라 목록을 불러옵니다"
  - name: "프롬프트 모드"
    desc: "[btn:Positive](+) [btn:Negative](-) [btn:Erase](.) [btn:Box](B) [btn:Rect](박스=마스크) [btn:Draw](드래그 경로) — 키보드 단축키로 전환"
  - name: "라이브 뷰어"
    desc: "영상 위에서 프롬프트 모드에 따라 물체를 지정합니다"
  - name: "추적 컨트롤"
    desc: "[btn:Warmup] 모델 로드, [btn:Cache] 마스크 캐시, [btn:Track Once] 한 프레임, [btn:Start] 연속 추적, [btn:Stop] 중단"
  - name: "표시 옵션"
    desc: "Show Mask Overlay, Show Only Active Mask, Show Tracked BBoxes 토글 + Mask Opacity, Poll Interval, Fallback Radius Scale 슬라이더"
  - name: "상태 표시"
    desc: "추적 성공/거부 카운터, 지연 시간(latency), 모델 상태가 표시됩니다"
---

1. [btn:Load Topics] 를 눌러 사용 가능한 카메라 목록을 불러오고, 추적할 영상이 나오는 카메라를 선택합니다.

2. [btn:Warmup] 으로 SAM2 모델을 먼저 로드합니다. 그 다음 프롬프트 모드를 고릅니다: [btn:Positive] (`+`)로 물체 클릭, [btn:Box] (`B`)로 박스 지정, [btn:Rect] 는 박스 전체를 마스크로, [btn:Draw] 는 드래그 경로를 따라 마스크를 그립니다. [btn:Negative] (`-`)로 제외할 영역, [btn:Erase] (`.`)로 잘못 찍은 점을 지웁니다.

3. [btn:Cache] 로 현재 마스크를 캐시한 뒤, [btn:Start] 를 누르면 실시간 추적이 시작됩니다. 마스크가 물체를 계속 잘 따라가는지 지켜봅니다. 잠깐만 테스트하려면 [btn:Track Once] 로 한 프레임만 추적할 수도 있어요.

4. 추적 중에 마스크가 흔들리면 [btn:Stop] 으로 멈추고 물체를 다시 클릭해서 잠금을 갱신합니다. Poll Interval과 Mask Opacity 슬라이더로 추적 속도와 표시를 조정할 수 있습니다.

<!-- 스크린샷을 추가하려면 아래처럼 작성하세요:
![화면 설명](../assets/rtsam/screenshot.png)
-->
