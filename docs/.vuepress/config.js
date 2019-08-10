const path = require('path')

module.exports = {
  title: 'csthink Blog',
  description: 'Write Code,Make Magic',
  head: [
    ['link', { rel: 'icon', href: '/images/favicon.ico' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
  ],
  port: 80,
  dest: path.resolve(__dirname, '../../dist'),
  serviceWorker: true,
  markdown: {
    lineNumbers: true,
  },
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      {
        text: '技术',
        items: [
          { text: 'H5', link: '/H5/H5和app对接文档' },
          { text: 'Standard', link: '/Standard/H5开发规范' }
        ]
      },
      { text: 'GitHub', link: 'https://github.com/csthink' },
    ],
    sidebar: {
      '/H5/': [
        'H5和app对接文档',
        '管理后台开发文档'
      ],
      '/Standard/': [
        'H5开发规范',
        'H5版本管理规范'
      ]
    },
    sidebarDepth: 2,
    lastUpdated: 'Last Updated',
    displayAllHeaders: true,
  }
}
