red := '\033[0;31m'
green := '\033[0;32m'
nc := '\033[0m' # No Color

example NAME:
  @just header "RUNNING EXAMPLE: v4/{{NAME}}"
  cd examples/v4/{{NAME}} && npm install && npm run dev

examples:
  for example in `ls examples/v4`; do just example $example; done

docs:
  npx gren-doc-preview

build-cli:
  npx gren make CLI --optimize --output=bin/main.js

build-cli-debug:
  npx gren make CLI --output=bin/main.js

web:
  cd website/v2 && npm install && npm run dev

deploy-web:
  cd website/v2 && flyctl deploy

header MSG:
  @echo -e "\n{{green}}{{MSG}}{{nc}}"
    
progress MSG:
  @echo -e "🌸 {{MSG}}..."
