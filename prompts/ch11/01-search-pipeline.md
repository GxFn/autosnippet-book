Title at top in bold Chinese: "搜索系统全景：双路召回 + 三级重排"

A left-to-right flow diagram showing the complete search pipeline, divided into two major phases.

LEFT SIDE — "召回阶段" (Recall Phase):
A rounded box labeled "用户查询" with a search icon.
Two parallel arrows fan out from it (NOT three — AutoSnippet abandoned BM25), each going to a separate lane:

Lane 1 (pale blue fill): "FieldWeighted 字段加权"
  Tags inside: "trigger ×5.0", "title ×3.0", "tags ×2.0", "description IDF ×1.5"
  Sub-note: "精确匹配 > 前缀 > 包含 > 反向包含"
  Bottom label: "精确匹配 · 毫秒级"

Lane 2 (pale green fill): "HNSW 向量语义"
  Tags inside: "768-dim", "cosine", "efSearch=100", "M=16"
  Sub-note: "纯 TypeScript · 零外部依赖"
  Bottom label: "语义理解 · 毫秒级"
  Small note: "SQ8 量化 · 内存省 75%"

Two lanes converge into a diamond shape labeled "RRF 融合":
  Annotation: "k=60 · 自适应 α (0.4–0.75)"
  Sub-note below diamond: "α = 0.4 + 0.35 × (1 − conf/60)"
  Small callout: "confidence 越低 → semantic 权重越高"
  Extra note: "AI 断路器打开时降级为纯 FieldWeighted"

CENTER-RIGHT — "重排阶段" (Reranking Phase):
Three vertically stacked boxes connected by downward arrows:

Box 1 (pale blue): "Level 1: CoarseRanker 五维粗排"
  Five small pills inside: "recall 0.45", "semantic 0.3", "freshness 0.15", "popularity 0.1", "quality 0"
  Sub-note: "freshness 半衰期 180 天 · 向量不可用时按比例放大"

Box 2 (pale yellow): "Level 2: MultiSignalRanker 七信号精排"
  Seven small pills in two rows:
    Row 1: "relevance", "authority", "recency", "popularity"
    Row 2: "difficulty", "contextMatch", "vector"
  Annotation on right: "场景权重: lint / generate / learning / search"

Box 3 (pale pink): "Level 3: ContextBoost 会话加成"
  Annotation: "sessionKeywords 重叠 max +20% · 语言匹配 +10%"
  Sub-note: "context 模式不缓存"

RIGHT SIDE — "输出":
An arrow from the bottom of Level 3 to a result list showing "Top-K Results" with 5 result cards ranked ①②③④⑤.

BOTTOM annotation: "AI 不可用时自动降级 · 零外部依赖 · context 模式不缓存（个性化结果）"
