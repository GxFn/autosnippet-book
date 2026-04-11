# 配置参考

> `constitution.yaml` + `default.json` 完整字段说明。

## constitution.yaml

AutoSnippet 的治理宪章，定义能力探测、角色权限和行为规则。版本 3.0。

### capabilities（能力层）

能力通过真实探测确定，不依赖用户声明。

| 能力 ID | 说明 | 探测方式 | 缓存 TTL |
|:---|:---|:---|:---|
| `git_write` | Git 推送权限 | `git push --dry-run` | 86400s |

### roles（角色层）

角色按最小权限原则分级，`developer` 需要 `git_write` 能力验证。

| 角色 | 名称 | 适用场景 | 关键权限 |
|:---|:---|:---|:---|
| `external_agent` | External Agent | IDE AI Agent（Cursor / Copilot / Claude Code） | 创建候选 · 搜索 · Guard 检查 · Task 管理 · 技能 CRUD · 进化提案 |
| `chat_agent` | ChatAgent | Dashboard 内置 AI 对话 | 读取 Recipe/候选/Guard 规则 · 创建候选 |
| `contributor` | Contributor | 有子仓库但无 push 权限的团队成员 | 只读：Recipe · 候选 · Guard 规则 · 审计日志 |
| `visitor` | Visitor | 严格模式下的最小权限访客 | 只读：Recipe · Guard 规则 |
| `developer` | Developer | 项目管理员（需 `git_write`） | 全部权限（`*`） |

**角色约束**：

| 角色 | 约束 |
|:---|:---|
| `external_agent` | 知识提交均进入 pending 状态；可创建进化提案（系统自动执行）；不能发布/弃用知识；不能修改 Guard 规则；不能删除数据 |
| `chat_agent` | 候选必须包含 reasoning；不能绕过 Guard 检查 |
| `contributor` | 不能创建/修改 Recipe；不能修改 Guard 规则 |
| `visitor` | 仅可读取，不能执行任何写操作 |

### rules（规则层）

| 规则 ID | 说明 | 检查函数 |
|:---|:---|:---|
| `destructive_confirm` | 删除操作需确认 | `destructive_needs_confirmation` |
| `content_required` | 创建候选/Recipe 必须包含内容 | `creation_needs_content` |
| `ai_no_direct_recipe` | AI 不能直接创建/批准 Recipe | `ai_cannot_approve_recipe` |
| `batch_authorized` | 批量操作需授权 | `batch_needs_authorization` |

## default.json

所有配置项及默认值。用户可在 `.autosnippet/config.json` 中覆盖。

### database

| 字段 | 类型 | 默认值 | 说明 |
|:---|:---|:---|:---|
| `type` | string | `"sqlite"` | 数据库类型 |
| `path` | string | `"./.autosnippet/autosnippet.db"` | SQLite 数据库路径 |
| `verbose` | boolean | `false` | 输出 SQL 日志 |

### server

| 字段 | 类型 | 默认值 | 说明 |
|:---|:---|:---|:---|
| `port` | number | `3000` | HTTP 服务端口 |
| `host` | string | `"localhost"` | 绑定地址 |
| `cors.enabled` | boolean | `true` | 启用 CORS |
| `cors.origin` | string | `"*"` | 允许的来源 |

### cache

| 字段 | 类型 | 默认值 | 说明 |
|:---|:---|:---|:---|
| `mode` | string | `"memory"` | 缓存模式 |
| `ttl` | number | `300` | 缓存 TTL（秒） |

### monitoring

| 字段 | 类型 | 默认值 | 说明 |
|:---|:---|:---|:---|
| `enabled` | boolean | `true` | 启用性能监控 |
| `slowRequestThreshold` | number | `1000` | 慢请求阈值（ms） |

### logging

| 字段 | 类型 | 默认值 | 说明 |
|:---|:---|:---|:---|
| `level` | string | `"info"` | 日志级别 |
| `format` | string | `"json"` | 日志格式 |
| `console` | boolean | `true` | 输出到控制台 |
| `file.enabled` | boolean | `true` | 写入文件 |
| `file.path` | string | `"./.autosnippet/logs"` | 日志文件目录 |

### constitution

| 字段 | 类型 | 默认值 | 说明 |
|:---|:---|:---|:---|
| `path` | string | `"./config/constitution.yaml"` | 宪章文件路径 |
| `strictMode` | boolean | `true` | 严格模式（无能力时降级为 visitor） |

### features

| 字段 | 类型 | 默认值 | 说明 |
|:---|:---|:---|:---|
| `USE_NEW_GATEWAY` | boolean | `true` | 启用新网关管线 |
| `REASONING_QUALITY_SCORE` | boolean | `true` | 启用推理链质量评分 |

### ai

| 字段 | 类型 | 默认值 | 说明 |
|:---|:---|:---|:---|
| `provider` | string | `"openai"` | AI Provider |
| `model` | string | `"gpt-4"` | 模型名称 |
| `temperature` | number | `0.7` | 生成温度 |
| `maxTokens` | number | `2000` | 最大输出 token |

### vector

| 字段 | 类型 | 默认值 | 说明 |
|:---|:---|:---|:---|
| `enabled` | boolean | `true` | 启用向量检索 |
| `adapter` | string | `"auto"` | 向量适配器（auto / hnsw / json） |
| `dimensions` | number | `768` | 向量维度 |
| `indexPath` | string | `"./data/vector-index"` | 索引存储路径 |
| `hnsw.M` | number | `16` | HNSW 每节点连接数 |
| `hnsw.efConstruct` | number | `200` | 构建时搜索宽度 |
| `hnsw.efSearch` | number | `100` | 查询时搜索宽度 |
| `quantize` | string | `"auto"` | 量化模式（auto / sq8 / none） |
| `quantizeThreshold` | number | `3000` | 启用量化的最小向量数 |
| `persistence.format` | string | `"binary"` | 持久化格式 |
| `persistence.flushIntervalMs` | number | `2000` | 刷盘间隔 |
| `persistence.flushBatchSize` | number | `100` | 刷盘批次大小 |
| `hybrid.enabled` | boolean | `true` | 启用混合检索 |
| `hybrid.rrfK` | number | `60` | RRF 融合参数 k |
| `hybrid.alpha` | number | `0.5` | 向量/关键词权重比 |
| `contextualEnrich` | boolean | `false` | 上下文增强嵌入 |
| `contextualModel` | string | `"claude-sonnet-4-20250514"` | 上下文增强模型 |
| `autoSyncOnCrud` | boolean | `true` | CRUD 时自动同步索引 |
| `syncDebounceMs` | number | `2000` | 同步去抖延迟 |
| `dimensionGuard` | boolean | `true` | 维度守卫（防止维度不匹配） |

### qualityGate

| 字段 | 类型 | 默认值 | 说明 |
|:---|:---|:---|:---|
| `maxErrors` | number | `0` | 允许的最大 error 数 |
| `maxWarnings` | number | `20` | 允许的最大 warning 数 |
| `minScore` | number | `70` | 最低质量评分 |

### guard

| 字段 | 类型 | 默认值 | 说明 |
|:---|:---|:---|:---|
| `disabledRules` | string[] | `[]` | 禁用的规则 ID 列表 |
| `codeLevelThresholds.swift-excessive-force-unwrap` | number | `5` | Swift 强制解包阈值 |
| `codeLevelThresholds.rust-excessive-unwrap` | number | `3` | Rust unwrap 阈值 |
| `codeLevelThresholds.rust-excessive-unsafe` | number | `3` | Rust unsafe 阈值 |
| `codeLevelThresholds.dart-excessive-late` | number | `3` | Dart late 变量阈值 |

### taskGraph

| 字段 | 类型 | 默认值 | 说明 |
|:---|:---|:---|:---|
| `decision.staleDays` | number | `30` | 决策过期天数 |
| `decision.maxActiveInPrime` | number | `20` | prime 返回的最大活跃决策数 |
| `decision.maxStaleInPrime` | number | `10` | prime 返回的最大过期决策数 |
