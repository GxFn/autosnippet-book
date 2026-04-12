Title at top in bold Chinese: "KnowledgeEntry V3 字段全景"

Central layout: a single large rounded rectangle representing the KnowledgeEntry entity card, occupying about 80% of the image width, divided into 6 horizontal layers stacked top-to-bottom, each layer separated by a thin dashed horizontal line. Each layer has a Chinese label on the left margin outside the card.

Layer 1 (top, label "核心身份" on left margin): Pale blue (#A8D4F0) background tint. 4 small rounded boxes arranged in a horizontal row, each with bold text inside:
- "id (UUID)" — smallest box
- "title (≤20字)" — medium box
- "description (≤80字)" — widest box
- "trigger (@前缀)" — medium box with a small @ icon
Tiny annotation below title box: "引用真实类名"

Layer 2 (label "内容体" on left margin): White background. Two boxes side by side:
- Left: a wider rounded rectangle labeled "content.markdown (≥200字符)" with 3 tiny monospace placeholder lines inside suggesting markdown text: "<# markdown", "| << text >", "| ..."
- Right: a smaller code-editor shaped box labeled "coreCode (3-8行)" with 3 thin horizontal lines inside simulating code, colored in pale gray

Layer 3 (label "约束三元组" on left margin): White background. 3 equal-width boxes in a row, connected by thin hand-drawn arrows (→) between them:
- Left box: stick figure with a clock icon, bold text "When" below, subtitle "⏰" — the trigger condition
- Center box: stick figure with a checkmark, bold text "Do" below, subtitle "✓" — the positive action
- Right box: stick figure with an X mark, bold text "Don't" below, subtitle "✗" — the prohibited action
The three boxes flow left-to-right with arrows.

Layer 4 (label "分类元数据" on left margin): White background. 5 small pill/tag-shaped elements in a row:
- "kind" tag (slightly larger, with 3 micro-labels stacked below it: "rule | pattern | fact")
- "knowledgeType" tag with a small diamond icon
- "category" tag with a small diamond icon
- "language" tag with a small diamond icon
- "tags[]" tag with a small diamond icon
Each tag has a subtle rounded pill shape outline.

Layer 5 (label "推理链" on left margin): Pale yellow (#F9E79F) background tint. 3 elements in a row:
- Left: a speech bubble icon labeled "whyStandard" — reasoning text
- Center: a stacked-papers/file icon labeled "sources[]" — source file paths
- Right: a semicircular gauge/meter icon with a needle, labeled "confidence 0-1" — the confidence score dial showing approximately 0.85

Layer 6 (bottom, label "值对象组合" on left margin): White background. 6 small hexagonal shapes in a neat row, each with a tiny padlock/lock icon at bottom-right corner indicating immutability:
- "Content" — hexagon
- "Relations" — hexagon
- "Constraints" — hexagon
- "Reasoning" — hexagon
- "Quality" — hexagon
- "Stats" — hexagon
Below each hexagon, tiny italic text: "immutable"

At the very bottom of the card, centered, a small annotation in lighter gray text: "19 REQUIRED + 1 EXPECTED + 5 OPTIONAL"
