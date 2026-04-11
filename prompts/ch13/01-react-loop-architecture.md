Title at top in bold Chinese: "AgentRuntime ReAct 推理循环架构"

A vertical flow diagram with a prominent central loop and surrounding subsystems.

CENTER — The ReAct Loop (large circular flow, clockwise):
Four nodes connected by thick curved arrows forming a cycle:
  "Observe 观察" (eye icon) → "Think 推理" (brain icon) → "Act 行动" (gear icon) → "Reflect 反思" (mirror icon) → back to "Observe"

Inside the circle: "LoopContext" box listing: iteration · tokenUsage · errorCount · toolCalls · sharedState

LEFT SIDE — Input (four arrows converging into the loop):
  Four channel boxes stacked vertically:
    "HTTP" (globe icon) with "conversationId, userId"
    "MCP" (puzzle icon) with "clientId, toolName"
    "CLI" (terminal icon) with "cwd, sessionId"
    "Lark" (bird icon) with "chatId, messageId"
  All four arrows merge into a single box: "AgentMessage 统一信封" then into the loop's "Observe" node.

RIGHT SIDE — Tool Execution Pipeline (horizontal chain flowing right from "Act"):
  A chain of 6 small boxes connected by arrows:
    "allowlistGate" → "safetyGate" → "cacheCheck" → "execute" → "observationRecord" → "submitDedup"
  Below the chain: "ToolRegistry" database icon

TOP — ExplorationTracker Phase State Machine:
  Three connected rounded rectangles: "SEARCH" →(searchBudget exhausted)→ "VERIFY" →(evidence complete)→ "SUMMARIZE"
  Arrow from SUMMARIZE labeled "toolChoice=none" pointing down to the loop
  Each phase labeled with its toolChoice: auto / auto / none

BOTTOM — Three Safety Nets (three boxes in a row):
  Box 1: "2-Strike 错误恢复" with "Strike 1: retry 2s → Strike 2: reset + break"
  Box 2: "三级上下文压缩" with "L1 60%: truncate → L2 80%: summarize → L3 95%: aggressive"
  Box 3: "空响应 Rollback" with "rollbackTick() → sleep 1500ms → continue"

BOTTOM-RIGHT — Preset Configurations (small table):
  4 rows: chat (8轮/120s), insight (24轮/300s), lark (6轮/60s), remote-exec (6轮/60s)
  Label: "同一引擎 · 不同配置"

Color scheme: Use warm tones. The central ReAct loop in amber/orange. Input channels in blue. Tool pipeline in green. Safety nets in red/coral. Tracker phases in purple.
