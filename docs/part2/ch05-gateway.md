# Ch05. Gateway 统一管线

> validate → guard → route → audit — 所有请求的必经之路。

## 本章概要

Gateway 是 AutoSnippet 的请求管线中枢。无论来自 CLI、MCP 还是 HTTP 的请求，都经过相同的四阶段管线处理。本章解析管线的设计动机和每个阶段的实现。

## 问题场景

<!-- TODO: 多个入口（CLI/MCP/HTTP）导致的一致性问题 -->
<!-- TODO: 横切关注点（权限/审计/验证）如何统一处理 -->

## 四阶段管线设计

### Stage 1: Validate

<!-- TODO: 输入校验、Schema 验证 -->

### Stage 2: Guard

<!-- TODO: 权限检查、速率限制、安全策略 -->

### Stage 3: Route

<!-- TODO: 请求路由到具体 Service -->

### Stage 4: Audit

<!-- TODO: 审计日志记录、操作追踪 -->

## 管线的可插拔设计

<!-- TODO: 中间件注册机制 -->
<!-- TODO: 管线阶段的扩展点 -->

## 数据流图

```
Request → [Validate] → [Guard] → [Route] → Service → Response
              ↓            ↓         ↓           ↓
           Schema       Permission  Routing    [Audit]
           Error        Denied      Error      Log
```

## 关键代码

<!-- TODO: Gateway 核心管线代码 -->
<!-- TODO: 中间件注册示例 -->

## 小结

<!-- TODO -->

::: tip 下一章
[Ch06. AST 多语言分析](./ch06-ast)
:::
