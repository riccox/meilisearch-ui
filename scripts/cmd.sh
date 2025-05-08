#!/bin/bash

# transform singleton mode environment variables
if [ ! -z "$SINGLETON_HOST" ]; then
  export VITE_SINGLETON_HOST="$SINGLETON_HOST"
fi

if [ ! -z "$SINGLETON_API_KEY" ]; then
  export VITE_SINGLETON_API_KEY="$SINGLETON_API_KEY"
fi

if [ ! -z "$SINGLETON_MODE" ]; then
  export VITE_SINGLETON_MODE="$SINGLETON_MODE"
  if [ "$SINGLETON_MODE" = "true" ]; then
    echo "Singleton mode enabled"
  fi
fi

if [ ! -z "$BASE_PATH" ]; then
  echo "Custom base path: $BASE_PATH"
fi
pnpm run build
pnpm run preview