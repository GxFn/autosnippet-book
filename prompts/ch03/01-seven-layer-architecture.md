Title at top in bold Chinese: "AutoSnippet 七层分层架构"

A vertical stack diagram with 7 layers, arranged from top to bottom. Each layer is a wide rounded rectangle spanning the full width, with decreasing visual intensity from top (entry) to bottom (infrastructure). Layers are separated by thin dashed lines.

LAYER 1 (topmost, pale yellow fill):
Label on left: "Layer 1"
Main label in center: "Entry Points — 入口层"
Right side: 3 small boxes in a row: "bin/cli.ts", "bin/mcp-server.ts", "bin/api-server.ts"
Annotation: "极薄 · 解析参数 · 委托下层"

LAYER 2 (pale yellow fill):
Label on left: "Layer 2"
Main label: "Bootstrap — 初始化编排"
Right side: a single box "bootstrap.ts" with subtitle "7 阶段启动序列"

LAYER 3 (pale blue fill):
Label on left: "Layer 3"
Main label: "Injection — 依赖注入"
Right side: a box "ServiceContainer" with 9 small module tags below: "Signal", "Infra", "App", "Knowledge", "Vector", "Guard", "Agent", "AI", "Panorama"

LAYER 4 (pale blue fill, slightly thicker left border):
Label on left: "Layer 4"
Main label: "Agent — 智能层"
Right side: 3 boxes: "AgentRuntime", "Memory", "61+ Tools"
Small annotation: "Capability × Strategy × Policy"

LAYER 5 (pale blue fill):
Label on left: "Layer 5"
Main label: "Service — 业务编排"
Right side: 6 representative service names as small tags: "Knowledge", "Guard", "Search", "Bootstrap", "Evolution", "Delivery"
Annotation: "16 子域"

LAYER 6 (pale yellow fill):
Label on left: "Layer 6"
Main label: "Core + Domain — 核心逻辑"
Two sub-sections side by side:
- Left sub-box: "Core" with tags "AST · Constitution · Gateway"
- Right sub-box: "Domain" with tags "KnowledgeEntry · Lifecycle · Dimension"

LAYER 7 (bottommost, pale pink fill):
Label on left: "Layer 7"
Main label: "Infrastructure — 基础设施"
Right side: 4 boxes: "SQLite", "Vector", "SignalBus", "Logger"
Additional tag: "Repository — 数据访问"

LEFT MARGIN:
A long vertical arrow pointing downward along the left edge, labeled "依赖方向 ↓"
A small annotation: "上层依赖下层 · 反之不行"

Bottom annotation: "路径别名: #shared/* · #infra/* · #service/* · #agent/* · #core/* · #domain/*"
