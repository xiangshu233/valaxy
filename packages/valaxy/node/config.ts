// import { loadConfig } from 'c12'
import fs from 'fs'
import { loadConfig } from 'unconfig'
import defu from 'defu'
import type { YunTheme } from 'valaxy-theme-yun'
import type { UserConfig, ValaxyConfig } from '../types'
import type { ValaxyEntryOptions } from './options'

const defaultValaxyConfig: ValaxyConfig = {
  url: '',
  lang: 'en',
  title: 'Valaxy Blog',
  description: 'A blog generated by Valaxy.',
  subtitle: 'Next Generation Static Blog Framework.',
  author: {
    avatar: 'https://cdn.jsdelivr.net/gh/YunYouJun/yun/images/meme/yun-good-with-bg.jpg',
    email: 'me@yunyoujun.cn',
    link: 'https://www.yunyoujun.cn',
    name: 'YunYouJun',
    status: {
      emoji: '😊',
      message: 'All at sea.',
    },
  },
  favicon: 'favicon.svg',
  feed: {
    name: '',
    favicon: 'favicon.svg',
  },
  social: [],

  license: {
    enabled: true,
    language: '',
    type: 'by-nc-sa',
  },

  sponsor: {
    enable: true,
    title: '我很可爱，请给我钱',
    methods: [
      {
        name: '支付宝',
        url: 'https://cdn.jsdelivr.net/gh/YunYouJun/cdn/img/donate/alipay-qrcode.jpg',
        color: '#00A3EE',
        icon: 'i-ri-alipay-line',
      },
      {
        name: 'QQ 支付',
        url: 'https://cdn.jsdelivr.net/gh/YunYouJun/cdn/img/donate/qqpay-qrcode.png',
        color: '#12B7F5',
        icon: 'i-ri-qq-line',
      },
      {
        name: '微信支付',
        url: 'https://cdn.jsdelivr.net/gh/YunYouJun/cdn/img/donate/wechatpay-qrcode.jpg',
        color: '#2DC100',
        icon: 'i-ri-wechat-pay-line',
      },

    ],
  },

  search: {
    enable: true,
    algolia: {
      enable: false,
      appId: '',
      apiKey: '',
      indexName: '',
    },
  },

  comment: {
    waline: {
      enable: false,
      serverURL: '',
    },
    twikoo: {
      enable: false,
      envId: 'https://twikoo.vercel.app',
    },
  },

  features: {
    katex: true,
  },

  theme: 'yun',
  themeConfig: {
    pkg: {
      name: '',
      version: '',
    },
  },

  unocss: {},

  markdown: {
    excerpt: '<!-- more -->',
  },
  markdownIt: {
    toc: {
      includeLevel: [1, 2, 3, 4],
      listType: 'ol',
    },
    katex: {},
  },
}

// for user config
export async function resolveConfig(options: ValaxyEntryOptions = {}) {
  // c12 merge array twice, so i deprecated it
  // const { config, configFile } = await loadConfig<ValaxyConfig>({
  //   name: 'valaxy',
  //   defaults: defaultValaxyConfig,
  // })

  const { config: userConfig, sources } = await loadConfig<ValaxyConfig>({
    sources: [
      {
        files: 'valaxy.config',
        extensions: ['ts', 'js', 'mjs', 'cjs', 'json'],
      },
    ],
    merge: false,
  })
  const configFile = sources[0]
  const config = defu(userConfig, defaultValaxyConfig)

  const theme = options.theme || config.theme || 'yun'

  try {
    const { defaultThemeConfig } = await import(`valaxy-theme-${theme}`)
    config.themeConfig = defu(config.themeConfig, defaultThemeConfig)
  }
  catch (e) {
    console.error(`valaxy-theme-${theme} doesn't have default config`)
  }

  try {
    const pkg = fs.readFileSync(require.resolve(`valaxy-theme-${theme}/package.json`), 'utf-8')
    config.themeConfig.pkg = JSON.parse(pkg)
  }
  catch (e) {
    console.error(`valaxy-theme-${theme} doesn't have package.json`)
  }

  return {
    config,
    configFile,
    theme,
  }
}

/**
 * Type config helper
 */
export function defineConfig(config: UserConfig<YunTheme.Config>) {
  return config
}

/**
 * Type config helper for custom theme config
 */
export function defineConfigWithTheme<ThemeConfig>(
  config: UserConfig<ThemeConfig>,
) {
  return config
}