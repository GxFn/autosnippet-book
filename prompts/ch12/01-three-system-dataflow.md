Title at top center in bold Chinese, two lines:
Line 1: "Panorama · Signal · 知识代谢"
Line 2 (slightly smaller): "三系统数据链路"

The image is divided into three vertical zones arranged side by side, each with a labeled header. The overall layout reads left-to-right as a data pipeline: Panorama feeds into Signal, Signal triggers Metabolism.

Zone labels at the very top: "ZONE 1", "ZONE 2", "ZONE 3" in small gray text above each zone.

════════════════════════════════════════
ZONE 1 — Panorama 感知层 (left third)
════════════════════════════════════════

Pale blue (#A8D4F0) fill background for the entire zone.

Bold header at top: "Panorama 感知层"

UPPER SECTION — 模块拓扑:
Bold sub-header: "模块拓扑"

A hand-drawn tree/network graph showing 7-8 small circles (nodes) connected by directed arrows (thin lines). The nodes are arranged in 4 horizontal rows labeled on the left side:
- "L3 Application" (top row, 1-2 nodes)
- "L2 UI" (second row, 2 nodes)
- "L1 Service" (third row, 2-3 nodes)
- "L0 Foundation" (bottom row, 1-2 nodes)

A dashed red rectangle encloses a cluster of 3 nodes that form a cycle, with a small annotation: "SCC 循环依赖 (Tarjan)"

A small label near the bottom-left: "Kahn 拓扑排序" with a thin arrow pointing rightward to indicate the layer assignment direction.

LOWER SECTION — 知识覆盖率:
Bold sub-header: "知识覆盖率"

A 4×4 heatmap grid. Column headers (tilted ~30°): "NetworkKit", "PaymentKit", "UIKit", "CoreData". Row labels on the left: "网络", "并发", "安全", "UI".

Cell fills use a traffic-light scheme:
- Green cells: contain "≥5" (strong coverage)
- Yellow/orange cells: contain "2-4" (adequate)
- Orange cells: contain "1" (weak)
- Red cells: contain "0" (missing) — especially in the PaymentKit column which is mostly red

Below the grid, a small legend row:
- Green square + "strong ≥5"
- Yellow square + "adequate 2-4"
- Orange square + "weak 1"

A tiny callout arrow from the red cells to text: "KnowledgeGap → 优先补充"

════════════════════════════════════════
ZONE 2 — Signal 神经层 (center third)
════════════════════════════════════════

Pale yellow (#F9E79F) fill background for the entire zone.

Bold header at top: "Signal 神经层"

UPPER AREA — Signal sources:
Four small labels with tiny arrows pointing down into the bus: "Guard", "INTO", "Search" on top row, then "Search", "Usage" below, with small downward arrows converging into the bus. Also a small "guard shield" icon to the left feeding in.

CENTER PIECE — SignalBus:
A tall vertical cylinder/tube shape (like a pillar or pipe), hand-drawn with slight wobble. Label "SignalBus" written vertically along the tube.

Along the tube, 6-8 tiny icons/symbols are scattered (representing different signal types): a shield (guard), a magnifying glass (search), a star (usage), a cycle arrow (lifecycle), a down-arrow (decay), a sparkle (quality). Some icons have tiny checkmarks (✓) and some have tiny X marks (✗) next to them, representing signal pass/fail.

LOWER AREA — Two output streams below the bus:

Stream A (upper):
Bold label: "Stream A : HitRecorder"
A horizontal flow of 4 small elements connected by arrows:
- Small stacked-lines icon → "buffer"
- Arrow → clock icon → "30s timer"
- Arrow → bundled-arrows icon → "batch SQL UPDATE"
- Arrow → cylinder icon → "SQLite"

Stream B (lower):
Bold label: "Stream B : SignalAggregator"
A horizontal flow of 3 small elements:
- Clock icon → "5-min sliding window"
- Arrow → bar-chart icon → "baseline × 3"
- Arrow → lightning bolt icon (red/pink) → "anomaly signal"

════════════════════════════════════════
ZONE 3 — Metabolism 代谢层 (right third)
════════════════════════════════════════

Pale pink (#FADBD8) fill background for the entire zone.

Bold header at top: "Metabolism 代谢层"

TRIGGER — At the very top of Zone 3, a horizontal arrow coming from Zone 2 (from the SignalBus), with label: "trigger decay | quality | anomaly → 30s 防抖"

A vertical chain of 5 boxes connected by downward arrows:

Box 1 (white fill, rounded, with a monospace-style class name):
- Bold: "DecayDetector"
- Sub-text: "6 策略 · 0-100 分数 · 5 级别"

↓ arrow

Box 2 (white fill, rounded):
- Bold: "ContradictionDetector"
- Sub-text: "4 维检测 · 硬/软矛盾"

↓ arrow

Box 3 (white fill, rounded):
- Bold: "RedundancyAnalyzer"
- Sub-text: "4 维加权 · 阈值 0.65"

↓ arrow (converging from all three boxes)

Box 4 (white fill, rounded, slightly wider):
- Bold: "EvolutionProposal[]"
- Sub-text: "7 天 TTL"

↓ arrow

Box 5 (white fill, rounded):
- Bold: "StagingManager"
- Sub-text line 1: "置信度分级宽限期："
- Sub-text line 2: "24h / 72h / longer"

↓ arrow

Box 6 (white fill, rounded, with a slightly thicker border):
- Bold: "Lifecycle"
- Sub-text: "状态机"

════════════════════════════════════════
BOTTOM ANNOTATION
════════════════════════════════════════

Centered below all three zones in bold colored text (dark ink): "信号驱动 · 不轮询 · 30 秒防抖聚合 · 渐进式治理"
