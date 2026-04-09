# Ch19. AgentRuntime — ReAct 推理循环

> Reasoning + Acting — Agent 如何思考和行动的核心引擎。

## 本章概要

AgentRuntime 是 AutoSnippet Agent 层的推理引擎，实现了 ReAct（Reasoning + Acting）循环模式。本章深度解析推理循环的实现、工具调用机制、上下文管理和错误恢复策略。

## ReAct 循环

```
Observe → Think → Act → Observe → Think → Act → ... → Final Answer
```

<!-- TODO: 循环的具体实现 -->
<!-- TODO: 终止条件与最大步数限制 -->

## AgentFactory

<!-- TODO: 工厂模式创建不同角色的 Agent -->
<!-- TODO: Agent 预设与角色配置 -->

## 执行策略

<!-- TODO: PipelineStrategy 的多种策略 -->
<!-- TODO: 串行 vs 并行执行 -->

## 上下文管理

<!-- TODO: 推理上下文的构建与压缩 -->
<!-- TODO: Token 预算管理 -->

## 关键代码

<!-- TODO: AgentRuntime 核心循环 -->
<!-- TODO: 工具调用协议 -->

## 小结

<!-- TODO -->

::: tip 下一章
[Ch20. 54 个内置工具的设计模式](./ch20-tools)
:::
