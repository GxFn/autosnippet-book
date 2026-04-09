# Ch24. DI 容器设计

> ServiceContainer — 懒加载单例的依赖注入。

## 本章概要

AutoSnippet 使用自研的轻量 DI 容器管理 40+ 个服务的依赖关系。本章解析 ServiceContainer 的懒加载设计、模块注册机制和服务生命周期管理。

## 为什么自研而非用框架

<!-- TODO: 轻量级需求 vs inversify/tsyringe 的权衡 -->

## ServiceContainer 设计

### 懒加载单例

<!-- TODO: 按需实例化，首次访问时创建 -->
<!-- TODO: 循环依赖检测 -->

### 模块注册

<!-- TODO: modules/ 目录下的 40+ 注册模块 -->
<!-- TODO: 注册时机与顺序 -->

### ServiceMap

<!-- TODO: 类型安全的服务映射 -->

## Bootstrap 初始化顺序

```
.env → Config → Logger → Database → Constitution → Services → Agent → HTTP/MCP
```

<!-- TODO: 详细初始化依赖图 -->

## 关键代码

<!-- TODO: ServiceContainer 核心实现 -->
<!-- TODO: 模块注册示例 -->

## 小结

<!-- TODO -->

::: tip 下一章
[Ch25. SQLite + 向量混合持久化](./ch25-persistence)
:::
