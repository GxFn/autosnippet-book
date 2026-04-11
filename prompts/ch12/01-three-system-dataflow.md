Title at top in bold Chinese: "Panorama · Signal · 知识代谢 三系统数据链路"

A horizontal flow diagram divided into three major zones, left to right.

ZONE 1 — "Panorama 感知层" (pale blue background):
Top section: A network graph of 6-8 nodes (circles) connected by directed edges, labeled "模块拓扑". Some nodes are grouped by dashed boxes labeled "L0 Foundation", "L1 Service", "L2 UI", "L3 Application" from bottom to top.
One cluster of 3 nodes has a red highlight labeled "SCC 循环依赖 (Tarjan)".
Arrow labeled "Kahn 拓扑排序" points to the layer assignment.

Bottom section: A heatmap grid labeled "知识覆盖率". Columns are modules (NetworkKit, PaymentKit, UIKit, CoreData), rows are dimensions (网络, 并发, 安全, UI). Cells colored: green (strong ≥5), yellow (adequate 2-4), orange (weak 1), red (missing 0). PaymentKit column is mostly red.
A callout points to the red cells: "KnowledgeGap → 优先补充"

ZONE 2 — "Signal 神经层" (pale yellow background):
Center piece: A vertical bus/pipeline labeled "SignalBus" with 12 small icons along it, each representing a signal type: guard, search, usage, lifecycle, decay, quality, anomaly, etc.
Above: small arrows flowing INTO the bus from left (Guard, Search, Usage sources).
Below: Two output streams:

Stream A: "HitRecorder" box showing buffer → 30s timer → batch SQL UPDATE → SQLite icon
Stream B: "SignalAggregator" box showing 5-min sliding window → baseline × 3 → anomaly signal (red flash icon)

ZONE 3 — "Metabolism 代谢层" (pale pink background):
Top: A trigger arrow from Zone 2 labeled "decay | quality | anomaly → 30s 防抖"
Three detector boxes stacked vertically:
  Box 1: "DecayDetector" with "6 策略 · 0-100 分数 · 5 级别"
  Box 2: "ContradictionDetector" with "4 维检测 · 硬/软矛盾"
  Box 3: "RedundancyAnalyzer" with "4 维加权 · 阈值 0.65"

Arrow from three boxes converges to: "EvolutionProposal[]" box with "7 天 TTL"
Arrow to: "StagingManager" box with "置信度分级宽限期: 24h / 72h / longer"
Final arrow to: "Lifecycle 状态机" (connecting back conceptually to the knowledge base)

Bottom annotation: "信号驱动 · 不轮询 · 30 秒防抖聚合 · 渐进式治理"
