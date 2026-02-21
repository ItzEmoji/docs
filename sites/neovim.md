---
outline: deep
---

# Neovim Configuration

A declaratively managed Neovim configuration built with [NVF](https://github.com/notashelf/nvf) (Neovim Flake). Everything — plugins, LSP servers, keybindings, and options — is defined in pure Nix. No Mason, no lazy.nvim, fully reproducible.

**Repository:** [github.com/ItzEmoji/nvim](https://github.com/ItzEmoji/nvim)

## Quick Start

```bash
# Run directly
nix run github:ItzEmoji/nvim --accept-flake-config

# Or use in your NixOS config
inputs.nvim.url = "github:ItzEmoji/nvim";
```

## Integration

The nvim flake exposes three module types for easy integration:

### NixOS module

Adds Neovim to system packages:

```nix
# In your host configuration.nix modules list:
inputs.nvim.nixosModules.nvim
```

### Home Manager module

Adds Neovim to user packages:

```nix
# In your home-manager.users.<name>.imports list:
inputs.nvim.homeManagerModules.nvim
```

### Flake module

For composing into other flake-parts flakes:

```nix
imports = [ inputs.nvim.flakeModules.nvim ];
```

## Architecture

The configuration uses the same **flake-parts + import-tree** pattern as the dotfiles. There are two layers of auto-import:

```
flake.nix
└── flake-parts + import-tree ./modules
    ├── modules/packages.nix      → builds the nvf package
    ├── modules/modules.nix       → exports nixos/HM/flake modules
    └── modules/format.nix        → treefmt (nixfmt)

    packages.nix calls:
    └── nvf.lib.neovimConfiguration
        └── import-tree ../conf
            ├── conf/vim-options.nix
            ├── conf/config/keybinds.nix
            ├── conf/config/ui.nix
            └── conf/plugins/*.nix
```

**`modules/`** contains flake-parts modules (package builds, flake outputs, formatting). **`conf/`** contains NVF configuration modules (vim options, plugins, keybindings) that are passed to `nvf.lib.neovimConfiguration`.

## Repository Structure

```
nvim/
├── flake.nix
├── modules/
│   ├── packages.nix            # Builds nvf package, exposes packages + apps
│   ├── modules.nix             # nixosModules, homeManagerModules, flakeModules
│   └── format.nix              # treefmt-nix (nixfmt)
└── conf/
    ├── vim-options.nix          # Core options: indentation, theme, statusline
    ├── config/
    │   ├── keybinds.nix         # All keybindings (~100 mappings)
    │   └── ui.nix               # Noice, devicons
    └── plugins/
        ├── bufferline.nix       # Tab line
        ├── languages.nix        # LSP, treesitter, language enables
        ├── lualine.nix          # Status line
        ├── mini.nix             # mini.nvim modules
        ├── nvim-cmp.nix         # Autocompletion
        └── snacks.nix           # Dashboard, picker, explorer, and more
```

## Theme

Catppuccin Mocha is used throughout — the editor theme, lualine status bar, and bufferline tabs all use it.

```nix
# conf/vim-options.nix
vim.theme = {
  enable = true;
  name = "catppuccin";
  style = "mocha";
};
```

## Plugins

### Snacks.nvim

The primary UI framework. Provides the dashboard, file explorer, fuzzy picker, notifications, and more:

| Feature | Description |
|---------|-------------|
| `dashboard` | Start screen with header and key shortcuts |
| `explorer` | File explorer |
| `picker` | Fuzzy finder (files, grep, buffers, git, LSP symbols) |
| `notifier` | Notification popups |
| `indent` | Indent guides |
| `scroll` | Smooth scrolling |
| `image` | Image rendering in terminal |
| `bigfile` | Performance optimization for large files |
| `statuscolumn` | Custom status column |
| `scope` | Scope detection |
| `words` | Word highlighting and jumping |

### Mini.nvim

A collection of small, focused modules:

| Module | Purpose |
|--------|---------|
| `pairs` | Auto-close brackets and quotes |
| `comment` | Toggle comments (`gcc`, `gc{motion}`) |
| `surround` | Add/change/delete surrounding characters |
| `splitjoin` | Toggle single-line / multi-line code |
| `move` | Move lines and selections with Alt+hjkl |
| `sessions` | Session management |

### Language Support

LSP and Treesitter are enabled globally. Language-specific support is configured for:

| Language | LSP | Treesitter | Formatting |
|----------|-----|------------|------------|
| Nix | nixd | yes | nixfmt |
| Python | yes | yes | — |
| Rust | rust-analyzer | yes | — |
| Go | gopls | yes | — |
| CSS | css-lsp | yes | — |

Diagnostics are viewable through **Trouble.nvim** (`<leader>xx`).

### Autocompletion

**nvim-cmp** with three sources:

| Source | Description |
|--------|-------------|
| `path` | Filesystem path completion |
| `luasnip` | Snippet completion |
| `buffer` | Words from open buffers |

### UI

| Plugin | Purpose |
|--------|---------|
| **Noice.nvim** | Replaces cmdline, messages, and popupmenu with a modern UI |
| **nvim-web-devicons** | File type icons |
| **nvim-bufferline** | Tab bar (tabs mode, no numbers) |
| **Lualine** | Status line with powerline separators |

## Keybindings

Leader key is space. All keybindings are defined in `conf/config/keybinds.nix`.

### File Navigation

| Key | Action |
|-----|--------|
| `<leader>ff` | Find files |
| `<leader>fr` | Recent files |
| `<leader>fg` | Git files |
| `<leader>fb` | Buffers |
| `<leader>ee` | File explorer |
| `<leader><space>` | Smart picker |
| `<leader>,` | Buffer picker |

### Search and Grep

| Key | Action |
|-----|--------|
| `<leader>/` | Grep |
| `<leader>sg` | Grep |
| `<leader>sw` | Grep word under cursor |
| `<leader>sb` | Search lines in current buffer |
| `<leader>sh` | Help |
| `<leader>sk` | Keymaps |
| `<leader>sd` | Diagnostics |
| `<leader>sm` | Marks |

### LSP

| Key | Action |
|-----|--------|
| `gd` | Go to definition |
| `gD` | Go to declaration |
| `gr` | References |
| `gI` | Implementations |
| `gy` | Type definitions |
| `<leader>ss` | Document symbols |
| `<leader>sS` | Workspace symbols |
| `<leader>fm` | Format buffer |

### Git

| Key | Action |
|-----|--------|
| `<leader>gg` | Lazygit |
| `<leader>gs` | Git status |
| `<leader>gb` | Git branches |
| `<leader>gl` | Git log |
| `<leader>gd` | Git diff |
| `<leader>gB` | Open in browser |

### Diagnostics (Trouble)

| Key | Action |
|-----|--------|
| `<leader>xx` | Toggle diagnostics |
| `<leader>xX` | Buffer diagnostics |
| `<leader>cs` | Symbols |
| `<leader>cl` | LSP panel |
| `<leader>xL` | Location list |
| `<leader>xQ` | Quickfix list |

### Toggles

| Key | Action |
|-----|--------|
| `<leader>us` | Toggle spelling |
| `<leader>uw` | Toggle wrap |
| `<leader>ul` | Toggle line numbers |
| `<leader>uL` | Toggle relative numbers |
| `<leader>ud` | Toggle diagnostics |
| `<leader>uc` | Toggle conceal |
| `<leader>ub` | Toggle dark/light background |
| `<leader>uh` | Toggle inlay hints |
| `<leader>ug` | Toggle indent guides |
| `<leader>uD` | Toggle dim mode |

### Other

| Key | Action |
|-----|--------|
| `<leader>z` | Zen mode |
| `<leader>bd` | Delete buffer |
| `<leader>tr` | Terminal |
| `<leader>th` | Colorscheme picker |
| `<leader>.` | Scratch buffer |
| `<leader>:` | Command history |
| `<leader>n` | Notifications |
| `<leader>cR` | Rename file |
