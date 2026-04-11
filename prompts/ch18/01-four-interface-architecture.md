Title at top in bold Chinese: "四端接入统一架构"

A radial diagram with ServiceContainer at the center and four interface paths extending outward in four directions.

CENTER — "ServiceContainer" (pale purple circle):
Text inside: "70+ 服务 · Gateway 管线 · Constitution 约束"
Below center: A small stack of three layers: "SQLite + Vector + Cache"

TOP — "CLI" path (pale blue background strip extending upward):
A terminal icon at the outer end
Text: "Commander.js · 18+ 命令"
Small list: "setup · coldstart · guard:ci · ui · embed · mirror"
Below list: "CliLogger" box with icons: "✅ 💡 ⚠️ ❌ · ora spinner · --json"
Arrow from terminal toward center labeled "ServiceContainer.get()"

RIGHT — "Dashboard" path (pale green background strip extending rightward):
A browser window icon at the outer end
Text: "React 19 + Vite + Tailwind CSS"
Small grid of 5 page labels: "Recipes · Candidates · Bootstrap · Guard · Panorama"
Below: "Socket.IO" bidirectional arrow icon with event labels: "candidate-created · bootstrap:task-done · recipe-published"
Arrow from browser toward center labeled "HTTP API /api/v1/*"

BOTTOM — "VSCode Extension" path (pale orange background strip extending downward):
A VS Code icon at the outer end
Text: "最小侵入 · 编辑器内嵌"
Three small feature boxes in a row:
  "CodeLens" with "// as:s · as:c · as:a"
  "Guard 诊断" with "波浪下划线"
  "RemoteCommand" with "轮询 /remote/pending"
Arrow from VS Code icon toward center labeled "ApiClient (localhost:3000)"

LEFT — "Lark Transport" path (pale yellow background strip extending leftward):
A Lark/飞书 icon at the outer end
Text: "飞书群聊 → 知识入口"
A decision diamond labeled "IntentClassifier" with three output arrows:
  "bot_agent" → arrow toward center (AgentRuntime)
  "ide_agent" → dashed arrow bending down toward VS Code Extension path (RemoteCommand)
  "system" → small arrow to "状态查询"
Below: "ConversationStore · 20 msg · 5 min dedup"

CONNECTING LINES:
All four paths converge to the center ServiceContainer
A dashed arc between Lark (left) and VSCode (bottom) labeled "RemoteCommand 跨端指令桥" showing the Lark → queue → IDE flow

BOTTOM ANNOTATION:
A horizontal bar: "四个外壳 · 一个内核 — 业务逻辑在 Service 层，界面层不含数据访问"
