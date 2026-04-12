Title at top in bold Chinese: "AgentRuntime ReAct 推理循环架构"

A vertical flow diagram with a prominent central loop and surrounding subsystems.

CENTER — CoALA 五阶段 ReAct 循环 (large circular flow, clockwise):
Five nodes connected by thick curved arrows forming a cycle, mapped to CoALA cognitive stages:
  "Perception 感知" (antenna icon) → "Reasoning 推理" (brain icon) → "Action 行动" (gear icon) → "Observation 观察" (eye icon) → "Reflection 反思" (mirror icon) → back to "Perception"

Inside the circle: "LoopContext" box listing: iteration · tokenUsage · errorCount · toolCalls · sharedState · abortSignal

LEFT SIDE — Input (four arrows converging into the loop):
  Four channel boxes stacked vertically:
    "HTTP" (globe icon) with "conversationId, userId"
    "MCP" (puzzle icon) with "clientId, toolName"
    "CLI" (terminal icon) with "cwd, sessionId"
    "Lark" (bird icon) with "chatId, messageId"
  All four arrows merge into a single box: "AgentMessage 统一信封" then into the loop's "Perception" node.

RIGHT SIDE — Tool Execution Pipeline (horizontal chain flowing right from "Action"):
  A chain of boxes connected by arrows, split into pre-execute and post-execute:
    "allowlistGate" → "safetyGate" → "cacheCheck" → [execute] → "observationRecord" → "trackerSignal" → "traceRecord" → "submitDedup"
  Below the chain: "ToolRegistry" database icon

TOP — ExplorationTracker Phase State Machine (Analyst 策略):
  Four connected rounded rectangles:
    "SCAN" →(2轮骨架扫描)→ "EXPLORE" →(searchBudget 60% 耗尽)→ "VERIFY" →(证据完整)→ "SUMMARIZE"
  Arrow from SUMMARIZE labeled "toolChoice=none" pointing down to the loop
  Each phase labeled with its toolChoice: required / required / auto / none

TOP-RIGHT — AbortSignal 传播链 (small vertical chain):
  "PipelineStrategy" → "AbortController" → "LoopContext" → "AiProvider._post()" → "fetch({ signal })"
  Label: "hard timeout → 全链路取消"

BOTTOM — Three Safety Nets (three boxes in a row):
  Box 1: "2-Strike 错误恢复" with "Strike 1: retry 2s → Strike 2: reset + break"
  Box 2: "三级上下文压缩" with "L1 60%: truncate → L2 80%: summarize → L3 95%: aggressive"
  Box 3: "空响应 Rollback" with "rollbackTick() → sleep 1500ms → continue"

BOTTOM-RIGHT — Preset Configurations (small table):
  5 rows: chat (8轮/120s), insight (24~40轮/3600s), evolution (16轮/180s), lark (12轮/180s), remote-exec (6轮/60s)
  Label: "同一引擎 · 不同配置"
