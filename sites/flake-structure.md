---
outline: deep
---

# Flake Structure

## The `flake.nix`

The entire flake definition fits in ~30 lines. The critical line is the `outputs`:

```nix
{
  description = "This is my NixOS Configuration";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    home-manager.url = "github:nix-community/home-manager/master";
    home-manager.inputs.nixpkgs.follows = "nixpkgs";
    flake-parts.url = "github:hercules-ci/flake-parts";
    import-tree.url = "github:vic/import-tree";
    # ... other inputs
  };

  outputs = inputs:
    inputs.flake-parts.lib.mkFlake { inherit inputs; }
      (inputs.import-tree ./modules);
}
```

That single `outputs` line does all the work:

1. **`import-tree ./modules`** — recursively finds every `.nix` file under `modules/` and imports them all as flake-parts modules.
2. **`flake-parts.lib.mkFlake`** — merges all those modules together into valid flake outputs (`nixosModules`, `homeManagerModules`, `nixosConfigurations`, etc.).

There are no manual import lists to maintain. Adding a new module is as simple as creating a `.nix` file in the right directory.

## How `import-tree` Works

`import-tree` walks the `modules/` directory tree and imports every `.nix` file it finds. Each file is loaded as a **flake-parts module** — a function that receives `{ ... }` (flake-parts module arguments) and returns an attribute set.

```
modules/
├── options.nix                     → imported as flake-parts module
├── nixosModules/
│   ├── base-system.nix             → imported as flake-parts module
│   ├── services/
│   │   ├── tailscale.nix           → imported as flake-parts module
│   │   └── audio.nix               → imported as flake-parts module
│   └── ...
├── homeManagerModules/
│   ├── cli/
│   │   ├── zsh/
│   │   │   └── zsh.nix             → imported as flake-parts module
│   │   └── tmux/
│   │       └── tmux.nix            → imported as flake-parts module
│   └── ...
└── hosts/
    └── cyril-nixos/
        └── configuration.nix       → imported as flake-parts module
```

Every single `.nix` file — regardless of depth — is automatically discovered and loaded. No `default.nix` files are needed.

## How `flake-parts` Works

Each imported file is a flake-parts module. Inside it, you set attributes on the `flake` namespace to register outputs:

```nix
# This is what every module file looks like at the outermost level
{ ... }:                                    # flake-parts module arguments
{
  flake.nixosModules.my-module =            # register a flake output
    { config, pkgs, ... }:                  # NixOS module arguments
    {
      # NixOS configuration here
    };
}
```

- `flake.nixosModules.<name>` registers a NixOS module.
- `flake.homeManagerModules.<name>` registers a Home Manager module.
- `flake.nixosConfigurations.<name>` registers a full system configuration.

All these attributes from all files are merged by flake-parts into the final flake outputs.

## The `options.nix` File

There is one special file — `modules/options.nix` — that declares `homeManagerModules` as a valid flake-parts option:

```nix
{ lib, inputs, ... }:
{
  imports = [
    inputs.treefmt-nix.flakeModule
  ];

  options.flake.homeManagerModules = lib.mkOption {
    type = lib.types.lazyAttrsOf lib.types.raw;
    default = { };
  };

  config = {
    perSystem = { pkgs, ... }: {
      treefmt.config = {
        projectRootFile = "flake.nix";
        programs.nixfmt.enable = true;
      };
    };
    systems = [ "x86_64-linux" "aarch64-linux" ];
  };
}
```

::: info Why is this needed?
`flake-parts` has built-in support for `nixosModules` and `nixosConfigurations`, but `homeManagerModules` is not a standard flake-parts option. This declaration tells flake-parts to accept and merge `flake.homeManagerModules.*` attributes from all module files.
:::

## Binary Cache

The flake configures a custom binary cache to speed up builds:

```nix
nixConfig = {
  substituters = [
    "https://cache.itzemoji.com/nix"
    "https://cache.nixos.org"
  ];
  trusted-public-keys = [
    "cache.itzemoji.com/nix:xiCpklCqm9MDpLJIWSlL5YsKM0nULH7J389tvbX4UzE="
    "cache.nixos.org-1:6NCHdD59X431o0gWypbMrAURkbJ16ZPMQFGspcDShjY="
  ];
};
```

When running `nix build` or `nixos-rebuild`, Nix will check this cache first. You may be prompted to trust the cache on first use — the installer handles this automatically with the `--accept-flake-config` flag.

## Flake Inputs

| Input | Purpose |
|-------|---------|
| `nixpkgs` | The NixOS package set (unstable channel) |
| `home-manager` | Declarative user-level configuration |
| `flake-parts` | Modular flake output framework |
| `import-tree` | Automatic recursive `.nix` file discovery |
| `stylix` | System-wide theming |
| `spicetify-nix` | Spotify theming via Spicetify |
| `nix-alien` | Run unpatched binaries on NixOS |
| `nixos-wsl` | NixOS on WSL2 support |
| `nvim` | Custom Neovim configuration flake |
| `treefmt-nix` | Code formatting (nixfmt) |
