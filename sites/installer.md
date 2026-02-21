---
outline: deep
---

# NixOS Installer

A terminal UI (TUI) application built in Rust that automates NixOS installation from any flake-based dotfiles repository. It handles disk partitioning, module selection, user creation, and runs `nixos-install` with your configuration.

**Repository:** [github.com/ItzEmoji/nixos-installer](https://github.com/ItzEmoji/nixos-installer)

## Quick Start

### Run directly with Nix

```bash
nix run github:ItzEmoji/nixos-installer
```

### With a custom dotfiles repository

```bash
nix run github:ItzEmoji/nixos-installer -- --repo https://github.com/youruser/your-dotfiles.git
```

### From an existing local clone

```bash
nix run github:ItzEmoji/nixos-installer -- /path/to/your/dotfiles
```

## Features

- Guided TUI wizard with step-by-step installation
- Clones any git-based nixos-dotfiles repository
- Automatic module discovery (scans `modules/nixosModules/` and `modules/homeManagerModules/`)
- Interactive multi-select for NixOS modules, Home Manager modules, and package sets
- Disk partitioning (full-disk or custom layout) with EFI, ext4, Btrfs, and swap support
- Multiple user creation with password setup
- Preset support — pick an existing host configuration or build a custom one
- 5 color themes: Catppuccin Mocha, Nord, Dracula, Tokyo Night, Gruvbox
- Real-time progress display during `git clone` and `nixos-install`
- Persistent logging to `/tmp/nixos-installer.log`

## Installation Wizard

The installer walks through these steps:

### 1. Clone Repository

If no local repo is provided, the installer clones the configured dotfiles repository into `/tmp/nixos-dotfiles`. Progress from `git clone` is displayed in real time.

### 2. Select Host Preset

The installer scans `modules/hosts/` for existing host configurations. You can:
- **Pick a preset** — use an existing host configuration as-is
- **Choose "Custom"** — build a new configuration by selecting individual modules

### 3. Configure Modules (Custom mode)

In custom mode, you select from the available modules:
- **NixOS modules** — system services, boot, desktop, drivers, etc.
- **System packages** — package sets from `modules/packages/`

Modules are discovered automatically by scanning the repository with `fd`.

### 4. Create Users

For each user:
- Enter a username (lowercase alphanumeric, hyphens, underscores)
- Set and confirm a password (hashed securely via `mkpasswd` or `openssl`)
- Optionally add more users

### 5. Select Per-User Modules (Custom mode)

For each user, select:
- **Home Manager modules** — shell tools, desktop apps, programs
- **User package sets** — per-user package lists

### 6. Disk Partitioning

Select a target disk, then choose a partitioning mode:

**Full Disk** — creates a standard layout automatically:
| Partition | Size | Filesystem | Mount |
|-----------|------|------------|-------|
| EFI | 512 MiB | FAT32 | `/boot` |
| Swap | configurable (default 4 GiB) | swap | — |
| Root | remaining space | ext4 | `/` |

**Custom** — define partitions manually with mount point, size, and filesystem type (FAT32, ext4, Btrfs, or swap).

### 7. Confirm and Install

A summary screen shows all selections. The installation then proceeds through these sub-steps:

1. Partition the disk (`parted`)
2. Format and mount filesystems
3. Generate `_hardware-configuration.nix`
4. Write host configuration (custom mode)
5. Write user configuration files
6. Stage new files with `git add`
7. Run `nixos-install --flake <path>#<hostname>`
8. Copy the repository to `/mnt/etc/nixos/`

### 8. Set Passwords

After installation, the installer sets root and user passwords via `nixos-enter`.

### 9. Complete

Reboot into your new system, or exit to continue working in the live environment.

## Specifying Your Repository

The installer supports any flake-based dotfiles repository. There are several ways to specify which one to use, in order of priority:

### CLI flag (highest priority)

```bash
nixos-installer --repo https://github.com/youruser/your-dotfiles.git
```

### Config file

Create or generate a config at `/etc/nixos-installer/config.toml`:

```bash
nixos-installer --init
```

Then edit the generated file:

```toml
# /etc/nixos-installer/config.toml

# Git repository URL for the NixOS dotfiles to install from.
repo_url = "https://github.com/youruser/your-dotfiles.git"

# Color theme for the installer TUI.
# Available: catppuccin-mocha, nord, dracula, tokyo-night, gruvbox
theme = "catppuccin-mocha"

# Home Manager base modules always included for every user.
hm_base_modules = ["home"]
```

Use a custom config path with `--config`:

```bash
nixos-installer --config /path/to/my-config.toml
```

### Environment variable

```bash
NIXOS_DOTFILES_REPO="https://github.com/youruser/your-dotfiles.git" nixos-installer
```

### Local path

Point directly at a local clone:

```bash
nixos-installer /path/to/your/dotfiles
```

The installer also auto-detects if the current working directory contains a `flake.nix` and `modules/` directory, and uses it directly without cloning.

### Default

If nothing is specified, the installer defaults to `https://github.com/itzemoji/nixos-dotfiles.git`.

## Repository-Level Configuration

Dotfiles repository authors can include a `config.toml` in their repository root. When the installer clones or loads the repo, it reads this file and merges its settings:

```toml
# config.toml (in your dotfiles repo root)

# Override the default repo URL (useful for forks)
# repo_url = "https://github.com/youruser/your-dotfiles.git"

# Set a default theme for users of this repo
theme = "catppuccin-mocha"

# Base HM modules that are always included (hidden from selection)
hm_base_modules = ["home"]
```

This lets you ship installer preferences alongside your dotfiles so users of your repo get sensible defaults.

## Expected Repository Structure

The installer expects your dotfiles repository to follow this layout:

```
your-dotfiles/
├── flake.nix
├── config.toml                    # optional: installer defaults
└── modules/
    ├── nixosModules/              # scanned for NixOS module selection
    │   └── ...
    ├── homeManagerModules/        # scanned for HM module selection
    │   └── ...
    ├── packages/                  # scanned for package set selection
    │   └── ...
    └── hosts/                     # scanned for host presets
        └── <hostname>/
            ├── configuration.nix
            ├── _hardware-configuration.nix
            └── user-<username>.nix
```

See [Creating Modules](/creating-modules) and [Host Configuration](/host-configuration) for details on how to structure these files.

## CLI Reference

```
nixos-installer [OPTIONS] [PATH]

ARGS:
    <PATH>              Use an existing local repo instead of cloning

OPTIONS:
    --repo <URL>        Override the dotfiles repository URL
    --config <PATH>     Load config from a custom path
                        (default: /etc/nixos-installer/config.toml)
    --theme <NAME>      Override the color theme
    --init              Generate a default config.toml
    --help, -h          Show help message

ENVIRONMENT:
    NIXOS_DOTFILES_REPO    Fallback repository URL if --repo is not given

AVAILABLE THEMES:
    catppuccin-mocha
    nord
    dracula
    tokyo-night
    gruvbox
```

## Building from Source

The installer is built with Rust and packaged as a Nix flake:

```bash
# Build with Nix
nix build github:ItzEmoji/nixos-installer

# Or clone and build with Cargo
git clone https://github.com/ItzEmoji/nixos-installer.git
cd nixos-installer
cargo build --release
```

### Dependencies

| Dependency | Purpose |
|-----------|---------|
| `ratatui` | Terminal UI framework |
| `crossterm` | Cross-platform terminal I/O |
| `serde` / `serde_json` | JSON parsing (for `lsblk` output) |
| `toml` | Config file parsing |

### Runtime Requirements

The installer shells out to standard NixOS tools that are available on any NixOS live ISO:

- `git` — repository cloning
- `parted` — disk partitioning
- `mkfs.fat`, `mkfs.ext4`, `mkfs.btrfs`, `mkswap` — filesystem creation
- `nixos-generate-config` — hardware config generation
- `nixos-install` — system installation
- `nixos-enter` — password setting in the installed system
- `fd` — module file discovery
- `mkpasswd` or `openssl` — password hashing
