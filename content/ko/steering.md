---
headline: "🚧 로봇이 이상하게 움직일 때 — 사람이 직접 끼어들어 교정하는 비상 화면"
summary: "Inference에서 로봇이 자율로 움직이는 중에 위험하거나 이상한 동작이 보이면, 이 화면에서 사람이 직접 제어권을 가져옵니다. [btn:Take Over Now]를 눌러 사람 모드로 전환하고, 리더 로봇으로 교정한 뒤, [btn:Return To Policy]로 다시 AI에게 넘겨줍니다."
goal: "위험한 동작을 즉시 멈추고, 사람이 직접 교정한 뒤, 안전하게 복귀하거나 종료합니다."
done: "사람 개입으로 상황을 교정한 뒤 자율 실행에 복귀하거나, 안전하게 종료된 상태입니다."
caution: "개입이 늦으면 로봇이 물체를 떨어뜨리거나 주변과 충돌할 수 있습니다. 이상한 느낌이 들면 주저하지 말고 바로 [btn:Take Over Now]를 누르세요. 늦게 개입하는 것보다 일찍 개입하는 것이 항상 안전합니다."
layout:
  - name: "상태 표시"
    desc: "현재 모드 뱃지: AUTO RUNNING(자율 실행 중, 초록) / HUMAN OVERRIDE(사람 제어 중, 주황) / IDLE(대기 중, 회색)"
  - name: "3단계 안내 카드"
    desc: "01 Inference 시작 → 02 Take Over → 03 Return — 개입 흐름을 시각적으로 보여줍니다"
  - name: "개입 이유 선택"
    desc: "[btn:Unsafe motion] [btn:Pose drift] [btn:Wrong affordance] [btn:Grasp slip] [btn:Human judgment] — 이유를 먼저 선택 후 개입"
  - name: "액션 버튼"
    desc: "[btn:Open Inference] Inference로 이동, [btn:Take Over Now] 사람 제어 전환, [btn:Return To Policy] AI에게 복귀"
  - name: "런타임 정보"
    desc: "현재 Task, Policy, Episode 번호, 개입 이유, 최근 이벤트 기록이 표시됩니다"
---

1. 이 화면은 Inference에서 정책이 실행 중일 때만 의미가 있습니다. 아직 Inference를 시작하지 않았다면 [btn:Open Inference] 를 눌러 먼저 정책을 실행하세요.

2. 로봇 동작에 문제가 보이면, 먼저 왜 개입하는지 이유를 선택합니다: [btn:Unsafe motion](위험한 움직임), [btn:Pose drift](자세 틀어짐), [btn:Wrong affordance](잘못된 접근), [btn:Grasp slip](물체 놓침), [btn:Human judgment](직감적 판단) 중 하나를 고르세요. 이 기록은 나중에 문제 분석에 쓰입니다.

3. [btn:Take Over Now] 를 누릅니다. 상태 뱃지가 `HUMAN OVERRIDE` 로 바뀌면서 사람 제어 모드가 됩니다. 이제 리더 로봇을 잡고 직접 교정 동작을 수행하세요.

4. 교정이 끝나면 [btn:Return To Policy] 로 다시 AI 자율 실행에 넘겨주거나, 상황이 안 좋으면 그대로 사람이 계속 제어해도 됩니다. 런타임 정보에서 현재 Task, Episode, 최근 이벤트를 확인할 수 있습니다.

![steering 화면](../assets/steering/screenshot.png)
