{ pkgs ? import <nixpkgs> { } }:

pkgs.stdenv.mkDerivation {
  name = "wasm-experiments";
  src = pkgs.lib.cleanSource ./.;
  preferLocalBuild = true;

  buildInputs = with pkgs; [ wasm-pack rustc cargo rustup nodejs cargo-generate ];
}
