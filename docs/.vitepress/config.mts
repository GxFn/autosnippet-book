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
      { text: '开始阅读', link: '/part1/ch01-introduction' },
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
        text: '概览与设计哲学',
        collapsed: false,
        items: [
          { text: 'AutoSnippet 介绍', link: '/part1/ch01-introduction' },
          { text: '架构总览 — DDD 分层与递归模式', link: '/part1/ch02-architecture' },
          { text: 'SOUL 原则与设计决策', link: '/part1/ch03-soul' },
        ],
      },
      {
        text: '核心引擎',
        collapsed: true,
        items: [
          { text: 'Constitution 权限体系', link: '/part2/ch04-constitution' },
          { text: 'Gateway 统一管线', link: '/part2/ch05-gateway' },
          { text: 'AST 多语言分析', link: '/part2/ch06-ast' },
          { text: 'Discovery 模块发现', link: '/part2/ch07-discovery' },
        ],
      },
      {
        text: '领域模型',
        collapsed: true,
        items: [
          { text: 'KnowledgeEntry 统一知识实体', link: '/part3/ch08-knowledge-entry' },
          { text: '知识生命周期 — 6 态状态机', link: '/part3/ch09-lifecycle' },
          { text: '11 维健康评估', link: '/part3/ch10-dimension' },
          { text: 'Recipe 与 Candidate 的设计权衡', link: '/part3/ch11-recipe-candidate' },
        ],
      },
      {
        text: '服务层深度解构',
        collapsed: true,
        items: [
          { text: 'Bootstrap 冷启动', link: '/part4/ch12-bootstrap' },
          { text: 'Search 统合搜索', link: '/part4/ch13-search' },
          { text: 'Guard 规范检查引擎', link: '/part4/ch14-guard' },
          { text: 'Evolution 知识进化', link: '/part4/ch15-evolution' },
          { text: 'Panorama 架构可视化', link: '/part4/ch16-panorama' },
          { text: 'Vector 向量化', link: '/part4/ch17-vector' },
          { text: 'Task & Signal 任务图与信号', link: '/part4/ch18-task-signal' },
        ],
      },
      {
        text: 'Agent 智能层',
        collapsed: true,
        items: [
          { text: 'AgentRuntime ReAct 推理循环', link: '/part5/ch19-agent-runtime' },
          { text: '54 个内置工具的设计模式', link: '/part5/ch20-tools' },
          { text: '6 层记忆系统', link: '/part5/ch21-memory' },
          { text: 'Forge 工具锻造', link: '/part5/ch22-forge' },
          { text: '意图分类与路由策略', link: '/part5/ch23-intent-routing' },
        ],
      },
      {
        text: '基础设施与集成',
        collapsed: true,
        items: [
          { text: 'DI 容器设计', link: '/part6/ch24-di-container' },
          { text: 'SQLite + 向量混合持久化', link: '/part6/ch25-persistence' },
          { text: 'MCP 协议实现', link: '/part6/ch26-mcp' },
          { text: 'HTTP API 与 OpenAPI', link: '/part6/ch27-http-api' },
          { text: '飞书 / IDE 多端接入', link: '/part6/ch28-integrations' },
        ],
      },
      {
        text: '前端与交互',
        collapsed: true,
        items: [
          { text: 'Dashboard 状态管理', link: '/part7/ch29-dashboard' },
          { text: 'CLI 14 命令的设计', link: '/part7/ch30-cli' },
        ],
      },
      {
        text: '工程实践',
        collapsed: true,
        items: [
          { text: '六层纵深防御体系', link: '/part8/ch31-defense-layers' },
          { text: 'PathGuard 与开发仓库保护', link: '/part8/ch32-pathguard' },
          { text: '测试策略', link: '/part8/ch33-testing' },
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
