---
outline: deep
---

# Creating Modules

This is the core of the dotfiles architecture. Every piece of configuration — a service, a program, a desktop environment, a set of packages — is a standalone module file that registers itself as either a `nixosModule` (system-level) or a `homeManagerModule` (user-level).

## The Module Pattern

Every module follows the same two-layer structure:

```nix
{ ... }:                                      # 1. Outer: flake-parts module args
{
  flake.<moduleType>.<moduleName> =           # 2. Register into flake outputs
    { config, pkgs, ... }:                    #    Inner: NixOS/HM module args
    {
      # Your configuration here
    };
}
```

| Layer | Function arguments | Purpose |
|-------|-------------------|---------|
| Outer | `{ ... }:` | Receives flake-parts module arguments (rarely needed) |
| Inner | `{ config, pkgs, ... }:` | Receives NixOS or Home Manager module arguments |

The `<moduleType>` is either `nixosModules` or `homeManagerModules`. The `<moduleName>` is a flat string — the name you'll use to reference this module from host configurations.

## NixOS Modules

NixOS modules configure system-level settings: services, boot, networking, drivers, system packages, etc. They are registered under `flake.nixosModules.<name>`.

### Minimal example

The simplest possible module enables a single service:

```nix
# modules/nixosModules/services/tailscale.nix
{ ... }:
{
  flake.nixosModules.tailscale =
    { ... }:
    {
      services.tailscale.enable = true;
    };
}
```

That's it. Save this file anywhere under `modules/` and it will be automatically discovered by `import-tree` and available as `self.nixosModules.tailscale` in your host configuration.

### With packages and programs

```nix
# modules/nixosModules/programs/nh.nix
{ ... }:
{
  flake.nixosModules.nh =
    { ... }:
    {
      programs.nh = {
        enable = true;
        clean.enable = true;
        clean.extraArgs = "--keep-since 4d --keep 3";
        flake = "/etc/nixos";
      };
    };
}
```

### With external flake inputs

When a module needs access to an external flake input, add `inputs` to the inner function arguments:

```nix
# modules/nixosModules/gui/stylix/stylix.nix
{ ... }:
{
  flake.nixosModules.stylix =
    { config, pkgs, inputs, ... }:
    {
      imports = [ inputs.stylix.nixosModules.stylix ];

      stylix = {
        enable = true;
        base16Scheme = "${pkgs.base16-schemes}/share/themes/catppuccin-mocha.yaml";
        autoEnable = false;
      };
    };
}
```

::: tip
For `inputs` to be available inside modules, your host configuration must pass it via `specialArgs`. See [Host Configuration](/host-configuration) for details.
:::

### With system packages

```nix
# modules/nixosModules/config/fonts.nix
{ ... }:
{
  flake.nixosModules.fonts =
    { pkgs, ... }:
    {
      fonts = {
        packages = with pkgs; [
          noto-fonts
          noto-fonts-cjk-sans
          noto-fonts-emoji
          jetbrains-mono
        ];
        fontconfig.defaultFonts = {
          monospace = [ "JetBrains Mono" ];
          sansSerif = [ "Noto Sans" ];
          serif = [ "Noto Serif" ];
        };
      };
    };
}
```

## Home Manager Modules

Home Manager modules configure user-level settings: shell, terminal, desktop apps, dotfiles, user packages, etc. They are registered under `flake.homeManagerModules.<name>`.

### With packages and config files

The most common pattern: install a package and place its config file:

```nix
# modules/homeManagerModules/cli/tmux/tmux.nix
{ ... }:
{
  flake.homeManagerModules.tmux =
    { pkgs, config, ... }:
    {
      home.packages = with pkgs; [
        tmux
      ];
      home.file.".config/tmux/tmux.conf".source = ./tmux.conf;
    };
}
```

The config file (`tmux.conf`) lives right next to the `.nix` file:

```
modules/homeManagerModules/cli/tmux/
├── tmux.nix
└── tmux.conf
```

### Using `programs.*` options

Many programs have dedicated Home Manager options:

```nix
# modules/homeManagerModules/cli/fzf/fzf.nix
{ ... }:
{
  flake.homeManagerModules.fzf =
    { ... }:
    {
      programs.fzf = {
        enable = true;
        enableZshIntegration = true;
      };
    };
}
```

### With structured config (TOML/JSON)

You can read config files as structured data instead of copying them as raw files:

```nix
# modules/homeManagerModules/cli/atuin/atuin.nix
{ ... }:
{
  flake.homeManagerModules.atuin =
    { ... }:
    {
      programs.atuin = {
        enable = true;
        enableZshIntegration = true;
        settings = builtins.fromTOML (builtins.readFile ./config.toml);
      };
    };
}
```

```nix
# modules/homeManagerModules/cli/oh-my-posh/oh-my-posh.nix
{ ... }:
{
  flake.homeManagerModules.oh-my-posh =
    { ... }:
    {
      programs.oh-my-posh = {
        enable = true;
        enableZshIntegration = true;
        settings = builtins.fromJSON (builtins.readFile ./config.json);
      };
    };
}
```

### With external flake inputs

```nix
# modules/homeManagerModules/programs/spicetify/spicetify.nix
{ ... }:
{
  flake.homeManagerModules.spicetify =
    { config, pkgs, inputs, ... }:
    let
      spicePkgs = inputs.spicetify-nix.legacyPackages.${pkgs.stdenv.system};
    in
    {
      programs.spicetify = {
        enable = true;
        theme = spicePkgs.themes.catppuccin;
        colorScheme = "mocha";
      };
    };
}
```

### Complex module with inline configuration

For programs with extensive configuration, you can write it all inline:

```nix
# modules/homeManagerModules/cli/zsh/zsh.nix
{ ... }:
{
  flake.homeManagerModules.zsh =
    { config, pkgs, ... }:
    {
      home.packages = with pkgs; [ zinit eza bat zsh gh fastfetch ];

      programs.zsh = {
        enable = true;
        history = {
          size = 5000;
          share = true;
          append = true;
          ignoreSpace = true;
        };
        shellAliases = {
          ls = "eza --icons --group-directories-first";
          vim = "nvim";
          cat = "bat";
        };
        sessionVariables = {
          EDITOR = "nvim";
        };
      };
    };
}
```

## Dual-Export Modules

A single file can export both a `nixosModule` and a `homeManagerModule`. This is commonly used for package lists:

```nix
# modules/packages/global.nix
{ ... }:
{
  flake.nixosModules.packages-global =
    { pkgs, inputs, ... }:
    {
      environment.systemPackages = with pkgs; [
        vim
        git
        wget
        file
        zsh
      ];
      programs = {
        zsh.enable = true;
        nix-ld.enable = true;
      };
    };

  flake.homeManagerModules.packages-global =
    { pkgs, ... }:
    {
      home.packages = with pkgs; [
        btop
        jq
        ripgrep
        nodejs
        gcc
        gnumake
      ];
    };
}
```

This registers both `self.nixosModules.packages-global` and `self.homeManagerModules.packages-global` from one file. The NixOS module handles system-wide packages, while the Home Manager module handles per-user packages.

## Config File Patterns

There are several ways to manage configuration files in modules:

| Pattern | When to use | Example |
|---------|-------------|---------|
| `home.file."path".source = ./file` | Raw config files that don't need Nix interpolation | tmux, hyprland, waybar |
| `programs.<name>.settings = builtins.fromTOML (builtins.readFile ./file)` | TOML configs with dedicated HM options | atuin |
| `programs.<name>.settings = builtins.fromJSON (builtins.readFile ./file)` | JSON configs with dedicated HM options | oh-my-posh |
| Inline Nix attributes | When you want Nix-level control (conditionals, pkgs references) | zsh, kitty, rofi |

## Directory Organization

Modules are organized by category. While the directory structure is flexible (import-tree finds everything regardless), the convention is:

```
modules/
├── nixosModules/
│   ├── bootloaders/        # Boot configuration (grub, systemd-boot)
│   ├── config/             # System config (fonts, nix-cache, home-manager)
│   ├── general/            # General system features (bluetooth, virtualisation)
│   ├── gui/
│   │   ├── desktops/       # Desktop environments (hyprland, plasma)
│   │   ├── displaymanagers/ # Display managers (ly, sddm)
│   │   └── stylix/         # System-wide theming
│   ├── programs/           # System programs (nh)
│   ├── services/           # System services (audio, printing, ssh, tailscale)
│   └── videoDrivers/       # GPU drivers (nvidia, base drivers)
├── homeManagerModules/
│   ├── cli/                # Shell tools (zsh, tmux, fzf, atuin, etc.)
│   ├── gui/                # Desktop apps (hyprland config, waybar, dunst, rofi)
│   ├── programs/           # GUI programs (kitty, foot, spicetify)
│   └── services/           # User services (ssh-agent)
└── packages/               # Package lists (dual-export nixos + HM)
```

::: tip
Co-locate config files with their module. A module at `cli/tmux/tmux.nix` should have its config at `cli/tmux/tmux.conf`. This keeps everything self-contained and easy to find.
:::

## Naming Conventions

- **Module names are flat** — despite the nested directory structure, modules register with simple names: `flake.nixosModules.tailscale`, not `flake.nixosModules.services.tailscale`.
- **Package modules use a prefix** — `packages-global`, `packages-cyril-nixos`, `packages-wsl`.
- **User modules include the host** — `cyril-nixos-user-cyril` identifies both the host and the user.
- **No `default.nix` files** — each module is a named `.nix` file, not a directory with `default.nix`.

## Step-by-Step: Adding a New Module

### 1. Create the file

Pick the appropriate category directory and create a `.nix` file:

```bash
mkdir -p modules/nixosModules/services
touch modules/nixosModules/services/my-service.nix
```

### 2. Write the module

```nix
# modules/nixosModules/services/my-service.nix
{ ... }:
{
  flake.nixosModules.my-service =
    { pkgs, ... }:
    {
      services.my-service = {
        enable = true;
        package = pkgs.my-service;
      };
    };
}
```

### 3. Add it to a host configuration

In your host's `configuration.nix`, add the module reference:

```nix
self.nixosModules.my-service
```

See [Host Configuration](/host-configuration) for the full pattern.

### 4. Rebuild

```bash
sudo nixos-rebuild switch --flake .#<hostname>
```

That's it. No imports to update, no `default.nix` to modify, no flake outputs to declare. The module is discovered automatically by `import-tree`.
