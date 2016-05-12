#!/bin/sh -e
cp -r src/themes build/
cp -r src/vendor build/
rm -rf build/js
mkdir build/js
mv build/main.js build/js/
cp src/*.html build/
cp -r src/translations build/
cp src/js/platformSettings.js build/js/
