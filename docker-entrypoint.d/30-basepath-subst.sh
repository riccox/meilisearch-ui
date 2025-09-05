#!/bin/sh
set -e

# This script performs base path substitution in static assets.

# Sanitize BASE_PATH and define replacement patterns
if [ -n "$BASE_PATH" ]; then
  REPLACE_PATH=$(echo "$BASE_PATH" | sed 's:/*$::' | sed 's:^/*::')
  FINAL_REPLACE_PATH="${REPLACE_PATH}/"
else
  FINAL_REPLACE_PATH=""
fi

# Replace the placeholder in the built files
find /usr/share/nginx/html -type f \( -name "*.js" -o -name "*.css" -o -name "*.html" \) -exec \
  sed -i -e "s|MEILI_UI_REPLACE_BASE_PATH/|${FINAL_REPLACE_PATH}|g" \
         -e "s|MEILI_UI_REPLACE_BASE_PATH|${FINAL_REPLACE_PATH%/}|g" {} + 

exit 0