Title at top center in bold Chinese: "结构分析链 — 五阶段管线"

A vertical pipeline diagram flowing top-to-bottom, with 5 phase boxes stacked vertically. Each phase box is a wide rounded rectangle (~80% image width, centered). Between each phase, a thick downward arrow (↓). The left side of each phase has an illustrative icon, the right side shows the output type label.

════════════════════════════════════════
ENTRY — 源文件 (top-left corner)
════════════════════════════════════════

Top-left: a small cluster of 5 overlapping file page icons (hand-drawn, slightly fanned). Each file has a tiny language extension label:
".ts", ".py", ".swift", ".java", ".go"

Below the file stack, bold label: "源文件"

A thick downward arrow from the file stack leads into Phase 1.

════════════════════════════════════════
PHASE 1 (pale blue #A8D4F0 fill, rounded rectangle)
════════════════════════════════════════

Bold title at top of box: "Phase 1: 单文件 AST 解析"

Left side inside box: a small tree icon (🌳) representing a syntax tree — a trunk with 3-4 small branches.

Center text line 1: "Tree-sitter WASM · 10 语言"
Center text line 2 (smaller, gray): "并行 · 文件独立 · 原始事实"

Right side OUTSIDE the box (right margin): a small white card/box with text:
Bold: "AstFileSummary[]"
Sub-text: "类 · 方法 · 属性 · 导入"

↓ thick downward arrow

════════════════════════════════════════
PHASE 2 (pale blue #A8D4F0 fill, rounded rectangle)
════════════════════════════════════════

Bold title: "Phase 2: 继承图构建"

Center text line 1: "跨文件聚合 · 类/协议/扩展关系"
Center text line 2 (smaller, gray): "superclass · protocol · extension"

Right side OUTSIDE the box: a small label "InheritanceEdge[]"

↓ thick downward arrow

════════════════════════════════════════
PHASE 3 (pale yellow #F9E79F fill, rounded rectangle, slightly taller than phases 1-2)
════════════════════════════════════════

Bold title: "Phase 3: 调用图推断"

Left side inside box: a small arrow icon (➡) indicating pipeline flow.

Center: 5 small numbered step boxes arranged in a tight horizontal row, connected by tiny right-arrows (→):
- Box "①静态调用" → Box "②方法归属" → Box "③层间推断" → Box "④去重合并" → Box "⑤置信度标注"
Each step box has white fill with thin border, very compact.

Below the 5-step row, annotation text (smaller, gray): "5 步增量管线 · 静态推断无需执行"

Right side OUTSIDE the box: bold label "CallGraphEdge[]"
Below that label, a tiny hand-drawn spider/network graph with 4 nodes and edges, each edge annotated with small confidence numbers: "0.8", "0.8", "0.6", "0.6" in tiny text.

↓ thick downward arrow

════════════════════════════════════════
PHASE 4 (pale yellow #F9E79F fill, rounded rectangle)
════════════════════════════════════════

Bold title: "Phase 4: 设计模式检测"

Center: 4 small rounded pill tags in a horizontal row, each with white fill and thin border:
"Singleton", "Delegate", "Factory", "Observer"

Below the pills, annotation text (smaller, gray): "AST 特征匹配 · 非 AI"

Right side OUTSIDE the box: bold label "DetectedPattern[]"
Below that, a tiny hand-drawn gauge/speedometer icon (semicircle with a needle pointing right, indicating confidence level).

↓ thick downward arrow

════════════════════════════════════════
PHASE 5 (pale pink #FADBD8 fill, rounded rectangle, slightly taller)
════════════════════════════════════════

Bold title: "Phase 5: Tarjan SCC + Kahn 拓扑"

Inside the box, two sub-boxes side by side with a thin vertical divider between them:

Left sub-box (~45% width, white fill with thin border):
- Bold header: "Tarjan SCC"
- Small icon below: a circular graph (3 nodes forming a triangle with arrows creating a cycle) — representing strongly connected components
- Sub-label: "耦合度分析"

Right sub-box (~45% width, white fill with thin border):
- Bold header: "Kahn 拓扑排序"
- Small icon below: a layered stack of 3 horizontal bars (like a pyramid/layers icon) — representing layer hierarchy
- Sub-label: "层次结构"

Below both sub-boxes, annotation text (smaller, gray): "强连通分量 → 模块耦合 · 拓扑序 → 层次分离"

↓ thick downward arrow

════════════════════════════════════════
EXIT — ProjectGraph (bottom center)
════════════════════════════════════════

A rounded rectangle (white fill, slightly thicker border), centered:
Bold text: "ProjectGraph → Panorama 全景图"

════════════════════════════════════════
BOTTOM ANNOTATION
════════════════════════════════════════

Centered below the entire diagram in bold text:
"源文件 → 语法树 → 继承图 → 调用图 → 模式 → 拓扑层次 → 项目理解"
