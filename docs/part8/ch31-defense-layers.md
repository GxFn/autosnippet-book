# Ch31. 六层纵深防御体系

> Constitution → Gateway → Permission → SafetyPolicy → PathGuard → ConfidenceRouter

## 本章概要

安全不是单点防护，而是六层纵深防御。本章解析 AutoSnippet 从配置层到运行时的六道安全防线，以及它们如何协同工作。

## 六层防御

### Layer 1: Constitution — 配置级约束

<!-- TODO: YAML 定义的行为边界 -->

### Layer 2: Gateway — 管线级拦截

<!-- TODO: 请求管线中的验证与权限检查 -->

### Layer 3: Permission — 操作级权限

<!-- TODO: 细粒度的操作权限矩阵 -->

### Layer 4: SafetyPolicy — Agent 级约束

<!-- TODO: Agent 的预算和行为约束 -->

### Layer 5: PathGuard — 文件系统级防护

<!-- TODO: 路径遍历防护与白名单 -->

### Layer 6: ConfidenceRouter — 决策级安全

<!-- TODO: 低置信度时的降级策略 -->

## 纵深协同

```
请求 → [Constitution ✓] → [Gateway ✓] → [Permission ✓] → [SafetyPolicy ✓] → [PathGuard ✓] → [ConfidenceRouter ✓] → 执行
         任一失败 → 拒绝 + 审计日志
```

## 关键代码

<!-- TODO -->

## 小结

<!-- TODO -->

::: tip 下一章
[Ch32. PathGuard 与开发仓库保护](./ch32-pathguard)
:::
