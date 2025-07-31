#!/bin/bash
cd /home/kavia/workspace/code-generation/bluetooth-data-logger-142389-142398/bluetooth_data_logger_frontend
npx eslint
ESLINT_EXIT_CODE=$?
npm run build
BUILD_EXIT_CODE=$?
if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi

