import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  lstatSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const INSTALLER = join(ROOT, "scripts", "install_skills.mjs");
const SKILLS = [
  "mat-init",
  "mat-refresh",
  "mat-discover",
  "mat-feature",
  "mat-build",
  "mat-review",
  "mat-next",
];

function temporaryDirectory(t) {
  const directory = mkdtempSync(join(tmpdir(), "mat-skills-install-"));
  t.after(() => {
    for (const container of ["skills", "not-created", join("codex-home", "skills")]) {
      for (const name of SKILLS) {
        const link = join(directory, container, name);
        if (existsSync(link) && lstatSync(link).isSymbolicLink()) {
          unlinkSync(link);
        }
      }
    }
    rmSync(directory, { recursive: true, force: true });
  });
  return directory;
}

function run(destination, extra = [], environment = process.env) {
  const argumentsList = [INSTALLER];
  if (destination) {
    argumentsList.push("--dest", destination);
  }
  argumentsList.push(...extra);
  return spawnSync(
    process.execPath,
    argumentsList,
    { encoding: "utf8", env: environment, windowsHide: true },
  );
}

function comparable(path) {
  const resolved = resolve(path);
  return process.platform === "win32" ? resolved.toLowerCase() : resolved;
}

test("creates one live link for each approved skill", (t) => {
  const destination = join(temporaryDirectory(t), "skills");
  const result = run(destination);
  assert.equal(result.status, 0, result.stderr);

  for (const name of SKILLS) {
    const installed = join(destination, name);
    assert.equal(lstatSync(installed).isSymbolicLink(), true, name);
    assert.equal(
      comparable(realpathSync(installed)),
      comparable(join(ROOT, name)),
      name,
    );
    assert.match(
      readFileSync(join(installed, "SKILL.md"), "utf8"),
      new RegExp(`name: ${name}`, "u"),
    );
  }
});

test("is idempotent and check mode verifies existing links", (t) => {
  const destination = join(temporaryDirectory(t), "skills");
  assert.equal(run(destination).status, 0);

  const repeated = run(destination);
  assert.equal(repeated.status, 0, repeated.stderr);
  assert.match(repeated.stdout, /0 created, 7 already linked/u);

  const checked = run(destination, ["--check"]);
  assert.equal(checked.status, 0, checked.stderr);
  assert.match(checked.stdout, /Verified 7 live skill link/u);
});

test("defaults to CODEX_HOME skills", (t) => {
  const directory = temporaryDirectory(t);
  const codexHome = join(directory, "codex-home");
  const result = run(null, [], { ...process.env, CODEX_HOME: codexHome });
  assert.equal(result.status, 0, result.stderr);

  for (const name of SKILLS) {
    assert.equal(
      comparable(realpathSync(join(codexHome, "skills", name))),
      comparable(join(ROOT, name)),
      name,
    );
  }
});

test("help identifies the Codex-specific default", () => {
  const result = run(null, ["--help"]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /\$CODEX_HOME\/skills/u);
  assert.doesNotMatch(result.stdout, /\.agents/u);
});

test("check mode reports missing links without creating the destination", (t) => {
  const destination = join(temporaryDirectory(t), "not-created");
  const result = run(destination, ["--check"]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /mat-init: missing/u);
});

test("refuses to replace a conflicting path", (t) => {
  const destination = join(temporaryDirectory(t), "skills");
  const initial = run(destination);
  assert.equal(initial.status, 0, initial.stderr);

  unlinkSync(join(destination, "mat-build"));
  writeFileSync(join(destination, "mat-build"), "keep me", "utf8");

  const result = run(destination);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /mat-build: conflict/u);
  assert.equal(readFileSync(join(destination, "mat-build"), "utf8"), "keep me");
});
