# 飞书 / IDE 多端接入

> WSS 长连接、零端口暴露 — 远程编程接入的实现。

## 本章概要

AutoSnippet 支持飞书自建应用和多种 IDE 的接入。本章解析飞书 WSS 长连接的实现、零端口暴露的安全设计和 IDE 特定的适配。

## 飞书集成

<!-- TODO: Lark Transport 层设计 -->
<!-- TODO: WSS 长连接的生命周期 -->
<!-- TODO: 消息协议适配 -->

## IDE 集成矩阵

| IDE | 协议 | 配置方式 |
|-----|------|---------|
| Cursor | MCP (stdio) | `.cursor/mcp.json` |
| VS Code Copilot | MCP (stdio) | `settings.json` |
| Trae | MCP (stdio) | 自动检测 |
| Xcode | 屏幕截图 + API | 自定义集成 |

<!-- TODO: 每种集成的详细实现 -->

## 关键代码

<!-- TODO -->

## 小结

<!-- TODO -->

::: tip 下一章
[Dashboard 状态管理](../part7/ch29-dashboard)
:::
