#!/usr/bin/env bash

# git clone https://github.com/creationix/nvm.git /tmp/.nvm
# source /tmp/.nvm/nvm.sh
# nvm install "$NODE_VERSION"
# nvm use --delete-prefix "$NODE_VERSION"

if [[ "$TRAVIS_OS_NAME" == "linux" ]]; then
  export DISPLAY=:99.0
  sh -e /etc/init.d/xvfb start
  sleep 3
fi

node --version
npm --version

npm install
# npm test & npm run e2e
npm run release -- --ia32 --x64
