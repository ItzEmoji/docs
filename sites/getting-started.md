# Getting Started

## Overview

This is a modular NixOS configuration built on three key technologies:

- **[flake-parts](https://github.com/hercules-ci/flake-parts)** — a framework for structuring Nix flake outputs as composable modules.
- **[import-tree](https://github.com/vic/import-tree)** — automatically discovers and imports every `.nix` file under a directory tree.
- **[Home Manager](https://github.com/nix-community/home-manager)** — manages user-level configuration declaratively alongside NixOS system config.

Together, these tools eliminate boilerplate. You never write import lists or `default.nix` files. Every `.nix` file you create under `modules/` is automatically loaded.

## Prerequisites

- A running NixOS system (or a NixOS live ISO for fresh installs)
- Nix with flakes enabled
- Git

## Quick Start

### Clone the repository

```bash
git clone https://github.com/ItzEmoji/nixos-dotfiles.git
cd nixos-dotfiles
```

### Build and switch

```bash
sudo nixos-rebuild switch --flake .#<hostname>
```

Replace `<hostname>` with your host configuration name (e.g. `cyril-nixos`).

### Using the TUI installer (fresh install)

For new installations, the [NixOS Installer](/installer) provides a guided terminal UI:

```bash
nix run github:ItzEmoji/nixos-installer
```

See the [Installer documentation](/installer) for full details.

## Repository Layout

```
nixos-dotfiles/
├── flake.nix                          # Flake definition (inputs + single-line outputs)
├── flake.lock
└── modules/
    ├── options.nix                    # flake-parts option declarations
    ├── nixosModules/                  # System-level NixOS modules
    │   ├── base-system.nix
    │   ├── bootloaders/
    │   ├── config/
    │   ├── general/
    │   ├── gui/
    │   ├── programs/
    │   ├── services/
    │   └── videoDrivers/
    ├── homeManagerModules/            # User-level Home Manager modules
    │   ├── base.nix
    │   ├── cli/
    │   ├── gui/
    │   ├── programs/
    │   └── services/
    ├── hosts/                         # Per-host configurations
    │   ├── cyril-nixos/
    │   └── wsl/
    └── packages/                      # Package lists (system + user)
        ├── global.nix
        ├── cyril-nixos.nix
        └── wsl.nix
```

## What's Next

| Topic | Description |
|-------|-------------|
| [Flake Structure](/flake-structure) | How `flake.nix`, flake-parts, and import-tree work together |
| [Creating Modules](/creating-modules) | Writing your own `nixosModules` and `homeManagerModules` |
| [Host Configuration](/host-configuration) | Composing modules into a complete system |
| [NixOS Installer](/installer) | The Rust-based TUI installer for fresh installs |
