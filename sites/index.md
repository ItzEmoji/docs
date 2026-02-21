---
layout: home

hero:
  name: "NixOS-Dotfiles"
  text: "A modular NixOS configuration framework"
  tagline: Build reproducible NixOS systems with flake-parts, import-tree, and composable modules.
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/ItzEmoji/nixos-dotfiles

features:
  - title: Modular Architecture
    details: Every piece of configuration is a standalone module — nixosModules for system-level config and homeManagerModules for user-level config. Mix and match per host.
  - title: Zero Boilerplate
    details: Powered by flake-parts and import-tree. Drop a .nix file anywhere under modules/ and it is automatically discovered and registered as a flake output.
  - title: TUI Installer
    details: A Rust-based terminal installer walks you through disk partitioning, module selection, and user creation — then runs nixos-install with your flake.
---
