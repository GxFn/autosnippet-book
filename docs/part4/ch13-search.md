# Ch13. Search 统合搜索

> keyword / semantic / weighted — 三种模式的统合与权衡。

## 本章概要

搜索是知识库的核心能力。本章解析 AutoSnippet 如何实现关键词搜索、语义搜索和加权混合搜索的统合引擎，以及 auto 模式的智能切换策略。

## 三种搜索模式

### Keyword 搜索

<!-- TODO: 基于 SQLite FTS 的全文检索 -->
<!-- TODO: 字段权重与排序 -->

### Semantic 搜索

<!-- TODO: 基于 Embedding 的向量相似度搜索 -->
<!-- TODO: 向量存储的选择 -->

### Weighted (FieldWeighted) 搜索

<!-- TODO: 多字段加权的混合排序 -->
<!-- TODO: 权重参数的调优 -->

## Auto 模式

<!-- TODO: 智能模式选择策略 -->
<!-- TODO: 查询意图分析 -->

## 搜索管线

```
Query → IntentAnalysis → ModeSelection → Search Engine → Scoring → Ranking → Results
```

## 关键代码

<!-- TODO: SearchService 统合入口 -->
<!-- TODO: 各模式的评分算法 -->

## 小结

<!-- TODO -->

::: tip 下一章
[Ch14. Guard 规范检查引擎](./ch14-guard)
:::
