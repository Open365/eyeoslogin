#!/bin/sh -e
apk add chromium xvfb
if [ -f /.dockerinit ]; then
    Xvfb :0 &
    sleep 5
    export DISPLAY=:0
    ./coverage.sh
    exit 0
fi

echo "commit_id=$(git rev-parse HEAD)" > commit.properties
npm install
bower install

if [ "$(git rev-parse HEAD)" = "$(git rev-parse origin/master)" ]; then
    git checkout master
    npm version patch
    git push origin master
fi
