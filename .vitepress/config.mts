import { defineConfig } from 'vitepress'

export default defineConfig({
  srcDir: "sites",

  title: "NixOS-Dotfiles",
  description: "Documentation for a modular NixOS-Dotfiles configuration using flake-parts and import-tree.",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/getting-started' },
      { text: 'Repositories', link: '/repositories' }
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Flake Structure', link: '/flake-structure' },
          { text: 'Repositories', link: '/repositories' }
        ]
      },
      {
        text: 'Modules',
        items: [
          { text: 'Creating Modules', link: '/creating-modules' },
          { text: 'Host Configuration', link: '/host-configuration' }
        ]
      },
      {
        text: 'Tools',
        items: [
          { text: 'NixOS Installer', link: '/installer' },
          { text: 'NixOS Images', link: '/nixos-images' },
          { text: 'Neovim Configuration', link: '/neovim' }
        ]
      }
    ],

    search: {
      provider: 'algolia',
      options: {
        appId: '36ZUKKG5BG',
        apiKey: 'c6aa0ba0ec27e90dffc194753e2e43ad',
        indexName: 'My NixOS-Dotfiles'
      }
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ItzEmoji/nixos-dotfiles' }
    ]
  }
})
