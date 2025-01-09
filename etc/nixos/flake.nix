{
  description = "flake";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.05";
    nixpkgs-new.url = "github:NixOS/nixpkgs/nixos-24.11";
    nixpkgs-unstable.url = "nixpkgs/nixos-unstable";
    nixos-hardware.url = "github:NixOS/nixos-hardware/master";
  };
  outputs = { self, nixpkgs, nixpkgs-unstable, nixpkgs-new, nixos-hardware }: 
    let
      system = "x86_64-linux";
      lib = nixpkgs.lib;
      pkgs = nixpkgs.legacyPackages.${system};
      pkgs-new = nixpkgs.legacyPackages.${system};
      pkgs-unstable = nixpkgs-unstable.legacyPackages.${system};
    in { 
      nixosConfigurations.allanslappy = lib.nixosSystem {
        inherit system;
        modules = [ ./configuration.nix ];
	specialArgs = {
          inherit pkgs-unstable;
	  inherit pkgs-new;
	};
      };
    };
}
