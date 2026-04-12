Title at top in bold Chinese: "三维正交组合 — 零种 Agent 类型，无限种配置"

A 3D isometric cube diagram showing three orthogonal axes, with Preset points plotted in the space.

THREE AXES (drawn in isometric perspective, origin at bottom-center):

X-AXIS (extending to the bottom-right) — labeled "Capability 能力维度 (可叠加)":
Six tick marks along the axis, each with a small rounded rectangle label:
  "Conversation 对话" · "CodeAnalysis 代码分析" · "KnowledgeProduction 知识生产" · "ScanProduction 扫描生产" · "SystemInteraction 系统交互" · "EvolutionAnalysis 进化分析"
Small stick-figure icon with toolbox near axis end
Annotation: "我能做什么"

Y-AXIS (extending to the bottom-left) — labeled "Strategy 策略维度 (单选)":
Four tick marks along the axis, each with a small rounded rectangle label:
  "Single 直跑" · "Pipeline 流水线" · "FanOut 扇出" · "Adaptive 自适应"
Small flowchart icon near axis end
Annotation: "我怎么做"

Z-AXIS (extending straight up) — labeled "Policy 约束维度 (可叠加)":
Three tick marks along the axis, each with a small rounded rectangle label:
  "Budget 预算" · "Safety 安全" · "QualityGate 质量门控"
Small shield icon near axis end
Annotation: "我的边界在哪"

FIVE PRESET POINTS (plotted as numbered filled circles in the 3D space, each with a small label card):

Point ① — "chat 对话" (pale blue fill):
  Position: X={Conversation, CodeAnalysis}, Y=Single, Z=Budget
  Label card: "8轮 · 120s · temp 0.7"

Point ② — "insight 洞察" (pale yellow fill):
  Position: X={CodeAnalysis, KnowledgeProduction}, Y=Pipeline, Z={Budget, QualityGate}
  Label card: "4阶段 · 24~40轮 · 3600s"

Point ③ — "evolution 进化" (pale yellow fill):
  Position: X={EvolutionAnalysis}, Y=Pipeline, Z=Budget
  Label card: "2阶段 · 16轮 · 180s"

Point ④ — "lark 飞书" (pale pink fill):
  Position: X={Conversation, CodeAnalysis}, Y=Single, Z={Budget, Safety}
  Label card: "12轮 · 发送者白名单"

Point ⑤ — "remote-exec 远程执行" (pale pink fill):
  Position: X={Conversation, CodeAnalysis, SystemInteraction}, Y=Single, Z={Budget, Safety}
  Label card: "6轮 · 命令沙箱"

BOTTOM COMPARISON BOX (centered below the cube):
Two columns side by side:
  Left column (crossed out with a red X): "继承方案: 6×4×3 = 72 个子类"
  Right column (with a green check mark): "正交组合: 6+4+3 = 13 个组件"
Below: formula in a rounded box: "Agent = Runtime( Capability × Strategy × Policy )"

BOTTOM ANNOTATION:
  "三个维度完全独立 · 任意组合 · 新增不影响已有"
