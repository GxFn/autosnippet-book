# Ch30. CLI 14 命令的设计

> `asd` — 14 个命令的统一入口与实现。

## 本章概要

`asd` CLI 是 AutoSnippet 的命令行入口，提供 14 个核心命令。本章解析命令的组织方式、参数解析和各命令的实现委托。

## 命令一览

| 命令 | 说明 | 委托服务 |
|------|------|---------|
| `setup` | 初始化项目 | SetupService |
| `coldstart` | 冷启动扫描 | BootstrapService |
| `ais` | AI 扫描 | AiScanService |
| `search` | 搜索知识库 | SearchService |
| `guard` | 规范检查 | GuardService |
| `server` | 启动 MCP 服务 | MCPServer |
| `ui` | 启动 Dashboard | HttpServer |
| `watch` | 文件监听 | WatchService |
| `sync` | Markdown 同步 | KnowledgeSyncService |
| `upgrade` | IDE 配置更新 | UpgradeService |
| `embed` | 生成 Embedding | VectorService |
| `deliver` | 生成交付物 | DeliveryService |
| `status` | 项目状态 | StatusService |
| `doctor` | 环境诊断 | DoctorService |

<!-- TODO: 更多命令详情 -->

## 命令注册机制

<!-- TODO: CLI 框架选型（Commander.js?） -->
<!-- TODO: 命令到 Service 的映射 -->

## 关键代码

<!-- TODO -->

## 小结

<!-- TODO -->

::: tip 下一章
[Ch31. 六层纵深防御体系](../part8/ch31-defense-layers)
:::
