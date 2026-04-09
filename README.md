# AutoSnippet 技术解构

> 从 150 行 Shell 脚本到 12 万行 AI 知识引擎 — 每一个设计决策的深度解读。

🔗 **在线阅读**: [docs.gaoxuefeng.com](https://docs.gaoxuefeng.com)

## 这本书讲什么

[AutoSnippet](https://github.com/GxFn/AutoSnippet) 是一个 AI 代码知识引擎，为 Cursor / Copilot 等 AI 助手构建本地项目知识层。本书从架构到实现逐模块解构其技术细节：

- **Part 1** — 概览与设计哲学：演进历程、DDD 分层架构、SOUL 原则
- **Part 2** — 核心引擎：Constitution 权限、Gateway 管线、AST 多语言分析、模块发现
- **Part 3** — 领域模型：KnowledgeEntry 实体、6 态生命周期、11 维健康评估
- **Part 4** — 服务层：冷启动、统合搜索、Guard 规范检查、知识进化、Panorama、向量化
- **Part 5** — Agent 智能层：ReAct 推理循环、54 个工具、6 层记忆、工具锻造
- **Part 6** — 基础设施：DI 容器、SQLite + 向量存储、MCP 协议、HTTP API
- **Part 7** — 前端与交互：Dashboard、CLI 命令设计
- **Part 8** — 工程实践：六层纵深防御、PathGuard、测试策略

## 本地开发

```bash
# 安装依赖
npm install

# 启动本地预览（热更新）
npm run dev

# 构建静态站点
npm run build

# 预览构建结果
npm run preview
```

## 目录结构

```
docs/
├── index.md              # 首页
├── part1/                # 概览与设计哲学 (Ch01-03)
├── part2/                # 核心引擎 (Ch04-07)
├── part3/                # 领域模型 (Ch08-11)
├── part4/                # 服务层深度解构 (Ch12-18)
├── part5/                # Agent 智能层 (Ch19-23)
├── part6/                # 基础设施与集成 (Ch24-28)
├── part7/                # 前端与交互 (Ch29-30)
├── part8/                # 工程实践 (Ch31-33)
└── .vitepress/
    └── config.mts        # VitePress 配置
```

## 技术栈

- 静态生成: [VitePress](https://vitepress.dev/)
- 托管平台: GitHub Pages
- 自定义域名: `docs.gaoxuefeng.com`
- CI/CD: GitHub Actions（push 自动构建部署）

## 相关链接

- [AutoSnippet 源码](https://github.com/GxFn/AutoSnippet)
- [博客](https://gaoxuefeng.com)

## License

MIT © [GaoXuefeng](https://github.com/GxFn)