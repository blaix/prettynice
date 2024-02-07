red := '\033[0;31m'
green := '\033[0;32m'
cyan := '\033[0;36m'
yellow := '\033[0;33m' # Or brown/orange depending on theme
white :=' \033[1;37m' # Or bold white depending on theme
nc := '\033[0m' # No Color

example NAME:
  echo -e "\n{{green}}==== RUNNING EXAMPLE: {{NAME}} ===={{nc}}\n"
  cd examples/{{NAME}} && npm start

watch NAME:
  echo -e "\n{{green}}==== WATCHING EXAMPLE: {{NAME}} ===={{nc}}\n"
  cd examples/{{NAME}} && fd ".+\.(gren|js)$" | entr -r npm start

examples:
  for example in `ls examples`; do just example $example; done
