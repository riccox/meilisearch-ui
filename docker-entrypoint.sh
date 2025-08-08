#!/bin/sh
set -e

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

if [ -z "$BASE_PATH" ]; then
  # Use the root template
  TEMPLATE_FILE=/etc/nginx/templates/nginx.conf.root.template
else
  # Use the basepath template
  TEMPLATE_FILE=/etc/nginx/templates/nginx.conf.basepath.template
fi

# Generate nginx.conf from template
envsubst '${BASE_PATH}' < "$TEMPLATE_FILE" > /etc/nginx/nginx.conf

# Start nginx in foreground
exec nginx -g 'daemon off;'