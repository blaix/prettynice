red := '\033[0;31m'
green := '\033[0;32m'
nc := '\033[0m' # No Color

example NAME:
  @just header "RUNNING EXAMPLE: {{NAME}}"
  cd examples/{{NAME}} && npm install && npm run dev

examples:
  for example in `ls examples`; do just example $example; done

cli CMD="" OPT="":
  rm -rf node_modules/prettynice
  just build-cli
  npm install
  npx prettynice {{CMD}} {{OPT}}

build-cli:
  cd cli && npx gren make src/Main.gren --optimize --output=bin/main.js
  # Force a reinstall in examples
  for example in `ls examples`; do rm -rf examples/$example/node_modules; done

build-cli-debug:
  cd cli && npx gren make src/Main.gren --output=bin/main.js

deploy-web:
  cd website/v1 && flyctl deploy

header MSG:
  @echo -e "\n{{green}}{{MSG}}{{nc}}"
    
progress MSG:
  @echo -e "🌸 {{MSG}}..."
