with import <nixpkgs> {};
mkShell {
  buildInputs = [
    bashInteractive
    nodejs_18
  ];
}

