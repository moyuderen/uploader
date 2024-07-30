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
          { text: 'Guide', link: '/sdk/' },
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
          { text: 'Guide', link: '/vue/' },
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
        text: '@tinyuploader/vuenext',
        items: [
          { text: 'Guide', link: '/vuenext/' },
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
            { text: '方法', link: '/sdk/functions' },
            { text: '详细说明', link: '/sdk/details' }
          ]
        },
        {
          text: '问题',
          items: []
        }
      ]
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/moyuderen/uploader' }],
    outline: {
      label: '页面导航'
    }

    // footer: {
    //   message: 'Released under the MIT License.',
    //   copyright: 'Copyright © 2024-present moyuderen'
    // }
  }
})
