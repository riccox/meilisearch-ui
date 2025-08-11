#!/bin/sh
set -e

# This script prepares the correct nginx template based on BASE_PATH.

TEMPLATE_DIR="/etc/nginx/templates"
AVAILABLE_DIR="/etc/nginx/templates-available"
DEST_TEMPLATE="$TEMPLATE_DIR/default.conf.template"

mkdir -p "$TEMPLATE_DIR"

if [ -n "$BASE_PATH" ]; then
  # Use the template that supports a base path
  cp "$AVAILABLE_DIR/nginx.basepath.conf.template" "$DEST_TEMPLATE"
else
  # Use the simpler template for serving from the root
  cp "$AVAILABLE_DIR/nginx.root.conf.template" "$DEST_TEMPLATE"
fi

exit 0
