#!/bin/bash
readonly THIS_DIR="$( cd "$(dirname "$0")" ; pwd -P )"

pushd $THIS_DIR

npm run release

sed -i '' 's/[ ][ ]*/ /g' $THIS_DIR/out/eruda.min.js
