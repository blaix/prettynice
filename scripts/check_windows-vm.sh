# Run the checks on Windows. This half runs on the Windows machine, in the copy
# of the working tree that check_windows-host.sh made. Its arguments are the
# versions of Node and just to check with.
set -eu

node_version=$1
just_version=$2

# Install tools into ~/tools, unless an earlier run already has.
# Downloaded and checked against its published SHA-256 in a scratch directory
# then renamed into place in one step.
#   install_tool <name> <zip url> <checksums url> <directory in the zip, or .>
install_tool() {
    dest=$HOME/tools/$1
    zip=${2##*/}
    [ -d "$dest" ] && return
    echo "Installing $1"
    mkdir -p "$HOME/tools"
    tmp=$(mktemp -d "$HOME/tools/.tmp.XXXXXX")
    curl -fsSL -o "$tmp/$zip" "$2"
    curl -fsSL "$3" | grep -F "  $zip" | (cd "$tmp" && sha256sum -c --quiet -)
    unzip -q "$tmp/$zip" -d "$tmp/unzipped"
    src=$(cd "$tmp/unzipped/$4" && pwd)
    mv -T "$src" "$dest" 2>/dev/null || [ -d "$dest" ]
    rm -rf "$tmp"
}

install_tool "node-$node_version" \
    "https://nodejs.org/dist/v$node_version/node-v$node_version-win-x64.zip" \
    "https://nodejs.org/dist/v$node_version/SHASUMS256.txt" \
    "node-v$node_version-win-x64"
install_tool "just-$just_version" \
    "https://github.com/casey/just/releases/download/$just_version/just-$just_version-x86_64-pc-windows-msvc.zip" \
    "https://github.com/casey/just/releases/download/$just_version/SHA256SUMS" \
    .

# gren comes from npm (gren-lang), as it does for apps on Windows.
export PATH="$HOME/tools/node-$node_version:$HOME/tools/just-$just_version:$PWD/node_modules/.bin:$PATH"
echo "Running npm ci"
npm ci
echo "Running just test"
just test
