# Ch06. AST 多语言分析

> 11 种语言，一套统一的代码结构提取接口。

## 本章概要

AutoSnippet 的 AST 分析层支持 JavaScript、TypeScript、Swift、Java、Go、Rust、Python、Kotlin、Dart、Objective-C、C# 共 11 种语言。本章解析统一抽象层的设计、各语言适配器的实现策略和 ProjectGraph 的构建过程。

## 问题场景

<!-- TODO: 为什么需要 AST 分析而非纯文本匹配 -->
<!-- TODO: 多语言支持的挑战 -->

## 设计决策

### 统一抽象接口

<!-- TODO: 语言无关的代码结构定义 -->
<!-- TODO: 函数、类、模块、导入导出的统一建模 -->

### 适配器模式

<!-- TODO: 每种语言一个适配器文件 (lang-*.ts) -->
<!-- TODO: 适配器的注册与选择 -->

## ProjectGraph 构建

<!-- TODO: 从文件到模块图的构建过程 -->
<!-- TODO: 依赖关系的提取与存储 -->

## 语言适配器一览

| 语言 | 文件 | 解析策略 |
|------|------|---------|
| JavaScript/TypeScript | `lang-js.ts` | <!-- TODO --> |
| Swift | `lang-swift.ts` | <!-- TODO --> |
| Java | `lang-java.ts` | <!-- TODO --> |
| Go | `lang-go.ts` | <!-- TODO --> |
| Rust | `lang-rust.ts` | <!-- TODO --> |
| Python | `lang-python.ts` | <!-- TODO --> |
| Kotlin | `lang-kotlin.ts` | <!-- TODO --> |
| Dart | `lang-dart.ts` | <!-- TODO --> |
| Objective-C | `lang-objc.ts` | <!-- TODO --> |
| C# | `lang-csharp.ts` | <!-- TODO --> |

## 关键代码

<!-- TODO: 统一接口定义 -->
<!-- TODO: 一个典型适配器的实现 -->

## 小结

<!-- TODO -->

::: tip 下一章
[Ch07. Discovery 模块发现](./ch07-discovery)
:::
