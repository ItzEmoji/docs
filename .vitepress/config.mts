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
          { text: 'Neovim Configuration', link: '/neovim' }
        ]
      }
    ],

    search: {
      provider: 'algolia',
      options: {
        appId: 'INEP5TS7QE',
        apiKey: '662f2b23880c64979f8ebdc859b84396',
        indexName: 'docs_itzemoji_com_inep5ts7qe_pages'
      }
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ItzEmoji/nixos-dotfiles' }
    ]
  }
})
