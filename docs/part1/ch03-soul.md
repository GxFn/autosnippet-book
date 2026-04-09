# Ch03. SOUL 原则与设计决策

> Precision > Quantity, Explain > Execute, Developer Intent > Auto-inference.

## 本章概要

SOUL.md 定义了 AutoSnippet 的核心价值观和行为边界。本章解析这些原则如何被编码到系统的每个层级中，从 Constitution 配置到 Agent 策略。

## 三条非协商原则

### 1. Precision > Quantity — 宁缺毋滥

<!-- TODO: 这条原则如何体现在知识准入机制 -->
<!-- TODO: Candidate → Recipe 的质量门控 -->

### 2. Explain > Execute — 说 why 而非直接做

<!-- TODO: Agent 的解释优先策略 -->
<!-- TODO: Guard 报告中的"为什么违规"输出 -->

### 3. Developer Intent > Auto-inference — 有疑问就问

<!-- TODO: 意图分类中的"不确定"路径 -->
<!-- TODO: MCP 工具的确认机制 -->

## 原则的系统性编码

### Constitution 配置

<!-- TODO: constitution.yaml 如何约束行为边界 -->

### Agent Policies

<!-- TODO: policies.ts 中的预算和约束 -->

### 质量评分系统

<!-- TODO: QualityService 如何量化 Precision -->

## 歧义处理策略

| 场景 | 处理方式 |
|------|---------|
| 代码可能是 Recipe 或忽略？ | 问开发者 |
| 两个候选高度相似？ | 合并 |
| Skill 选择不确定？ | 查 skill list |

<!-- TODO: 更多歧义场景的具体实现 -->

## 小结

<!-- TODO: 原则如何让 12 万行代码保持一致性 -->

::: tip 下一章
[Ch04. Constitution 权限体系](../part2/ch04-constitution)
:::
