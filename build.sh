#!/bin/bash
readonly THIS_DIR="$( cd "$(dirname "$0")" ; pwd -P )"

pushd $THIS_DIR

npm run release

cat $THIS_DIR/out/JsConsole.html.0 $THIS_DIR/out/eruda.min.js $THIS_DIR/out/JsConsole.html.2 > $THIS_DIR/out/temp.html

sed -i '' 's/[ ][ ]*/ /g' $THIS_DIR/out/temp.html
cat $THIS_DIR/out/temp.html | xargs echo -n>$THIS_DIR/out/index.html
rm -f $THIS_DIR/out/temp.html
