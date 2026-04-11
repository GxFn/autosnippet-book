# AutoSnippet 技术解构

> 从 150 行 Shell 脚本到 12 万行 AI 知识引擎 — 每一个设计决策的深度解读。

🔗 **在线阅读**: [docs.gaoxuefeng.com](https://docs.gaoxuefeng.com)

## 这本书讲什么

[AutoSnippet](https://github.com/GxFn/AutoSnippet) 是一个 AI 代码知识引擎，为 Cursor / Copilot 等 AI 助手构建本地项目知识层。本书 6 个篇章、18 章正文 + 4 篇附录，从架构到实现逐模块解构其技术细节。

### Part 1 — 起点与哲学

| 章 | 标题 |
|---|------|
| Ch01 | AutoSnippet 介绍 |
| Ch02 | SOUL 原则 — 知识引擎的身份约束 |

### Part 2 — 核心引擎

| 章 | 标题 |
|---|------|
| Ch03 | 架构全景 — DDD 分层与模块拓扑 |
| Ch04 | 安全管线 — Constitution · Gateway · 纵深防御 |
| Ch05 | 代码理解 — 多语言 AST · Discovery · 增强 |

### Part 3 — 领域模型

| 章 | 标题 |
|---|------|
| Ch06 | KnowledgeEntry — 一个实体表达所有知识 |
| Ch07 | 生命周期与进化 — 知识的生老病死 |
| Ch08 | 质量评分与维度框架 |

### Part 4 — 服务层

| 章 | 标题 |
|---|------|
| Ch09 | Bootstrap — 冷启动的多阶段编排 |
| Ch10 | Guard — 四层合规检测引擎 |
| Ch11 | Search — 混合检索与智能排序 |
| Ch12 | Panorama · Signal · 知识代谢 |

### Part 5 — Agent 智能层

| 章 | 标题 |
|---|------|
| Ch13 | AgentRuntime — ReAct 推理循环 |
| Ch14 | 正交组合 — Capability × Strategy × Policy |
| Ch15 | 工具体系与记忆系统 |

### Part 6 — 基础设施与接入

| 章 | 标题 |
|---|------|
| Ch16 | 数据基础设施 |
| Ch17 | MCP 协议与六通道交付 |
| Ch18 | 界面层 — Dashboard · CLI · 多端接入 |

### 附录

| 附录 | 标题 |
|------|------|
| A | 配置参考 |
| B | Guard 规则清单 |
| C | MCP 工具清单 |
| D | 信号类型清单 |

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

## 插图生成

每章配有手绘风格架构插图，通过 prompt 文件驱动生成：

```bash
# 查看所有插图状态
bash scripts/illustrations.sh --list

# 生成缺失的插图
bash scripts/illustrations.sh

# 重新生成指定章节
bash scripts/illustrations.sh --force ch06

# 预览模式
bash scripts/illustrations.sh --dry-run
```

Prompt 文件存放在 `prompts/chXX/` 目录，生成的图片输出到 `docs/public/images/chXX/`。

## 目录结构

```
docs/
├── index.md              # 首页
├── part1/                # 起点与哲学 (Ch01-02)
├── part2/                # 核心引擎 (Ch03-05)
├── part3/                # 领域模型 (Ch06-08)
├── part4/                # 服务层 (Ch09-12)
├── part5/                # Agent 智能层 (Ch13-15)
├── part6/                # 基础设施与接入 (Ch16-18)
├── appendix/             # 附录 (A-D)
├── public/images/        # 章节插图
└── .vitepress/
    └── config.mts        # VitePress 配置
prompts/
├── style-prompt-suffix.md  # 统一风格约束
└── chXX/                   # 各章插图 prompt
scripts/
└── illustrations.sh        # 插图生成工具
```

## 技术栈

- 静态生成: [VitePress](https://vitepress.dev/)
- 插图生成: [baoyu-imagine](https://github.com/nicepkg/baoyu-skills) (Gemini)
- 托管平台: GitHub Pages
- 自定义域名: `docs.gaoxuefeng.com`
- CI/CD: GitHub Actions（push 自动构建部署）

## 相关链接

- [AutoSnippet 源码](https://github.com/GxFn/AutoSnippet)
- [博客](https://gaoxuefeng.com)

## License

MIT © [GaoXuefeng](https://github.com/GxFn)