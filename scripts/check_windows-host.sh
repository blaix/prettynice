# Run the checks on Windows. This half runs here, on a machine with nix where
# `ssh windows-ci` reaches a Windows machine whose ssh shell is Git for
# Windows' bash. It copies the working tree there and runs
# check_windows-vm.sh, which does the rest.
set -eu

# Tool versions come from the flake's dev shell, for consistency.
system=$(nix eval --raw --impure --expr builtins.currentSystem)
version() {
    nix eval --raw ".#devShells.$system.default" --apply "shell:
        (builtins.head (builtins.filter (p: (p.pname or \"\") == \"$1\")
            shell.nativeBuildInputs)).version"
}
node_version=$(version nodejs)
just_version=$(version just)

# Grab scratch copy of the git index and add uncommitted changes to it, leaving
# the real index alone (won't see untracked files, same as `nix flake check`).
index=$(mktemp)
trap 'rm -f "$index"' EXIT
cp "$(git rev-parse --git-path index)" "$index"
GIT_INDEX_FILE=$index git add -u
tree=$(GIT_INDEX_FILE=$index git write-tree)

# Copy the files to a temp directory on the VM.
# The trap removes it when the run ends.
# (tar -m: the archive's timestamps are just "now" here, and the VM's clock can
# be behind this one's, which makes tar complain and fail)
dir=$(ssh windows-ci mktemp -d)
trap 'rm -f "$index"; ssh windows-ci "rm -rf $dir"' EXIT
git archive --format=tar "$tree" | ssh windows-ci "tar -xmf - -C $dir"

# Run the actual checks.
ssh windows-ci "cd $dir && sh scripts/check_windows-vm.sh $node_version $just_version"
