#!/bin/sh -e
apk update
apk add chromium xvfb bash xorg-server-dev
npm install -g istanbul@0.2.11
export CHROME_BIN=/usr/bin/chromium-browser
if [ -f /.dockerinit ]; then
    Xvfb :0 -extension RANDR &
    sleep 5
    export DISPLAY=:0
    ./coverage.sh
    exit 0
fi

echo "commit_id=$(git rev-parse HEAD)" > commit.properties
npm install
bower install --allow-root

if [ "$(git rev-parse HEAD)" = "$(git rev-parse origin/master)" ]; then
    git checkout master
    npm version patch
    git push origin master
fi
