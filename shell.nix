with import <nixpkgs> {};
mkShell {
  buildInputs = [
    bashInteractive
    flyctl
    just
    nodejs_20
  ];
  shellHook = ''
    export PATH="$PWD/node_modules/.bin:$PATH"
    if [ ! -f "$PWD/node_modules/.bin/gren" ]; then
      npm install
    fi
  '';
}

