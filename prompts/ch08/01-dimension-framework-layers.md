Title at top in bold Chinese: "25 维分类框架"

A vertical 3-tier layout showing the dimension hierarchy. Left side has a magnifying glass icon labeled "Discovery 检测" feeding into activation.

TIER 1 (top section, labeled "Layer 1: 通用维度 — 所有项目 · 13 个"):
A large rounded rectangle with pale blue fill, containing 13 small dimension cards arranged in 3 rows (5-4-4).
Cards with weight 1.0 have thicker border + slightly darker fill to visually emphasize as core dimensions:

Row 1: "架构与设计 ×1.0 T1", "代码规范 ×0.8", "设计模式 ×0.8", "错误与健壮性 ×1.0 T1", "并发与异步 ×0.8"
Row 2: "数据与事件流 ×0.8", "网络与 API ×1.0 T1", "界面与交互 ×0.6", "测试与质量 ×0.8"
Row 3: "安全与认证 ×1.0 T1", "性能优化 ×0.6", "可观测性 ×0.6", "Agent 约束 ×0.6"

Note: "T1" small badge on ×1.0 cards means tierHint=1 (execute first). Other cards without badge are Tier 2/3.

TIER 2 (middle section, labeled "Layer 2: 语言维度 — 按主语言激活 · 7 个"):
A medium rounded rectangle with pale yellow fill, containing 7 small dimension cards in 2 rows (4-3):

Row 1: "Swift/ObjC 惯用法", "TS/JS 模块", "Python 包结构", "JVM 注解"
Row 2: "Go 模块", "Rust 所有权", "C#/.NET 模式"

Left side label: "conditions: languages" — dashed arrow from Discovery pointing to this layer, indicating activation by detected language.

TIER 3 (bottom section, labeled "Layer 3: 框架维度 — 按检测到的框架激活 · 5 个"):
A smaller rounded rectangle with pale pink fill, containing 5 small dimension cards in a single row:

"React 模式", "Vue 模式", "Spring 模式", "SwiftUI 模式", "Django/FastAPI"

Left side label: "conditions: frameworks" — dashed arrow from Discovery pointing to this layer, indicating activation by detected framework.

RIGHT SIDEBAR — "UnifiedDimension 接口" (a vertical annotation panel with three facet groups):

Group 1 — "提取面" (pale blue card):
  · extractionGuide — "告诉 Agent 挖掘什么"
  · allowedKnowledgeTypes — "约束产出类型"

Group 2 — "评估面" (pale yellow card):
  · qualityDescription — "健康评估标准"
  · matchTopics — "主题匹配规则"
  · weight — "Panorama 权重 (0-1)"

Group 3 — "执行面" (pale pink card):
  · tierHint — "1=最先 2=中间 3=最后"
  · conditions — "languages / frameworks"

BOTTOM LEFT — "激活示例" (a small example box):
"Swift + SwiftUI 项目 → 13 + 1 + 1 = 15 个维度"
"Go 项目 → 13 + 1 = 14 个维度"

BOTTOM FLOW:
A horizontal arrow: "Discovery 检测语言/框架 → 激活维度子集 → Agent 按 tierHint 分批执行 (T1 先行 → T2 → T3)"

Bottom annotation: "DimensionRegistry — Single Source of Truth · Bootstrap / Panorama / Rescan / Dashboard 共用"
