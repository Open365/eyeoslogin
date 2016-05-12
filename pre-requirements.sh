#!/bin/bash
set -e
set -u

sudo yum install npm
sudo npm install -g istanbul
sudo npm install -g bower
sudo npm install i18next-conv -g
