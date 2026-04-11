Title at top in bold Chinese: "KnowledgeEntry V3 字段全景"

Central layout: a large rounded rectangle representing the KnowledgeEntry entity, divided into 6 horizontal layers stacked vertically, each layer separated by a thin dashed line:

Layer 1 (top, labeled "核心身份"): 4 small rounded boxes in a row: "id (UUID)", "title (≤20字)", "description (≤80字)", "trigger (@前缀)". This layer has a pale blue background tint.

Layer 2 (labeled "内容体"): 2 boxes: "content.markdown (≥200字符)" as a wider box, and "coreCode (3-8行)" as a smaller code-shaped box with monospace style lines inside.

Layer 3 (labeled "约束三元组"): 3 equal boxes in a row with icons: "When ⏰" → "Do ✓" → "Don't ✗", connected by thin arrows.

Layer 4 (labeled "分类元数据"): 5 small tag-shaped elements: "kind", "knowledgeType", "category", "language", "tags[]". The "kind" tag shows 3 micro-labels below it: "rule | pattern | fact".

Layer 5 (labeled "推理链"): 3 elements: a speech bubble "whyStandard", a file stack icon "sources[]", a gauge/meter icon "confidence 0-1". This layer has a pale yellow background tint.

Layer 6 (bottom, labeled "值对象组合"): 6 small hexagonal shapes in a row: "Content", "Relations", "Constraints", "Reasoning", "Quality", "Stats". Each hexagon has a tiny "immutable" lock icon.

At the bottom of the card, a small annotation in lighter gray: "19 REQUIRED + 1 EXPECTED + 5 OPTIONAL"
