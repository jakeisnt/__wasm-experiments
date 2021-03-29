{
  description = "wasm-experiments";

  inputs = {
    nixpkgs.url = "nixpkgs/nixos-unstable";
    utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, utils, ... }:
  utils.lib.eachDefaultSystem (system:
  let
    inherit (lib) attrValues;
    pkgs = import nixpkgs { inherit system; };
    lib = nixpkgs.lib;
  in {
  devShell = pkgs.mkShell {
    nativeBuildInputs = with pkgs; [
      zig
    ];
  };
});
}
