# AutoSnippet 介绍

> 将代码库中的模式提取为知识库，供 IDE 中的 AI 编码助手查询——让生成的代码真正符合你们团队的规范。

## 问题：AI 不知道你们怎么写代码

Copilot 和 Cursor 不知道你们团队怎么写代码。它们生成的东西能跑，但不像你们写的——命名不对、模式不对、抽象层次不对。最后要么你重写 AI 的输出，要么在每次 Code Review 里反复解释同样的规范。

**更深层的问题是**：这不是提示词能解决的。你可以写一页 System Prompt 告诉 AI "我们用 Repository 模式访问数据"，但当项目有 200 个这样的约定时，没有哪个上下文窗口装得下。即使装得下，LLM 在长上下文中的注意力衰减也会让大部分规范形同虚设。

这个问题的本质是：**团队的编码知识是分散的、隐式的、持续演化的**，而 LLM 需要的是**结构化的、可检索的、确定性的**输入。

## 方案：本地化的项目知识引擎

AutoSnippet 在你的代码库和 AI 之间建立一层**本地化的项目记忆**。它扫描你的代码库，通过 AST 分析和 AI 理解提取有价值的模式（需要你批准），然后通过 [MCP](https://modelcontextprotocol.io/) 让所有 AI 工具都能按需查询。

```text
你的代码  →  AST 分析 + AI 提取  →  你来审核  →  知识库（ .md 文件 + 本地 SQLite ）
                                                   ↓
                                    Cursor / Copilot / VS Code / Claude Code / Xcode
                                                   ↓
                                           AI 按你的模式生成
                                                   ↓
                                         Guard 引擎自动合规检查
```

![AutoSnippet 核心工作流](/images/ch01/01-core-workflow.png)

这些知识持久化在本地，不占用 LLM 的上下文窗口，而是在 AI 需要时**按需注入**——项目知识积累得越多，生成的代码越符合你们的规范。

知识不是静态快照。每条知识有自己的**六态生命周期**（pending → staging → active → evolving → decaying → deprecated），会随着代码的演进自动衰减、进化或淘汰。SourceRefReconciler 持续检测知识引用的源文件是否存活，其结果通过信号系统被 ReverseGuard、DecayDetector 等消费，驱动知识生命周期转换，确保知识库的可信度。

## 核心洞察：有限答案，无限问题

传统的 AI 编码辅助是**每次对话都从零开始**：你给它上下文，它给你代码。上下文窗口是有限的，你的项目约定却在不断膨胀——200 条规范塞不进 128K token，即使塞进去注意力衰减也会让大部分形同虚设。这是一场你注定输掉的军备竞赛。

AutoSnippet 反转了这个等式。

> **先提交有限的答案，用来回答无限的问题。**

一次冷启动产出几十到几百条 Recipe——这是"有限的答案"。但每一条都经过 AST 验证、质量评分、人工审核，是项目真实模式的精确表达。此后，无论团队成员问出什么样的编码问题，Agent 都能从这有限的知识库中组合出准确的回答。知识库不需要覆盖所有可能的问题——它捕获项目的**核心模式和约定**，剩下的由 Agent 的推理能力补全。

更关键的是：**发问与回答在同一个 Agent 内完成。** 编程 Agent 通过 MCP 工具与知识库**语义对话**——不是把知识库塞进上下文，而是通过结构化的工具接口按需检索。同一个 Agent 既是知识的生产者（冷启动时提取模式），也是知识的消费者（日常编码时查询规范、检查合规）。提取知识的 Agent 理解这些知识的语义结构，使用知识的 Agent 知道应该如何提问——这不是两个割裂的系统，而是一个自洽的认知闭环。

这个洞察构成了整个系统的设计原点。后续章节中每一个工程决策，最终都在回答同一组问题：如何让有限的知识覆盖更广的问题空间？如何让知识的生产和消费成本趋近于零？如何让这个闭环自我强化而非自我衰减？

## 使用速览

```bash
npm install -g autosnippet

cd your-project
asd setup     # 初始化工作空间 + 数据库 + MCP 配置
asd ui        # 启动后台服务，IDE 和 MCP 工具依赖此服务运行
```

> **Trae / Qoder 用户：** `asd setup` 后运行 `asd mirror`，将 `.cursor/` 配置同步到 `.trae/` / `.qoder/`。

安装完成后，打开 IDE 的 **Agent Mode**（Cursor Composer / VS Code Copilot Chat / Trae），跟 Agent 对话即可——`asd setup` 已通过 MCP 协议将 AutoSnippet 注册为工具服务。

> **首次使用：** 需在 IDE 的 MCP 设置中手动开启 `autosnippet` 服务。

> **提示：** IDE Agent 使用的模型越强，效果越好。推荐选择 Claude Opus 4.6 / Sonnet 4.6、GPT-5.4 或 Gemini 3.1 Pro。

### 冷启动：建立项目知识库

> 💬 *"帮我冷启动，生成项目知识库"*

Agent 扫描整个项目，提取出团队的编码模式、架构约定、调用习惯，同时生成项目 Wiki。冷启动只做一次，之后就进入日常使用。

冷启动背后是一条完整的管线：文件收集 → 10 语言 AST 解析（Tree-sitter）→ 25 维度框架分析 → 61+ 工具编排的 Agent 推理循环 → 人工审核。Agent 不是简单的"让 LLM 读代码然后总结"，而是在结构化分析的基础上做确定性标记，只把真正不确定的部分交给 LLM 消解。

### 日常：说一句话就行

| 你说 | 你得到 |
|------|--------|
| ① *"项目里 API 接口怎么写"* | 直接拿到符合你们项目风格的代码，而不是通用示例 |
| ② *"帮我写一个用户注册接口"* | 生成的代码自动遵循刚才查到的 API 规范 |
| ③ *"检查这个文件符不符合项目规范"* | 提交前过一遍规范检查，减少 Code Review 里的反复沟通 |
| ④ *"把这段错误处理保存为项目规范"* | 一次沉淀，以后所有人的 AI 都会学会这个写法 |

Agent 写完代码后，Guard 合规引擎会自动检查 diff——发现违规即自我修复，不需要你手动介入。

### 越用越好

候选在 Dashboard（`asd ui`）中审核并批准 → 变成 **Recipe** → AI 生成代码时自动参照 → 你发现新的好写法 → 继续沉淀 → AI 越来越像团队的人。这些知识是本地 Markdown 文件，跟 git 走，不会随对话消失，也不占上下文窗口——知识库再大也不会拖慢 AI。

## 核心能力总览

围绕"有限答案回答无限问题"这一核心洞察，AutoSnippet 构建了完整的知识工程系统——从代码理解到知识提取、从合规检查到知识交付，每个模块都在服务同一个闭环。以下是各核心模块的速览，每个模块在后续章节中都有独立的深入解析。

### 多语言 AST 分析与项目全景

基于 Tree-sitter 的 10 语言统一解析：Go · Python · Java · Kotlin · Swift · TypeScript · JavaScript · Rust · Objective-C · Dart。不只是语法树——还包括类继承关系、调用图推断（5 阶段增量分析）、设计模式检测（Singleton / Delegate / Factory / Observer）、Tarjan 耦合分析和 Kahn 拓扑分层。这些结构化数据构成项目的**全景图（Panorama）**，是所有上层智能的基础。*→ [Ch03 架构全景](../part2/ch03-architecture) · [Ch05 代码理解](../part2/ch05-ast)*

### 知识的生命周期与可信任性

每条知识（KnowledgeEntry）不是一个静态文本，而是一个领域实体，携带 25 维分类、质量评分、置信度推理链、源文件引用证据。六态生命周期赋予知识自主演化的能力：

```text
pending → staging → active → evolving → decaying → deprecated
```

**进化提案（Evolution Proposal）** 是安全设计的核心：Agent 不直接修改已有知识，而是附加提案（enhance / merge / supersede / correction）。低风险提案在观察期后自动执行，高风险提案（contradiction / reorganize）必须人工确认。

**源代码引用（SourceRefs）** 保证可信任性：每条 Recipe 携带项目中真实文件路径作为证据链，SourceRefReconciler 持续检查路径健康状态，git rename 自动修复，引用失活的知识会被信号系统标记并触发衰退。*→ [Ch06 KnowledgeEntry](../part3/ch06-knowledge-entry) · [Ch07 生命周期](../part3/ch07-lifecycle)*

### Guard 合规引擎

不是静态 lint，而是一个**四层检测 + 三态输出**的免疫系统：

1. **正则匹配** — 快速的一级过滤
2. **代码级多行分析** — 跨行的模式检测
3. **Tree-sitter AST** — 语义级的结构检查
4. **跨文件分析** — 依赖关系级的约束验证

每条违规输出 pass / violation / uncertain 三态。不确定的结果不会强制报错，而是通过 UncertaintyCollector 追踪，交由开发者决策。Guard 同时具备**反向验证（ReverseGuard）**能力——检测 Recipe 引用的符号是否仍然存活，发现 5 种代码漂移类型。*→ [Ch10 Guard 引擎](../part4/ch10-guard)*

### Agent Runtime：ReAct 推理循环

内置的统一 Agent 引擎，采用 CoALA 认知架构：

```text
感知（Perception）→ 工作记忆（Working Memory）→ 推理（Reasoning）→ 行动（Action）→ 反思（Reflection）
```

61+ 工具覆盖 AI 分析、AST 图查询、进化提案、Guard 检查、生命周期管理、知识检索、项目文件访问、系统交互等全部能力。每轮迭代最多执行 8 次工具调用，三级递进上下文压缩（summary → extract → token budget）控制窗口膨胀。内置 2-strike 错误恢复策略、空响应 rollback、熔断器感知和提交去重机制。*→ [Ch13 AgentRuntime](../part5/ch13-agent-runtime) · [Ch14 正交组合](../part5/ch14-orthogonal)*

### 混合搜索引擎

双路统合搜索：FieldWeighted 字段加权检索 + HNSW 向量语义检索 + RRF 融合排序（k=60）。七信号加权排序（relevance / authority / recency / popularity / difficulty / contextMatch / vector）根据使用场景动态调整权重——lint 场景 relevance 优先，generate 场景 popularity 和 vector 并重，learning 场景 difficulty 最重。

向量系统是零外部依赖的纯 JavaScript HNSW 实现（768 维），BatchEmbedder 通过批量 API + 并发控制实现 **50 倍加速**（串行 30s → 批量 0.6s）。*→ [Ch11 混合检索](../part4/ch11-search)*

### 六通道知识交付

知识不只通过 MCP 工具查询交付，还主动推送到 IDE 的原生机制中：

| 通道 | 交付物 | 目标 |
|------|--------|------|
| **A** | alwaysApply 一行式规则 | `.cursor/rules/` |
| **B** | When/Do/Don't 主题规则 | `.cursor/rules/` 按主题分文件 |
| **C** | 项目技能同步 | `.cursor/skills/` |
| **D** | 压缩的开发文档 | `.cursor/skills/autosnippet-devdocs/` |
| **F** | Agent 指令集 | `AGENTS.md` · `CLAUDE.md` · `.github/copilot-instructions.md` |
| **Mirror** | IDE 镜像 | `.trae/` · `.qoder/`（可选） |

TokenBudget 控制每个通道的 token 上限，KnowledgeCompressor 按 rules / patterns / facts / documents 分类压缩，确保不超出 IDE 的上下文预算。*→ [Ch17 MCP 与交付](../part6/ch17-mcp-delivery)*

### 信号驱动架构

12 种信号类型（guard / search / usage / lifecycle / decay / quality / panorama / intent / anomaly …）通过统一的 SignalBus 同步分发（< 0.1ms per emit）。HitRecorder 批量采集使用信号，30 秒定时 flush 到 SQLite，兼顾实时性与写入性能。

信号饱和触发而非定时扫描——知识的衰退、进化、质量变化都由真实使用信号驱动，而不是每天跑一遍定时任务。*→ [Ch12 Panorama · Signal](../part4/ch12-metabolism)*

## 设计哲学

这些哲学不是抽象原则，而是代码中随处可见的工程决策。[Ch02](./ch02-soul) 将深入解读每一项哲学如何化为具体的代码守护点，此处勾勒轮廓：

### 1. AI 编译期 + 工程运行期

LLM 在"编译期"产出确定性执行物（Recipe、Guard 规则、Evolution 提案），运行期纯工程逻辑——搜索、交付、合规检查不依赖 LLM。这意味着一旦知识库建立，即使没有 AI 连接，Guard、Search、Delivery 仍然正常工作。

### 2. 确定性标记 + 概率性消解

AST 分析做确定的事（类继承、调用图、模式检测），不确定的部分（"这个模式是否值得提取为规范"）结构化上抛给 AI。Guard 的四层检测也遵循同样的原则——正则和 AST 做确定性匹配，只有 uncertain 的结果才需要 AI 或人工介入。

### 3. 正交组合 > 特化子类

Agent 系统用 Capability × Strategy × Policy 三维正交组合替代 N 个特化子类。同一个 AgentRuntime 引擎，搭配不同的 Strategy（Research / Code Review / Evolution）和 Policy（验证规则集）就能处理完全不同的任务，而不需要 ResearchAgent、ReviewAgent、EvolutionAgent 三个子类。

### 4. 信号驱动 > 时间驱动

没有 cron job。知识衰退由真实使用信号（30 天无 guardHit / searchHit）触发，进化提案由矛盾检测信号触发，质量评分由采用率信号更新。SignalBus 的异常隔离保证消费者异常不阻断信号分发。

### 5. 纵深防御

六层安全链路：Constitution（YAML 角色权限）→ Gateway（4 步管线：validate → guard → route → audit）→ Permission（3-tuple RBAC）→ SafetyPolicy（Agent 行为约束）→ PathGuard（文件系统边界）→ ConfidenceRouter（置信度路由）。任何一层失败都会阻断请求，每层独立记录审计日志。

## 工程规模

![AutoSnippet 工程规模数据卡](/images/ch01/02-engineering-scale.png)

| 维度 | 数据 |
|------|------|
| AST 支持语言 | 10 种（Go · Python · Java · Kotlin · Swift · TS · JS · Rust · ObjC · Dart） |
| Agent 工具 | 61+ |
| 知识维度框架 | 25 维（13 通用 + 7 语言特定 + 5 框架特定） |
| 搜索信号 | 6 维加权 |
| Guard 检测层 | 4 层（正则 → 代码级 → AST → 跨文件） |
| 知识生命周期 | 6 态状态机 |
| 交付通道 | 6 通道 |
| 信号类型 | 12 种 |
| 安全防御层 | 6 层 |
| 支持 IDE | Cursor · VS Code · Claude Code · Trae · Qoder · Xcode |
| DI 模块 | 9 个（Signal · Infra · App · Knowledge · Vector · Guard · Agent · AI · Panorama） |

## 展望

"有限答案回答无限问题"不是一个已经到达的终点，而是一个持续逼近的方向。当前系统的每一项改进，本质上都在优化同一个等式的两端——让"有限的答案"更精准、更鲜活、更广泛，让"无限的问题"被回答得更快、更准、更自然。

### Agent 能力的深度挖掘

目前产出的 Recipes 能够保证正确且有价值，但与全景分析对比仍有知识空白。25 维框架覆盖了分析的广度，但 Agent 在每个维度的深度挖掘能力仍有提升空间——目标是 **90% 覆盖的可信任 Recipes**。

### 快速演化项目的知识跟随

AutoSnippet 自身就是一个架构频繁调整的项目，知识库需要设计更稳定的快速跟随方案。SourceRefReconciler 和 DecayDetector 已经解决了"知识过时"的检测问题，下一步是让知识在架构重构时能够自动重组而非逐条衰退。

### 主项目与子项目的知识共享

不同主项目中的同一子模块可能产出不一致的 Recipe。计划设计云端共享能力，子项目通过配置指向一份共享 Recipe 源，同时保留本地覆写的能力。

### 飞书讨论的快速落地

基于飞书 Lark Transport 的衍生功能：将技术讨论中确认的规范直接生成 Recipe，通过 Guard 引擎标注代码中的不合规处，支持自然语言提示词的一键修复。

### Git 流水线集成

多人开发场景下，Guard 检查接入 CI/CD（`asd guard:ci`），Recipe 变更走 Pull Request 审核流程，知识库与代码仓库保持同步的版本控制。

## 本书结构

本书按照 AutoSnippet 的架构层次组织，**每一章对应一个核心模块**，从设计动机到实现细节逐层展开：

- **Part 1（起点与哲学）**：本章介绍 + SOUL 设计原则
- **Part 2（工程基石）**：架构全景 → 安全管线 → 代码理解
- **Part 3（知识领域）**：KnowledgeEntry 实体 → 六态生命周期 → 质量评分
- **Part 4（核心服务）**：Bootstrap 冷启动 → Guard 合规 → Search 检索 → 信号代谢
- **Part 5（Agent 智能层）**：Agent Runtime → 正交组合 → 工具与记忆
- **Part 6（平台与交付）**：数据基础设施 → MCP 六通道交付 → 界面层

::: tip 下一章
[SOUL 原则 — 知识引擎的身份约束](./ch02-soul)
:::
