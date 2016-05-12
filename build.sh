#!/bin/sh
set -e
set -x

npm install
bower install --allow-root
grunt build
