import { defineConfig } from 'vitepress'

export default defineConfig({
  srcDir: "sites",

  title: "NixOS-Dotfiles",
  description: "Documentation for a modular NixOS-Dotfiles configuration using flake-parts and import-tree.",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/getting-started' },
      { text: 'Installer', link: '/installer' }
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Flake Structure', link: '/flake-structure' }
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
          { text: 'NixOS Installer', link: '/installer' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ItzEmoji/nixos-dotfiles' }
    ]
  }
})
