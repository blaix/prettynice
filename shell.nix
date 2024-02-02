with import <nixpkgs> {};
mkShell {
  buildInputs = [
    bashInteractive
    nodejs_18
  ];
  shellHook = ''
    export PATH="$PWD/node_modules/.bin:$PATH"
    if [ ! -f "$PWD/node_modules/.bin/gren" ]; then
      npm install
    fi
  '';
}

