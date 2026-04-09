# Ch07. Discovery 模块发现

> 11 种构建目标，自动识别项目结构与技术栈。

## 本章概要

Discovery 模块负责探测目标项目的技术栈、构建系统和模块边界。本章解析自动发现的实现机制、支持的构建目标类型以及发现结果如何驱动后续分析。

## 问题场景

<!-- TODO: 为什么需要自动发现而非手动配置 -->
<!-- TODO: 单体 vs Monorepo 的挑战 -->

## 设计决策

### 构建目标识别

<!-- TODO: 11 种构建目标类型 -->
<!-- TODO: 识别策略：文件标记（package.json、Cargo.toml 等） -->

### 框架增强 (Enhancement)

<!-- TODO: 17 个框架的增强型识别 -->
<!-- TODO: 框架特定的知识维度 -->

## 发现流程

```
项目根目录 → 文件扫描 → 标记匹配 → 构建目标列表 → 框架检测 → ProjectSnapshot
```

<!-- TODO: 详细流程图 -->

## 关键代码

<!-- TODO: Discovery 核心逻辑 -->
<!-- TODO: 构建目标探测器 -->

## 小结

<!-- TODO -->

::: tip 下一章
[Ch08. KnowledgeEntry 统一知识实体](../part3/ch08-knowledge-entry)
:::
