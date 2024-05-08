red := '\033[0;31m'
green := '\033[0;32m'
nc := '\033[0m' # No Color

example NAME:
  @just header "RUNNING EXAMPLE: next/{{NAME}}"
  cd examples/next/{{NAME}} && npm install && npm run dev

v1-example NAME:
  @just header "RUNNING EXAMPLE: v1/{{NAME}}"
  cd examples/v1/{{NAME}} && npm install && npm run dev

examples:
  for example in `ls examples/next`; do just example $example; done

v1-examples:
  for example in `ls examples/v1`; do just v1-example $example; done

cli CMD="" OPT="":
  rm -rf node_modules/prettynice
  just build-cli
  npm install
  npx prettynice {{CMD}} {{OPT}}

build-cli:
  cd cli && npm install && npx gren make src/Main.gren --optimize --output=bin/main.js
  # Force a reinstall in examples
  for example in `ls examples/next`; do rm -rf examples/next/$example/node_modules; done

build-cli-debug:
  cd cli && npx gren make src/Main.gren --output=bin/main.js

web:
  cd website/v1 && npm install && npm run dev

deploy-web:
  cd website/v1 && flyctl deploy

header MSG:
  @echo -e "\n{{green}}{{MSG}}{{nc}}"
    
progress MSG:
  @echo -e "🌸 {{MSG}}..."
