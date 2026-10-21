red := '\033[0;31m'
green := '\033[0;32m'
nc := '\033[0m' # No Color

example NAME:
    @just header "RUNNING EXAMPLE: v4/{{ NAME }}"
    cd examples/v4/{{ NAME }} && npm install && npm run dev

examples:
    for example in `ls examples/v4`; do just example $example; done

docs:
    npx gren-doc-preview

test:
    just build-cli-debug && cd tests && gren run Setup && gren run Tests

build-cli:
    npx gren make CLI --optimize --output=bin/main.js

build-cli-debug:
    npx gren make CLI --output=bin/main.js

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

[doc("Check formatting without changing anything")]
lint:
    nixfmt --check flake.nix
    just --format --check --unstable

[doc("Every check CI runs (in the nix sandbox)")]
check:
    nix flake check -L
