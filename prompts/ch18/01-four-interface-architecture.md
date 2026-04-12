Title at top center in bold Chinese: "四端接入统一架构"

A radial/cross-shaped diagram with ServiceContainer at the exact center, and four interface paths extending outward in four compass directions (top, right, bottom, left). The background is divided into four triangular quadrants by diagonal lines from center to corners, each quadrant tinted with a distinct pale color. Small "TOP", "RIGHT", "BOTTOM", "LEFT" labels in light gray at the corners.

════════════════════════════════════════
CENTER — ServiceContainer (circular, white fill with thin border)
════════════════════════════════════════

A medium-sized circle in the exact center of the image.

Inside the circle, three lines of bold text:
- "ServiceContainer"
- "· 70+ 服务"
- "· Gateway 管线"
- "· Constitution 约束"

Below the circle (still near center), a small stacked icon of three layers (database/vector/cache) with text: "SQLite + Vector + Cache"

════════════════════════════════════════
TOP QUADRANT — CLI (pale blue #A8D4F0 tint)
════════════════════════════════════════

At the very top, a terminal icon (rectangle with ">_" prompt symbol inside).

Below the icon, bold text: "Commander.js · 18+ 命令"

Below that, a rounded box listing commands in two rows:
Row 1: "setup · coldstart · guard:ci"
Row 2: "ui · embed · mirror"

Below that, a smaller box labeled "CliLogger" with 4 small status icons in a row: ✅ 💡 ⚠️ ❌, followed by text: "· ora spinner · --json"

An arrow pointing downward from CliLogger toward the center circle, with a small label along the arrow: "ServiceContainer.get()"

════════════════════════════════════════
LEFT QUADRANT — Lark Transport (pale yellow #F9E79F tint)
════════════════════════════════════════

At the far left, a Lark/飞书 bird icon (blue bird shape).

To the right of the icon, bold text: "飞书群聊 → 知识入口"

Below, a small diamond shape (decision node) labeled "IntentClassifier" with three output arrows:
- Arrow labeled "bot_agent" pointing right toward center, with small text "AgentRuntime"
- Arrow labeled "ide_agent" bending downward with a dashed line toward the bottom quadrant (VSCode), with small text "→ system"
- Arrow labeled "system" going to a small label "状态查询"

Below the diamond, a small rounded box: "ConversationStore · 20 msg · 5 min dedup"

════════════════════════════════════════
RIGHT QUADRANT — Dashboard (pale pink #FADBD8 tint)
════════════════════════════════════════

At the far right, a browser window icon (rectangle with a wavy/wave lines icon inside representing React).

Above/beside the icon, bold text: "React 19 + Vite + Tailwind CSS"

Below the icon, a 2×3 grid of small rounded pill tags:
Row 1: "Recipes", "Candidates"
Row 2: "Bootstrap", "Guard"
Row 3: "Guard", "Panorama"

An arrow from the icon pointing left toward center, labeled "HTTP API /api/v1/*"

Below the arrow, a bidirectional arrow icon (⇄) with label "Socket.IO" and three event names stacked:
"· candidate-created"
"· bootstrap:task-done"
"· recipe-published"

════════════════════════════════════════
BOTTOM QUADRANT — VSCode Extension (pale blue #A8D4F0 tint, lighter shade)
════════════════════════════════════════

At the bottom center, a VS Code icon (blue diamond/angular shape with code brackets).

Above the icon, bold text: "最小侵入 · 编辑器内嵌"

Below the icon, 3 small rounded boxes in a horizontal row:

Box 1: bold "CodeLens", sub-text "// as:s · as:c · as:a"
Box 2: bold "Guard 诊断", sub-text "波浪下划线"
Box 3: bold "RemoteCommand", sub-text "轮询 /remote/pending"

An arrow from VSCode icon pointing upward toward center, labeled "ApiClient (localhost:3000)"

════════════════════════════════════════
CONNECTING LINES — Cross-端 bridge
════════════════════════════════════════

A dashed curved line connecting the LEFT quadrant (Lark) to the BOTTOM quadrant (VSCode), arcing through the lower-left area. Along this line, a small label: "RemoteCommand 跨端指令桥" with sub-text: "Lark → queue → IDE"

════════════════════════════════════════
BOTTOM ANNOTATION
════════════════════════════════════════

Centered below the entire diagram in bold text:
"四个外壳 · 一个内核 —— 业务逻辑在 Service 层，界面层不含数据访问"
