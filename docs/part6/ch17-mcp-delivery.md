# MCP 协议与六通道交付

> 知识如何到达 AI — 从 MCP 工具调用到 IDE 原生文件推送。

## 问题场景

知识库建好了。几百条 Recipe 安静地躺在 SQLite 里。但 AI 怎么用它？

最直接的方式是通过 MCP（Model Context Protocol）—— AI 调用 `autosnippet_search` 工具，按需获取相关 Recipe。这种模式灵活、精确，但有一个前提：**AI 需要"知道"自己该搜索**。首次对话时，Agent 对项目一无所知，不知道有哪些约束、哪些模式——它不会主动搜索一个它不知道存在的知识库。

更优的方式是**主动推送**：把最重要的知识直接写入 IDE 的原生配置文件（`.cursor/rules/`、`AGENTS.md`、`.github/copilot-instructions.md`），AI 在每次对话开始时就自动读取。这不占用工具调用额度，不需要 AI 主动搜索——知识在对话前就已经注入了上下文。

但推送不能无限制——IDE 的上下文窗口有限。把 500 条 Recipe 全部推送进去，等于用知识噪声淹没了用户的实际问题。必须选择、压缩、分层。

AutoSnippet 用**六通道交付**覆盖两种模式——按需查询（MCP 工具调用）和主动推送（IDE 文件写入），让知识从数据库到 AI 的路径既完整又可控。

![MCP 协议与六通道交付全景图](/images/ch17/01-mcp-delivery-overview.png)

## 设计决策

### MCP Server——18 个工具的协议层

MCP（Model Context Protocol）是 Anthropic 提出的标准协议，定义了 AI Agent 与外部工具之间的通信方式。协议提供三种能力——**Tool**（工具调用）、**Resource**（数据资源）和 **Prompt**（提示模板）。AutoSnippet 使用 Tool 能力，注册了 18 个工具：

| # | 工具名 | 层级 | 职责 |
|:---|:---|:---|:---|
| 1 | `autosnippet_health` | Agent | 服务健康检查 · KB 统计 |
| 2 | `autosnippet_search` | Agent | 知识搜索（auto/keyword/semantic/context） |
| 3 | `autosnippet_knowledge` | Agent | 知识浏览（list/get/insights/confirm_usage） |
| 4 | `autosnippet_structure` | Agent | 项目结构发现 |
| 5 | `autosnippet_graph` | Agent | 知识图谱查询 |
| 6 | `autosnippet_call_context` | Agent | 调用上下文分析 |
| 7 | `autosnippet_guard` | Agent | 代码合规检查 |
| 8 | `autosnippet_submit_knowledge` | Agent | 知识提交（统一管线） |
| 9 | `autosnippet_skill` | Agent | 技能管理（list/load/create/update/delete） |
| 10 | `autosnippet_bootstrap` | Agent | 冷启动扫描 |
| 11 | `autosnippet_rescan` | Agent | 增量重扫（保留 Recipe，重新分析项目） |
| 12 | `autosnippet_evolve` | Agent | 批量 Recipe 进化决策 |
| 13 | `autosnippet_dimension_complete` | Agent | 维度补全 |
| 14 | `autosnippet_wiki` | Agent | Wiki 规划与生成 |
| 15 | `autosnippet_panorama` | Agent | 项目全景分析 |
| 16 | `autosnippet_task` | Agent | 意图管理 · 任务生命周期 · 决策记录 |
| 17 | `autosnippet_enrich_candidates` | Admin | 候选知识富化 |
| 18 | `autosnippet_knowledge_lifecycle` | Admin | 知识生命周期管理 |

18 个工具分为两个层级——**Agent 层**（16 个，AI Agent 可调用）和 **Admin 层**（2 个，仅管理员工具链使用）。层级通过环境变量 `ASD_MCP_TIER` 控制，MCP Server 在列出工具时过滤：

```typescript
// ListTools 处理器：根据 Tier 过滤可见工具
setRequestHandler(ListToolsRequestSchema, () => {
  const maxTier = TIER_ORDER[process.env.ASD_MCP_TIER || 'agent'];
  return { tools: TOOLS.filter(t => TIER_ORDER[t.tier] <= maxTier) };
});
```

**请求流程**——从 IDE 到知识库再回来：

```text
IDE Agent → CallToolRequest{name, arguments}
  → McpServer._handleToolCall()
    → _gatewayGate()          // 权限检查
    → _resolveHandler()       // 路由到处理函数
    → handler(ctx, args)      // 执行业务逻辑
    → 序列化结果
  → CallToolResponse{content: [{type: 'text', text: JSON}]}
← IDE Agent
```

Gateway 关卡是安全边界——不是所有工具调用都需要权限检查。`autosnippet_search`（只读查询）直接放行；`autosnippet_submit_knowledge`（写入操作）和 `autosnippet_skill`（create/update/delete 操作）必须经过 Gateway 的权限验证。路由映射在 `TOOL_GATEWAY_MAP` 中声明，某些工具使用 `resolver` 函数根据参数动态决定是否需要关卡——例如 `autosnippet_skill` 的 `list` 操作是只读的，`create` 操作才需要权限。

**多 IDE 适配**——MCP Server 使用 stdio 传输（标准输入/输出），这是最通用的方式：

| IDE | 连接方式 | 配置文件 |
|:---|:---|:---|
| Cursor | stdio 原生支持 | `.cursor/mcp.json` |
| VS Code Copilot | stdio + Extension 适配 | `.vscode/mcp.json` |
| Claude Code | stdio 原生支持 | `.claude/mcp.json` |
| Trae / Qoder | Mirror 文件映射 | `.trae/` · `.qoder/` |

配置文件格式几乎相同——指定 `node` 命令和 `mcp-server.js` 路径。`asd setup` 命令自动生成这些文件，用户无需手动配置。Trae 和 Qoder 不直接支持 MCP，通过 Mirror 机制把 `.cursor/` 下的规则和技能文件复制到对应目录，利用它们的原生文件加载能力间接交付知识。

### 六通道交付——分层推送

为什么要六个通道？因为 IDE 读取配置文件的方式不同——`.cursor/rules/` 中标记 `alwaysApply: true` 的文件每次对话都加载，`alwaysApply: false` 的文件按相关性加载，`.cursor/skills/` 是长文档格式的深度参考。不同类型的知识适合不同的交付形态：

| 通道 | 交付物 | 目标文件 | Token 预算 | 加载时机 |
|:---|:---|:---|:---|:---|
| **A** | alwaysApply 一行式规则 | `.cursor/rules/autosnippet-project-rules.mdc` | 800 · ≤15 条 | 每次对话自动加载 |
| **B** | When/Do/Don't 主题规则 | `.cursor/rules/autosnippet-patterns-{topic}.mdc` | 750/文件 · ≤5 条 | 按主题相关性加载 |
| **B+** | 调用图架构规则 | `.cursor/rules/autosnippet-patterns-call-architecture.mdc` | — | 架构相关时加载 |
| **C** | 项目技能同步 | `.cursor/skills/autosnippet-{name}/` | — | Agent 主动引用 |
| **D** | 压缩开发文档 | `.cursor/skills/autosnippet-devdocs/references/` | — | Agent 主动引用 |
| **F** | Agent 指令集 | `AGENTS.md` · `CLAUDE.md` · `.github/copilot-instructions.md` | — | 非 Cursor IDE 自动加载 |
| **Mirror** | IDE 配置镜像 | `.trae/` · `.qoder/` | — | `asd mirror` 手动触发 |

**通道 A** 是最高优先级——每次对话都会被 AI 读取的硬约束。800 token 的预算意味着只能放 15 条最重要的规则。这些规则从所有 `active` 状态的 `rule` 类型知识中，按排名得分（confidence × 40% + authority × 30% + useCount × 20% + activeBonus）选出 Top 15，压缩为一行式表述。

**通道 B** 按主题分组——`networking`、`ui`、`data`、`architecture`、`conventions`、`general`。每个主题文件标记 `alwaysApply: false`，IDE 根据当前对话内容的相关性决定是否加载。这让 750 条知识中的 networking 规则只在讨论网络代码时出现，不会污染 UI 讨论的上下文。

**通道 F** 是多 IDE 兼容层。不是所有 IDE 都支持 `.cursor/rules/` 格式——Claude Code 读取 `CLAUDE.md`，GitHub Copilot 读取 `.github/copilot-instructions.md`，OpenAI Codex 读取 `AGENTS.md`。通道 F 把相同的知识（≤15 条规则 + ≤10 条模式 + MCP 工具列表 + 技能列表）写入这三种文件。

## 架构与数据流

### CursorDeliveryPipeline——六通道编排

CursorDeliveryPipeline 是交付系统的主引擎——协调六个通道的知识选择、压缩和文件写入。完整的交付流程：

```yaml
deliver():
  ① entries ← _loadEntries()           // 加载 active + staging + 高置信度 pending
  ② {rules, patterns, facts, docs} ← _classify(entries)  // 按 kind 分类
  ③ rulesGenerator.cleanDynamicFiles()  // 清理旧的动态文件
  ④ channelA ← _generateChannelA(rules)         // 一行式规则
  ⑤ channelB ← _generateChannelB(patterns, facts) // 主题规则
  ⑥ archResult ← _generateCallGraphArchitectureRules() // 调用图架构
  ⑦ channelC ← _generateChannelC()               // 技能同步
  ⑧ channelD ← _generateChannelD(docs)           // 开发文档
  ⑨ channelF ← _generateChannelF(rules, patterns) // Agent 指令集
  → return {channelA, channelB, channelC, channelD, channelF, stats}
```

**知识选择**的关键在于 `_loadEntries()`——不是所有知识都参与交付。只有 `active`（已验证的正式知识）、`staging`（待发布的准正式知识）和高置信度 `pending`（尚未完全验证但可信度够高）的条目会被加载。`deprecated` 和 `decaying` 状态的知识被排除——它们不应该被推送给 AI。

**文件写入策略**是全量覆盖——每次交付重新生成所有通道文件。这比增量更新简单且可靠：不需要跟踪"上次交付了哪些知识"，也不会因为知识删除而留下废弃文件。`cleanDynamicFiles()` 先清理上次生成的 `autosnippet-*` 文件，再写入新内容，保证幂等性。

### KnowledgeCompressor——四种压缩策略

知识从 Recipe 的完整格式（200+ 字符的 markdown + 代码块 + 元数据）压缩到交付格式，是一个有损转换。KnowledgeCompressor 针对不同通道使用不同策略：

**规则压缩**（通道 A）——`compressToRuleLine()`：

```typescript
// 输入：完整 Recipe
{
  doClause: "Use constructor injection for CookieProviding dependencies",
  dontClause: "Don't import concrete implementations across module boundaries",
  language: "swift",
  scope: "language-specific"
}

// 输出：一行式规则
"- [swift] Use constructor injection for CookieProviding dependencies. Do NOT import concrete implementations across module boundaries."
```

每条知识压缩为一行。语言标签只在 scope 非 universal 时添加。`dontClause` 的冗余前缀（"Don't"、"Do not"、"Never"）被去除后拼接为 "Do NOT ..." 后缀。

**模式压缩**（通道 B）——`compressToWhenDoDont()`：

```markdown
### @cookie-providing-di-pattern
- **When**: Creating or modifying CookieProviding and its dependencies
- **Do**: Use constructor injection for CookieProviding dependencies
- **Don't**: Import concrete implementations across module boundaries
- **Why**: Ensures testability and decouples module boundaries
```

保留 trigger 标识符（方便 Agent 精确引用）、三条约束子句和理由的第一句话。`coreCode` 通过 `_skeletonize()` 裁剪到 ≤15 行，去除注释——保留骨架代码。

### TokenBudget——预算与裁剪

每个通道有严格的 Token 预算：

```typescript
const BUDGET = {
  CHANNEL_A_MAX: 800,           // 通道 A：整个文件上限
  CHANNEL_A_MAX_RULES: 15,      // 通道 A：最多 15 条规则
  CHANNEL_B_MAX_PER_FILE: 750,  // 通道 B：每个主题文件上限
  CHANNEL_B_MAX_PATTERNS: 5,    // 通道 B：每主题最多 5 条模式
};
```

超预算时的裁剪策略是**按排名截断**——知识已经按 `_rankScore()` 排序，排名靠后的直接丢弃：

```typescript
function truncateToTokenBudget(lines: string[], budget: number) {
  const kept: string[] = [];
  let tokensUsed = 0;
  for (const line of lines) {
    const lineTokens = estimateTokens(line); // CJK 感知：约 1.3 token/中文字符
    if (tokensUsed + lineTokens <= budget) {
      kept.push(line);
      tokensUsed += lineTokens;
    }
  }
  return { kept, dropped: lines.length - kept.length, tokensUsed };
}
```

Token 估算使用 CJK 感知算法——中文字符的 token 密度（约 1.3 token/字符）高于英文（约 0.25 token/单词），如果用英文估算器处理中文知识库会严重低估实际消耗。

**排名得分**决定哪些知识最终进入交付文件：

```text
score = confidence × 0.4 + authorityScore × 0.3
      + min(useCount, cap) × 0.2 + activeBonus
```

confidence 权重最高——高置信度的知识优先推送。useCount 有上限（避免"老知识"因为历史使用次数高而永远占据头部）。`active` 状态的知识获得额外加分。

### 通道 B+——调用图架构规则

通道 B+ 是一个独特的通道——它的内容不来自 Recipe，而是从代码库的调用图中**自动推断**：

```yaml
1. 从数据库提取调用边（RawDbCallGraphAdapter.findCallEdges()）
2. 聚合为目录级调用矩阵：'src/controllers' → Map('src/services' → count)
3. 计算出入度：in-degree 高 = 低层（被调用多 = 基础服务），out-degree 高 = 高层（调用多 = 控制器）
4. 推断分层架构：Foundation → Service → Controller → Application
```

输出为一条架构规则文件 `autosnippet-patterns-call-architecture.mdc`，告诉 AI "这个项目的分层结构是什么，哪些模块不应该跨层调用"。这是用数据驱动的方式自动发现项目架构约束——不需要开发者手动编写架构文档。

### 通道 C——技能同步

技能（Skills）是比规则更长、更深入的文档——描述一个完整的领域实践（如"项目架构概览"、"编码标准"、"设计模式"等）。SkillsSyncer 把 AutoSnippet 管理的技能同步到 `.cursor/skills/` 目录：

```yaml
同步两类来源：
  ① 内置技能：从 AutoSnippet 包的 skills/ 目录直接复制
  ② 项目技能：从 AutoSnippet/skills/project-* 转换

转换规则：
  project-architecture  → autosnippet-architecture
  project-coding-standards → autosnippet-coding-standards
  project-agent-guidelines → autosnippet-guidelines
  ...

每个技能输出：
  .cursor/skills/autosnippet-{name}/SKILL.md
  .cursor/skills/autosnippet-{name}/references/RECIPES.md  ← 关联 Recipe 摘要
```

`references/RECIPES.md` 是技能和知识库的桥梁——列出与该技能主题相关的 Recipe 摘要表格，让 Agent 知道"如果需要更详细的信息，可以通过 `autosnippet_search` 搜索这些条目"。

### 通道 F——Agent 指令集

通道 F 的目标是为不支持 `.cursor/rules/` 的 IDE 生成等效的指令文件。AgentInstructionsGenerator 生成三种文件：

- **AGENTS.md**——OpenAI Codex 和通用 Agent 读取
- **CLAUDE.md**——Claude Code 读取
- **.github/copilot-instructions.md**——GitHub Copilot 读取

内容结构统一：Coding Standards（≤15 条压缩规则）+ Architecture Patterns（≤10 条触发器表格）+ MCP Tools（16 个 Agent 工具列表）+ Skills（可用技能列表）。

**CLAUDE.md 的特殊处理**：

CLAUDE.md 通常是开发者手动创建的项目文档——AutoSnippet 不能覆盖用户内容。解决方案是**标记边界注入**：

```markdown
# 项目文档（用户编写的内容，不会被修改）

<!-- autosnippet:begin -->
## Coding Standards
- [swift] Use constructor injection...
...
<!-- autosnippet:end -->

更多用户内容...
```

AutoSnippet 只修改 `<!-- autosnippet:begin -->` 和 `<!-- autosnippet:end -->` 之间的区域，保留标记外的所有用户内容。如果文件不存在，整体生成并包含标记。

**FileProtection 机制**保护用户文件不被意外覆盖：

```typescript
function checkWriteSafety(filePath: string) {
  if (!fs.existsSync(filePath)) { return { canWrite: true }; }
  
  // 读取文件头 1024 字节检测签名
  const header = fs.readFileSync(filePath, 'utf8').slice(0, 1024);
  const SIGNATURE = /auto-generated by (?:\[)?autosnippet(?:\])?|autosnippet:begin/i;
  
  if (SIGNATURE.test(header)) { return { canWrite: true, reason: 'autosnippet-owned' }; }
  return { canWrite: false, reason: 'user-owned' };
}
```

只有 AutoSnippet 自己生成的文件（头部含签名）或标记区域才会被写入。用户手动创建的 `AGENTS.md`（不含签名）不会被覆盖。

## 核心实现

### MCP Server 生命周期

MCP Server 的启动、运行和关闭是一个完整的生命周期：

```typescript
// 启动
async start() {
  await this.initialize();                              // 加载 Bootstrap · 初始化容器
  applyPendingAutoApprove(projectRoot);                 // 注入 autoApprove 到 mcp.json
  const transport = new StdioServerTransport();          // stdio 传输
  await this.sdkServer.connect(transport);               // 开始监听
}

// 初始化
async initialize() {
  const bootstrap = await Bootstrap.create(projectRoot);
  bootstrap.configurePathGuard(projectRoot);            // 路径安全
  const container = await bootstrap.initServiceContainer({
    db, auditLogger, gateway, constitution, config
  });
  this.registerGatewayActions();                        // Gateway 路由注册
  this.sdkServer = new SdkMcpServer({
    name: 'autosnippet-v3', version: '3.0.0'
  });
}
```

**Session 追踪**——MCP Server 为每个连接维护一个 Session 对象，追踪工具调用次数、使用过的工具、意图状态等。`IntentState` 是一个状态机，追踪 Agent 的行为模式：

```typescript
interface IntentState {
  phase: 'idle' | 'prime' | 'active' | 'closed';
  taskId?: string;
  toolCalls: Array<{ tool: string; timestamp: number }>;
  searchQueries: string[];
  decisions: Array<{ id: string; title: string }>;
}
```

`prime` 阶段是关键——`autosnippet_task({ operation: 'prime' })` 是每条消息的第一个调用，它让 MCP Server 恢复会话上下文，准备好相关知识。没有 `prime` 的工具调用意味着 Agent 没有上下文，结果质量会下降。

### Gateway 四阶段管线

Gateway 是 AutoSnippet 的安全和审计中枢——MCP 工具调用和 HTTP API 请求都经过它。四个阶段：

```yaml
Validate → Guard → Route → Audit

① Validate：请求格式校验——actor、action、resource 字段完整性
② Guard：权限 + 宪法检查——角色权限矩阵 + Constitution 约束
③ Route：分发到注册的 Action Handler——实际业务逻辑执行
④ Audit：审计日志记录——成功或失败都写入 audit_logs
```

MCP Server 使用 Gateway 的两种模式：

- **`checkOnly()`**——只执行 Validate + Guard，不执行 Route。用于 `_gatewayGate()` 的权限预检——在工具调用前验证权限，通过后再调用实际处理函数。
- **`execute()`**——完整四阶段。用于 HTTP API 请求。

这种设计让 MCP 和 HTTP 共享同一套权限和审计逻辑，但 MCP 的处理函数可以独立于 Gateway 的 Action Handler——因为 MCP 工具的参数格式和 HTTP 路由不同，处理逻辑需要各自适配。

### HTTP API——RESTful 路由

HTTP Server 为 Dashboard 和外部集成提供 RESTful API：

```yaml
GET  /api/v1/health              → 健康检查
GET  /api/v1/health/ready        → 就绪检查
GET  /api/v1/knowledge           → 知识列表（分页 · 过滤）
POST /api/v1/search              → 搜索
POST /api/v1/guard               → Guard 检查
GET  /api/v1/guard/rules         → Guard 规则列表
GET  /api/v1/panorama            → 全景数据
GET  /api/v1/recipes             → Recipe 浏览
GET  /api/v1/skills              → 技能列表
POST /api/v1/bootstrap           → 启动 Bootstrap
GET  /api/v1/audit               → 审计日志
GET  /api/v1/task                → 任务列表
GET  /api-spec                   → OpenAPI 规范
```

中间件栈的顺序经过精心排列：

```yaml
performanceMonitor   → 性能追踪（计时开始）
helmet               → 安全头（CSP · XSS 保护）
requestLogger        → HTTP 日志
express.json(10mb)   → JSON 解析（10MB 限制）
cors                 → 跨域（Dashboard 需要）
roleResolver         → 角色检测
gatewayMiddleware    → 注入 Gateway 实例
timeout              → 超时配置（扫描 600s · 普通 60s）
```

`roleResolver` 从请求头中检测调用者角色——Dashboard（本地请求）自动获得 `developer` 角色，外部请求降级为 `contributor` 或 `visitor`。不同角色在 Gateway 中有不同的权限范围。

**错误响应格式**统一为：

```json
{
  "success": false,
  "error": {
    "message": "Permission denied for action: knowledge:create",
    "code": "PERMISSION_DENIED",
    "statusCode": 403
  },
  "timestamp": 1712833200000
}
```

错误码映射：`PERMISSION_DENIED → 403`、`CONSTITUTION_VIOLATION → 422`、`NOT_FOUND → 404`、`INTERNAL_ERROR → 500`。

### Mirror 机制

Mirror 不是自动触发的——它通过 `asd mirror` CLI 命令手动执行。原因是：Trae 和 Qoder 的用户是少数，自动 Mirror 会为大多数用户创建不需要的目录。

Mirror 的实现很直接：

```typescript
_mirrorToIDE(targetDirName: string) {
  // 1. 复制 .cursor/rules/autosnippet-* → {target}/rules/
  const rules = fs.readdirSync(rulesPath)
    .filter(f => f.startsWith('autosnippet-'));
  for (const file of rules) {
    fs.cpSync(src, dest, { recursive: true, force: true });
  }
  
  // 2. 复制 .cursor/skills/autosnippet-* → {target}/skills/
  const skills = fs.readdirSync(skillsPath)
    .filter(d => d.startsWith('autosnippet-'));
  for (const dir of skills) {
    fs.cpSync(src, dest, { recursive: true, force: true });
  }
}
```

只复制 `autosnippet-` 前缀的文件和目录——用户自己创建的规则和技能不会被 Mirror。这避免了"AutoSnippet 把用户在 Cursor 里手动写的规则推到 Trae 里"的意外行为。

## 运行时行为

### 场景 1：首次 Setup——六通道文件生成

用户执行 `asd setup`。Bootstrap 完成后调用 `CursorDeliveryPipeline.deliver()`：

```text
知识库：120 条 active Recipe（50 rules · 40 patterns · 20 facts · 10 documents）

→ 通道 A：Top 15 规则 → autosnippet-project-rules.mdc (780 tokens)
→ 通道 B：5 主题文件
    networking (5 patterns) → autosnippet-patterns-networking.mdc
    ui (4 patterns) → autosnippet-patterns-ui.mdc
    data (3 patterns) → autosnippet-patterns-data.mdc
    architecture (5 patterns) → autosnippet-patterns-architecture.mdc
    conventions (3 patterns) → autosnippet-patterns-conventions.mdc
→ 通道 B+：调用图分析 → autosnippet-patterns-call-architecture.mdc
→ 通道 C：3 技能同步 → autosnippet-architecture/ · autosnippet-coding-standards/ · ...
→ 通道 D：10 文档 → autosnippet-devdocs/references/*.md
→ 通道 F：AGENTS.md + .github/copilot-instructions.md
```

用户打开 Cursor，开始对话——AI 自动读取通道 A 的 15 条硬约束。讨论网络代码时，Cursor 自动加载 `autosnippet-patterns-networking.mdc`。Agent 需要深入了解架构时，引用 `autosnippet-architecture` 技能。

### 场景 2：新知识批准——增量交付

Agent 产出了一条新的 `code-pattern`，经过 Guard 验证后进入 `active` 状态。系统触发增量交付——重新执行 `deliver()`，六个通道全部重新生成。

为什么不只更新受影响的通道？因为新知识的排名可能影响通道 A 的 Top 15 选择——一条新的高置信度规则可能把原来的第 15 条挤出去。全量重新生成保证一致性，而生成过程本身只需要几十毫秒（内存中的字符串拼接 + 文件写入）。

### 场景 3：MCP 工具调用——搜索知识

AI Agent 需要了解"这个项目的 Cookie 管理方式"，调用 `autosnippet_search({ query: "cookie management pattern", mode: "auto" })`：

```text
McpServer._handleToolCall('autosnippet_search', {query, mode})
  → _gatewayGate()：搜索是只读操作，不在 TOOL_GATEWAY_MAP 中，直接放行
  → _resolveHandler()：映射到 consolidated.consolidatedSearch()
  → consolidatedSearch()：mode='auto' 路由到 searchHandlers.search()
  → SearchEngine：三路召回 + RRF 融合 + 三级重排
  → 返回 Top-5 Recipe，序列化为 JSON
← Agent 获得精准的 Cookie 管理模式描述
```

搜索结果经过通道 A/B 已经推送的知识不会重复——因为 Agent 已经在上下文中看到了 Top 15 规则，搜索目的是获取更深入的、不在 Top 15 中的知识。

### 场景 4：Mirror 同步

用户同时使用 Cursor 和 Trae。`.cursor/` 下的规则通过正常交付生成后，执行 `asd mirror`：

```text
→ 检测 .cursor/rules/autosnippet-* 文件（6 个）
→ 复制到 .trae/rules/ （保持文件名不变）
→ 检测 .cursor/skills/autosnippet-* 目录（3 个）
→ 复制到 .trae/skills/
→ 完成。用户在 Trae 中获得相同的知识覆盖
```

## 权衡与替代方案

### 为什么不只用 MCP 按需查询

纯 MCP 模式的问题在于**冷启动**——Agent 首次对话时不知道搜索什么。通道 A 的 15 条 alwaysApply 规则解决了这个问题：即使 Agent 从不调用 `autosnippet_search`，它也遵守了项目的核心约束。

实际行为是两种模式的互补：通道 A/B/F 提供"基线知识"（最重要的 20-30 条），MCP 搜索提供"长尾知识"（剩余的几百条）。基线知识保证 AI 不犯低级错误，搜索补充具体场景的深度信息。

### 为什么不只用文件推送

纯推送模式的问题在于**规模限制**。500 条 Recipe 全部推送进 IDE 文件，通道 A 就需要 50,000+ token——远超 AI 的上下文窗口容量。Token 预算的存在意味着推送必须筛选和压缩，大量知识无法通过推送覆盖。

MCP 搜索没有这个限制——它按需获取，搜索结果通常 5-10 条，token 消耗可控。

### 六通道 vs 更少通道

为什么不合并成三个通道（规则 · 技能 · 指令）？因为 IDE 的文件加载粒度不同：

- 通道 A（alwaysApply）和通道 B（按需加载）的区别不是内容格式，而是**加载策略**。合并它们意味着要么所有规则都 alwaysApply（浪费上下文），要么都按需加载（核心约束可能被遗漏）。
- 通道 C（技能）和通道 D（文档）的区别是来源和更新频率——技能来自 AutoSnippet 管理的 SKILL.md，文档来自 Recipe 中的 dev-document 类型。它们的同步逻辑不同。

六通道的复杂度是真实的维护成本。但每个通道解决了一个具体的交付问题，合并任何两个都会丢失重要的区分能力。

## 小结

MCP 协议和六通道交付是 AutoSnippet 知识价值链的最后一环——知识从数据库到达 AI 的"最后一公里"：

- **MCP Server** 注册 18 个工具，通过 stdio 传输服务 Cursor / VS Code / Claude Code，Gateway 四阶段管线保证安全和审计
- **六通道交付**把知识推送到 IDE 原生文件——通道 A 的 15 条 alwaysApply 规则保证冷启动不犯错，通道 B 的主题规则按需加载，通道 F 的 Agent 指令覆盖非 Cursor IDE
- **KnowledgeCompressor** 在 800 token 的预算内压缩规则为一行式表述，排名得分决定谁进入 Top 15
- **FileProtection** 保护用户文件不被覆盖，标记边界注入让 AutoSnippet 和用户内容和平共存
- **Mirror** 让 .cursor/ 的知识资产跨 IDE 复用

两种模式互补：推送提供基线知识（核心约束 · 高频模式），MCP 搜索提供长尾知识（特定场景 · 深度细节）。知识库的几百条 Recipe 通过这两条路径，最终在每次 AI 对话中发挥价值。

::: tip 下一章
[界面层 — Dashboard · CLI · 多端接入](./ch18-interface)
:::
