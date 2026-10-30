set -e

(cd tests && gren run Setup && gren run Tests)
(cd packages/prettynice-common/tests && gren run Tests)
