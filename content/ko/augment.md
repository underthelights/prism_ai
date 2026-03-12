---
headline: "데이터가 부족할 때 — 이미지와 지시문을 다양하게 늘려주는 화면"
summary: "녹화 데이터가 적으면 학습이 잘 안 됩니다. 이 화면에서는 기존 데이터를 바탕으로 이미지를 변형하거나(Vision), 작업 지시문을 다양하게 바꿔서(Language) 데이터를 늘립니다. 원본은 그대로 두고 새로운 변형 데이터를 추가하는 방식이에요."
goal: "학습 데이터의 양과 다양성을 안전하게 늘립니다."
done: "증강된 이미지 데이터셋 또는 다양하게 변형된 작업 지시문이 저장됩니다."
caution: "이미지를 너무 과하게 변형하면(예: 밝기를 극단적으로 바꾸기) 실제 카메라 영상과 달라져서 오히려 학습 품질이 떨어집니다. 미리보기로 '이게 실제 카메라에서 나올 법한 영상인가?'를 확인하세요. 지시문 변형도 원래 의미가 바뀌지 않았는지 하나씩 읽어보세요."
layout:
  - name: "모드 탭"
    desc: "[btn:Vision] / [btn:Language] 두 가지 모드 중 하나를 선택합니다"
  - name: "Vision — Pixel Augment"
    desc: "개별 변환 토글 + 세기 슬라이더: [btn:Lightness] [btn:Salt & Pepper] [btn:Gaussian] [btn:Blur] [btn:Color Jitter] [btn:Disturbance]"
  - name: "Vision — View Transfer"
    desc: "합성 카메라 변환: 백엔드 선택 [btn:Local Warp MVP] [btn:Interactive World Model] [btn:Custom Adapter] + Strength, Sway, Zoom 슬라이더"
  - name: "Vision — 서브탭"
    desc: "[btn:Stream] 은 실시간 미리보기, [btn:Batch] 는 전체 데이터셋에 일괄 적용"
  - name: "Language 설정"
    desc: "작업 지시문 목록 + [btn:Manual Input] 직접 추가 또는 [btn:LLM] 으로 EXAONE AI가 자동 생성"
---

1. 상단에서 무엇을 늘릴지 고릅니다: [btn:Vision] 은 이미지 변형, [btn:Language] 는 지시문 변형입니다.

2. **Vision — Pixel Augment**: 원하는 변환을 토글로 켭니다. [btn:Lightness](밝기), [btn:Salt & Pepper](점 노이즈), [btn:Gaussian](가우시안 노이즈), [btn:Blur](흐림), [btn:Color Jitter](색조 변환), [btn:Disturbance](왜곡) 각각의 세기를 슬라이더로 조절합니다. [btn:Stream] 탭에서 미리보기로 결과가 자연스러운지 확인하세요.

3. **Vision — View Transfer** (선택): 합성 카메라 시점을 만들고 싶으면 View Transfer를 켜고 백엔드를 고릅니다 — [btn:Local Warp MVP], [btn:Interactive World Model], [btn:Custom Adapter]. Source Camera, Strength, Sway, Zoom 슬라이더와 Synthetic Camera Suffix를 설정합니다.

4. 설정이 끝나면 [btn:Batch] 탭으로 이동합니다. 데이터셋을 선택하고, 증강 비율(Augmentation Ratio)과 출력 폴더를 정한 뒤 [btn:Start Batch Augmentation] 을 눌러 실행합니다.

5. **Language 모드**: 데이터셋을 선택하고 [btn:Load Tasks] 로 기존 지시문을 불러옵니다. [btn:Manual Input] 으로 직접 새 표현을 추가하거나, [btn:LLM] 을 선택해 EXAONE 모델명과 원본 지시문을 입력하고 [btn:Compose Variants] 로 AI가 다양한 변형을 만들게 합니다. 생성된 지시문을 하나씩 검토한 뒤 [btn:Apply to Dataset] 으로 저장합니다.

6. 증강이 끝나면 Visualize나 Data Tools에서 결과를 다시 확인하세요. 변형 데이터가 원본과 너무 다르면 빼는 것이 나을 수도 있습니다.

<!-- 스크린샷을 추가하려면 아래처럼 작성하세요:
![화면 설명](../assets/augment/screenshot.png)
-->
