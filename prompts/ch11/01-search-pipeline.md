Title at top in bold Chinese: "搜索系统全景：三路召回 + 四级重排"

A left-to-right flow diagram showing the complete search pipeline, divided into two major phases.

LEFT SIDE — "召回阶段" (Recall Phase):
A rounded box labeled "用户查询" with a search icon.
Three parallel arrows fan out from it, each going to a separate lane:

Lane 1 (pale blue fill): "FieldWeighted 字段加权"
  Tags inside: "trigger ×5.0", "title ×3.0", "tags ×2.0", "IDF ×1.5"
  Bottom label: "精确匹配 · 毫秒级"

Lane 2 (pale green fill): "HNSW 向量语义"
  Tags inside: "768-dim", "cosine", "efSearch=100"
  Bottom label: "语义理解 · 毫秒级"

Lane 3 (pale orange fill): "BM25 关键词"
  Tags inside: "k1=1.2", "b=0.75", "TF-IDF"
  Bottom label: "经典检索 · 微秒级"

Three lanes converge into a diamond shape labeled "RRF 融合" with annotation "k=60 · 排名融合 · 不需要分数归一化".

CENTER — "重排阶段" (Reranking Phase):
Four vertically stacked boxes connected by downward arrows, each slightly wider than the previous:

Box 1 (pale purple): "Level 1: CrossEncoder AI 重排"
  Annotation: "40 candidates · LLM 评分 · 降级 Jaccard"

Box 2 (pale blue): "Level 2: CoarseRanker 五维粗排"
  Five small pills inside: "recall 0.45", "semantic 0.3", "freshness 0.15", "popularity 0.1", "quality 0"

Box 3 (pale yellow): "Level 3: MultiSignalRanker 六信号精排"
  Six small pills: "relevance", "authority", "recency", "popularity", "difficulty", "contextMatch"
  Annotation on right: "场景权重: lint / generate / learning / search"

Box 4 (pale pink): "Level 4: ContextBoost 会话加成"
  Annotation: "sessionKeywords 重叠 +20% · 语言匹配 +10%"

RIGHT SIDE — "输出":
An arrow from the bottom of Level 4 to a result list showing "Top-K Results" with 5 result cards ranked 1-5.

Bottom annotation: "5 分钟缓存 · context 模式不缓存 · AI 不可用时自动降级 · 零外部依赖"
