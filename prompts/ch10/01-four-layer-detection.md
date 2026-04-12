Title at top center in bold Chinese: "Guard 四层检测架构"

A vertical diagram flowing top-to-bottom with 4 detection layers shaped as TRAPEZOIDS of increasing width (like a funnel/pyramid widening downward). Each layer is wider than the one above it, giving a visual of increasing depth and cost. Between layers, thick downward arrows (↓). Layers are numbered with large bold circled numbers on the left margin.

════════════════════════════════════════
ENTRY (top center)
════════════════════════════════════════

A small file icon (page with lines) followed by text: "源代码文件"
Thick downward arrow (↓) leading into Layer 1.

════════════════════════════════════════
LAYER 1 — 正则匹配 (narrowest trapezoid, pale blue #A8D4F0 fill)
════════════════════════════════════════

Large bold circled number "1" on the left margin outside the trapezoid.

Inside the trapezoid:
- Bold title (large): "正则匹配"
- Top-right corner: a small rounded tag "regex" in monospace font
- Center line: "60+ 规则 · 微秒级 · 8 语言"
- Below: 3 small rounded pill tags in a row with white fill:
  "dispatch_sync", "no-eval", "no-panic"

↓ thick downward arrow

════════════════════════════════════════
LAYER 2 — 代码级跨行分析 (slightly wider trapezoid, pale blue #A8D4F0 fill)
════════════════════════════════════════

Large bold circled number "2" on the left margin.

Inside the trapezoid:
- Bold title (large): "代码级跨行分析"
- Center line: "15 检查 · 毫秒级"
- Below: 4 small rounded pill tags in a row with white fill:
  "KVO 配对", "Promise.catch", "defer in loop", "资源泄漏"

↓ thick downward arrow

════════════════════════════════════════
LAYER 3 — AST 语义查询 (wider trapezoid, pale yellow #F9E79F fill)
════════════════════════════════════════

Large bold circled number "3" on the left margin.

Inside the trapezoid:
- Bold title (large): "AST 语义查询"
- Below title: 3 rounded pill tags arranged in two rows with white fill:
  Row 1: "mustCallThrough", "mustNotUseInContext"
  Row 2 (centered): "mustConformToProtocol"
- Bottom line: "Tree-sitter · 十毫秒级"

↓ thick downward arrow

════════════════════════════════════════
LAYER 4 — AST 深度度量 + 跨文件分析 (widest, pale pink #FADBD8 fill)
════════════════════════════════════════

Large bold circled number "4" on the left margin.

This layer is the widest trapezoid, divided into two side-by-side sub-sections with a thin vertical divider in the middle:

Left sub-section (~50% width):
- Bold header: "AST 深度度量"
- 4 small rounded pill tags in 2×2 grid with white fill:
  Row 1: "类膨胀 >20", "圈复杂度 >15"
  Row 2: "God Class", "继承深度 >4"
- Bottom label: "13 规则"

Right sub-section (~50% width):
- Bold header: "跨文件分析"
- 3 small rounded pill tags in 2 rows with white fill:
  Row 1: "循环导入", "重复类名"
  Row 2 (centered): "Category 冲突"
- Bottom label: "6 规则"

════════════════════════════════════════
OUTPUT — Three result boxes (bottom center)
════════════════════════════════════════

Three arrows diverge downward from Layer 4, leading to three rounded boxes side by side:

Left box (pale blue #A8D4F0 fill):
- Large: "✓ pass"
- Sub-text: "确定合规"

Center box (pale pink #FADBD8 fill):
- Large: "✗ violation"
- Sub-text: "确定违规 · fixSuggestion"

Right box (pale yellow #F9E79F fill):
- Large: "? uncertain"
- Sub-text: "检测边界 · 能力报告"

════════════════════════════════════════
RIGHT MARGIN — Vertical annotation
════════════════════════════════════════

Along the right edge (outside all layers), a vertical line of Chinese text running top-to-bottom:
"渐进式深度 · 简单问题快速解决 · 复杂问题深入分析"

════════════════════════════════════════
BOTTOM ANNOTATION
════════════════════════════════════════

Centered below the three output boxes in bold text:
"四层全部执行 · 互补而非递进 · UncertaintyCollector 追踪每一个未确定规则"
