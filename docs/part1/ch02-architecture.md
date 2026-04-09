# Ch02. 架构总览 — DDD 分层与递归模式

> 13 个核心模块，不是偶然堆叠，而是 DDD 分层思想的递归应用。

## 本章概要

AutoSnippet 采用领域驱动设计（DDD）的分层架构，并将这种分层思想递归应用到每个子模块内部。本章解析整体架构蓝图，为后续章节建立全局认知框架。

## 架构全景图

```
┌─────────────────────────────────────────────┐
│                  CLI / MCP / HTTP            │  ← 接入层
├─────────────────────────────────────────────┤
│                  Agent Layer                 │  ← 智能层
├─────────────────────────────────────────────┤
│                  Gateway                     │  ← 管线层
├─────────────────────────────────────────────┤
│             Service Layer (15 子域)           │  ← 服务层
├─────────────────────────────────────────────┤
│             Domain Layer                     │  ← 领域层
├─────────────────────────────────────────────┤
│             Repository Layer                 │  ← 仓储层
├─────────────────────────────────────────────┤
│          Infrastructure Layer                │  ← 基础设施层
└─────────────────────────────────────────────┘
```

## 各层职责

### 接入层 (CLI / MCP / HTTP)

<!-- TODO: 三种接入方式的统一入口设计 -->
<!-- TODO: 请求如何被标准化 -->

### 智能层 (Agent)

<!-- TODO: Agent 的独立架构地位 -->
<!-- TODO: 为什么 Agent 不属于 Service -->

### 管线层 (Gateway)

<!-- TODO: validate → guard → route → audit 管线 -->
<!-- TODO: 管线的可插拔设计 -->

### 服务层 (Service)

<!-- TODO: 15 个子域的划分依据 -->
<!-- TODO: 服务间的依赖规则 -->

### 领域层 (Domain)

<!-- TODO: 纯值对象与实体的划分 -->
<!-- TODO: 领域逻辑不依赖基础设施 -->

### 仓储层 (Repository)

<!-- TODO: Repository 模式的应用 -->

### 基础设施层 (Infrastructure)

<!-- TODO: 12 个子模块的职责边界 -->

## 递归分层模式

::: info 核心洞察
AutoSnippet 的每个服务子域（如 Guard、Search）内部也遵循类似的分层：接口定义 → 业务逻辑 → 数据访问。
:::

<!-- TODO: 用 Guard 服务为例展示递归分层 -->

## 依赖方向与约束

```
接入层 → Agent → Gateway → Service → Domain → Repository → Infrastructure
                                              ↗
                                     (Domain 不依赖 Service)
```

<!-- TODO: 依赖倒置的具体应用点 -->

## 模块目录映射

| 架构层 | 目录 | 关键文件数 |
|--------|------|-----------|
| 核心层 | `lib/core/` | AST、Constitution、Gateway、Discovery、Enhancement |
| 领域层 | `lib/domain/` | KnowledgeEntry、Dimension、Snippet |
| 服务层 | `lib/service/` | 15 个子域，40+ Service 类 |
| Agent 层 | `lib/agent/` | Runtime、Tools(54)、Memory(6层)、Forge |
| 基础设施 | `lib/infrastructure/` | DB、Cache、Event、Vector、Logging |
| 仓储层 | `lib/repository/` | Knowledge、Evolution、Token、Remote |
| 外部集成 | `lib/external/` | MCP、AI Provider、Lark |
| HTTP | `lib/http/` | 22 路由文件，142 端点 |
| CLI | `lib/cli/` | 14 命令实现 |
| DI 容器 | `lib/injection/` | ServiceContainer、40+ 模块注册 |
| 共享 | `lib/shared/` | 28 个工具文件 |
| 类型 | `lib/types/` | 全局类型定义 |

## 小结

<!-- TODO: 总结分层带来的可维护性和可测试性 -->

::: tip 下一章
[Ch03. SOUL 原则与设计决策](./ch03-soul)
:::
