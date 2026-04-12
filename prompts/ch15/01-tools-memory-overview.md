Title at top in bold Chinese: "工具体系与记忆系统全景"

A vertical two-panel diagram. Upper panel is the Tool system, lower panel is the Memory system, connected by a shared MemoryCoordinator bar on the right side.

═══════════════════════════════════════════════
UPPER PANEL — "工具体系" (pale blue tinted area):
═══════════════════════════════════════════════

LEFT — ToolRegistry:
A large rounded rectangle labeled "ToolRegistry" containing a grid of 12 small module boxes arranged in 3 rows × 4 columns:
  Row 1: "ast-graph (11)", "lifecycle (10)", "infrastructure (7)", "query (6)"
  Row 2: "composite (6)", "project-access (5)", "guard (4)", "system (3)"
  Row 3: "evolution (3)", "knowledge-graph (2)", "ai-analysis (2)", "scan-recipe (1)"
Below the grid: small text "60 工具 × 12 模块"

Arrow from ToolRegistry labeled "Capability 白名单过滤" pointing right to the pipeline.

CENTER — ToolExecutionPipeline:
A vertical chain of numbered steps, split into "before 钩子" (pre-execute) and "after 钩子" (post-execute) sections, with [execute] in the middle:

  before 钩子:
    "① AllowlistGate" (with a side note "幻觉工具 → 拦截")
    "② SafetyGate" (with a shield icon and side arrow "blocked → 拦截")
    "③ CacheCheck" (with side arrow "hit → 跳过执行")
  [execute] — thick bar in the middle
  after 钩子:
    "④ ObservationRecord"
    "⑤ TrackerSignal"
    "⑥ TraceRecord"
    "⑦ SubmitDedup" (with side arrow "dup → 去重")

Label below: "7 层中间件链 (3 before + 4 after)"
Small note: "EventBus · Progress 由 #processToolCalls 直接处理"

RIGHT of pipeline — Output:
Arrow from pipeline to a box labeled "ToolResult" with sub-items: "· 结果压缩（按工具类型差异化）" and "· 审计日志"

BELOW LEFT — ToolForge branch:
A downward arrow from ToolRegistry to a horizontal waterfall of three boxes:
  "Reuse (0ms)" →(fail)→ "Compose (~10ms)" →(fail)→ "Generate (~5s)"
Each box has a small annotation:
  Reuse: "参数预填充"
  Compose: "DynamicComposer DAG"
  Generate: "LLM → SandboxRunner"
Arrow from Generate to: "TemporaryToolRegistry (TTL 30min)"
Label: "三级瀑布降级"

═══════════════════════════════════════════════
LOWER PANEL — "记忆体系" (pale yellow tinted area):
═══════════════════════════════════════════════

CENTER — Three concentric circles (memory tiers, no fixed percentage — annotate as "动态分配"):
  Innermost circle (pale pink fill): "ActiveContext 工作记忆" with label "单轮迭代"
  Middle circle (pale yellow fill): "SessionStore 会话记忆" with label "Bootstrap 全程"
  Outermost circle (pale blue fill): "PersistentMemory 长期记忆" with label "≤500 条 · 跨会话"
  Small text below circles: "conversationLog"

LEFT of circles — Three annotation boxes pointing to each ring:
  Inner (ActiveContext): "Scratchpad + ObservationLog + Plan · 按工具类型压缩"
  Middle (SessionStore): "跨维度发现 · 阶段反思 · TierReflection · 工具结果缓存"
  Outer (PersistentMemory): "30 天归档 · 90 天遗忘 · fact / insight / preference"

BELOW-LEFT of circles — Three profile cards in a row:
  "user: PM 60% · AC 20%" with label "Chat 场景"
  "analyst: AC 45% · SS 35%" with label "分析阶段"
  "producer: SS 55% · AC 25%" with label "生产阶段"
  Common label above: "BUDGET_PROFILES（动态 token 预算分配）"

RIGHT of circles — Two component boxes:
  Box 1: "MemoryRetriever · 三维评分" with formula: "0.2×recency + 0.3×importance + 0.5×relevance"
  Box 2: "MemoryConsolidator · 冲突消解" with three action tags: "≥85% UPDATE", "≥60% MERGE", "<60% ADD"

SPANNING RIGHT SIDE — A vertical bar labeled "MemoryCoordinator":
  Text inside: "统一调度 · buildStaticMemoryPrompt() · buildDynamicMemoryPrompt() · surplus 弹性再分配"
  Arrows connecting to all three memory rings and to the pipeline's CacheCheck

═══════════════════════════════════════════════
BOTTOM — ExplorationTracker bar:
═══════════════════════════════════════════════

Three strategy rows showing different phase chains:
  "Analyst:   SCAN → EXPLORE → VERIFY → SUMMARIZE"
  "Bootstrap: EXPLORE → PRODUCE → SUMMARIZE"
  "Producer:  PRODUCE → SUMMARIZE"

Below: "SignalDetector · NudgeGenerator · toolChoice 动态控制"
Arrow from TrackerSignal (⑤ in pipeline above) pointing down to this bar
