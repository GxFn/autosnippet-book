Title at top in bold Chinese: "三维正交组合 — 零种 Agent 类型，无限种配置"

A 3D isometric cube diagram showing three orthogonal axes, with Preset points plotted in the space.

THREE AXES (drawn in hand-drawn perspective, converging at bottom-left origin):

X-AXIS (horizontal, going right) — labeled "Capability 能力维度 (可叠加)":
Six tick marks along the axis, each with a small rounded rectangle label:
  "Conversation 对话" · "CodeAnalysis 代码分析" · "KnowledgeProduction 知识生产" · "ScanProduction 扫描生产" · "SystemInteraction 系统交互" · "EvolutionAnalysis 进化分析"
Small icon below axis: a toolbox icon
Annotation below: "我能做什么"

Y-AXIS (vertical, going up) — labeled "Strategy 策略维度 (单选)":
Four tick marks along the axis, each with a small rounded rectangle label:
  "Single 直跑" · "Pipeline 流水线" · "FanOut 扇出" · "Adaptive 自适应"
Small icon left of axis: a flow-chart icon
Annotation left: "我怎么做"

Z-AXIS (diagonal, going back-left for depth) — labeled "Policy 约束维度 (可叠加)":
Three tick marks along the axis, each with a small rounded rectangle label:
  "Budget 预算" · "Safety 安全" · "QualityGate 质量门控"
Small icon below axis: a shield icon
Annotation below: "我的边界在哪"

FIVE PRESET POINTS (plotted as filled circles in the 3D space, each with a dashed projection line to each axis):

Point 1 — "chat 对话" (pale blue fill):
  Position: X={Conversation, CodeAnalysis}, Y=Single, Z=Budget
  Label card nearby: "8轮 · 120s · 0.7"

Point 2 — "insight 洞察" (pale yellow fill):
  Position: X={CodeAnalysis, KnowledgeProduction}, Y=Pipeline, Z={Budget, QualityGate}
  Label card nearby: "4阶段 · 24轮 · 3600s"

Point 3 — "evolution 进化" (pale yellow fill):
  Position: X={EvolutionAnalysis}, Y=Pipeline, Z=Budget
  Label card nearby: "2阶段 · 16轮 · 180s"

Point 4 — "lark 飞书" (pale pink fill):
  Position: X={Conversation, CodeAnalysis}, Y=Single, Z={Budget, Safety}
  Label card nearby: "12轮 · 发送者白名单"

Point 5 — "remote-exec 远程执行" (pale pink fill):
  Position: X={Conversation, CodeAnalysis, SystemInteraction}, Y=Single, Z={Budget, Safety}
  Label card nearby: "6轮 · 命令沙箱"

BOTTOM-LEFT COMPARISON BOX (small, below the cube):
Two columns side by side:
  Left column (crossed out with a red X): "继承方案: 6×4×3 = 72 个子类"
  Right column (with a check mark): "正交组合: 6+4+3 = 13 个组件"

BOTTOM-RIGHT FORMULA (in a rounded box):
  "Agent = Runtime( Capability × Strategy × Policy )"

CONNECTING CONCEPT (small annotation near origin):
  "三个维度完全独立 · 任意组合 · 新增不影响已有"
