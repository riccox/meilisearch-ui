#!/usr/bin/env node

/**
 * Post-build script to replace MEILI_UI_REPLACE_BASE_PATH placeholder
 * This is needed for non-Docker deployments (like Vercel) where the placeholder
 * is not replaced by the Docker entrypoint script.
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { glob } from "glob";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");
const distDir = join(projectRoot, "dist");

// Check if we're in a Docker environment
const isDocker =
  process.env.BASE_PATH !== undefined && process.env.BASE_PATH !== "";

if (isDocker) {
  console.log("Docker environment detected, skipping post-build replacement");
  process.exit(0);
}

console.log(
  "Non-Docker environment detected, replacing MEILI_UI_REPLACE_BASE_PATH placeholder..."
);

// Find all files that might contain the placeholder
const files = await glob("**/*.{js,css,html}", { cwd: distDir });

let replacedCount = 0;

for (const file of files) {
  const filePath = join(distDir, file);

  try {
    let content = readFileSync(filePath, "utf8");
    const originalContent = content;

    // Replace the placeholder with empty string (root path)
    content = content.replace(/MEILI_UI_REPLACE_BASE_PATH\//g, "");
    content = content.replace(/MEILI_UI_REPLACE_BASE_PATH/g, "");

    if (content !== originalContent) {
      writeFileSync(filePath, content, "utf8");
      replacedCount++;
      console.log(`Updated: ${file}`);
    }
  } catch (error) {
    console.warn(`Warning: Could not process ${file}:`, error.message);
  }
}

console.log(`Post-build replacement complete. Updated ${replacedCount} files.`);
