#!/usr/bin/env node

import { copyFileSync, existsSync, mkdirSync, readFileSync, realpathSync, statSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const TEMPLATE_FILES = new Map([
  ["AGENTS.md", "AGENTS.md"],
  ["CONTEXT.md", "CONTEXT.md"],
  ["WORKFLOW.md", "WORKFLOW.md"],
  ["TASKS.md", "TASKS.md"],
  ["tasks/_template.md", "task-template.md"],
]);

class InitError extends Error {}

function git(repo, args, { check = true } = {}) {
  const result = spawnSync("git", ["-C", repo, ...args], {
    encoding: "utf8",
    windowsHide: true,
  });

  if (result.error) {
    throw new InitError(`git ${args.join(" ")} failed: ${result.error.message}`);
  }

  if (check && result.status !== 0) {
    const detail = result.stderr.trim() || result.stdout.trim();
    throw new InitError(`git ${args.join(" ")} failed: ${detail}`);
  }

  return result;
}

function resolveTemplates() {
  const skillRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const templates = join(skillRoot, "support", "mat-shared", "templates");
  const missing = [...TEMPLATE_FILES.values()].filter(
    (source) => !existsSync(join(templates, source)),
  );

  if (missing.length > 0) {
    throw new InitError(`canonical templates are missing: ${missing.join(", ")}`);
  }

  return templates;
}

function canonicalPath(path) {
  const canonical = realpathSync.native(path);
  return process.platform === "win32" ? canonical.toLowerCase() : canonical;
}

function verifyMainWorktree(repo) {
  const inside = git(repo, ["rev-parse", "--is-inside-work-tree"], {
    check: false,
  }).stdout.trim();
  if (inside !== "true") {
    throw new InitError(`not a Git working tree: ${repo}`);
  }

  const gitDir = git(repo, [
    "rev-parse",
    "--path-format=absolute",
    "--git-dir",
  ]).stdout.trim();
  const commonDir = git(repo, [
    "rev-parse",
    "--path-format=absolute",
    "--git-common-dir",
  ]).stdout.trim();

  if (canonicalPath(gitDir) !== canonicalPath(commonDir)) {
    throw new InitError("refusing to initialize from a linked Git worktree");
  }
}

function addLocalExclusion(repo) {
  const relative = git(repo, ["rev-parse", "--git-path", "info/exclude"]).stdout.trim();
  const exclude = resolve(isAbsolute(relative) ? relative : join(repo, relative));
  mkdirSync(dirname(exclude), { recursive: true });

  const existing = existsSync(exclude) ? readFileSync(exclude, "utf8") : "";
  if (!existing.split(/\r?\n/u).includes(".mat/")) {
    const separator = existing.length === 0 || /\r?\n$/u.test(existing) ? "" : "\n";
    writeFileSync(exclude, `${existing}${separator}.mat/\n`, "utf8");
  }

  return exclude;
}

function initialize(repoPath, resumeIncomplete) {
  const repo = realpathSync.native(resolve(repoPath));
  verifyMainWorktree(repo);
  const templates = resolveTemplates();
  const target = join(repo, ".mat");

  if (existsSync(target) && !resumeIncomplete) {
    throw new InitError(".mat already exists; inspect it and use the mat-refresh skill");
  }
  if (existsSync(target) && !statSync(target).isDirectory()) {
    throw new InitError(".mat exists but is not a directory");
  }

  const created = [];
  for (const [destinationName, sourceName] of TEMPLATE_FILES) {
    const destination = join(target, destinationName);
    if (existsSync(destination)) {
      continue;
    }

    mkdirSync(dirname(destination), { recursive: true });
    copyFileSync(join(templates, sourceName), destination);
    created.push(destination);
  }

  addLocalExclusion(repo);
  const probe = join(target, "AGENTS.md");
  if (git(repo, ["check-ignore", "-q", probe], { check: false }).status !== 0) {
    throw new InitError(`Git does not ignore ${probe}`);
  }

  return created;
}

function parseArguments(args) {
  let repo = process.cwd();
  let resumeIncomplete = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--repo") {
      index += 1;
      if (index >= args.length) {
        throw new InitError("--repo requires a path");
      }
      repo = args[index];
    } else if (argument === "--resume-incomplete") {
      resumeIncomplete = true;
    } else {
      throw new InitError(`unknown argument: ${argument}`);
    }
  }

  return { repo, resumeIncomplete };
}

function main() {
  try {
    const { repo, resumeIncomplete } = parseArguments(process.argv.slice(2));
    const created = initialize(repo, resumeIncomplete);
    for (const path of created) {
      console.log(`created: ${path}`);
    }
    console.log("verified: .mat is ignored by Git");
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`error: ${message}`);
    return 2;
  }
}

process.exitCode = main();
