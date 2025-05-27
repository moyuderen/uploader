import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/uploader/',
  title: 'Uploader',
  description: '',
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: 'local'
    },

    nav: [
      { text: 'Home', link: '/' },
      {
        text: '@tinyuploader/sdk',
        items: [
          { text: 'Guide', link: '/sdk/quick-start' },
          {
            text: 'Repository',
            link: 'https://github.com/moyuderen/uploader/tree/main/packages/sdk'
          },
          {
            text: 'CHANGELOG',
            link: 'https://github.com/moyuderen/uploader/blob/main/packages/sdk/CHANGELOG.md'
          }
        ]
      },
      {
        text: '@tinyuploader/vue',
        items: [
          { text: 'Guide', link: '/vue/quick-start' },
          {
            text: 'Repository',
            link: 'https://github.com/moyuderen/uploader/tree/main/packages/vue'
          },
          {
            text: 'CHANGELOG',
            link: 'https://github.com/moyuderen/uploader/blob/main/packages/vue/CHANGELOG.md'
          }
        ]
      },
      {
        text: '@tinyuploader/react',
        items: [
          { text: 'Guide', link: '/react/quick-start' },
          {
            text: 'Repository',
            link: 'https://github.com/moyuderen/uploader/tree/main/packages/react'
          },
          {
            text: 'CHANGELOG',
            link: 'https://github.com/moyuderen/uploader/blob/main/packages/react/CHANGELOG.md'
          }
        ]
      },
      {
        text: '@tinyuploader/vuenext',
        items: [
          { text: 'Guide', link: '/vuenext/quick-start' },
          {
            text: 'Repository',
            link: 'https://github.com/moyuderen/uploader/tree/main/packages/vue-next'
          },
          {
            text: 'CHANGELOG',
            link: 'https://github.com/moyuderen/uploader/blob/main/packages/vue-next/CHANGELOG.md'
          }
        ]
      }
    ],

    sidebar: {
      '/sdk/': [
        {
          text: 'Guide',
          items: [
            { text: '开始', link: '/sdk/quick-start' },
            { text: '参数配置', link: '/sdk/props' },
            { text: '回调', link: '/sdk/callbacks' },
            { text: '方法', link: '/sdk/functions' }
          ]
        },
        {
          text: '其他',
          collapsed: false,
          items: [
            { text: '实例', link: '/sdk/instance' },
            { text: '枚举', link: '/sdk/enum' },
            { text: 'interface', link: '/sdk/interface' }
          ]
        },
        {
          text: 'Mock 接口',
          link: '/sdk/server'
        },
        {
          text: '问题',
          link: '/sdk/questions'
        }
      ],
      '/vue/': []
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/moyuderen/uploader' }],
    outline: {
      level: 'deep',
      label: 'On this page'
    }

    // footer: {
    //   message: 'Released under the MIT License.',
    //   copyright: 'Copyright © 2024-present moyuderen'
    // }
  },
  markdown: {
    lineNumbers: true
  }
})
