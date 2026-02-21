---
outline: deep
---

# Repositories

All repositories are hosted on GitHub under [ItzEmoji](https://github.com/ItzEmoji) and **mirrored** to GitLab, Codeberg, and Gitea.

## Mirror Locations

Every repository listed below is available on all four platforms:

| Platform | Base URL |
|----------|----------|
| GitHub (primary) | `github.com/ItzEmoji` |
| GitLab | `gitlab.com/ItzEmoji` |
| Codeberg | `codeberg.org/ItzEmoji` |
| Gitea | `gitea.com/ItzEmoji` |

Mirrors are synced automatically on every push to `main` via GitHub Actions.

## Repository Overview

### nixos-dotfiles

The modular NixOS configuration documented on this site. Uses flake-parts and import-tree for zero-boilerplate module management.

| Platform | Link |
|----------|------|
| GitHub | [ItzEmoji/nixos-dotfiles](https://github.com/ItzEmoji/nixos-dotfiles) |
| GitLab | [ItzEmoji/nixos-dotfiles](https://gitlab.com/ItzEmoji/nixos-dotfiles) |
| Codeberg | [ItzEmoji/nixos-dotfiles](https://codeberg.org/ItzEmoji/nixos-dotfiles) |
| Gitea | [ItzEmoji/nixos-dotfiles](https://gitea.com/ItzEmoji/nixos-dotfiles) |

See: [Getting Started](/getting-started), [Creating Modules](/creating-modules), [Host Configuration](/host-configuration)

---

### nixos-installer

A Rust-based TUI installer for NixOS that works with any flake-based dotfiles repository. Handles disk partitioning, module selection, user creation, and runs `nixos-install`.

| Platform | Link |
|----------|------|
| GitHub | [ItzEmoji/nixos-installer](https://github.com/ItzEmoji/nixos-installer) |
| GitLab | [ItzEmoji/nixos-installer](https://gitlab.com/ItzEmoji/nixos-installer) |
| Codeberg | [ItzEmoji/nixos-installer](https://codeberg.org/ItzEmoji/nixos-installer) |
| Gitea | [ItzEmoji/nixos-installer](https://gitea.com/ItzEmoji/nixos-installer) |

```bash
nix run github:ItzEmoji/nixos-installer
```

See: [NixOS Installer](/installer)

---

### nvim

A declaratively managed Neovim configuration built with [NVF](https://github.com/notashelf/nvf) (Neovim Flake). Pure Nix, no Mason, fully reproducible.

| Platform | Link |
|----------|------|
| GitHub | [ItzEmoji/nvim](https://github.com/ItzEmoji/nvim) |
| GitLab | [ItzEmoji/nvim](https://gitlab.com/ItzEmoji/nvim) |
| Codeberg | [ItzEmoji/nvim](https://codeberg.org/ItzEmoji/nvim) |
| Gitea | [ItzEmoji/nvim](https://gitea.com/ItzEmoji/nvim) |

```bash
nix run github:ItzEmoji/nvim --accept-flake-config
```

See: [Neovim Configuration](/neovim)

---

### nixos-images

Custom NixOS ISO images. This repository is **GitHub-only** and is not mirrored to other platforms.

| Platform | Link |
|----------|------|
| GitHub | [ItzEmoji/nixos-images](https://github.com/ItzEmoji/nixos-images) |

## Binary Cache

All repositories share a binary cache to speed up builds. Pre-built artifacts for `x86_64-linux` and `aarch64-linux` are pushed automatically by CI:

```
https://cache.itzemoji.com/nix
```

When running `nix build` or `nix run` on any of these repositories, Nix will fetch pre-built binaries from this cache instead of compiling from source. You may be prompted to trust the cache on first use — pass `--accept-flake-config` to accept automatically.
