import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readlinkSync,
  realpathSync,
  symlinkSync,
} from "node:fs";
import { homedir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS = [
  "mat-init",
  "mat-refresh",
  "mat-discover",
  "mat-feature",
  "mat-build",
  "mat-review",
  "mat-next",
];

function usage() {
  return [
    "Usage: install.cmd [--check] [--dest <directory>]",
    "",
    "Create live directory links for Mat's seven Codex skills.",
    "",
    "Options:",
    "  --check             Verify links without changing anything.",
    "  --dest <directory>  Override the default $CODEX_HOME/skills destination.",
    "  --help              Show this help.",
  ].join("\n");
}

function parseArguments(argumentsList) {
  const codexHome = process.env.CODEX_HOME
    ? resolve(process.env.CODEX_HOME)
    : join(homedir(), ".codex");
  const options = {
    check: false,
    destination: join(codexHome, "skills"),
  };

  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];
    if (argument === "--check") {
      options.check = true;
      continue;
    }
    if (argument === "--dest") {
      const value = argumentsList[index + 1];
      if (!value) {
        throw new Error("--dest requires a directory path.");
      }
      options.destination = resolve(value);
      index += 1;
      continue;
    }
    if (argument === "--help" || argument === "-h") {
      options.help = true;
      continue;
    }
    throw new Error(`Unknown option: ${argument}`);
  }

  return options;
}

function normalizePath(path) {
  const resolved = resolve(path);
  return process.platform === "win32" ? resolved.toLowerCase() : resolved;
}

function inspectDestination(destination, source) {
  let metadata;
  try {
    metadata = lstatSync(destination);
  } catch (error) {
    if (error.code === "ENOENT") {
      return { state: "missing" };
    }
    throw error;
  }

  if (!metadata.isSymbolicLink()) {
    return { state: "conflict", reason: "it is not a directory link" };
  }

  let linkedSource;
  try {
    linkedSource = realpathSync(destination);
  } catch (error) {
    return {
      state: "conflict",
      reason: `its link target cannot be resolved (${error.message})`,
    };
  }

  if (normalizePath(linkedSource) !== normalizePath(source)) {
    return {
      state: "conflict",
      reason: `it points to ${readlinkSync(destination)}`,
    };
  }

  return { state: "linked" };
}

function validateSources() {
  const failures = [];
  for (const name of SKILLS) {
    const skillFile = join(ROOT, name, "SKILL.md");
    if (!existsSync(skillFile)) {
      failures.push(`${name}: missing ${relative(ROOT, skillFile)}`);
      continue;
    }
    const contents = readFileSync(skillFile, "utf8");
    if (!contents.includes(`name: ${name}`)) {
      failures.push(`${name}: SKILL.md does not declare the expected name`);
    }
  }
  if (failures.length > 0) {
    throw new Error(`Source validation failed:\n${failures.join("\n")}`);
  }
}

function createLink(source, destination) {
  const type = process.platform === "win32" ? "junction" : "dir";
  symlinkSync(source, destination, type);
  return type === "junction" ? "directory junction" : "symbolic link";
}

function run() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }

  validateSources();
  if (!options.check) {
    mkdirSync(options.destination, { recursive: true });
  }

  const conflicts = [];
  const missing = [];
  const linked = [];
  const created = [];

  for (const name of SKILLS) {
    const source = join(ROOT, name);
    const destination = join(options.destination, name);
    const inspection = inspectDestination(destination, source);

    if (inspection.state === "linked") {
      linked.push(name);
      console.log(`${name}: linked`);
      continue;
    }

    if (inspection.state === "conflict") {
      conflicts.push(`${name}: ${destination} ${inspection.reason}`);
      console.error(`${name}: conflict`);
      continue;
    }

    if (options.check) {
      missing.push(`${name}: missing ${destination}`);
      console.error(`${name}: missing`);
      continue;
    }

    const linkType = createLink(source, destination);
    created.push(name);
    console.log(`${name}: created ${linkType}`);
  }

  if (conflicts.length > 0 || missing.length > 0) {
    const details = [...conflicts, ...missing].join("\n");
    throw new Error(`Skill link verification failed:\n${details}`);
  }

  if (options.check) {
    console.log(`Verified ${linked.length} live skill link(s) in ${options.destination}`);
  } else {
    console.log(
      `Ready: ${created.length} created, ${linked.length} already linked in ${options.destination}`,
    );
  }
}

try {
  run();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
