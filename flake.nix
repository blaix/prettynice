{
  description = "Prettynice - a full-stack web framework for Gren";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-26.05";
  };

  outputs =
    { self, nixpkgs }:
    let
      supportedSystems = [
        "x86_64-linux"
        "aarch64-linux"
        "aarch64-darwin"
      ];
      forAllSystems = nixpkgs.lib.genAttrs supportedSystems;
      pkgsFor = system: nixpkgs.legacyPackages.${system};

      # The dev shell's tools. git isn't here on purpose, to force the system's
      # git (with the user's configs, etc.) to be used.
      devToolsFor = pkgs: [
        pkgs.gren
        pkgs.just
        pkgs.nixfmt
        pkgs.nodejs_24
      ];

      # A check that runs `just <recipe>` on a writable copy of the source, in
      # the sandbox: the recipe is the single definition of what's checked.
      justCheck =
        pkgs: recipe:
        pkgs.runCommand "prettynice-${recipe}"
          {
            nativeBuildInputs = devToolsFor pkgs ++ [ pkgs.gitMinimal ];
          }
          ''
            cp -r ${./.} src
            chmod -R u+w src
            cd src
            export HOME=$TMPDIR
            just ${recipe}
            touch $out
          '';
    in
    {
      # `nix flake check` runs these in the sandbox.
      checks = forAllSystems (
        system:
        let
          pkgs = pkgsFor system;
        in
        nixpkgs.lib.genAttrs [
          "lint"
          "test"
        ] (justCheck pkgs)
      );

      devShells = forAllSystems (
        system:
        let
          pkgs = pkgsFor system;
        in
        {
          default = pkgs.mkShell {
            packages = devToolsFor pkgs;
          };
        }
      );

      formatter = forAllSystems (system: (pkgsFor system).nixfmt);
    };
}
