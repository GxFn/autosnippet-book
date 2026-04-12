Title at top center in bold Chinese: "Bootstrap 双路径架构"

A top-to-bottom flow diagram with three major sections: a shared pipeline at top, a diamond fork in the middle splitting into two parallel paths, and a convergence zone at the bottom. The overall layout is symmetrical with the fork point on the center axis.

════════════════════════════════════════
TOP SECTION — Phase 0–4 共享管线
════════════════════════════════════════

A wide rounded rectangle spanning nearly the full width of the image. Pale blue (#A8D4F0) fill with a hand-drawn border.

Header text inside at top: "Phase 0–4 共享管线（~2s · 纯工程 · 零 AI）"

Below the header, a horizontal chain of 7 small rounded boxes connected by thin solid arrows (→), evenly spaced left to right. Each box has a tiny phase number label directly above it in lighter gray:

- "P1" above box → "文件收集" (white fill)
- "P1.5" above box → "AST 解析" (white fill)
- "P1.6" above box → "Entity Graph" (white fill)
- "P1.7" above box → "Call Graph" (white fill)
- "P2–2.2" above box → "依赖图 + Panorama" (white fill)
- "P3" above box → "Guard 审计" (white fill)
- "P4" above box → "维度解析" (white fill)

Below the chain of boxes, centered in italic smaller text: "ProjectSnapshot"

════════════════════════════════════════
FORK POINT
════════════════════════════════════════

A thick downward arrow from the bottom edge of the shared pipeline rectangle leads to a hand-drawn diamond/rhombus shape centered on the page. Inside the diamond: "AI Provider?"

From the diamond, two diverging arrows:
- LEFT arrow going down-left, labeled "有 API Key" in bold
- RIGHT arrow going down-right, labeled "无 · IDE Agent" in bold

════════════════════════════════════════
LEFT PATH — 内部 Agent 路径
════════════════════════════════════════

A tall rounded rectangle on the left side of the image. Pale yellow (#F9E79F) fill.

Bold header at top: "内部 Agent 路径"

Inside, 4 stacked boxes in a vertical flow connected by downward arrows:

Box 1 (white fill, rounded):
- Bold: "FanOut 策略"
- Sub-text: "Tier 1 (×3) → Tier 2 (×2) → Tier 3 (×1)"

↓ arrow

Box 2 (white fill, rounded):
- Bold: "PipelineStrategy"
- Sub-text: "Analyze → Gate → Produce"

↓ arrow

Box 3 (white fill, rounded):
- Bold: "Phase 5:"
- Sub-text: "微观维度 → Candidate"

↓ arrow

Box 4 (white fill, rounded):
- Bold: "Phase 5.5:"
- Sub-text: "宏观维度 → Project Skill"

To the right of the left path rectangle, a small annotation cluster:
- A tiny progress bar icon (5 small segments, 3 filled blue, 2 empty)
- Text: "Socket.io 进度推送"
- A tiny dashed arrow → "Dashboard"

════════════════════════════════════════
RIGHT PATH — 外部 Agent 路径
════════════════════════════════════════

A tall rounded rectangle on the right side of the image, same height as the left path. Pale pink (#FADBD8) fill.

Bold header at top: "外部 Agent 路径"

Inside, 2 stacked elements in a vertical flow:

Box 1 (white fill, rounded):
- Bold: "Mission Briefing 构建"
- Sub-text line 1: "执行计划 + 文件摘要 +"
- Sub-text line 2: "维度清单"

↓ arrow labeled "返回 MCP"

Box 2 (white fill, rounded, slightly larger, with a tiny IDE-style icon in the upper-left corner):
- Bold: "IDE Agent"
- Sub-text in parentheses: "(Cursor/Copilot)"
- Below, smaller monospace-style text:
  "读代码 → 分析维度"
  "submit_knowledge_batch"
  "dimension_complete"

════════════════════════════════════════
BOTTOM — 知识库汇聚
════════════════════════════════════════

Both the left path and right path have thick downward arrows converging into a single wide rounded rectangle at the bottom center. Pale blue (#A8D4F0) fill with a slightly thicker border.

Bold text centered inside: "知识库"

Below the bold text, 4 small icons in a horizontal row with labels underneath each:
- A flask/beaker icon → "Candidates"
- A book icon → "Recipes"
- A star/wand icon → "Skills"
- A graph/network icon → "知识图谱"

════════════════════════════════════════
BOTTOM ANNOTATION
════════════════════════════════════════

Centered below everything in lighter gray text: "两条路径 · 同一基座 · 同一知识库"
