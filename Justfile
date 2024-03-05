red := '\033[0;31m'
green := '\033[0;32m'
cyan := '\033[0;36m'
yellow := '\033[0;33m' # Or brown/orange depending on theme
white :=' \033[1;37m' # Or bold white depending on theme
nc := '\033[0m' # No Color

example NAME:
  @just header "RUNNING EXAMPLE: {{NAME}}"
  just prep-example {{NAME}}
  cd examples/{{NAME}} && npm start

watch-example NAME:
  @just header "WATCHING EXAMPLE: {{NAME}}"
  just prep-example {{NAME}}
  cd examples/{{NAME}} && fd ".+\.(gren|js|json)$" ../.. | entr -r npm start

prep-example NAME:
  just build-cli
  cd examples/{{NAME}} && npm install

build-cli:
  cd cli && npx gren make src/Main.gren --optimize && chmod a+x app && mv app bin/index.js

examples:
  for example in `ls examples`; do just example $example; done

header MSG:
  @echo -e "\n{{green}}{{MSG}}{{nc}}"
    
progress MSG:
  @echo -e "🌸 {{MSG}}..."
