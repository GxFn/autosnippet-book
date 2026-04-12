# 真实数据：BiliDili 冷启动全记录

> 本章记录的是两次**真实测试数据**，两轮执行之间对调度和容错做了微调，所有数值均为原始日志直出，未做任何修正。
> AutoSnippet 的核心能力在于知识管理与 Guard 引擎，AgentRuntime 只是其中的自动化采集层。本章的目的不是宣传 Agent 有多强，而是**如实展示当前冷启动的工程现状**——哪些环节已经可用，哪些还有明显短板——为后续章节的 Recipe 审核和 Guard 规则生成提供数据基础。

## 19.1 项目画像

| 指标 | 值 |
|------|-----|
| 项目 | BiliDili（iOS 客户端） |
| 语言 | Swift |
| 源文件 | 124 个 |
| SPM Packages | 4 个本地包 |
| AutoSnippet 版本 | 3.3.9（两轮之间微调了调度与容错参数） |
| 执行方式 | `asd coldstart --wait --json` |

### 测试环境

两轮测试的运行环境完全一致（当天连续执行），如下：

| 环境项 | 值 |
|--------|-----|
| **LLM 模型** | `gemini-3-flash-preview` |
| **API 接口** | Google AI Studio（免费配额） |
| **上下文窗口** | 1,048,576 input tokens / 65,536 output tokens |
| **模型知识截止** | 2025 年 1 月 |
| **运行时** | Node.js ≥ 22，macOS |
| **两轮间隔** | 当天连续运行（无重启清库） |
| **实际 Token 费用** | $0（Google AI Studio 免费配额） |
| **预估付费价格（参考）** | 第一轮：Input 8.26M × $0.50/M = $4.13，Output 0.138M × $3.00/M = $0.41，**合计 $4.54**；第二轮：Input 11.15M × $0.50/M = $5.57，Output 0.178M × $3.00/M = $0.53，**合计 $6.10** |

> **关于免费配额的说明**：免费配额下 `gemini-3-flash-preview` 的速率限制比付费层级更严格，这可能是部分维度出现 hard timeout（330s 等待后 0 tool calls）的因素之一。两轮中观察到的 LLM "冻结" 现象在付费层级下未必重现。

### 代码实体图谱

AST 分析在 Phase 2 完成后构建了完整的代码实体图谱：

| 实体类型 | 数量 |
|----------|------|
| class | 214 |
| method | 451 |
| module | 20 |
| protocol | 20 |
| **合计** | **705** |

| 边类型 | 数量 | 占比 |
|--------|------|------|
| data_flow | 1,003 | 41.4% |
| calls | 505 | 20.8% |
| related | 406 | 16.7% |
| conforms | 271 | 11.2% |
| inherits | 196 | 8.1% |
| depends_on | 43 | 1.8% |
| **合计** | **2,424** | |

热点节点（入度最高）：

```
DownloadTask.cancel        inDegree=38
Endpoint                   inDegree=32
ThreadSafeDictionary.contains   inDegree=32
ThreadSafeDictionary.removeAll  inDegree=32
ThreadSafeDictionary.removeValue inDegree=18
```

`ThreadSafeDictionary` 的三个方法在图谱中入度极高——这与 BiliDili 大量使用线程安全字典管理并发状态的实际架构吻合。

### 项目结构

BiliDili 的代码组织可以概括为“App 壳层在上，`Sources/` 承载业务代码，`Packages/` 提供复用基础能力”。对冷启动分析而言，真正需要展开的是 `Sources/` 和 `Packages/` 两层：

```
BiliDili/
├── BiliDili/                     # App 壳层，不展开
├── Sources/                      # 业务源码主层
│   ├── Core/
│   │   ├── PaginationKit/
│   │   └── ServiceKit/
│   ├── Features/
│   │   ├── Following/
│   │   ├── Home/
│   │   ├── LiveChat/
│   │   ├── Profile/
│   │   ├── VideoFeed/
│   │   └── VideoPlay/
│   └── Infrastructure/
│       ├── Account/
│       ├── Networking/
│       └── WebSocket/
└── Packages/                     # 4 个本地 SPM 包
    ├── AOXFoundationKit/
    ├── AOXNetworkKit/
    ├── AOXPlayer/
    └── AOXUIKit/
```

**两层结构的真实分工**：

| 层级 | 实际内容 | 在项目中的职责 | Agent 分析重点 |
|------|---------|--------------|------------|
| **Sources/** | `Core`、`Features`、`Infrastructure` 三层 | 承载业务功能、共享服务和基础设施实现，是主要的产品代码层 | 从 `Features/*` 追到 `Infrastructure/*` 与 `Core/*`，确认页面行为、数据流、错误处理和并发调用链 |
| **Packages/** | `AOXFoundationKit`、`AOXNetworkKit`、`AOXPlayer`、`AOXUIKit` | 提供可复用基础能力，作为业务层下方的通用能力包 | 分析底层网络、播放器、UI 组件、基础工具如何被 `Sources/` 引用，以及跨层依赖是否稳定 |

这也是 `concurrency-async` 和 `performance-optimization` 两个维度 token 消耗较高的原因：Agent 不能只看 `Sources/Features/*` 的页面代码，还要继续追到 `Sources/Infrastructure/*` 与 `Packages/*`，才能确认并发原语、网络封装和播放器能力的真实调用链。

### 第一轮 → 第二轮 关键引擎差异

两轮执行之间（同一 3.3.9 版本），对调度和容错参数做了以下微调：

| 改动项 | 第一轮（优化前） | 第二轮（优化后） |
|--------|-----------|-----------|
| Tier 调度 | 3-Tier：2 + 2 + 10 | **5-Tier**：2 + 3 + 3 + 3 + 3 |
| Analyze 预算 | 固定 `maxIterations=24` | **自适应** `computeAnalystBudget(124)=34` |
| SCAN→EXPLORE 阈值 | iter=3 | iter=**2**（提前 1 轮进入深度探索） |
| Produce 超时容错 | 无 fast-retry | **fast-retry**：超时 0 tool calls → retryBudget 自动重试 |
| 中止链 | 无 abortSignal | **abortSignal**：hard timeout 后立即中断 LLM 调用 |
| 反射频率 | 3 Tiers → 3 reflections | 5 Tiers → **5 reflections** |
| 记忆蒸馏日志 | 基础统计 | **按维度 / 重要性分布 / 实体数 / 直方图** |

## 19.2 管线执行总览

### 第二轮时间线

整个 Bootstrap 从 `05:46 UTC` 到 `06:25 UTC`，总耗时 **2,176 秒（≈36.3 分钟）**。

```
05:46:49  Phase 0-4: 结构收集 + AST + Guard 审计
05:46:49  ── Tier 1/5 ── [architecture, swift-objc-idiom]
05:52:01  ── Tier 2/5 ── [coding-standards, design-patterns, networking-api]
06:00:21  ── Tier 3/5 ── [error-resilience, concurrency-async, data-event-flow]
06:07:46  ── Tier 4/5 ── [ui-interaction, testing-quality, security-auth]
06:15:16  ── Tier 5/5 ── [performance-optimization, observability-logging,
                           agent-guidelines]
06:23:04  Memory Consolidation (293ms) + Report
06:23:05  Cursor Delivery (26ms): 13 rules + 6 topics + 5 skills + 1 agent
06:25:13  Wiki Generation (8 files, 8 AI-enhanced)
```

对比第一轮时间线：

```
03:48:11  Phase 0-4: 结构收集 + AST + Guard 审计
03:48:11  ── Tier 1/3 ── [architecture, swift-objc-idiom]
04:09:00  ── Tier 2/3 ── [coding-standards, design-patterns]
04:13:28  ── Tier 3/3 ── [其余 10 个维度]
04:35:25  Memory Consolidation + Report
04:38:01  Wiki Generation
```

### 5-Tier vs 3-Tier 调度对比

第二轮采用 **5-Tier** 渐进调度（第一轮为 3-Tier），并发度均为 3：

**第二轮（5-Tier）：**

| Tier | 维度 | 维度数 | 候选产出 | 耗时 |
|------|------|--------|----------|------|
| 1 | architecture, swift-objc-idiom | 2 | 22 | 5m 12s |
| 2 | coding-standards, design-patterns, networking-api | 3 | 11 | 8m 20s |
| 3 | error-resilience, concurrency-async, data-event-flow | 3 | 22 | 7m 25s |
| 4 | ui-interaction, testing-quality, security-auth | 3 | 24 | 7m 30s |
| 5 | performance-optimization, observability-logging, agent-guidelines | 3 | 19 | 7m 48s |
| **合计** | | **14** | **98** | **36.3m** |

**第一轮（3-Tier）：**

| Tier | 维度数 | 候选产出 | 耗时 |
|------|--------|----------|------|
| 1 | 2 | 10 | 20m 49s |
| 2 | 2 | 22 | 4m 28s |
| 3 | 10 | 50 | 21m 57s |
| **合计** | **14** | **82** | **32.5m** |

> **关键差异**：第一轮的 Tier 3 把 10 个维度堆在一起，并发 3 意味着需要 4 波串行执行；第二轮将其拆为 3+3+3，每 Tier 只需 1 波即可完成。Tier 间隔更短，反射（Reflection）也从 3 次增加到 5 次，跨维度知识传递更密集。

### 最终产出

| 类别 | 第一轮 | 第二轮 | 变化 |
|------|-----|-----|------|
| 候选知识 (Candidates) | 101 | 98 | -3% |
| 有效维度 | 12/14 | 13/14 | +1 |
| QualityGate 满分维度 | 8/14 | 10/14 | +2 |
| Wiki 文档 | 8 | 8 | — |
| Cursor Rules | 12 | 13 rules + 6 topics | +7 |
| Project Skills | 5 | 5 | — |
| Agent 指令文件 | 1 | 1 | — |
| 语义记忆 | 166 | 220 | +32.5% |
| Findings | 83 | 131 | +57.8% |
| Cross-refs | 28 | 37 | +32.1% |
| Reflections | 3 | 5 | +66.7% |

## 19.3 AgentRuntime 执行实录

### 维度级指标（第二轮）

每个维度都经历 **Analyze → QualityGate → Produce** 的 PipelineStrategy 管线：

| 维度 | Input Token | Tool Calls | 候选 | QG 分 | 耗时 | 备注 |
|------|------------|------------|------|-------|------|------|
| architecture | 326,423 | 28 | 11 | 66 | 3m 22s | evidence=0 |
| swift-objc-idiom | 913,543 | 56 | 11 | 100 | 5m 12s | |
| design-patterns | 0 | 0 | 0 | — | 5m 30s | ⚠ analyze hard timeout |
| coding-standards | 702,437 | 44 | 9 | 100 | 7m 37s | produce fast-retry |
| networking-api | 477,389 | 34 | 2 | 70 | 8m 20s | depth=0，第一轮完全退化 |
| data-event-flow | 779,001 | 42 | 5 | 100 | 6m 24s | |
| concurrency-async | 1,163,364 | 54 | 7 | 100 | 7m 17s | 1 rejected |
| error-resilience | 1,040,557 | 54 | 10 | 100 | 7m 25s | |
| testing-quality | 892,951 | 58 | 9 | 100 | 6m 33s | |
| security-auth | 1,030,241 | 52 | 8 | 100 | 6m 39s | |
| ui-interaction | 1,066,897 | 58 | 7 | 100 | 7m 30s | 1 rejected |
| agent-guidelines | 613,437 | 29 | 5 | 66 | 4m 57s | evidence=0，第一轮完全退化 |
| performance-opt | 1,136,144 | 51 | 7 | 100 | 7m 39s | |
| observability-logging | 1,005,137 | 49 | 7 | 100 | 7m 48s | |
| **合计** | **11,147,521** | **609** | **98** | — | **36.3m** | |

**两轮对比关键发现：**

1. **Token 消耗上升 34.9%**（11.1M vs 8.3M）：自适应预算将 `maxIterations` 从 24 提高到 34，Agent 在 EXPLORE 阶段有更多轮次深入阅读源码。`concurrency-async`（1.16M）和 `performance-optimization`（1.14M）成为 Token 消耗最高的维度，因为它们需要跨 Package 追踪 `ThreadSafeDictionary`、`OSAllocatedUnfairLock` 等并发原语的使用链路。

2. **第一轮两个退化维度恢复**：`networking-api`（第一轮: 0 token / 0 产出 → 第二轮: 477K token / 2 候选 / QG=70）和 `agent-guidelines`（第一轮: 0/0 → 第二轮: 613K / 5 候选 / QG=66）。5-Tier 调度让这两个维度不再与 8 个强维度挤在同一 Tier 中竞争资源。

3. **新退化维度 design-patterns**：analyze 阶段 hard timeout（330s），LLM 调用完全无响应。与第一轮的 architecture produce timeout 类似——这是 Agent 偶发的 “冻结” 现象，abortSignal 在 330s 后强制中断并继续管线。

4. **fast-retry 首次触发**：`coding-standards` 的 produce 阶段首次超时（210s，0 tool calls），fast-retry 自动触发 retryBudget → 重试后 14 iters / 11 tool calls → 产出 9 条候选。这是第二轮新增的容错链路首次在测试中触发。

### 候选产出分布（第二轮）

```
architecture            ███████████   11
swift-objc-idiom        ███████████   11
error-resilience        ██████████    10
coding-standards        █████████      9  ← fast-retry 救回
testing-quality         █████████      9
security-auth           ████████       8
ui-interaction          ███████        7
concurrency-async       ███████        7
performance-opt         ███████        7
observability-logging   ███████        7
data-event-flow         █████          5
agent-guidelines        █████          5  ← 第一轮完全退化，第二轮恢复
networking-api          ██             2  ← 第一轮完全退化，第二轮恢复
design-patterns         ░░░░           0  ← analyze hard timeout
```

> 13 个有效维度的平均产出为 7.5 条候选。Gateway 共拒绝 3 条（`concurrency-async` 1 条、`ui-interaction` 1 条、`agent-guidelines` 1 条），验证通过率 **97.0%**（第一轮为 95.3%）。

## 19.4 ExplorationTracker 相位转换

### SCAN→EXPLORE：一致的 iter=2 触发

第二轮的所有维度都在 **iter=2** 时从 SCAN 转入 EXPLORE（第一轮为 iter=3）。这是因为 `explorationThreshold` 从 3 降低到 2——Agent 只需 1 次结构扫描 + 1 次文件列表读取即可进入深度代码阅读，节省了约 10-15 秒/维度。

从第二轮日志摘录典型转换：

```
SCAN → EXPLORE (iter=2, dwellMs=9670,  files=3,  patterns=5)   architecture
SCAN → EXPLORE (iter=2, dwellMs=11392, files=5,  patterns=0)   swift-objc-idiom
SCAN → EXPLORE (iter=2, dwellMs=10869, files=0,  patterns=5)   coding-standards
SCAN → EXPLORE (iter=2, dwellMs=16409, files=0,  patterns=0)   design-patterns
SCAN → EXPLORE (iter=2, dwellMs=21974, files=8,  patterns=12)  networking-api
SCAN → EXPLORE (iter=2, dwellMs=20415, files=1,  patterns=4)   error-resilience
SCAN → EXPLORE (iter=2, dwellMs=25900, files=19, patterns=13)  concurrency-async
SCAN → EXPLORE (iter=2, dwellMs=33921, files=11, patterns=8)   data-event-flow
...
```

### Analyze 阶段的标准相位序列（第二轮）

以 `error-resilience` 为例（完整 SCAN → EXPLORE → VERIFY → SUMMARIZE）：

```
SCAN ─ 20s ─→ EXPLORE ─ 183s ─→ VERIFY ─ 13s ─→ SUMMARIZE
  iter=2         iter=25          iter=26
  files=1        files=34         files=34
```

对比 `concurrency-async`（maxIterations 强制中断）：

```
SCAN ─ 26s ─→ EXPLORE ──── 230s ──→ SUMMARIZE (maxIter=34/34 forced)
  iter=2         files=29→38
```

### 驻留时长统计（两轮对比）

| 阶段 | 第二轮中位数 | 第二轮最小 | 第二轮最大 | 第一轮中位数 |
|------|----------|---------|---------|----------|
| SCAN | 18s | 10s | 34s | 22s |
| EXPLORE | 201s | 86s | 270s | 139s |
| VERIFY | 15s | 1s | 21s | 30s |

**第二轮变化**：
- **SCAN 缩短**：iter=2 提前退出，中位从 22s 降到 18s
- **EXPLORE 大幅延长**：maxIter=34（vs 24）给予 Agent 更充裕的深度阅读时间，中位从 139s 升到 201s，最高达 270s（performance-optimization）
- **VERIFY 缩短**：更多维度在 EXPLORE 阶段已触达 maxIterations 直接跳入 SUMMARIZE，VERIFY 变得更短甚至被跳过

### maxIterations 强制退出统计

第二轮中有 **7 个维度** 的 Analyze 阶段触发了 `maxIterations reached (34/34), forcing → SUMMARIZE`（第一轮为 6/24）：

| 维度 | EXPLORE 最终 files | patterns |
|------|-------------------|----------|
| swift-objc-idiom | 38 | 38 |
| coding-standards | 47 | 55 |
| concurrency-async | 29 | 30 |
| data-event-flow | 38 | 34 |
| security-auth | 37 | 55 |
| observability-logging | 27 | 32 |
| performance-optimization | 43 | 21 |

> 自适应预算从 24 增到 34 轮（+41.7%），但仍有半数维度耗尽预算。对于 124 文件的中型项目，34 轮预算让 Agent 平均触达 35+ 文件和 35+ 模式——而第一轮为 22 文件。

### Produce 阶段的饱和退出（第二轮）

Produce 阶段出现了三种结束模式：

1. **正常饱和退出**：`Exploration saturated at iter 10/24 — files=6, staleRounds=7`。Agent 发现没有新文件可读取后自然结束，平均在 iter 9-13 退出。这是最常见的模式。

2. **SUMMARIZE 转换退出**：`PRODUCE → SUMMARIZE (iter=7-13, submits=5-11)`。Agent 认为已产出足够候选后主动结束。

3. **Fast-retry 退出**：`coding-standards` produce 首次超时（210s，0 tool calls）→ `♻️ fast-retrying with retryBudget` → 5 iters / 2 submits 后完成。这是第二轮新增的退出路径。

## 19.5 上下文窗口压缩

ContextWindow 的三级渐进压缩在第二轮执行中触发了 **12 次 L1 级**（第一轮为 7 次）：

| 触发时间 | 压缩前 Token | Budget | 占比 | 截断条目 |
|----------|-------------|--------|------|----------|
| 05:54:44 | 16,616 | 48,000 | 34.6% | 11 |
| 06:02:44 | 16,313 | 48,000 | 34.0% | 13 |
| 06:02:46 | 16,234 | 48,000 | 33.8% | 12 |
| 06:03:09 | 17,448 | 48,000 | 36.4% | 11 |
| 06:09:51 | 20,197 | 48,000 | 42.1% | 9 |
| 06:10:05 | 18,963 | 48,000 | 39.5% | 10 |
| 06:10:17 | 19,945 | 48,000 | 41.6% | 10 |
| 06:11:45 | 24,928 | 48,000 | 51.9% | 6 |
| 06:16:48 | 20,371 | 48,000 | 42.4% | 10 |
| 06:17:07 | 19,070 | 48,000 | 39.7% | 9 |
| 06:17:17 | 19,568 | 48,000 | 40.8% | 11 |
| 06:18:27 | 25,851 | 48,000 | 53.9% | 6 |

**两轮对比**：

- **触发次数增加**：12 次 vs 7 次——maxIterations=34 意味着更多轮对话积累，压缩需求更频繁
- **最高占比更高**：53.9% vs 40.3%——部分维度（如 security-auth、performance-optimization）在 34 轮深度分析后窗口压力更大
- **L2/L3 仍未触发**——L1 裁剪（截断旧 tool result）在两次执行中均足够维持窗口可控
- **截断条目范围**：6-13 条/次（均值 9.8），与第一轮的 10-12 条/次接近

> 结论不变：对于 124 文件的中型项目，L1 已是上限。L2（摘要级压缩）和 L3（全量重写）设计更多针对大型 monorepo（1000+ 文件）场景。

## 19.6 质量门控（QualityGate）

QualityGate 在每个维度的 Analyze 阶段结束后评分，使用四维度模型。以下是第二轮数据（附第一轮对照）：

| 维度 | 第二轮 Total | Depth | Breadth | Evidence | Coherence | 第一轮 Total |
|------|----------|-------|---------|----------|-----------|----------|
| architecture | **66** | 100 | 100 | **0** | **80** | 100 |
| swift-objc-idiom | 100 | 100 | 100 | 100 | 100 | 100 |
| design-patterns | — | — | — | — | — | 100 |
| coding-standards | 100 | 100 | 100 | 100 | 100 | 100 |
| networking-api | **70** | **0** | 100 | 100 | 100 | (退化) |
| data-event-flow | 100 | 100 | 100 | 100 | 100 | 100 |
| concurrency-async | 100 | 100 | 100 | 100 | 100 | 100 |
| error-resilience | 100 | 100 | 100 | 100 | 100 | **66** |
| ui-interaction | 100 | 100 | 100 | 100 | 100 | 100 |
| testing-quality | 100 | 100 | 100 | 100 | 100 | 100 |
| security-auth | 100 | 100 | 100 | 100 | 100 | 100 |
| performance-opt | 100 | 100 | 100 | 100 | 100 | 100 |
| observability-logging | 100 | 100 | 100 | 100 | 100 | 100 |
| agent-guidelines | **66** | 100 | 99.0 | **0** | **80** | (退化) |

**两轮 QualityGate 对比：**

1. **满分率**：第二轮 10/14 vs 第一轮 8/14（排除退化维度后）

2. **退化维度完全不同**：
   - 第一轮退化（0 token / 0 tool calls）：`networking-api`、`agent-guidelines`
   - 第二轮退化（hard timeout）：`design-patterns`
   - **第一轮的两个退化维度在第二轮恢复**，虽然分数不满（networking-api=70, agent-guidelines=66），但已能正常分析并产出候选

3. **architecture 分数下降**（100 → 66）：第二轮中 evidence=0，评语 *“Findings lack file-level evidence”*。analyze 仅 12 iters 即完成（SCAN→EXPLORE→VERIFY→SUMMARIZE 全流程走完），分析深度足够但文件级证据引用缺失。

4. **error-resilience 分数上升**（66 → 100）：第一轮中该维度 evidence=0 / coherence=80，第二轮得益于更充裕的 34 轮预算，Agent 有足够轮次收集文件级证据。

> QualityGate 阈值仍为 50 分（pass），**"宽准入、靠产出筛选"** 的设计意图不变：architecture（66 分）和 agent-guidelines（66 分）均通过门控，最终分别产出 11 和 5 条候选知识。

## 19.7 记忆蒸馏与语义记忆

Bootstrap 管线的最终阶段将短期分析结果（Tier 2 SessionStore）**蒸馏**为长期语义记忆（Tier 3 PersistentMemory），供后续会话和二次冷启动复用。这一过程借鉴了 *Generative Agents*（Park et al., 2023）的三层记忆架构与 *Mem0* 的冲突解决策略。

### 三层记忆架构

```
┌─────────────────────────────────────────────────────┐
│  Tier 1 · WorkingMemory (ContextWindow)              │
│  ── Agent 单轮上下文，随对话窗口滑动清除 ──           │
└──────────────────────┬──────────────────────────────┘
                       │ 维度完成时 flush
┌──────────────────────▼──────────────────────────────┐
│  Tier 2 · SessionStore (内存)                        │
│  ── 维度报告 + findings + Tier Reflections ──        │
│  生命周期: 一次 Bootstrap 会话                       │
└──────────────────────┬──────────────────────────────┘
                       │ EpisodicConsolidator 蒸馏
┌──────────────────────▼──────────────────────────────┐
│  Tier 3 · PersistentMemory (SQLite)                  │
│  ── semantic_memories 表，跨会话持久化 ──             │
│  类型: fact / insight / preference                   │
│  生命周期: 30 天归档衰减 → 90 天遗忘 → MAX_MEMORIES  │
└─────────────────────────────────────────────────────┘
```

### 蒸馏管线：EpisodicConsolidator

管线启动时机：所有 Tier 完成后，`orchestrator.ts` Step 5 触发。

```
Pipeline 完成
  → compact() 过期清理
  → #extractFromFindings()       → fact 记忆
  → #extractFromReflections()    → insight + high-priority fact
  → #extractFromAnalysisText()   → 正则提取 fact/insight
  → MemoryConsolidator.consolidate() → 去重/合并/冲突解决
  → enforceCapacity() 容量控制
```

三个提取器的策略差异：

| 提取器 | 输入源 | 产出类型 | 重要性策略 | 过滤阈值 |
|--------|--------|----------|-----------|----------|
| `#extractFromFindings` | 维度 findings 列表 | `fact` | 继承原始 `importance` | importance ≥ 4, 长度 ≥ 10 |
| `#extractFromReflections` | TierReflection.crossDimensionPatterns | `insight` | 固定 7（跨维度高权重） | 长度 ≥ 10 |
| | TierReflection.suggestionsForNextTier | `insight` | 固定 5（建议性质） | 长度 ≥ 10 |
| | TierReflection.topFindings (imp ≥ 7) | `fact` | 继承原始 | importance ≥ 7 |
| `#extractFromAnalysisText` | 分析文本正则匹配 | `fact` / `insight` | 固定 4（正则置信度偏低） | 10 ≤ 长度 ≤ 120, 每维度上限 5+3 |

### BiliDili 实际蒸馏数据

**第二轮数据**（附第一轮对照）：

```
[Insight-v3] Memory stats: 14 dims, 131 findings, 134 files, 37 cross-refs, 5 reflections
                     (第一轮: 14 dims, 83 findings,  143 files, 28 cross-refs, 3 reflections)

[Consolidator] Extracted 259 candidate memories: 126 findings, 109 insights, 24 text facts
                     (第一轮: 173 candidates:         83 findings,  63 insights, 27 text facts)

[Consolidator] Per-dimension (top 6):
  concurrency-async=29, performance-optimization=26, ui-interaction=23,
  swift-objc-idiom=20, networking-api=17, design-patterns=13
                     (第一轮: design-patterns=18, coding-standards=16,
                      swift-objc-idiom=15, concurrency-async=14)

[Consolidator] Importance distribution: [1-3]=0 [4-6]=69 [7-10]=190 | Entities: 438
                     (第一轮: [1-3]=0 [4-6]=90 [7-10]=83 | Entities: 247)

[MemoryConsolidator] Consolidation: +220 ADD, ~28 UPDATE, ⊕11 MERGE, =0 SKIP  (293ms)
                     (第一轮: +166 ADD, ~2 UPDATE,  ⊕5 MERGE,  =0 SKIP  (221ms))

[Insight-v3] Total: 220 memories (avg importance: 7.0)
                     (第一轮: 166 memories, avg importance: 7.2)

[Insight-v3] Memory by type: fact=161, insight=59 | by source: bootstrap=220
[Insight-v3] Importance histogram: imp4=24 imp5=41 imp6=4 imp7=55 imp8=58 imp9=71 imp10=6
                     (第一轮: imp4=27 imp5=63 imp7=36 imp8=25 imp9=15 imp10=0)
```

### 第二轮蒸馏变化分析

**记忆量增长 32.5%**（166 → 220）的三个来源：

1. **Findings 增长 57.8%**（83 → 131）：第二轮的 5 次 Tier 反射产生更多跨维度 findings
2. **Cross-refs 增长 32.1%**（28 → 37）：5-Tier 的密集反射使维度间关联发现增加
3. **两个退化维度恢复**：networking-api（+17 候选记忆）和 agent-guidelines（+? 候选记忆）在第一轮中贡献为零

**重要性分布右移**：第二轮的 `[7-10]` 区间记忆从 83 条增加到 190 条（+129%），而 `[4-6]` 区间从 90 条降到 69 条。这意味着提取器产出了更多高权重记忆——主要因为 reflections 从 3 增加到 5，而 `crossDimensionPatterns` 的固定 importance=7 大量注入高权重 insight。

**实体提取翻倍**：438 vs 247（+77.3%）。更多维度完成分析意味着更多类名、文件名被关联到记忆条目中。

### 蒸馏衰减管线（第二轮）

| 步骤 | 第二轮 | 第一轮 | 说明 |
|------|--------|--------|------|
| 原始候选记忆 | 259 | 173 | 第二轮: 126 findings + 109 insights + 24 text facts |
| 去重合并(MERGE) | -11 | -5 | Jaccard ≥ 0.60 |
| 更新已有(UPDATE) | ~28 | ~2 | 第二轮库中有第一轮残留记忆，大量触发 UPDATE |
| 跳过(SKIP) | 0 | 0 | 无完全重复项 |
| **最终写入** | **220** | **166** | 第二轮 avg importance: 7.0 / 第一轮: 7.2 |

> UPDATE 数大幅上升（28 vs 2）的原因：第二次冷启动时数据库中已有第一轮写入的 166 条记忆，MemoryConsolidator 在 Phase 2 的相似度匹配中将 28 条与已有记忆合并（similarity ≥ 0.85），提升了 `importance` 和 `access_count`。这是二次冷启动增量更新的实际表现。

### 智能固化：MemoryConsolidator 决策树

每条候选记忆经过两阶段处理：

**Phase 1 — Mem0 冲突预解决**

对已有记忆库做矛盾检测：如果新记忆与旧记忆主题一致但一条包含否定词（"不再使用"/"deprecated"），则判定为矛盾，用新记忆**替换**旧记忆。

```
// 矛盾检测逻辑
主题重叠 = Jaccard(topicWords_A, topicWords_B) ≥ 0.3 或 overlap ≥ 2 词
否定不一致 = 一方匹配 /不再使用|禁止|deprecated|don't/ 而另一方不匹配
→ 判定矛盾 → REPLACE (用新内容替换旧记忆)
```

**Phase 2 — Similarity-based Consolidation**

```
对每条候选记忆:
  1. findSimilar(content, type, limit=3)
     └─ 使用 Jaccard + 子串包含加成 (0.3 bonus)
  2. 无匹配 (similarity < 0.1) → ADD
  3. similarity ≥ 0.85         → UPDATE (提升 importance + access_count)
  4. similarity ≥ 0.60         → MERGE (拼接 content, 取 max(importance))
  5. 其他                      → ADD
```

BiliDili 的 259 条候选中（第二轮），由于库中已有第一轮的 166 条记忆，大量触发 UPDATE（28 条）和 MERGE（11 条），而非全量 ADD。这是 **二次冷启动** 的标志性模式——增量更新而非全量重写。

5 条 MERGE 来自跨维度重叠升级为第二轮的 11 条 MERGE：`concurrency-async` 和 `performance-optimization` 都提到 `ThreadSafeDictionary`，`error-resilience` 和 `networking-api` 都提到 `RetryMiddleware`——5-Tier 的更密集反射使跨维度重叠发现增加了一倍。

### 实体提取

每条候选记忆同时提取关联实体（类名、文件名等），存入 `related_entities` 字段：

- **CamelCase 类名**：`/\b[A-Z][a-zA-Z]*[A-Z][a-zA-Z]*\b/` → `ThreadSafeDictionary`, `NetworkMiddleware`
- **Evidence 文件名**：从 `finding.evidence` 中解析 `file.swift:line`

BiliDili 第二轮总共提取 **438 个实体引用**（第一轮: 247，+77.3%），平均每条记忆 2.0 个实体（第一轮: 1.5）。实体密度提升意味着后续检索时关键词匹配更精准。

### 记忆生命周期

写入 `semantic_memories` 表后，记忆进入生命周期管理：

| 阶段 | 触发时机 | 操作 |
|------|---------|------|
| **活跃** | 写入后 | 正常检索，`access_count` 递增 |
| **归档衰减** | 30 天未访问 & importance < 3 | importance -= 1（最低为 1） |
| **遗忘** | 90 天未访问 & importance < 7 | 从数据库删除 |
| **过期** | TTL 到期 | 从数据库删除 |
| **容量淘汰** | 总数 > 500 | 按 importance ASC + access_count ASC 删除溢出部分 |

这意味着**重要性 ≥ 7 的记忆永远不会被自动遗忘**（只会被容量淘汰），而正则提取的低置信度记忆（importance=4）如果 90 天内未被检索引用，将被自动清理。

### 检索打分：Generative Agents 三维模型

记忆写入后，二次冷启动或日常对话通过 `MemoryRetriever.retrieve()` 检索。打分公式：

$$
\text{score} = 0.2 \times \text{recency} + 0.3 \times \text{importance} + 0.5 \times \text{relevance}
$$

其中：
- **recency** = $e^{-\Delta t \cdot \ln 2 / T_{1/2}}$，半衰期 $T_{1/2} = 7$ 天
- **importance** = `importance / 10`（归一化）
- **relevance** = 当有向量嵌入时 `0.6 × cosine + 0.4 × lexical`，否则纯词汇匹配

检索结果注入 `§8 历史语义记忆` 提示词段，格式：

```markdown
## 项目记忆 (10 条最相关)
- ⚠️ [fact] ThreadSafeDictionary 是项目的核心并发基础设施，入度 38...
- 📌 [insight] concurrency-async 与 performance-opt 共享依赖...
- 💡 [fact] 项目使用 os.Logger 的静态分类器进行日志...
```

Badge 规则：`⚠️` importance ≥ 8, `📌` importance ≥ 5, `💡` 其他。

### Tier 间反射产出

**第二轮（5 Tiers）：**

| Tier | Dimensions | Top Findings | Cross-patterns | Suggestions |
|------|-----------|-------------|----------------|-------------|
| Tier 1 | architecture, swift-objc-idiom | 10 | 1 | — |
| Tier 2 | coding-standards, design-patterns, networking-api | 10 | 5 | — |
| Tier 3 | error-resilience, concurrency-async, data-event-flow | 10 | 5 | — |
| Tier 4 | ui-interaction, testing-quality, security-auth | 10 | 5 | — |
| Tier 5 | performance-opt, observability-logging, agent-guidelines | 10 | 5 | — |

**第一轮（3 Tiers）：**

| Tier | Top Findings | Cross-patterns | Suggestions |
|------|-------------|----------------|-------------|
| Tier 1 | 10 | 4 | 3 |
| Tier 2 | 10 | 3 | 2 |
| Tier 3 | 10 | 5 | 4 |

第二轮的 Cross-patterns 总量从 12 增加到 21（+75%）。每个 cross-pattern 转化为 importance=7 的 insight 记忆，是语义记忆中跨维度洞察的主要来源。5-Tier 比 3-Tier 多出两次反射机会，使 Tier 2-5 的后续维度在分析时能引用更多前序发现。

## 19.8 交付产物一览

### 候选知识按维度分布（第二轮）

```
维度                     候选数   rejected   净产出   第一轮净产出
──────────────────────────────────────────────────────────
architecture               11        0        11         0
swift-objc-idiom           11        0        11        10
error-resilience           10        0        10         4
coding-standards            9        0         9        10
testing-quality             9        0         9        10
security-auth               8        0         8        10
ui-interaction              7        1         6         6
concurrency-async           7        1         6        10
performance-optimization    7        0         7         7
observability-logging       7        0         7         5
data-event-flow             5        0         5        10
agent-guidelines            5        1         4         0
networking-api              2        0         2         0
design-patterns             0        0         0        12
──────────────────────────────────────────────────────────
合计                       98        3        95        82
                                                 + 19 post
                                                 = 101 第一轮
```

### 全部交付清单（第二轮）

| 交付物 | 路径 | 数量 | 第一轮对照 |
|--------|------|------|---------|
| 候选知识 | `AutoSnippet/candidates/*/` | 98 | 101 |
| Cursor Rules (A) | `.cursor/rules/autosnippet-project-rules.mdc` | 13 rules | 12 |
| Cursor Patterns (B) | `.cursor/rules/autosnippet-patterns-*.mdc` | 6 topics (23 patterns + 9 facts + 18 insights) | — |
| Project Skills (C) | `AutoSnippet/skills/` | 5 | 5 |
| Agent 指令 (F) | `AGENTS.md` + `copilot-instructions` | 2,165 tokens | 1 file |
| Wiki | `AutoSnippet/wiki/` | 8 articles (8 AI-enhanced) | 8 |
| 语义记忆 | `.autosnippet/memory/` | 220 | 166 |
| Bootstrap 报告 | `.autosnippet/bootstrap-report.json` | 1 | 1 |

### Cursor Delivery 通道明细（第二轮新增）

第二轮新增了 Channel B 的多主题 pattern 分发：

```
Channel A: 13 rules → autosnippet-project-rules.mdc          (785 tokens)
Channel B: networking  — 5 patterns + 2 facts                 
         : ui         — 5 patterns + 0 facts                 
         : architecture — 5 patterns + 5 facts               
         : data       — 5 patterns + 0 facts                 
         : conventions — 3 patterns + 2 facts                 
         : call-architecture — 18 insights                   (3,983 tokens total)
Channel C: 5 builtin skills synced                            
Channel F: 1 agent instruction file                           (2,165 tokens)
Total delivery: 26ms
```

## 19.9 数据洞察总结

### 效率指标（两轮对比）

| 指标 | 第二轮 | 第一轮 | 变化 |
|------|-----|-----|------|
| 每候选 Token 消耗 | ~114K input | ~83K | +37.3% |
| 每候选 Tool Calls | ~6.2 calls | ~5 | +24% |
| 每候选耗时 | ~22.2s | ~19s | +16.8% |
| Input/Output Token 比 | 62.6:1 | 60:1 | +4.3% |
| 维度成功率 | 13/14 = **92.9%** | 12/14 = 85.7% | +7.2pp |
| QG 满分率 | 10/14 = **71.4%** | 8/14 = 57.1% | +14.3pp |
| Gateway 验证通过率 | 95/98 = **97.0%** | ~94/98 = 95.9% | +1.1pp |
| 语义记忆产出 | 220 | 166 | +32.5% |
| Findings 产出 | 131 | 83 | +57.8% |

> 第二轮每条候选的 Token 消耗上升 37.3%，但维度成功率 +7.2pp，语义记忆 +32.5%。这是“用预算换覆盖率”的工程权衡：自适应预算（34 轮）让 Agent 有更多轮次深入分析，减少了退化维度但增加了单候选成本。

### 退化分析（第二轮仅 1 个退化维度）

第一轮有 3 个退化维度（architecture produce timeout + networking-api / agent-guidelines 完全退化），第二轮仅剩 **1 个**：

**design-patterns（analyze hard timeout）**：
- Analyze 阶段 330s 超时，0 iters，0 tool calls——LLM 调用完全无响应
- abortSignal 在超时后立即触发 `⛔ abortSignal fired during LLM call — exiting`
- SessionStore 仍存储了 8 findings / 0 files 的报告（来自 fallback 数据）
- 该维度在第一轮中正常完成（QG=100, 12 candidates）——这说明 LLM “冻结” 是随机事件而非系统性缺陷

**第一轮退化维度在第二轮的表现：**

| 维度 | 第一轮状态 | 第二轮状态 | 第二轮产出 |
|------|---------|---------|---------|
| networking-api | 完全退化（0 token, 0 calls, 330s timeout） | QG=70, 34 tool calls, 477K tokens | 2 候选, 11 findings |
| agent-guidelines | 完全退化（0 token, 0 calls, 330s timeout） | QG=66, 29 tool calls, 613K tokens | 5 候选, 0 findings |
| architecture (produce) | QG=100 但 produce timeout（0 calls） | QG=66, 28 tool calls, 11 候选 | 正常产出 |

恢复的可能因素：**5-Tier 调度**——第一轮中 networking-api 和 agent-guidelines 与 8 个强维度挤在 Tier 3 中（10 维度 / 并发 3 = 3+ 波串行），资源争抢可能导致 LLM API 请求被流控。第二轮将它们分配到 Tier 2（networking-api）和 Tier 5（agent-guidelines），每 Tier 仅 3 维度 / 并发 3 = 1 波即完成。但仅凭两次测试无法确认因果关系，也可能是 LLM API 状态的偶然差异。

### 容错链路验证

第二轮首次在测试中触发了三条容错路径：

| 容错机制 | 触发场景 | 结果 |
|---------|---------|------|
| **hard timeout + abortSignal** | design-patterns analyze 330s | LLM 调用被中断，管线继续 |
| **fast-retry** | coding-standards produce 210s + 0 calls | 自动重试 → 14 iters → 9 候选 |
| **SUMMARIZE grace retry** | 多个维度的 forced summary 返回空响应 | grace 2/2 重试后兜底总结 |

fast-retry 的 **coding-standards** 案例值得注意：如果没有这条路径，该维度将只产出 0 条候选（与第一轮的 architecture produce timeout 相同结局），而实际上重试后产出了 9 条。

### 从数据看设计决策

1. **5-Tier 调度 vs 3-Tier**：退化维度从 2 减少到 0（不计算 LLM 冻结的 design-patterns），跨维度 cross-patterns 从 12 增加到 21，反射频率增加但总时长仅增加 3.8 分钟。但仅凭两次测试无法确认这是调度策略的贡献还是 LLM 随机性的影响。

2. **自适应预算**：`computeAnalystBudget(124)=34` 让 Agent 在 EXPLORE 阶段平均触达 35+ 文件，error-resilience 的 QG 从 66 分升到 100 分。代价是 7/14 维度仍耗尽预算——34 对于 124 文件的中型项目是合理但仍偏紧的值。

3. **SCAN→EXPLORE 提前 1 轮**：iter=2 而非 iter=3 节省了约 10-15 秒/维度（14 维度共 2-3 分钟）。更重要的是减少了 Agent 在 SCAN 阶段的无效规划，尽早进入代码阅读。

4. **二次冷启动的增量更新模式**：28 条 UPDATE 表明 MemoryConsolidator 的相似度合并机制在增量场景下正常工作。二次冷启动不是“推倒重来”，而是“更新增强”。

5. **L1 压缩仍是上限**：12 次 L1 已可控，但最高 53.9% 窗口占比接近 60% 阈值。如果项目文件数翻倍到 250+，可能会触发 L2。

## 19.10 第一轮 → 第二轮 全景对比

### 核心指标对比表

| 指标 | 第一轮（优化前） | 第二轮（优化后） | Δ |
|------|-----------|-----------|---|
| **调度策略** | 3-Tier (2+2+10) | 5-Tier (2+3+3+3+3) | 更均衡 |
| **Analyze 预算** | 固定 24 轮 | 自适应 34 轮 | +41.7% |
| **SCAN 阈值** | iter=3 | iter=2 | -1 轮 |
| **总时长** | 32.5 min | 36.3 min | +11.7% |
| **Input Tokens** | 8,263,086 | 11,147,521 | +34.9% |
| **Output Tokens** | 138,119 | 177,863 | +28.8% |
| **Tool Calls** | 498 | 609 | +22.3% |
| **候选知识** | 101 (82+19) | 98 | -3.0% |
| **有效维度** | 12/14 | **13/14** | +1 |
| **QG 100分** | 8/14 | **10/14** | +2 |
| **退化维度** | 2（完全退化） | **0**（1 LLM 冻结） | -2 |
| **Findings** | 83 | **131** | +57.8% |
| **Cross-refs** | 28 | **37** | +32.1% |
| **Reflections** | 3 | **5** | +66.7% |
| **语义记忆** | 166 | **220** | +32.5% |
| **实体引用** | 247 | **438** | +77.3% |
| **L1 压缩次数** | 7 | 12 | +71.4% |

### 成本 vs 收益分析

```
额外投入:                         额外产出:
  +2.8M input tokens (34.9%)        +1 有效维度 (networking-api 恢复)
  +111 tool calls (22.3%)           +48 findings (57.8%)
  +3.8 min wall time (11.7%)        +54 语义记忆 (32.5%)
                                    +9 cross-refs (32.1%)
                                    +2 reflections (66.7%)
                                    +191 实体引用 (77.3%)
                                    +1 fast-retry 救回的维度
```

每增加 1M input token，换来约 17 条额外 findings 和 19 条语义记忆。总成本增加 34.9% 但**知识密度**（findings/token）反而提升了 17%（131/11.1M vs 83/8.3M）——这可能说明自适应预算让 Agent 的阅读更有针对性，但也可能有 LLM 随机性的影响。

> **下一章**将以同一份数据为基础，展示从 Candidate 到 Recipe 的人工审核流程，以及 Guard 引擎如何将 Recipe 转化为实时代码校验规则。
