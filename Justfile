red := '\033[0;31m'
green := '\033[0;32m'
nc := '\033[0m' # No Color

# The Gren files `format` and `lint` cover: every one fd finds, which skips
# gitignored files. Left alone: examples/v1-v3 (older Gren syntax that
# gren-format can't parse) and tests/ExampleRecords.gren (its odd layout is what
# the tests parse).
gren_files := ```
    fd -e gren \
        -E examples/v1 -E examples/v2 -E examples/v3 \
        -E tests/ExampleRecords.gren \
        | tr '\n' ' '
```

example NAME:
    @just header "RUNNING EXAMPLE: v4/{{ NAME }}"
    cd examples/v4/{{ NAME }} && npm install && npm run dev

examples:
    for example in `ls examples/v4`; do just example $example; done

docs:
    npx gren-doc-preview

[doc("Compile the package and the CLI")]
build:
    gren make
    gren make CLI --output=bin/main.js

[doc("Run all framework and package tests")]
test: build
    cd tests && gren run Setup && gren run Tests
    cd packages/prettynice-common/tests && gren run Tests

[doc("Check and build the CLI, then publish to npm")]
publish-cli: publish-cli-preflight test
    gren make CLI --optimize --output=bin/main.js
    npm publish

# Fail unless the tree is clean, HEAD is tagged `cli-<version>`
# for package.json's version, and npm doesn't have that version yet.
[private]
publish-cli-preflight:
    #!/usr/bin/env bash
    set -euo pipefail
    version=$(node -p "require('./package.json').version")
    if [ -n "$(git status --porcelain)" ]; then
        echo "The git tree isn't clean." >&2
        exit 1
    fi
    if ! git tag --points-at HEAD | grep -qx "cli-$version"; then
        echo "HEAD isn't tagged cli-$version." >&2
        exit 1
    fi
    if [ -n "$(npm view "prettynice@$version" version 2>/dev/null)" ]; then
        echo "prettynice $version is already on npm. Bump package.json's version." >&2
        exit 1
    fi

# `init-local` runs `prettynice init` but points the generated
# project at this directory for its prettynice npm dependency.
init-local TARGET:
    npx prettynice init-local ${PWD} {{ TARGET }}

web:
    cd website/v2 && npm install && npm run dev

deploy-web:
    cd website/v2 && flyctl deploy

header MSG:
    @echo -e "\n{{ green }}{{ MSG }}{{ nc }}"

progress MSG:
    @echo -e "🌸 {{ MSG }}..."

[doc("Make a worktree and branch: `just worktree my-branch origin/main`")]
worktree name base="main":
    #!/usr/bin/env bash
    set -euo pipefail
    main=$(git worktree list --porcelain | sed -n '1s/^worktree //p')
    dir="$main.worktrees/{{ name }}"
    git worktree add -b "{{ name }}" "$dir" "{{ base }}"
    echo
    echo "Worktree: $dir"
    echo "Branch:   {{ name }}"

[doc("Remove a worktree made by `just worktree` (keeps the branch)")]
worktree-rm name:
    #!/usr/bin/env bash
    set -euo pipefail
    main=$(git worktree list --porcelain | sed -n '1s/^worktree //p')
    git worktree remove "$main.worktrees/{{ name }}"
    # Branch names with slashes leave empty parent directories.
    d=$(dirname "$main.worktrees/{{ name }}")
    while [ "$d" != "$main.worktrees" ] && rmdir "$d" 2>/dev/null; do d=$(dirname "$d"); done
    echo "Removed $main.worktrees/{{ name }}; branch {{ name }} kept"

[doc("Format source files and scripts")]
format:
    nixfmt flake.nix
    just --format --unstable
    gren-format {{ gren_files }}

[doc("Check formatting without changing anything")]
lint:
    nixfmt --check flake.nix
    just --format --check --unstable
    gren-format --check {{ gren_files }}

[doc("Every check CI runs (in the nix sandbox)")]
check:
    nix flake check -L
