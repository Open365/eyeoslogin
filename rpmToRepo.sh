#!/bin/bash

set -e

sudo rm -f /var/www/html/unstable/eyeos-login*
sudo cp pkgs/*.rpm /var/www/html/unstable/
sudo createrepo -v -p -o /var/www/html/unstable/ /var/www/html/unstable
sudo chown -R apache.apache /var/www