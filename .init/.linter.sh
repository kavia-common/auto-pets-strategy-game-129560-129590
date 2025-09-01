#!/bin/bash
cd /home/kavia/workspace/code-generation/auto-pets-strategy-game-129560-129590/frontend_client
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

