---
headline: "🚧 학습된 모델이 데이터를 어떻게 이해하고 있는지 2D 지도로 보는 화면"
summary: "모델이 서로 다른 데이터를 구분하고 있는지 궁금할 때 이 화면을 씁니다. 모델 체크포인트와 데이터셋을 선택하면, 모델이 내부적으로 만든 벡터(embedding)를 2D 산점도로 시각화합니다. 비슷한 데이터끼리 뭉쳐 있으면 모델이 잘 구분하고 있다는 뜻이에요."
goal: "모델이 서로 다른 작업/에피소드/데이터셋을 얼마나 잘 구분하는지 시각적으로 확인합니다."
done: "데이터셋별, 에피소드별, 작업별로 색이 다른 산점도를 볼 수 있습니다."
caution: "산점도가 예쁘게 분리되었다고 모델 성능이 좋은 건 아닙니다. 이 화면은 해석을 돕는 보조 도구이지, 성능 지표가 아닙니다. 실제 로봇 테스트(Inference)와 함께 판단하세요."
layout:
  - name: "모델 선택"
    desc: "[btn:Browse] 로 체크포인트 선택. 저장된 모델 드롭다운 또는 경로 직접 입력. [btn:Refresh] 로 목록 갱신"
  - name: "데이터셋 추가"
    desc: "[btn:Add Dataset] 으로 비교할 데이터셋을 1개 이상 추가 (삭제는 각 행의 [btn:Delete])"
  - name: "시각화 설정"
    desc: "Method 드롭다운: t-SNE / PCA / UMAP. Color by 드롭다운: Dataset / Episode / Task. Max samples, Frame skip 숫자 입력"
  - name: "산점도"
    desc: "오른쪽에 결과 그래프 + [btn:Zoom In] [btn:Zoom Out] [btn:Reset View] 로 세부 확인"
  - name: "진행 표시"
    desc: "추출 중 진행률 바와 처리된 샘플 수가 표시됩니다"
---

1. [btn:Browse] 로 분석할 모델 체크포인트를 선택합니다. 저장된 모델 드롭다운에서 바로 고르거나, 경로를 직접 입력할 수도 있습니다. 목록이 안 보이면 [btn:Refresh] 를 누르세요.

2. [btn:Add Dataset] 으로 비교하고 싶은 데이터셋을 1개 이상 추가합니다. 여러 데이터셋을 넣으면 어떤 데이터끼리 비슷한지 한눈에 볼 수 있습니다. 필요 없는 데이터셋은 [btn:Delete] 로 제거합니다.

3. 시각화 방법을 고릅니다 — Method 드롭다운에서 `t-SNE`, `PCA`, `UMAP` 중 택1. Color by 드롭다운에서 색상 기준을 `Dataset`, `Episode`, `Task` 중 선택합니다. Max samples와 Frame skip 값도 설정합니다. t-SNE를 고르면 Perplexity, UMAP을 고르면 n_neighbors 추가 옵션이 나타납니다.

4. [btn:Extract Embeddings] 를 누르면 추출이 시작됩니다. 진행률 바와 처리된 샘플 수가 표시됩니다. 완료되면 오른쪽에 산점도가 나타납니다.

5. 산점도에서 [btn:Zoom In], [btn:Zoom Out], [btn:Reset View] 로 세부 영역을 확인합니다. 점 위에 마우스를 올리면 해당 데이터의 상세 정보가 나옵니다.

<!-- 스크린샷을 추가하려면 아래처럼 작성하세요:
![화면 설명](../assets/embedding/screenshot.png)
-->
