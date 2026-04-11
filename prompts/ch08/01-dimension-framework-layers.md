Title at top in bold Chinese: "25 维分类框架"

A vertical 3-tier concentric layout showing the dimension hierarchy, with the outermost ring at top and innermost at bottom:

TIER 1 (top section, labeled "Layer 1: 通用维度 — 所有项目"):
A large rounded rectangle with pale blue fill, containing 13 small dimension cards arranged in 3 rows (5-4-4):

Row 1: "架构与设计 ×1.0", "代码规范 ×0.8", "设计模式 ×0.8", "错误与健壮性 ×1.0", "并发与异步 ×0.8"
Row 2: "数据与事件流 ×0.8", "网络与 API ×1.0", "界面与交互 ×0.6", "测试与质量 ×0.8"
Row 3: "安全与认证 ×1.0", "性能优化 ×0.6", "可观测性 ×0.6", "Agent 约束 ×0.6"

Each card is a tiny rounded rectangle with the Chinese label and weight value. Cards with weight 1.0 have a slightly thicker border to visually emphasize importance.

TIER 2 (middle section, labeled "Layer 2: 语言维度 — 按主语言激活"):
A medium rounded rectangle with pale yellow fill, containing 7 small dimension cards in 2 rows (4-3):

Row 1: "Swift/ObjC 惯用法", "TS/JS 模块", "Python 包结构", "JVM 注解"
Row 2: "Go 模块", "Rust 所有权", "C#/.NET 模式"

Each card has a tiny language icon (a code bracket symbol) and shows the dimension label only. Dashed vertical lines connect upward from each card to Tier 1, labeled "conditions: languages"

TIER 3 (bottom section, labeled "Layer 3: 框架维度 — 按检测到的框架激活"):
A smaller rounded rectangle with pale pink fill, containing 5 small dimension cards in a single row:

"React 模式", "Vue 模式", "Spring 模式", "SwiftUI 模式", "Django/FastAPI"

Each card has a tiny framework icon (a puzzle piece). Dashed vertical lines connect upward from each card to Tier 2, labeled "conditions: frameworks"

RIGHT SIDEBAR (a thin vertical annotation panel):
Three small info blocks stacked vertically:
- A gear icon with "extractionGuide" label: "告诉 Agent 挖掘什么"
- A filter icon with "allowedKnowledgeTypes" label: "约束产出类型"
- A gauge icon with "weight" label: "Panorama 权重"

BOTTOM CONNECTION:
A horizontal arrow at the very bottom pointing right, labeled "Discovery 检测语言/框架 → 激活维度子集 → Agent 按 tierHint 分批执行"

Bottom annotation: "DimensionRegistry — Single Source of Truth · Bootstrap / Panorama / Rescan / Dashboard 共用"
