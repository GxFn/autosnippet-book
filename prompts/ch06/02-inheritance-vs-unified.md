Title at top in bold Chinese: "继承体系 vs 统一实体"

Two-column layout split by a bold vertical divider in the center. Left column has pale pink (#FADBD8) background tint, right column has pale blue (#A8D4F0) background tint.

LEFT COLUMN (header at top: "❌ 面向对象继承"):

Top section — a class inheritance tree diagram:
- Root box at top: rounded rectangle labeled "BaseKnowledge" with a class icon
- 4 child boxes branching downward via thin lines: "Pattern", "Decision", "Convention", "Practice"
- Each child box is a smaller rounded rectangle

Below the tree, 3 problem callout items stacked vertically, each with a yellow warning triangle icon (⚠) on the left:

Problem 1: "搜索需要 UNION 4 张表"
- Sketch to the right: 4 tiny table grids (2×2 each) with a "+" sign between them, suggesting 4 separate database tables being merged

Problem 2: "生命周期代码 ×4 复制"
- Sketch to the right: 4 identical small circular arrow icons in a row, representing duplication of lifecycle state machine code across 4 subclasses

Problem 3: "分类边界模糊"
- Sketch to the right: 3 overlapping dotted/dashed circles forming a Venn diagram with a large "?" question mark in the overlap area, representing unclear categorization boundaries

CENTER DIVIDER:
A large bold "VS" text inside a circle, positioned vertically centered between the two columns. Two small hand-drawn lightning bolt decorations, one above and one below the VS circle.

RIGHT COLUMN (header at top: "✅ 统一实体 + 分类标签"):

Center focal point — a single large rounded rectangle labeled "KnowledgeEntry" in bold, with a slightly thicker hand-drawn border. This is the unified entity.

Upper-left branching from KnowledgeEntry — label "行为维度 kind": an arrow fans out to 3 small rounded boxes stacked vertically:
- "rule" → small annotation "Guard 检查"
- "pattern" → small annotation "代码模板"
- "fact" → small annotation "关系描述"

Upper-right branching from KnowledgeEntry — label "语义维度 knowledgeType": an arrow fans out to 5 small labels stacked vertically:
- "code-pattern"
- "architecture"
- "best-practice"
- "conventions"
- "project-profile"

Below the KnowledgeEntry box, 3 benefit items with green checkmarks (✓):
- "一张表" — single database table
- "一套 API" — unified API
- "一个状态机" — shared lifecycle

At the bottom of the right column — a horizontal lifecycle flow:
Label "Lifecycle" above. 4 circles connected by thin arrows left-to-right:
- Circle 1 (unfilled outline): "pending"
- Circle 2 (unfilled outline): "staging"
- Circle 3 (unfilled outline): "active"
- Circle 4 (with a diagonal strikethrough line): "deprecated"
Arrow connecting each circle to the next: →
