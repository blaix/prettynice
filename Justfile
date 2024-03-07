red := '\033[0;31m'
green := '\033[0;32m'
nc := '\033[0m' # No Color

example NAME:
  @just header "RUNNING EXAMPLE: {{NAME}}"
  cd examples/{{NAME}} && npm install && npm run dev

build-cli:
  cd cli && npx gren make src/Main.gren --optimize && chmod a+x app && mv app bin/index.js
  # Force a reinstall in examples
  for example in `ls examples`; do rm -rf examples/$example/node_modules; done

examples:
  for example in `ls examples`; do just example $example; done

header MSG:
  @echo -e "\n{{green}}{{MSG}}{{nc}}"
    
progress MSG:
  @echo -e "🌸 {{MSG}}..."
