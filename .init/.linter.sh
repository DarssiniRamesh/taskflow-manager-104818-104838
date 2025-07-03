#!/bin/bash
cd /home/kavia/workspace/code-generation/taskflow-manager-104818-104838/task_manager_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

