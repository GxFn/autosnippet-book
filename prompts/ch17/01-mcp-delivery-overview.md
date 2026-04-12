Title at top in bold Chinese: "MCP 协议与六通道交付全景"

A wide horizontal diagram divided into three major zones from left to right: Knowledge Source, Two Delivery Paths, and IDE Targets.

ZONE 1 — "知识源" (left, pale blue background):
A database cylinder icon labeled "SQLite · Recipe 知识库"
Below: small text "active + staging + high-confidence pending"
Arrow right labeled "classify by kind" splitting into two paths.

ZONE 2 — Two parallel horizontal paths:

UPPER PATH — "按需查询 (MCP)" (pale green background strip):
Left: "IDE Agent" icon (laptop with sparkle) sends arrow labeled "CallToolRequest{name, args}" to:
Center: A rounded rectangle labeled "MCP Server" containing:
  - Top bar: "autosnippet-v3 · stdio · 18 工具"
  - Small grid of tool names in 2 rows: "search · knowledge · guard · structure · graph · call_context · task · skill · bootstrap · rescan · evolve · dimension_complete · wiki · panorama · health · submit_knowledge · enrich_candidates · knowledge_lifecycle"
  - Below: "Tier 过滤: Agent(16) · Admin(18)"
Arrow from MCP Server to:
A pipeline of 4 connected boxes labeled "Gateway 四阶段":
  "Validate" → "Guard" → "Route" → "Audit"
  Below Guard: small branch arrow labeled "checkOnly() 权限预检"
  Below Route: small text "→ Service 层 (业务逻辑)"
Arrow from pipeline back left to "IDE Agent" labeled "CallToolResponse{JSON}"

LOWER PATH — "主动推送 (Delivery)" (pale yellow background strip):
Left: "CursorDeliveryPipeline" box with subtitle "deliver() 编排引擎"
Between Pipeline and channels: Two small utility boxes:
  Box 1: "KnowledgeCompressor" with "compressToRuleLine() · compressToWhenDoDont() · _skeletonize()"
  Box 2: "TokenBudget" with "truncateToTokenBudget() · _rankScore() · CJK 感知"

From CursorDeliveryPipeline, 7 arrows fan out rightward to 7 channel boxes stacked vertically:

Channel A (red accent): "① alwaysApply 规则"
  Detail: "800 token · ≤15 条 · confidence×0.4 + authority×0.3 + useCount×0.2"
  Arrow to: ".cursor/rules/autosnippet-project-rules.mdc"

Channel B (orange accent): "② 主题规则 (When/Do/Don't)"
  Detail: "750 token/文件 · ≤5 条/主题 · 6 主题"
  Small text: "networking · ui · data · architecture · conventions · general"
  Arrow to: ".cursor/rules/autosnippet-patterns-{topic}.mdc"

Channel B+ (orange-light accent): "③ 调用图架构"
  Detail: "自动推断分层 · 出入度分析"
  Small text: "Foundation → Service → Controller → Application"
  Arrow to: ".cursor/rules/autosnippet-patterns-call-architecture.mdc"

Channel C (blue accent): "④ 技能同步"
  Detail: "SKILL.md + references/RECIPES.md"
  Arrow to: ".cursor/skills/autosnippet-{name}/"

Channel D (blue-light accent): "⑤ 开发文档"
  Detail: "dev-document 类型 Recipe"
  Arrow to: ".cursor/skills/autosnippet-devdocs/references/"

Channel F (purple accent): "⑥ Agent 指令集"
  Detail: "≤15 规则 + ≤10 模式 + 工具列表 + 技能列表"
  Three arrows to three files:
    "AGENTS.md" (label: "→ OpenAI Codex")
    "CLAUDE.md" (label: "→ Claude Code · 标记边界注入")
    ".github/copilot-instructions.md" (label: "→ GitHub Copilot")

Channel Mirror (gray accent, dashed border): "⑦ Mirror"
  Detail: "asd mirror · 手动触发"
  Small text: "复制 .cursor/rules/ + skills/ 中 autosnippet-* 前缀文件"
  Dashed arrow to: ".trae/ · .qoder/"

ZONE 3 — "IDE 接入" (right, pale purple background):
Four IDE icons stacked vertically, each with connection lines showing which paths they use:

"Cursor" — solid lines from:
  · MCP (stdio, .cursor/mcp.json)
  · Channel A/B/B+/C/D (直接读取 .cursor/ 文件)

"VS Code Copilot" — solid lines from:
  · MCP (stdio + Extension, .vscode/mcp.json)
  · Channel F (.github/copilot-instructions.md)

"Claude Code" — solid lines from:
  · MCP (stdio, .claude/mcp.json)
  · Channel F (CLAUDE.md, 标记边界注入 autosnippet:begin/end)

"Trae / Qoder" — dashed lines from:
  · Channel Mirror (复制 .cursor/ 文件)
  · Channel F (AGENTS.md)

Bottom annotation bar: "FileProtection · 签名检测 · 标记边界注入 (<!-- autosnippet:begin/end -->) · 全量覆盖写入 · 幂等性"
