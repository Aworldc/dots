{ config, pkgs, pkgs-unstable, pkgs-new, ... }:

{
  imports = [
    ./hardware-configuration.nix <musnix>
  ];

  nix.settings.experimental-features = [ "nix-command" "flakes" ];

  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;

  networking.hostName = "allanslappy";
  networking.networkmanager.enable = true;

  time.timeZone = "Australia/Melbourne";

  i18n.defaultLocale = "en_AU.UTF-8";
  i18n.extraLocaleSettings = {
    LC_ADDRESS = "en_AU.UTF-8";
    LC_IDENTIFICATION = "en_AU.UTF-8";
    LC_MEASUREMENT = "en_AU.UTF-8";
    LC_MONETARY = "en_AU.UTF-8";
    LC_NAME = "en_AU.UTF-8";
    LC_NUMERIC = "en_AU.UTF-8";
    LC_PAPER = "en_AU.UTF-8";
    LC_TELEPHONE = "en_AU.UTF-8";
    LC_TIME = "en_AU.UTF-8";
  };

  services.xserver.xkb = {
    layout = "us";
    variant = "";
  };

  services.dbus.enable = true;
  services.dbus.packages = with pkgs; [
    xfce.xfconf
    gnome2.GConf
  ];

  services.pipewire = {
    enable = true;
    alsa.enable = true;
    alsa.support32Bit = true;
    pulse.enable = true;
    # jack.enable = true;
  };

  musnix.enable = true;

  services.upower.enable = true;
  services.gvfs.enable = true;
  services.udisks2.enable = true;
  services.devmon.enable = true;

  # services.displayManager.sddm.enable = true;
  # services.displayManager.sddm.wayland.enable = true;
  # services.xserver.displayManager.gdm.enable = true;

  programs.hyprland.enable = true;
  programs.hyprland.xwayland.enable = true;
  programs.dconf.enable = true;
  programs.steam.enable = true;

  nixpkgs.config.allowUnfree = true;

  users.users.allan = {
    isNormalUser = true;
    description = "Allan";
    extraGroups = [ "networkmanager" "wheel" "audio" ];
    packages = with pkgs; [];
  };

  environment.sessionVariables = rec {
    XDG_CACHE_HOME  = "$HOME/.cache";
    XDG_CONFIG_HOME = "$HOME/.config";
    XDG_DATA_HOME   = "$HOME/.local/share";
    XDG_STATE_HOME  = "$HOME/.local/state";

    # Not officially in the specification
    XDG_BIN_HOME    = "$HOME/.local/bin";
    PATH = [ 
      "${XDG_BIN_HOME}"
    ];
  };

  environment.sessionVariables.NIXOS_OZONE_WL = "1";
  environment.sessionVariables.WLR_NO_HARDWARE_CURSORS = "1";
  environment.sessionVariables.GTK_THEME = "adw-gtk3-dark";
  environment.sessionVariables.QT_QPA_PLATFORM = "wayland";
  environment.sessionVariables.QT_AUTO_SCREEN_SCALE_FACTOR = "1";
  environment.sessionVariables.QT_WAYLAND_DISABLE_WINDOWDECORATION = "1";
  environment.sessionVariables.SDL_VIDEODRIVER = "wayland";
  environment.sessionVariables.QT_SCALE_FACTOR_ROUNDING_POLICY = "RoundPreferFloor";
  environment.sessionVariables.XDG_SESSION_TYPE = "wayland";
  environment.sessionVariables.XDG_SESSION_DESKTOP = "Hyprland";
  environment.sessionVariables.XDG_CURRENT_DESKTOP = "Hyprland";
  environment.sessionVariables.GDK_BACKEND = "wayland";
  environment.sessionVariables.CLUTTER_BACKEND = "wayland";
  environment.sessionVariables.XCURSOR_SIZE = "24";


  environment.systemPackages = [
    pkgs.ags
    pkgs-new.hyprland
    pkgs-new.hyprpaper
    pkgs-new.neovim
    pkgs-new.kitty
    pkgs.gnome.nautilus
    pkgs-new.baobab
    pkgs.wofi
    pkgs.git
    pkgs-new.firefox
    pkgs.gradience
    pkgs-new.adw-gtk3
    pkgs.at-spi2-atk
    pkgs-new.qt6.qtwayland
    pkgs.gnome.adwaita-icon-theme
    pkgs.prismlauncher
  # pkgs-new.neofetch
    pkgs-new.jq
    pkgs-new.mako
    pkgs.vscodium
    pkgs-new.brightnessctl
  # pkgs.libreoffice-fresh
  # pkgs-new.vlc
    pkgs-unstable.osu-lazer-bin
    pkgs-new.hyprshot
  # pkgs-new.gnome.gnome-system-monitor
    pkgs.steam
    pkgs-new.hyprshot
  # pkgs-new.krita
    pkgs-new.inkscape
  # pkgs-new.ladybird
    pkgs-new.libreoffice
  # pkgs-new.waydroid
    pkgs-new.blender
  # pkgs-new.freecad
    pkgs-new.thefuck
  ];

  system.stateVersion = "24.05";
}
