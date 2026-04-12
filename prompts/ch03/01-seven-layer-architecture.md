Title at top center in bold Chinese: "AutoSnippet 七层分层架构"

A vertical stack diagram with 7 layers arranged from top (Layer 1) to bottom (Layer 7). Each layer is a wide rounded rectangle spanning ~80% of the image width, centered horizontally. Layers are separated by thin dashed horizontal lines. Each layer has "Layer N" label in a small rounded pill on the left side.

The overall color scheme uses three fills:
- White/very light gray: Layer 1, Layer 2 (thin entry layers)
- Pale blue (#A8D4F0): Layer 3, Layer 4, Layer 5 (core business layers)
- Pale pink (#FADBD8): Layer 7 (infrastructure, the foundation)
- White with slight border: Layer 6 (pure logic, no external dependency)

════════════════════════════════════════
LAYER 1 (topmost, white fill, thinnest height)
════════════════════════════════════════

Left pill: "Layer 1"
Bold title (large): "Entry Points — 入口层"
Right-side annotation in small text: "极薄 · 解析参数 · 委托下层"

Below the title, 3 small rounded boxes in a horizontal row, each with monospace font:
- Box 1: "bin/cli.ts"
- Box 2: "bin/mcp-server.ts"
- Box 3: "bin/api-server.ts"

════════════════════════════════════════
LAYER 2 (white fill, thin height)
════════════════════════════════════════

Left pill: "Layer 2"
Bold title: "Bootstrap — 初始化编排"
Right side: a single rounded box "bootstrap.ts" with small sub-text below it: "7 阶段启动序列"

════════════════════════════════════════
LAYER 3 (pale blue #A8D4F0 fill)
════════════════════════════════════════

Left pill: "Layer 3"
Bold title: "Injection — 依赖注入"
Right side: a person/gear icon (🔧) followed by bold text "ServiceContainer"

Below, 7 small rounded pill tags arranged in a horizontal row:
"Signal", "Infra", "App", "Knowledge", "Vector", "Agent", "AI", "Panorama"
(each tag has a light white fill with thin border)

════════════════════════════════════════
LAYER 4 (pale blue #A8D4F0 fill)
════════════════════════════════════════

Left pill: "Layer 4"
Bold title: "Agent — 智能层"
Right-side annotation in small italic text: "Capability × Strategy × Policy"

Below the title, 3 rounded boxes in a row, each with a small person icon (👤) to the left of the text:
- Box 1: "👤 AgentRuntime"
- Box 2: "👤 Memory"
- Box 3: "61+ Tools"

════════════════════════════════════════
LAYER 5 (pale blue #A8D4F0 fill)
════════════════════════════════════════

Left pill: "Layer 5"
Bold title: "Service — 业务编排"
Right-side annotation: "16 子域"

Below the title, 6 small rounded pill tags in a horizontal row:
"Knowledge", "Guard", "Search", "Bootstrap", "Evolution", "Delivery"
(each tag has white fill with thin border)

════════════════════════════════════════
LAYER 6 (white fill, slightly taller than Layers 1-2)
════════════════════════════════════════

Left pill: "Layer 6"
Bold title spanning the full width: "Core + Domain — 核心逻辑"

Below the title, two sub-boxes side by side, each with a visible border:

Left sub-box (takes ~45% width):
- Bold label: "Core"
- Sub-text: "AST · Constitution · Gateway"

Right sub-box (takes ~45% width):
- Bold label: "Domain"
- Sub-text: "KnowledgeEntry · Lifecycle · Dimension"

════════════════════════════════════════
LAYER 7 (bottommost, pale pink #FADBD8 fill)
════════════════════════════════════════

Left pill: "Layer 7"
Bold title: "Infrastructure — 基础设施"

Below the title, 4 rounded boxes in a horizontal row, each with a small icon to the left:
- Box 1: cylinder icon (🗄️) + "SQLite"
- Box 2: grid icon (📊) + "Vector"
- Box 3: lightning icon (⚡) + "SignalBus"
- Box 4: scroll icon (📜) + "Logger"

Below these boxes, right-aligned small text: "Repository — 数据访问"

════════════════════════════════════════
LEFT MARGIN — Dependency Arrow
════════════════════════════════════════

Along the entire left edge (outside the layer stack), a long vertical arrow pointing DOWNWARD spanning from Layer 1 to Layer 7.

Arrow label (written vertically alongside): "依赖方向 ↓"
Below the arrow, small vertical text: "上层依赖下层 · 反之不行"

════════════════════════════════════════
BOTTOM ANNOTATION
════════════════════════════════════════

Centered below the entire stack in small monospace text:
"路径别名: #shared/* · #infra/* · #service/* · #agent/* · #core/* · #domain/*"
