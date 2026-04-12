Title at top in bold Chinese: "查询路由：Confidence Gate + 自适应 Alpha"

A top-to-bottom decision flow diagram with warm, clean colors.

TOP — Input:
A rounded box labeled "用户查询" with a magnifying glass icon, connected by arrow to:

STAGE 1 — "FieldWeighted 快速评估":
A pale blue box showing "~40ms" badge in top-right corner.
Inside: "字段加权搜索 → Top-K 候选"

Arrow down to:

STAGE 2 — "Confidence 计算":
A wider box with a gauge/meter visualization (0 to 100 scale).
Left side (red zone, 0-30): "低置信 → 语义主导"
Middle (yellow zone, 30-55): "中等 → 均衡融合"
Right side (green zone, 55-100): "高置信 → 纯关键词"

Inside the box, a compact table of signals:
  Positive signals (green arrows up):
    "Title/Trigger 匹配 +95"
    "CamelCase 识别 +75"
    "分数断崖 +60"
    "代码术语 +50"
  Negative signals (red arrows down):
    "疑问句 → 归零"
    "多词短语 → 归零"

Arrow splits into TWO branches at a diamond decision node labeled "conf ≥ 60?":

LEFT BRANCH (YES — green path):
Box labeled "跳过 Semantic"
Badge: "40ms 返回"
Sub-note: "纯 FieldWeighted 结果"
Example queries in small font: "WBISigner · BaseViewController · @video-player-reuse"

RIGHT BRANCH (NO — orange path):
Box labeled "调用 Semantic + RRF 融合"
Inside: formula "α = 0.4 + 0.35 × (1 − conf/60)"
Three example rows:
  "conf=0 → α=0.75 (语义主导)"
  "conf=35 → α=0.55 (均衡)"
  "conf=55 → α=0.42 (关键词偏重)"
Badge: "230–450ms (本地 Ollama)"
Example queries: "Cookie持久化 · 数据竞争怎么避免 · how to make API calls"

Both branches converge at bottom into:
A rounded result box: "Top-K 结果返回"

BOTTOM annotation bar:
"本地 Embedding (Ollama) 使语义分支延迟从秒级降至毫秒级"
