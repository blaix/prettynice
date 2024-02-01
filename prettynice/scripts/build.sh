#!/usr/bin/env bash

set -eu

# This assumes we're in a examples/[example] directory.
# TODO: replace this script with prettynice cli commands.
EXAMPLE_ROOT="$(pwd)"
PROJECT_ROOT="${EXAMPLE_ROOT}/../.." 

mkdir -p dist/client
mkdir -p dist/server
mkdir -p server/gen

rm -r {client,server}/gen/* &> /dev/null || printf ""
rm -r dist/* &> /dev/null || printf ""

# public assets
cp -r public/* dist/client/ &> /dev/null || printf "No public assets"

# build components
if [[ -d client/src/Components ]]; then
  if [[ "$(ls client/src/Components)" ]]; then
    mkdir -p {client,server}/gen/Gen/Components
    cd $PROJECT_ROOT/prettynice/cli
    npm install
    npx gren make src/Main.gren
    mkdir -p build
    mv app build/
    cd $EXAMPLE_ROOT
    node $PROJECT_ROOT/prettynice/cli/build/app
    cd $EXAMPLE_ROOT/client
    npx gren make $(find gen/Gen/Components -name "*.gren") --output=../dist/client/main.js
    # TODO: nested components+ports (e.g. Components/My/Component.gren/js)
    cp src/Components/*.js ../dist/client/ &> /dev/null || printf "No component ports."
  fi
fi

# build server
cd $EXAMPLE_ROOT/server
if [[ -f src/ports.js ]]; then
    cp src/ports.js ../dist/server/ports.js
fi
npx gren make src/Main.gren --output=../dist/server/main.js
cp $PROJECT_ROOT/prettynice/lib/src/server.js ../dist/server/app
