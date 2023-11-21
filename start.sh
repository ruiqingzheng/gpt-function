#!/usr/bin/env zsh

node=/root/.nvm/versions/node/v18.18.2/bin/node
pnpm=/root/.nvm/versions/node/v18.18.2/bin/pnpm
cd /root/projects/gpt-function/
$pnpm install
$node ./main.js