red := '\033[0;31m'
green := '\033[0;32m'
nc := '\033[0m' # No Color

example NAME:
  @just header "RUNNING EXAMPLE: v3/{{NAME}}"
  cd examples/v3/{{NAME}} && npm install && npm run dev

v2-example NAME:
  @just header "RUNNING EXAMPLE: v2/{{NAME}}"
  cd examples/v2/{{NAME}} && npm install && npm run dev

examples:
  for example in `ls examples/v3`; do just example $example; done

v2-examples:
  for example in `ls examples/v2`; do just v2-example $example; done

docs:
  npx gren-doc-preview

cli CMD="" OPT="":
  rm -rf node_modules/prettynice
  just build-cli
  npm install
  npx prettynice {{CMD}} {{OPT}}

build-cli: clean-npm
  cd cli && npm install && npx gren make src/Main.gren --optimize --output=bin/main.js

clean-npm:
  for example in `ls examples/v3`; do rm -rf examples/v3/$example/node_modules && rm examples/v3/$example/package-lock.json; done

build-cli-debug:
  cd cli && npx gren make src/Main.gren --output=bin/main.js

web:
  cd website/v2 && npm install && npm run dev

deploy-web:
  cd website/v2 && flyctl deploy

header MSG:
  @echo -e "\n{{green}}{{MSG}}{{nc}}"
    
progress MSG:
  @echo -e "🌸 {{MSG}}..."
