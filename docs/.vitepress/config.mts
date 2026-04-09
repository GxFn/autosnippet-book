import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'AutoSnippet 技术解构',
  description: '从架构到实现 — AI 知识引擎的深度技术文档',
  lang: 'zh-CN',
  base: '/',

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'AutoSnippet Book',

    nav: [
      { text: '首页', link: '/' },
      { text: '开始阅读', link: '/part1/ch01-evolution' },
      {
        text: '相关链接',
        items: [
          { text: 'AutoSnippet GitHub', link: 'https://github.com/GxFn/AutoSnippet' },
          { text: '博客', link: 'https://gaoxuefeng.com' },
        ],
      },
    ],

    sidebar: [
      {
        text: 'Part 1: 概览与设计哲学',
        collapsed: false,
        items: [
          { text: 'Ch01. 从 Shell 脚本到知识引擎', link: '/part1/ch01-evolution' },
          { text: 'Ch02. 架构总览 — DDD 分层与递归模式', link: '/part1/ch02-architecture' },
          { text: 'Ch03. SOUL 原则与设计决策', link: '/part1/ch03-soul' },
        ],
      },
      {
        text: 'Part 2: 核心引擎',
        collapsed: false,
        items: [
          { text: 'Ch04. Constitution 权限体系', link: '/part2/ch04-constitution' },
          { text: 'Ch05. Gateway 统一管线', link: '/part2/ch05-gateway' },
          { text: 'Ch06. AST 多语言分析', link: '/part2/ch06-ast' },
          { text: 'Ch07. Discovery 模块发现', link: '/part2/ch07-discovery' },
        ],
      },
      {
        text: 'Part 3: 领域模型',
        collapsed: false,
        items: [
          { text: 'Ch08. KnowledgeEntry 统一知识实体', link: '/part3/ch08-knowledge-entry' },
          { text: 'Ch09. 知识生命周期 — 6 态状态机', link: '/part3/ch09-lifecycle' },
          { text: 'Ch10. 11 维健康评估', link: '/part3/ch10-dimension' },
          { text: 'Ch11. Recipe 与 Candidate 的设计权衡', link: '/part3/ch11-recipe-candidate' },
        ],
      },
      {
        text: 'Part 4: 服务层深度解构',
        collapsed: true,
        items: [
          { text: 'Ch12. Bootstrap 冷启动', link: '/part4/ch12-bootstrap' },
          { text: 'Ch13. Search 统合搜索', link: '/part4/ch13-search' },
          { text: 'Ch14. Guard 规范检查引擎', link: '/part4/ch14-guard' },
          { text: 'Ch15. Evolution 知识进化', link: '/part4/ch15-evolution' },
          { text: 'Ch16. Panorama 架构可视化', link: '/part4/ch16-panorama' },
          { text: 'Ch17. Vector 向量化', link: '/part4/ch17-vector' },
          { text: 'Ch18. Task & Signal 任务图与信号', link: '/part4/ch18-task-signal' },
        ],
      },
      {
        text: 'Part 5: Agent 智能层',
        collapsed: true,
        items: [
          { text: 'Ch19. AgentRuntime ReAct 推理循环', link: '/part5/ch19-agent-runtime' },
          { text: 'Ch20. 54 个内置工具的设计模式', link: '/part5/ch20-tools' },
          { text: 'Ch21. 6 层记忆系统', link: '/part5/ch21-memory' },
          { text: 'Ch22. Forge 工具锻造', link: '/part5/ch22-forge' },
          { text: 'Ch23. 意图分类与路由策略', link: '/part5/ch23-intent-routing' },
        ],
      },
      {
        text: 'Part 6: 基础设施与集成',
        collapsed: true,
        items: [
          { text: 'Ch24. DI 容器设计', link: '/part6/ch24-di-container' },
          { text: 'Ch25. SQLite + 向量混合持久化', link: '/part6/ch25-persistence' },
          { text: 'Ch26. MCP 协议实现', link: '/part6/ch26-mcp' },
          { text: 'Ch27. HTTP API 与 OpenAPI', link: '/part6/ch27-http-api' },
          { text: 'Ch28. 飞书 / IDE 多端接入', link: '/part6/ch28-integrations' },
        ],
      },
      {
        text: 'Part 7: 前端与交互',
        collapsed: true,
        items: [
          { text: 'Ch29. Dashboard 状态管理', link: '/part7/ch29-dashboard' },
          { text: 'Ch30. CLI 14 命令的设计', link: '/part7/ch30-cli' },
        ],
      },
      {
        text: 'Part 8: 工程实践',
        collapsed: true,
        items: [
          { text: 'Ch31. 六层纵深防御体系', link: '/part8/ch31-defense-layers' },
          { text: 'Ch32. PathGuard 与开发仓库保护', link: '/part8/ch32-pathguard' },
          { text: 'Ch33. 测试策略', link: '/part8/ch33-testing' },
        ],
      },
    ],

    outline: {
      level: [2, 3],
      label: '本页目录',
    },

    editLink: {
      pattern: 'https://github.com/GxFn/autosnippet-book/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页',
    },

    lastUpdated: {
      text: '最后更新',
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
          modal: {
            noResultsText: '没有找到相关结果',
            resetButtonTitle: '清除查询',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
          },
        },
      },
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/GxFn/AutoSnippet' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 GaoXuefeng',
    },

    docFooter: {
      prev: '上一章',
      next: '下一章',
    },
  },
})
