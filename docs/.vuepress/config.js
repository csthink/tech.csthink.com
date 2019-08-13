const path = require('path')
const sidebar_zh = require('./config/sidebar/zh')

module.exports = {
  // base: '.',
  locales: {
    '/': {
      lang: 'zh-CN',
      title: 'CSTHINK 技术团队',
      description: '致所有热爱编程的我们'
    },
    '/en/': {
      lang: 'en-US',
      title: 'CSTHINK Tech',
      description: 'Write Code. Make Magic.'
    }
  },
  // title: 'CSTHINK 技术团队',
  // description: 'Write Code,Make Magic',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    // ['link', { rel: 'manifest', href: '/manifest.json' }],
    // ['script', { src: "//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" }],
    // ['script', {},
    // '(adsbygoogle = window.adsbygoogle || []).push({google_ad_client: "ca-pub-7505588143637216",  enable_page_level_ads: true});'],
  ],
  port: 80,
  dest: path.resolve(__dirname, '../../dist'),
  serviceWorker: true,
  markdown: {
    lineNumbers: true,
    anchor: {
      permalink: true
    },
    // markdown-it-toc 的选项
    toc: {
      includeLevel: [1, 2, 3]
    },
  },
  themeConfig: {
    repo: 'csthink/tech.csthink.com',
    repoLabel: '🔗 Github',
    editLinks: true,
    docsDir: 'docs',
    sidebarDepth: 2,
    displayAllHeaders: true,
    locales: {
      '/': {
        label: '简体中文',
        selectText: '🌐 选择语言',
        editLinkText: '帮助我们改进这个页面!',
        lastUpdated: '上次更新',
        nav: require('./config/nav/zh'),
        sidebar: sidebar_zh,
        serviceWorker: {
          updatePopup: {
            message: "发现新内容可用.",
            buttonText: "刷新"
          }
        }
      },
      '/en/': {
        label: 'English',
        selectText: '🌐 Languages',
        editLinkText: 'Help us improve this page!',
        lastUpdated: 'Last Updated',
        nav: require('./config/nav/en'),
      }
    },
  },
  plugins: [
    ['@vuepress/back-to-top', true],
    ['@vuepress/pwa', {
      serviceWorker: true,
      updatePopup: true
    }],
    ['@vuepress/google-analytics',{
        'ga': 'UA-145589912-1'
    }],
    ['@vuepress/medium-zoom'],
  ],
  extraWatchFiles: [
    '.vuepress/nav/en.js',
    '.vuepress/nav/zh.js',
  ]
}
