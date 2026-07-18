#!/usr/bin/env node

import { existsSync, realpathSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(realpathSync(fileURLToPath(import.meta.url)));
const repositoryRoot = resolve(scriptDirectory, "..", "..");
const ideaBin = resolve(repositoryRoot, "IDEAS.md");

if (!existsSync(ideaBin)) {
  console.error(`Workflow Idea Bin not found: ${ideaBin}`);
  process.exitCode = 1;
} else {
  console.log(ideaBin);
}
