#!/bin/bash

./upload.sh

ssh -p9999 root@uk.vps.rt '/root/projects/gpt-function/start.sh'