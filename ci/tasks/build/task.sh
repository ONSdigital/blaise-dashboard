#!/bin/bash

set -euo pipefail

cd dashboard-git

yarn install
yarn build
cd ..
cp -r dashboard-git/. dashboard