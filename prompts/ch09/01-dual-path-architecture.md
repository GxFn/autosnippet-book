Title at top in bold Chinese: "Bootstrap 双路径架构"

A diagram showing the Bootstrap pipeline splitting into two paths. The layout is top-to-bottom with a fork in the middle.

TOP SECTION — Shared Pipeline (pale blue fill, wide rounded rectangle spanning full width):
Label: "Phase 0–4 共享管线（~2s · 纯工程 · 零 AI）"
Inside: a horizontal flow of 7 small rounded boxes connected by arrows:
"文件收集" → "AST 解析" → "Entity Graph" → "Call Graph" → "依赖图 + Panorama" → "Guard 审计" → "维度解析"
Each box has a tiny phase number above it: "P1", "P1.5", "P1.6", "P1.7", "P2–2.2", "P3", "P4"
Below the pipeline: a small output label "ProjectSnapshot"

FORK POINT (center):
A diamond/rhombus shape labeled "AI Provider?"
Left arrow labeled "有 API Key" pointing down-left
Right arrow labeled "无 · IDE Agent" pointing down-right

LEFT PATH — Internal Agent (pale yellow fill, tall rounded rectangle):
Header: "内部 Agent 路径"
Inside, a vertical flow:
1. Box: "FanOut 策略" with sub-labels "Tier 1 (×3) → Tier 2 (×2) → Tier 3 (×1)"
2. Box: "PipelineStrategy" with sub-labels "Analyze → Gate → Produce"
3. Box: "Phase 5: 微观维度 → Candidate"
4. Box: "Phase 5.5: 宏观维度 → Project Skill"
Side annotation: "Socket.io 进度推送 → Dashboard"
Small icons: a progress bar and a notification bell

RIGHT PATH — External Agent (pale pink fill, tall rounded rectangle):
Header: "外部 Agent 路径"
Inside, a vertical flow:
1. Box: "Mission Briefing 构建" with sub-labels "执行计划 + 文件摘要 + 维度清单"
2. Arrow labeled "返回 MCP" pointing to:
3. Box with an IDE icon: "IDE Agent (Cursor/Copilot)" with sub-labels:
   - "读代码 → 分析维度"
   - "submit_knowledge_batch"
   - "dimension_complete"

BOTTOM — Convergence (pale blue fill):
Both paths have arrows converging into a single rounded rectangle at the bottom:
Label: "知识库" with icons for: "Candidates", "Recipes", "Skills", "知识图谱"

Bottom annotation: "两条路径 · 同一基座 · 同一知识库"
