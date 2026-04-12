# MCP 工具清单

> AutoSnippet 通过 MCP 协议暴露的 18 个工具完整列表。

工具分为两个层级：**Agent Tier**（16 个，IDE Agent 日常使用）和 **Admin Tier**（2 个，管理员操作）。每个工具调用都经过 Gateway 四阶段管线（Validate → Guard → Route → Audit）。

## Agent Tier（16 个工具）

### autosnippet_health

检查服务状态和知识库统计（条目总数、kind/lifecycle 分布）。`total=0` 时需要冷启动。

**参数**：无

### autosnippet_search

知识库搜索，支持 5 种模式。

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|:---|:---|:---|:---|:---|
| `query` | string | ✅ | — | 搜索关键词或自然语言描述 |
| `mode` | enum | — | `"auto"` | auto / keyword / weighted / semantic / context |
| `kind` | enum | — | `"all"` | all / rule / pattern / fact |
| `limit` | int | — | `10` | 返回数量（1-100） |
| `language` | string | — | — | 按编程语言过滤 |
| `sessionId` | string | — | — | 会话 ID（context 模式用） |
| `sessionHistory` | array | — | — | 会话历史 |

### autosnippet_knowledge

知识条目管理：list / get / insights / confirm_usage。

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|:---|:---|:---|:---|:---|
| `operation` | enum | — | `"list"` | list / get / insights / confirm_usage |
| `id` | string | — | — | get / insights / confirm_usage 时必填 |
| `kind` | enum | — | — | all / rule / pattern / fact |
| `language` | string | — | — | 按语言过滤 |
| `category` | string | — | — | 按分类过滤 |
| `knowledgeType` | string | — | — | 按知识类型过滤 |
| `status` | string | — | — | 按状态过滤 |
| `complexity` | string | — | — | 按复杂度过滤 |
| `limit` | int | — | `20` | 返回数量（1-200） |
| `usageType` | enum | — | — | adoption / application（confirm_usage 用） |
| `feedback` | string | — | — | 使用反馈 |

### autosnippet_structure

项目结构发现：targets / files / metadata。

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|:---|:---|:---|:---|:---|
| `operation` | enum | — | `"targets"` | targets / files / metadata |
| `targetName` | string | — | — | files 操作时指定目标名 |
| `includeSummary` | boolean | — | `true` | 包含摘要 |
| `includeContent` | boolean | — | `false` | 包含文件内容 |
| `contentMaxLines` | int | — | `100` | 内容截取行数 |
| `maxFiles` | int | — | `500` | 最大文件数（1-5000） |

### autosnippet_graph

知识关系图谱查询：query / impact / path / stats。

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|:---|:---|:---|:---|:---|
| `operation` | enum | ✅ | — | query / impact / path / stats |
| `nodeId` | string | — | — | query / impact 时指定节点 ID |
| `nodeType` | string | — | `"recipe"` | 节点类型 |
| `fromId` | string | — | — | path 起点 |
| `toId` | string | — | — | path 终点 |
| `direction` | enum | — | `"both"` | out / in / both |
| `maxDepth` | int | — | `3` | 最大深度（1-10） |
| `relation` | string | — | — | 关系类型过滤 |

### autosnippet_call_context

函数/方法调用链查询：callers / callees / both / impact。

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|:---|:---|:---|:---|:---|
| `methodName` | string | ✅ | — | 函数/方法名称，支持部分匹配 |
| `direction` | enum | — | `"both"` | callers / callees / both / impact |
| `maxDepth` | int | — | `2` | 最大深度（1-5） |

### autosnippet_guard

代码合规检查。支持：无参数（git diff）、files、code、reverse_audit、coverage_matrix、compliance_report。

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|:---|:---|:---|:---|:---|
| `operation` | enum | — | — | check / review / reverse_audit / coverage_matrix / compliance_report |
| `files` | string[] | — | — | 文件路径列表 |
| `code` | string | — | — | 代码片段 |
| `language` | string | — | — | 语言标识 |
| `filePath` | string | — | — | 文件路径 |
| `maxFiles` | number | — | — | reverse_audit / coverage_matrix 扫描上限 |

### autosnippet_submit_knowledge

提交知识条目（单条/批量统一管线）。自动融合分析检测重叠。

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|:---|:---|:---|:---|:---|
| `items` | object[] | ✅ | — | 知识条目数组（1~N） |
| `target_name` | string | — | — | 来源标识 |
| `source` | string | — | `"mcp"` | 来源标记 |
| `skipConsolidation` | boolean | — | `false` | 跳过融合分析 |
| `skipDuplicateCheck` | boolean | — | `false` | 跳过去重 |
| `client_id` | string | — | — | 客户端 ID |
| `dimensionId` | string | — | — | 冷启动关联维度 |
| `supersedes` | string | — | — | 声明替代旧 Recipe 的 ID |

### autosnippet_skill

技能管理：list / load / create / update / delete / suggest。

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|:---|:---|:---|:---|:---|
| `operation` | enum | ✅ | — | list / load / create / update / delete / suggest |
| `name` | string | — | — | Skill 名称（kebab-case） |
| `section` | string | — | — | load 时过滤章节 |
| `description` | string | — | — | create / update 描述 |
| `content` | string | — | — | create / update Markdown 内容 |
| `overwrite` | boolean | — | `false` | 覆盖已有 |
| `createdBy` | enum | — | `"external-ai"` | manual / user-ai / system-ai / external-ai |

### autosnippet_bootstrap

冷启动——无参数。自动分析项目（AST · 依赖图 · Guard 审计），返回 Mission Briefing。

**参数**：无

### autosnippet_rescan

增量重扫——保留现有 Recipe，重新分析项目，运行 RecipeRelevanceAuditor。

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|:---|:---|:---|:---|:---|
| `dimensions` | string[] | — | — | 指定维度列表，空=全部 |
| `reason` | string | — | — | 触发原因 |

### autosnippet_evolve

批量 Recipe 进化决策：propose_evolution / confirm_deprecation / skip。

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|:---|:---|:---|:---|:---|
| `decisions` | array | ✅ | — | 决策数组 |
| `decisions[].recipeId` | string | ✅ | — | 目标 Recipe ID |
| `decisions[].action` | enum | ✅ | — | propose_evolution / confirm_deprecation / skip |
| `decisions[].evidence` | object | — | — | 进化证据：`{ codeSnippet, filePath, type, suggestedChanges }` |
| `decisions[].reason` | string | — | — | 弃用原因 |
| `decisions[].skipReason` | enum | — | — | still_valid / insufficient_info |

### autosnippet_dimension_complete

维度分析完成通知，处理 Recipe 关联、Skill 生成、检查点、跨维度提示。

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|:---|:---|:---|:---|:---|
| `dimensionId` | string | ✅ | — | 维度 ID |
| `analysisText` | string | ✅ | — | 分析报告（Markdown） |
| `sessionId` | string | — | — | Bootstrap session ID |
| `submittedRecipeIds` | string[] | — | — | 已提交的 Recipe IDs |
| `keyFindings` | string[] | — | — | 关键发现（3-5 项） |
| `candidateCount` | number | — | — | 候选数量 |
| `referencedFiles` | string[] | — | — | 引用文件列表 |
| `crossDimensionHints` | Record | — | — | 跨维度提示 |

### autosnippet_wiki

Wiki 文档生成：plan / finalize。

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|:---|:---|:---|:---|:---|
| `operation` | enum | ✅ | — | plan / finalize |
| `language` | enum | — | `"zh"` | zh / en |
| `sessionId` | string | — | — | 会话 ID |
| `articlesWritten` | string[] | — | — | finalize 时的文件列表 |

### autosnippet_panorama

项目全景查询，支持 8 种操作。

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|:---|:---|:---|:---|:---|
| `operation` | enum | — | `"overview"` | overview / module / gaps / health / governance_cycle / decay_report / staging_check / enhancement_suggestions |
| `module` | string | — | — | operation=module 时必填 |

### autosnippet_task

任务与决策管理。**每条消息必须先调用 `prime`**。

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|:---|:---|:---|:---|:---|
| `operation` | enum | ✅ | — | prime / create / close / fail / record_decision |
| `title` | string | — | — | create / record_decision 标题 |
| `description` | string | — | — | record_decision 描述 |
| `id` | string | — | — | Task ID（close / fail） |
| `reason` | string | — | — | close / fail 原因 |
| `rationale` | string | — | — | record_decision 理由 |
| `tags` | string[] | — | — | record_decision 标签 |
| `userQuery` | string | — | — | 用户输入文本 |
| `activeFile` | string | — | — | 当前活跃文件路径 |
| `language` | string | — | — | 当前编程语言 |

## Admin Tier（2 个工具）

### autosnippet_enrich_candidates

诊断候选条目字段完整度（不调用 AI），返回每个候选的缺失字段列表。

| 参数 | 类型 | 必填 | 说明 |
|:---|:---|:---|:---|
| `candidateIds` | string[] | ✅ | 1-20 个 Candidate ID |

### autosnippet_knowledge_lifecycle

知识条目生命周期操作。

| 参数 | 类型 | 必填 | 说明 |
|:---|:---|:---|:---|
| `id` | string | ✅ | 条目 ID |
| `action` | enum | ✅ | submit / approve / reject / publish / deprecate / reactivate / to_draft / fast_track |
| `reason` | string | — | reject / deprecate 理由 |

## Gateway 权限映射

每个工具的写操作都经过 Gateway 权限检查：

| 工具 | Gateway Action | 资源 |
|:---|:---|:---|
| `autosnippet_submit_knowledge` | `knowledge:create` | knowledge |
| `autosnippet_rescan` | `knowledge:bootstrap` | knowledge |
| `autosnippet_dimension_complete` | `knowledge:bootstrap` | knowledge |
| `autosnippet_wiki`（finalize） | `knowledge:create` | knowledge |
| `autosnippet_evolve` | `knowledge:evolve` | knowledge |
| `autosnippet_guard`（files） | `guard_rule:check_code` | guard_rules |
| `autosnippet_skill`（create） | `create:skills` | skills |
| `autosnippet_skill`（update） | `update:skills` | skills |
| `autosnippet_skill`（delete） | `delete:skills` | skills |
| `autosnippet_task`（create） | `task:create` | intent |
| `autosnippet_task`（close/fail） | `task:update` | intent |
| `autosnippet_task`（record_decision） | `task:create` | intent |
| `autosnippet_enrich_candidates` | `knowledge:update` | knowledge |
| `autosnippet_knowledge_lifecycle` | `knowledge:update` | knowledge |
