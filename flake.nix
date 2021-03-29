{
  description = "wasm-experiments";

  inputs = {
    nixpkgs.url = "nixpkgs/nixos-unstable";
    utils.url = "github:numtide/flake-utils";
    rust_overlay.url = "github:oxalica/rust-overlay";
  };

  outputs = { self, nixpkgs, utils, rust_overlay, ... }:
  utils.lib.eachDefaultSystem (system:
  let
    inherit (lib) attrValues;
    pkgs = import nixpkgs { inherit system; overlays = [ rust_overlay.overlay ]; };
    lib = nixpkgs.lib;
    rust_channel = pkgs.rust-bin.fromRustupToolchainFile ./rust-toolchain;
    package = with pkgs; callPackage ./. { inherit pkgs; };
  in { defaultPackage = package; 
  devShell = pkgs.mkShell {
    nativeBuildInputs = with pkgs; [
      rust_channel # Full rust from overlay, includes cargo
      nodePackages.npm # For all node packages
      wasm-pack # Compiling to WASM and packing with web-stuff
      rust-analyzer # you know what it isss
    ];
  };
});
}
