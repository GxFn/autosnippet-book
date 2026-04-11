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
  - Top bar: "autosnippet-v3 · stdio · 16 工具"
  - Small grid of tool names in 2 rows: "search · knowledge · guard · structure · graph · task · skill · bootstrap ..."
  - Below: "Tier 过滤: Agent(14) · Admin(16)"
Arrow from MCP Server to:
A pipeline of 4 connected boxes labeled "Gateway 四阶段":
  "Validate" → "Guard" → "Route" → "Audit"
  Below Guard: small branch arrow labeled "checkOnly() 权限预检"
Arrow from pipeline to:
"Service 层" box, then arrow back left to "IDE Agent" labeled "CallToolResponse{JSON}"

LOWER PATH — "主动推送 (Delivery)" (pale yellow background strip):
Left: "CursorDeliveryPipeline" box with subtitle "deliver() 编排引擎"
From this box, 6 arrows fan out rightward to 6 channel boxes stacked vertically:

Channel A (red accent): "alwaysApply 规则" with "800 token · ≤15 条" and arrow to ".cursor/rules/autosnippet-project-rules.mdc"

Channel B (orange accent): "主题规则 (When/Do/Don't)" with "750 token/文件 · 6 主题" and arrow to ".cursor/rules/autosnippet-patterns-{topic}.mdc"

Channel B+ (orange-light accent): "调用图架构" with "自动推断分层" and arrow to ".cursor/rules/autosnippet-patterns-call-architecture.mdc"

Channel C (blue accent): "技能同步" with "SKILL.md + RECIPES.md" and arrow to ".cursor/skills/autosnippet-{name}/"

Channel D (blue-light accent): "开发文档" with "dev-document 类型" and arrow to ".cursor/skills/autosnippet-devdocs/references/"

Channel F (purple accent): "Agent 指令集" with "多 IDE 兼容" and three arrows to "AGENTS.md", "CLAUDE.md", ".github/copilot-instructions.md"

Between Pipeline and channels: A small box labeled "KnowledgeCompressor" with:
  "compressToRuleLine() · compressToWhenDoDont()"
And another small box labeled "TokenBudget" with:
  "truncateToTokenBudget() · _rankScore()"

ZONE 3 — "IDE 接入" (right, pale purple background):
Four IDE icons stacked vertically:
  "Cursor" — connected to upper and lower paths directly
  "VS Code Copilot" — connected to MCP path + .github/copilot-instructions.md
  "Claude Code" — connected to MCP path + CLAUDE.md
  "Trae / Qoder" — connected via dashed arrow labeled "Mirror (asd mirror)" from .cursor/ files

Bottom annotation: A horizontal bar showing "FileProtection · 签名检测 · 标记边界注入 (<!-- autosnippet:begin/end -->)"
