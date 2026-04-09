# Ch04. Constitution 权限体系

> RBAC 5 角色模型 — 从配置文件到运行时权限守卫。

## 本章概要

Constitution 是 AutoSnippet 的权限中枢，通过 YAML 配置定义角色、权限和行为边界。本章解析权限模型的设计思路、运行时检查机制以及与 Gateway 的协作方式。

## 问题场景

<!-- TODO: 为什么需要权限体系 — MCP 工具的安全边界 -->
<!-- TODO: 多角色场景：开发者 vs 审核者 vs 管理员 -->

## 设计决策

### RBAC 5 角色模型

<!-- TODO: 5 个角色的定义与权限矩阵 -->
<!-- TODO: constitution.yaml 配置结构 -->

### 配置即代码

<!-- TODO: 为什么用 YAML 而非数据库存储权限 -->
<!-- TODO: 配置热加载机制 -->

## 核心实现

### Constitution 加载流程

<!-- TODO: 从 YAML 到内存对象的转换 -->
<!-- TODO: 校验与默认值填充 -->

### 运行时权限检查

<!-- TODO: 请求上下文中的角色注入 -->
<!-- TODO: Gateway 管线中的权限卡点 -->

## 数据流

```
constitution.yaml → ConfigLoader → ConstitutionService → Gateway.validate()
                                                              ↓
                                                    Permission Check
                                                              ↓
                                                    Allow / Deny
```

<!-- TODO: 补充 Mermaid 序列图 -->

## 关键代码

<!-- TODO: 核心 Permission 检查函数 -->
<!-- TODO: 角色定义 Schema -->

## 小结

<!-- TODO -->

::: tip 下一章
[Ch05. Gateway 统一管线](./ch05-gateway)
:::
