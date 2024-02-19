#!/usr/bin/env bash

set -eu

# This assumes we're in a examples/[example] directory.
# TODO: replace this script with prettynice cli commands.
EXAMPLE_ROOT="$(pwd)"
PROJECT_ROOT="${EXAMPLE_ROOT}/../.." 

# clean slate
if [[ -d dist ]]; then
    rm -rf dist
fi
if [[ -d server/.prettynice ]]; then
    rm -rf server/.prettynice
fi
if [[ -d client/.prettynice ]]; then
    rm -rf client/.prettynice
fi

# expected directories
mkdir -p public
mkdir -p dist/client/Components
mkdir -p dist/server
mkdir -p server/.prettynice/Prettynice
mkdir -p server/.prettynice/Gen/Components

# prevent a 404 error if there's no client-side js to build
# (the server renders a script tag no matter what. maybe fix that?)
touch dist/client/main.js

# run the prettynice cli
# (slowly migrating everything in this build.sh here)
cd $PROJECT_ROOT/cli
npx gren make src/Main.gren
mkdir -p build
mv app build/
cd $EXAMPLE_ROOT
node $PROJECT_ROOT/cli/build/app

if [[ -d client/src/Components ]]; then
  if [[ "$(ls client/src/Components)" ]]; then
    mkdir -p client/.prettynice/Prettynice
    mkdir -p client/.prettynice/Gen/Components
    cp "$PROJECT_ROOT/src/Prettynice/Component.gren" client/.prettynice/Prettynice/
    cd $EXAMPLE_ROOT/client
    npx gren make $(find .prettynice/Gen/Components -name "*.gren") --output=../dist/client/main.js
    if [[ "$(ls src/Components/**/*.js 2>/dev/null)" ]]; then
        cp src/Components/*.js ../dist/client/
    fi
  fi
fi

# build server
cd $EXAMPLE_ROOT/server
npx gren make src/Main.gren --output=../dist/server/main.js
cp $PROJECT_ROOT/src/server.js ../dist/server/app
