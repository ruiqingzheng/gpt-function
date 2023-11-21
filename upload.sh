#!/bin/bash

rsync -rv -e 'ssh -p 9999'  --exclude-from ./exclude_upload ./ root@uk.vps.rt:/root/projects/gpt-function