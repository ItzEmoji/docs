---
outline: deep
---

# NixOS Images

Custom NixOS images built from a single configuration and exported to 26 different formats — ISOs, cloud images, VM images, containers, and netboot. Every image ships with flakes enabled, a pre-configured Neovim, SSH access, and essential tools.

**Repository:** [github.com/ItzEmoji/nixos-images](https://github.com/ItzEmoji/nixos-images) (GitHub only, not mirrored)

## Quick Start

### Download the installer ISO

```bash
wget https://github.com/ItzEmoji/nixos-images/releases/latest/download/nixos-installer.iso
```

Flash it to a USB drive:

```bash
dd if=nixos-installer.iso of=/dev/sdX bs=4M status=progress
```

### Netboot via iPXE

Boot into any iPXE environment and chain-load the netboot script:

```
chain https://github.com/ItzEmoji/nixos-images/releases/latest/download/netboot.ipxe
```

Or use it with a custom netboot menu (replace `ItzEmoji` with your GitHub username if you forked the repo):

```
chain https://github.com/ItzEmoji/nixos-images/releases/latest/download/netboot.ipxe
```

The iPXE script fetches the kernel (`bzImage`) and initrd directly from the GitHub release, then boots into the NixOS installer environment. No USB drive needed.

## How Netboot Works

The netboot image consists of three artifacts published to every GitHub release:

| File | Description |
|------|-------------|
| `netboot.ipxe` | iPXE script that loads the kernel and initrd |
| `bzImage` | Linux kernel |
| `initrd` | Initial ramdisk containing the NixOS system |

When an iPXE client chain-loads `netboot.ipxe`, the script:

1. Frees any previously loaded images (`imgfree`)
2. Downloads the kernel from the GitHub release URL
3. Downloads the initrd from the GitHub release URL
4. Boots with the appropriate init parameters

The iPXE script URLs are automatically patched during CI to point at the correct GitHub release download URLs, so the raw `netboot.ipxe` file works out of the box without any manual editing.

### Using with a custom netboot menu

If you run your own iPXE/netboot menu, add an entry that chain-loads the script:

```
:nixos-installer
chain https://github.com/ItzEmoji/nixos-images/releases/latest/download/netboot.ipxe
```

To use your own fork, replace `ItzEmoji` with your GitHub username:

```
chain https://github.com/<your-username>/nixos-images/releases/latest/download/netboot.ipxe
```

## What's in the Image

Every image — ISO, netboot, cloud, VM — boots the same NixOS configuration:

| Feature | Details |
|---------|---------|
| Auto-login | Root user via kmscon (no password prompt) |
| Root password | Empty (for local access) |
| SSH | Enabled, root login permitted, ed25519 key pre-authorized |
| Keyboard | Swiss German (`ch`) |
| Console font | JetBrains Mono Nerd Font |
| Nix | Flakes and nix-command enabled |
| Network | NetworkManager |
| Editor | Custom [Neovim](/neovim) (from `github:ItzEmoji/nvim`) |
| Tools | git, util-linux, curl, wget, fastfetch |
| State version | 25.05 |

## Available Image Formats

All 26 formats are built from the same NixOS configuration and exposed as flake packages. Build any of them with:

```bash
nix build github:ItzEmoji/nixos-images#<format>
```

### ISOs

| Package | Description |
|---------|-------------|
| `iso` | Basic NixOS live ISO |
| `iso-installer` | Installer ISO |

### Network Boot

| Package | Description |
|---------|-------------|
| `netboot` | iPXE netboot (bzImage + initrd + netboot.ipxe) |
| `kexec` | Kexec tarball (for kexec-based remote installs) |

### Cloud Images

| Package | Provider |
|---------|----------|
| `azure` | Microsoft Azure (VHD) |
| `cloudstack` | Apache CloudStack (QCOW2) |
| `digital-ocean` | DigitalOcean |
| `google-compute` | Google Compute Engine |
| `linode` | Linode |
| `openstack` | OpenStack (QCOW2) |
| `openstack-zfs` | OpenStack with ZFS (QCOW2) |
| `oci` | OCI container image |

### Virtual Machine Images

| Package | Hypervisor |
|---------|------------|
| `hyperv` | Hyper-V (VHDX) |
| `proxmox` | Proxmox VE (VMA) |
| `proxmox-lxc` | Proxmox LXC container |
| `qemu` | QEMU (QCOW2, BIOS) |
| `qemu-efi` | QEMU (QCOW2, EFI) |
| `vagrant-virtualbox` | Vagrant + VirtualBox (.box) |
| `virtualbox` | VirtualBox (OVA) |
| `vmware` | VMware (VMDK) |
| `kubevirt` | KubeVirt |

### Container Images

| Package | Format |
|---------|--------|
| `lxc` | LXC rootfs tarball |
| `lxc-metadata` | LXC metadata tarball |

### Raw Disk Images

| Package | Description |
|---------|-------------|
| `raw` | Raw disk image (BIOS) |
| `raw-efi` | Raw disk image (EFI) |
| `sd-card` | SD card image (for SBCs) |

## Repository Structure

```
nixos-images/
├── flake.nix                    # Flake definition (flake-parts + import-tree)
└── modules/
    ├── configuration.nix        # nixosConfigurations.nixos-installer (composes all modules)
    ├── images.nix               # Exposes all 26 image formats as flake packages
    ├── kmscon.nix               # Virtual console with JetBrains Mono + root autologin
    ├── nix-config.nix           # Flakes enabled, stateVersion
    ├── packages.nix             # System packages (git, curl, wget, etc.)
    ├── root-user.nix            # Root user with empty password + SSH key
    ├── ssh-server.nix           # OpenSSH with root login
    ├── xkb.nix                  # Swiss German keyboard layout
    └── format.nix               # treefmt-nix (nixfmt)
```

The same **flake-parts + import-tree** pattern is used here as in the [dotfiles](/flake-structure). Every `.nix` file under `modules/` is automatically discovered and loaded.

## CI/CD

On every push to `main`, GitHub Actions:

1. Builds the **netboot** image (`nix build .#netboot`)
2. Builds the **installer ISO** (`nix build .#iso-installer`)
3. Patches `netboot.ipxe` to use GitHub release download URLs
4. Creates a new GitHub release with four artifacts:
   - `nixos-installer.iso`
   - `netboot.ipxe`
   - `bzImage`
   - `initrd`

Releases are tagged `v1.0.<run_number>` and the latest release is always accessible via the `/releases/latest/download/` URL.

## Forking

To create your own custom NixOS images:

1. Fork [ItzEmoji/nixos-images](https://github.com/ItzEmoji/nixos-images)
2. Edit the modules under `modules/` to customize your image (packages, SSH keys, keyboard layout, etc.)
3. Push to `main` — CI will build and publish your images automatically
4. Download your ISO or chain-load your netboot script using your own GitHub username in the URL

::: tip
Make sure to create an initial release tagged `latest` if GitHub Actions fails on the first run. The workflow requires the releases feature to be enabled on your fork.
:::
