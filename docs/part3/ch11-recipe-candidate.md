# Ch11. Recipe 与 Candidate 的设计权衡

> 为什么需要两个阶段？为什么不直接入库？

## 本章概要

本章解析 Recipe（正式知识）和 Candidate（候选知识）的分离设计，以及这个设计如何服务于"Precision > Quantity"的核心原则。

## 问题场景

<!-- TODO: 自动扫描产出的噪声问题 -->
<!-- TODO: 需要审核机制的原因 -->

## 设计权衡

### Candidate 层的价值

<!-- TODO: 缓冲区、质量门控、批量审核 -->

### Recipe 的不可变性

<!-- TODO: Recipe 的版本管理 -->
<!-- TODO: StyleGuide 与 Recipe 的关系 -->

## 文件系统布局

```
.autosnippet/
├── candidates/    ← 候选知识（待审核）
├── recipes/       ← 正式知识（已审核）
├── skills/        ← 技能定义
└── wiki/          ← 项目 Wiki
```

## 关键代码

<!-- TODO: Candidate → Recipe 的提升流程 -->

## 小结

<!-- TODO -->

::: tip 下一章
[Ch12. Bootstrap 冷启动](../part4/ch12-bootstrap)
:::
