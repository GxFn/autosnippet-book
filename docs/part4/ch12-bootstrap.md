# Ch12. Bootstrap 冷启动

> 从零到知识库 — `asd setup` 背后发生了什么。

## 本章概要

Bootstrap 是 AutoSnippet 初始化的起点。本章解析从 `asd setup` 到项目知识库就绪的完整流程，包括环境检测、配置生成、数据库初始化和首次 AI 扫描。

## 冷启动流程

```
asd setup
  ├── 1. 环境检测（Node.js 版本、AI Provider）
  ├── 2. 生成 .autosnippet/ 目录结构
  ├── 3. 初始化 SQLite 数据库
  ├── 4. 探测项目技术栈（Discovery）
  ├── 5. 生成 constitution.yaml
  ├── 6. IDE 配置探测与 MCP 注入
  └── 7. 首次 AI 扫描（可选）
```

<!-- TODO: 每个步骤的详细实现 -->

## 设计决策

<!-- TODO: 为什么是渐进式初始化而非一步到位 -->
<!-- TODO: 幂等性保证 -->

## 关键代码

<!-- TODO: SetupService 核心逻辑 -->
<!-- TODO: BootstrapService 与 ColdStartService 的职责划分 -->

## 小结

<!-- TODO -->

::: tip 下一章
[Ch13. Search 统合搜索](./ch13-search)
:::
