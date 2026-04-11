Title at top in bold Chinese: "工具体系与记忆系统全景"

A vertical two-panel diagram. Upper panel is the Tool system, lower panel is the Memory system, connected by a shared MemoryCoordinator bar.

UPPER PANEL — "工具体系" (pale blue background):

LEFT — Tool Registry:
A large rounded rectangle labeled "ToolRegistry" containing a grid of 12 small module boxes arranged in 3 rows × 4 columns:
  Row 1: "ast-graph (11)", "lifecycle (7)", "infrastructure (7)", "query (6)"
  Row 2: "composite (6)", "project-access (5)", "guard (4)", "system (3)"
  Row 3: "evolution (3)", "quality (3)", "knowledge-graph (2)", "ai-analysis (2)"
Below the grid: small text "60 工具 × 12 模块"

Arrow from ToolRegistry labeled "Capability 白名单过滤" pointing right.

CENTER — ToolExecutionPipeline:
A vertical chain of 8 small rounded rectangles connected by downward arrows, forming a pipeline:
  "① EventBus" → "② Progress" → "③ SafetyGate" (with a small shield icon and a side arrow labeled "blocked → 拦截") → "④ CacheCheck" (with a side arrow labeled "hit → 跳过") → "⑤ ObservationRecord" → "⑥ TrackerSignal" → "⑦ TraceRecord" → "⑧ SubmitDedup" (with a side arrow labeled "dup → 去重")
Label below the chain: "8 层中间件链"

RIGHT — Output:
Arrow from pipeline to a box labeled "ToolResult" with text "结果压缩 · 审计日志"

BELOW CENTER — ToolForge branch:
A downward arrow from ToolRegistry to a horizontal waterfall of three boxes:
  "Reuse (0ms)" →(fail)→ "Compose (~10ms)" →(fail)→ "Generate (~5s)"
Each box has a small annotation:
  Reuse: "参数预填充"
  Compose: "DynamicComposer DAG"
  Generate: "LLM → SandboxRunner"
Arrow from Generate to: "TemporaryToolRegistry (TTL 30min)"
Label: "三级瀑布降级"

DIVIDER — A horizontal dashed line separating upper and lower panels.

LOWER PANEL — "记忆体系" (pale yellow background):

CENTER — Three concentric circles (memory tiers):
  Innermost circle (pale pink fill): "ActiveContext" with labels "工作记忆 · 6000 token (40%)"
  Middle circle (pale yellow fill): "SessionStore" with labels "会话记忆 · 4000 token (27%)"
  Outermost circle (pale blue fill): "PersistentMemory" with labels "长期记忆 · 3000 token (20%)"
  Small text at bottom of circles: "conversationLog · 1500 token (10%)"

LEFT of circles — Three annotation boxes pointing to each ring:
  Inner: "Scratchpad + ObservationLog + Plan · 单轮迭代 · 按工具类型压缩"
  Middle: "跨维度发现 · 阶段反思 · Bootstrap 全程 · 工具结果缓存"
  Outer: "≤500 条 · 30 天归档 · 90 天遗忘 · fact/insight/preference"

RIGHT of circles — Two component boxes:
  Box 1: "MemoryRetriever · 三维评分" with formula sketch: "0.2×recency + 0.3×importance + 0.5×relevance"
  Box 2: "MemoryConsolidator · 冲突消解" with three action tags: "≥85% UPDATE", "≥60% MERGE", "<60% ADD"

SPANNING BOTH PANELS — A vertical bar on the far right labeled "MemoryCoordinator":
  Text inside: "统一调度 · Token 预算分配 · injectStaticMemory()"
  Arrows connecting to all three memory rings

BOTTOM — A horizontal bar labeled "ExplorationTracker":
  Five phase boxes in a row: "SCAN → EXPLORE → PRODUCE → VERIFY → SUMMARIZE"
  Below: "SignalDetector · NudgeGenerator · toolChoice 动态控制"
  Arrow from TrackerSignal (in pipeline above) pointing down to this bar
