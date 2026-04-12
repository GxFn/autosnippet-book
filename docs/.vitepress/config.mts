import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'AutoSnippet 技术解构',
  description: '从架构到实现 — AI 知识引擎的深度技术文档',
  lang: 'zh-CN',
  base: '/',

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],

  markdown: {
    math: true,
  },

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'AutoSnippet Book',

    nav: [
      { text: '首页', link: '/' },
      { text: '图解速览', link: '/visual-tour' },
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
      { text: '图解速览', link: '/visual-tour' },
      {
        text: '起点与哲学',
        collapsed: false,
        items: [
          { text: 'AutoSnippet 介绍', link: '/part1/ch01-introduction' },
          { text: 'SOUL 原则', link: '/part1/ch02-soul' },
        ],
      },
      {
        text: '工程基石',
        collapsed: true,
        items: [
          { text: '架构全景', link: '/part2/ch03-architecture' },
          { text: '安全管线', link: '/part2/ch04-security' },
          { text: '代码理解', link: '/part2/ch05-ast' },
        ],
      },
      {
        text: '知识领域',
        collapsed: true,
        items: [
          { text: 'KnowledgeEntry', link: '/part3/ch06-knowledge-entry' },
          { text: '生命周期与进化', link: '/part3/ch07-lifecycle' },
          { text: '质量评分与维度', link: '/part3/ch08-quality' },
        ],
      },
      {
        text: '核心服务',
        collapsed: true,
        items: [
          { text: 'Bootstrap 冷启动', link: '/part4/ch09-bootstrap' },
          { text: 'Guard 合规引擎', link: '/part4/ch10-guard' },
          { text: 'Search 混合检索', link: '/part4/ch11-search' },
          { text: '向量引擎深度解析', link: '/part4/ch11b-vector' },
          { text: 'Panorama · Signal · 代谢', link: '/part4/ch12-metabolism' },
        ],
      },
      {
        text: 'Agent 智能层',
        collapsed: true,
        items: [
          { text: 'AgentRuntime', link: '/part5/ch13-agent-runtime' },
          { text: '正交组合', link: '/part5/ch14-orthogonal' },
          { text: '工具与记忆', link: '/part5/ch15-tools-memory' },
        ],
      },
      {
        text: '平台与交付',
        collapsed: true,
        items: [
          { text: '数据基础设施', link: '/part6/ch16-infrastructure' },
          { text: 'MCP 与六通道交付', link: '/part6/ch17-mcp-delivery' },
          { text: '界面层', link: '/part6/ch18-interface' },
        ],
      },
      {
        text: '真实数据',
        collapsed: true,
        items: [
          { text: 'BiliDili 冷启动全记录', link: '/part7/ch19-bilidili-coldstart' },
        ],
      },
      {
        text: '附录',
        collapsed: true,
        items: [
          { text: '配置参考', link: '/appendix/config-reference' },
          { text: 'MCP 工具清单', link: '/appendix/mcp-tools' },
          { text: 'Guard 规则清单', link: '/appendix/guard-rules' },
          { text: '信号类型清单', link: '/appendix/signal-types' },
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
