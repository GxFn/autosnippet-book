# 信号类型清单

> 12 种信号的发送者、消费者、触发条件。

## 信号结构

每个信号包含以下字段：

```typescript
interface Signal {
  type: SignalType;                    // 信号类别（12 种）
  source: string;                      // 产出模块标识
  target: string | null;               // 关联 Recipe/Module ID
  value: number;                       // 标准化信号值 0-1
  metadata: Record<string, unknown>;   // 原始数据载荷
  timestamp: number;                   // 信号产生时间戳 (ms)
}
```

## 12 种信号类型

| # | 信号类型 | 领域 | 说明 |
|:---|:---|:---|:---|
| 1 | `guard` | 合规 | Guard 审计发现违规 |
| 2 | `guard_blind_spot` | 合规 | Guard uncertain 超阈值，请求能力扩展 |
| 3 | `search` | 检索 | 搜索执行完成 |
| 4 | `usage` | 使用 | 知识被查看/采纳/应用 |
| 5 | `lifecycle` | 生命周期 | 知识状态变更（创建 · 晋升 · 弃用 · 矛盾 · 冗余） |
| 6 | `exploration` | Agent | Agent 探索阶段变化 |
| 7 | `quality` | 质量 | 反向验证 · 规则精度 · 源引用健康 |
| 8 | `panorama` | 全景 | 全景覆盖率更新 |
| 9 | `decay` | 衰退 | 衰退检测评分 |
| 10 | `forge` | 工具锻造 | 临时工具注册/过期/锻造完成 |
| 11 | `intent` | 意图 | 意图链记录 |
| 12 | `anomaly` | 异常 | 信号量突增异常 |

## 信号发送者

### guard

| 发送者 | 触发条件 | value 含义 |
|:---|:---|:---|
| `GuardCheckEngine` | auditFiles 发现违规 | 1 = 有 error，0.5 = 仅 warning |

### guard_blind_spot

| 发送者 | 触发条件 | value 含义 |
|:---|:---|:---|
| `GuardCheckEngine` | uncertain 结果 ≥5 条 | 发射 CapabilityRequest |

### search

| 发送者 | 触发条件 | value 含义 |
|:---|:---|:---|
| `SearchEngine` | 搜索完成 | min(total / limit, 1) |

### usage

| 发送者 | 触发条件 | value 含义 |
|:---|:---|:---|
| `GuardFeedbackLoop` | 用户采纳修复建议 | 1 |
| `HitRecorder` | view / adoption / application 事件 | 按事件类型 |

### lifecycle

| 发送者 | 触发条件 | value 含义 |
|:---|:---|:---|
| `ConfigWatcher` | 配置文件变更检测 | 变更数 |
| `Bootstrap` | 冷启动阶段进度 | 0.3 = 分析中，1 = 完成 |
| `StagingManager.enter` | Recipe 进入 staging | 1 |
| `StagingManager.rollback` | staging 回滚 | 0 |
| `StagingManager.promote` | staging 晋升为 active | 1 |
| `RecipeLifecycleSupervisor` | 生命周期状态变更 | 1 |
| `ContradictionDetector` | 检测到知识矛盾 | 矛盾严重度 |
| `RedundancyAnalyzer` | 检测到知识冗余 | 冗余度 |
| `ProposalExecutor` | 进化提案执行完成 | 1 |

### exploration

| 发送者 | 触发条件 | value 含义 |
|:---|:---|:---|
| `ExplorationTracker.exit` | 退出探索阶段 | 探索深度 |
| `ExplorationTracker.phase` | 探索阶段变化 | 阶段进度 |

### quality

| 发送者 | 触发条件 | value 含义 |
|:---|:---|:---|
| `ReverseGuard` | Recipe→Code 反向验证发现问题 | 1 |
| `RuleLearner` | 规则质量评估 | 1 - falsePositiveRate |
| `RuleLearner.precisionDrop` | 规则精度下降 | 精度值 |
| `SourceRefReconciler` | 源引用过时率 | 过时比例 |
| `SourceRefReconciler` | 源引用失效 | 1 |

### panorama

| 发送者 | 触发条件 | value 含义 |
|:---|:---|:---|
| `PanoramaService` | 全景覆盖率更新 | 覆盖率百分比 |

### decay

| 发送者 | 触发条件 | value 含义 |
|:---|:---|:---|
| `DecayDetector` | 衰退检测完成 | 1 - decayScore/100 |

### forge

| 发送者 | 触发条件 | value 含义 |
|:---|:---|:---|
| `TemporaryToolRegistry` | 临时工具注册 | 1 |
| `TemporaryToolRegistry` | 临时工具过期 | 0 |
| `ToolForge` | 工具锻造完成 | 1 |

### intent

| 发送者 | 触发条件 | value 含义 |
|:---|:---|:---|
| `TaskHandler` | 意图链记录（IntentChainRecord） | 1 |

### anomaly

| 发送者 | 触发条件 | value 含义 |
|:---|:---|:---|
| `SignalAggregator` | 任意信号类型在窗口内突增 3 倍 | 异常倍率 |

## 信号消费者

| 消费者 | 订阅信号 | 用途 |
|:---|:---|:---|
| `SignalBridge` | `*` + `guard` | 信号转发到 EventBus（`signal:event` + `guard:updated`） |
| `SignalAggregator` | guard · search · usage · lifecycle · forge · decay · quality | 滑窗统计 + 异常检测 |
| `SignalTraceWriter` | `*`（全部） | 全类型信号 JSONL 留痕 |
| `ComplianceReporter` | guard · quality | 合规性报告生成 |
| `MultiSignalRanker` | quality · usage | 搜索结果多信号精排 |
| `PanoramaService` | guard · lifecycle · usage | 全景视图缓存失效 |
| `KnowledgeMetabolism` | decay · quality · anomaly | 知识新陈代谢（衰退 · 矛盾 · 冗余检测） |
| `SignalCollector` | `*`（全部） | Skill 推荐引擎维度快照 |
| Intent JSONL | intent | Intent 信号持久化到 JSONL 文件 |

## HitRecorder 事件→信号映射

HitRecorder 将用户行为事件转换为标准化信号：

| 事件类型 | 统计字段 | 映射信号 |
|:---|:---|:---|
| `guardHit` | `guardHits` | `guard` |
| `searchHit` | `searchHits` | `search` |
| `view` | `views` | `usage` |
| `adoption` | `adoptions` | `usage` |
| `application` | `applications` | `usage` |
