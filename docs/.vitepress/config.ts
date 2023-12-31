import { defineConfig } from 'vitepress'
import { version } from '../../package.json'

const embedScript = `
import { initializeRescue, updateRescue } from 'https://cdn.jsdelivr.net/npm/@thezzisu/rescuer@${version}/dist/window.min.js'
initializeRescue().then(() => {
  updateRescue('v0', 'https://pub-d939c96dfbc04659807dc509c0f99b36.r2.dev/rescue.zip')
})`

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Rescuer',
  description: 'Rescuer Docs',
  head: [['script', { type: 'module' }, embedScript]],
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started' }
    ],

    sidebar: [
      {
        text: 'Docs',
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Window API', link: '/window-api' },
          { text: 'Service Worker API', link: '/service-worker-api' }
        ]
      }
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/thezzisu/rescuer' }],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-present thezzisu'
    },

    editLink: {
      pattern: 'https://github.com/thezzisu/rescuer/edit/main/docs/:path'
    }
  }
})
