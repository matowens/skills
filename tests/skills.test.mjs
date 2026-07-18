import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, delimiter, dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS = [
  "mat-init",
  "mat-refresh",
  "mat-discover",
  "mat-feature",
  "mat-build",
  "mat-review",
  "mat-next",
  "mat-retro",
];
const APPROVED_SKILLS = new Set(SKILLS);
const INIT_SCRIPT = join(ROOT, "mat-init", "scripts", "init_project.mjs");
const CLAUDE_QA_SCRIPT = join(
  ROOT,
  "mat-review",
  "scripts",
  "run_claude_qa.ps1",
);
const RETRO_IDEA_SCRIPT = join(ROOT, "mat-retro", "scripts", "resolve_workflow_ideas.mjs");
const MAT_SHARED = join(ROOT, "mat-init", "support", "mat-shared");
const REQUIRED_PROJECT_FILES = [
  ".mat/AGENTS.md",
  ".mat/CONTEXT.md",
  ".mat/WORKFLOW.md",
  ".mat/TASKS.md",
  ".mat/IDEAS.md",
  ".mat/templates/feature.md",
  ".mat/templates/task.md",
  ".mat/templates/retrospective.md",
];

function run(command, args, cwd = ROOT) {
  return spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    windowsHide: true,
  });
}

function makeRepo(t) {
  const repo = mkdtempSync(join(tmpdir(), "mat-skills-test-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  const result = run("git", ["init", "-q", repo]);
  assert.equal(result.status, 0, result.stderr);
  return repo;
}

function invokeInit(repo, extra = []) {
  return run("node", [INIT_SCRIPT, "--repo", repo, ...extra]);
}

function read(path) {
  return readFileSync(path, "utf8");
}

function skill(name) {
  return read(join(ROOT, name, "SKILL.md"));
}

function walkFiles(root) {
  const files = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (entry.name === ".git") {
      continue;
    }
    const path = join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(path));
    } else if (entry.isFile()) {
      files.push(path);
    }
  }
  return files;
}

test("initializes without replacing root AGENTS and stays untracked", (t) => {
  const repo = makeRepo(t);
  const result = invokeInit(repo);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(existsSync(join(repo, "AGENTS.md")), false);
  for (const path of REQUIRED_PROJECT_FILES) {
    assert.equal(existsSync(join(repo, path)), true, path);
  }
  assert.equal(existsSync(join(repo, ".mat", "features")), true);
  assert.match(read(join(repo, ".mat", "CONTEXT.md")), /## Command Map/u);
  assert.match(read(join(repo, ".mat", "CONTEXT.md")), /## Hosting and Delivery/u);
  assert.doesNotMatch(read(join(repo, ".mat", "AGENTS.md")), /workflow[_ -]?version/iu);
  const status = run("git", ["status", "--short", "--untracked-files=all"], repo);
  assert.doesNotMatch(status.stdout, /\.mat/u);
  const ignored = run("git", ["check-ignore", "-q", ".mat/AGENTS.md"], repo);
  assert.equal(ignored.status, 0);
});

test("preserves existing root AGENTS", (t) => {
  const repo = makeRepo(t);
  const original = "# Existing repository instructions\nDo not replace me.\n";
  writeFileSync(join(repo, "AGENTS.md"), original, "utf8");
  const result = invokeInit(repo);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(read(join(repo, "AGENTS.md")), original);
});

test("appends to existing exclude exactly once", (t) => {
  const repo = makeRepo(t);
  const exclude = join(repo, ".git", "info", "exclude");
  writeFileSync(exclude, "*.private\n", "utf8");
  const result = invokeInit(repo);
  assert.equal(result.status, 0, result.stderr);
  const lines = read(exclude).split(/\r?\n/u);
  assert.equal(lines.includes("*.private"), true);
  assert.equal(lines.filter((line) => line === ".mat/").length, 1);
});

test("creates a missing exclude file", (t) => {
  const repo = makeRepo(t);
  const exclude = join(repo, ".git", "info", "exclude");
  unlinkSync(exclude);
  const result = invokeInit(repo);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(read(exclude).split(/\r?\n/u).includes(".mat/"), true);
});

test("existing .mat stops without overwrite", (t) => {
  const repo = makeRepo(t);
  const mat = join(repo, ".mat");
  mkdirSync(mat);
  const context = join(mat, "CONTEXT.md");
  writeFileSync(context, "custom content", "utf8");
  const result = invokeInit(repo);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /mat-refresh skill/u);
  assert.equal(read(context), "custom content");
  assert.equal(existsSync(join(mat, "AGENTS.md")), false);
});

test("resume incomplete adds only missing files", (t) => {
  const repo = makeRepo(t);
  const mat = join(repo, ".mat");
  mkdirSync(mat);
  const context = join(mat, "CONTEXT.md");
  writeFileSync(context, "custom content", "utf8");
  const result = invokeInit(repo, ["--resume-incomplete"]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(read(context), "custom content");
  assert.equal(existsSync(join(mat, "AGENTS.md")), true);
});

test("all skills are explicit and scaffolded", () => {
  for (const name of SKILLS) {
    const instructions = skill(name);
    const metadata = read(join(ROOT, name, "agents", "openai.yaml"));
    assert.match(instructions, new RegExp(`name: ${name}`, "u"));
    assert.match(metadata, new RegExp(name, "u"));
    assert.equal(
      metadata.includes(`$${name}`),
      true,
      `${name} default_prompt must explicitly invoke $${name}`,
    );
    assert.match(metadata, /allow_implicit_invocation: false/u);
    assert.doesNotMatch(instructions, /TODO/u);
  }
});

test("exactly eight approved skills exist", () => {
  const skillFiles = walkFiles(ROOT).filter((path) => basename(path) === "SKILL.md");
  assert.equal(skillFiles.length, 8);
  const discovered = new Set(
    skillFiles.map((path) => relative(ROOT, dirname(path)).replaceAll("\\", "/")),
  );
  assert.deepEqual(discovered, APPROVED_SKILLS);
});

test("only approved skill directories contain metadata", () => {
  for (const name of APPROVED_SKILLS) {
    assert.equal(existsSync(join(ROOT, name, "SKILL.md")), true);
    assert.equal(existsSync(join(ROOT, name, "agents", "openai.yaml")), true);
  }
  const metadataRoots = new Set(
    walkFiles(ROOT)
      .filter((path) => basename(path) === "openai.yaml" && basename(dirname(path)) === "agents")
      .map((path) => basename(dirname(dirname(path)))),
  );
  assert.deepEqual(metadataRoots, APPROVED_SKILLS);
});

test("mat-shared remains support-only", () => {
  assert.equal(existsSync(MAT_SHARED), true);
  assert.equal(existsSync(join(ROOT, "mat-shared")), false);
  const files = walkFiles(MAT_SHARED);
  assert.equal(files.some((path) => basename(path) === "SKILL.md"), false);
  assert.equal(files.some((path) => basename(path) === "openai.yaml"), false);
  assert.equal(existsSync(join(MAT_SHARED, "references")), true);
  assert.equal(existsSync(join(MAT_SHARED, "templates")), true);
});

test("refresh preserves customized content", () => {
  const instructions = skill("mat-refresh");
  assert.match(instructions, /Do not repeat the complete `mat-init` onboarding interview/u);
  assert.match(instructions, /ask Mat in small groups only about missing context, contradictions, or conflicts/u);
  assert.match(instructions, /Wait for Mat's explicit approval of that plan/u);
  assert.match(instructions, /Do not modify `.mat\/`, `.git\/info\/exclude`, or any other file before approval/u);
  assert.match(instructions, /timestamped recovery copy/u);
  assert.match(instructions, /outside the repository/u);
  assert.match(instructions, /Do not create a recovery copy for purely additive or narrowly targeted changes/u);
  assert.match(instructions, /Never blindly replace/u);
  assert.match(instructions, /Preserve existing confirmed facts/u);
  assert.match(instructions, /Preserve every Feature and Task identifier/u);
  assert.match(instructions, /Quick Todo/u);
  assert.match(instructions, /only when they were explicitly included in the approved plan/u);
  assert.match(instructions, /Reconcile `.mat\/templates\/feature\.md`, `.mat\/templates\/task\.md`, and `.mat\/templates\/retrospective\.md`/u);
  assert.match(instructions, /missing files or sections/u);
  assert.match(instructions, /all existing Feature, Task, and retrospective files/u);
  assert.match(instructions, /directly against the current canonical templates and references/u);
  assert.match(instructions, /only approved changes were applied/u);
});

test("init requires confirmed project onboarding context", () => {
  const instructions = skill("mat-init");
  const context = read(join(MAT_SHARED, "templates", "CONTEXT.md"));
  assert.match(instructions, /Conduct a required, adaptive interview/u);
  assert.match(instructions, /Ask a small coherent group at a time/u);
  assert.match(instructions, /service or container names/u);
  assert.match(instructions, /host or inside a specific service or container/u);
  assert.match(instructions, /Exact command map/u);
  assert.match(instructions, /Team and delivery/u);
  assert.match(instructions, /Source control and deployment preparation/u);
  assert.match(instructions, /GitLab or GitHub/u);
  assert.match(instructions, /`glab` or `gh`/u);
  assert.match(instructions, /final `mat-next` may push/u);
  assert.match(instructions, /Require Mat to confirm or correct/u);
  assert.match(instructions, /only when Mat explicitly accepts that gap/u);
  assert.match(context, /## Command Map/u);
  assert.match(context, /## Team Workflow and Terminology/u);
  assert.match(context, /## Source Control and Deployment Preparation/u);
  assert.match(context, /## Hosting and Delivery/u);
  assert.match(context, /Targeted tests/u);
  assert.match(context, /Database migrations or seeding/u);
});

test("workflow has no internal version markers", () => {
  const textExtensions = new Set([".md", ".mjs", ".yaml", ".yml"]);
  for (const path of walkFiles(ROOT).filter((candidate) => textExtensions.has(extname(candidate)))) {
    assert.doesNotMatch(read(path), /workflow[_ -]?version/iu, relative(ROOT, path));
  }
});

test("discovery remains collaborative and read-only", () => {
  const instructions = skill("mat-discover");
  assert.match(instructions, /Ask small, coherent groups/u);
  assert.match(instructions, /working session between equal contributors/u);
  assert.match(instructions, /propose that discovery is complete/u);
  assert.match(instructions, /Mat contributes product intent/u);
  assert.match(instructions, /If either Mat or the Lead Engineer identifies a meaningful gap/u);
  assert.match(instructions, /When both agree discovery is sufficient/u);
  assert.match(instructions, /structured conversational handoff/u);
  assert.match(instructions, /Do not create or modify any file/u);
  assert.match(instructions, /Discovery remains conversational and read-only/u);
  assert.match(instructions, /modify production code or tests/u);
  assert.match(instructions, /Software Engineer or QA Engineer/u);
  assert.match(instructions, /recommend invoking `mat-feature`/u);
  assert.match(instructions, /Do not invoke it or begin planning automatically/u);
});

test("feature creates one confirmed specification and ordered Task set", () => {
  const instructions = skill("mat-feature");
  assert.match(instructions, /mutually agreed discovery handoff/u);
  assert.match(instructions, /Mat and the Lead Engineer agreed discovery was sufficient/u);
  assert.match(instructions, /business stakeholders, the product owner, and the engineering team/u);
  assert.match(instructions, /Executive Summary reusable in email/u);
  assert.match(instructions, /smallest ordered set/u);
  assert.match(instructions, /independently buildable, testable, and reviewable Tasks/u);
  assert.match(instructions, /Present the complete proposed Feature Specification/u);
  assert.match(instructions, /Do not allocate identifiers/u);
  assert.match(instructions, /until Mat explicitly approves it/u);
  assert.match(instructions, /starting with `0001`/u);
  assert.match(instructions, /never fill a gap, reuse, or renumber/u);
  assert.match(instructions, /\.mat\/features\/<FFFF-feature-name>\/FEATURE\.md/u);
  assert.match(instructions, /\.mat\/features\/<FFFF-feature-name>\/tasks\//u);
  assert.match(instructions, /\.mat\/templates\/feature\.md/u);
  assert.match(instructions, /\.mat\/templates\/task\.md/u);
  assert.match(instructions, /\.mat\/templates\/retrospective\.md/u);
  assert.match(instructions, /NNN-short-task-name\.md/u);
  assert.match(instructions, /from `Ready for Tasking` to `In Progress`/u);
  assert.match(instructions, /inline `Ready` state/u);
  assert.match(instructions, /RETROSPECTIVE\.md/u);
  assert.match(instructions, /Do not populate Active Task/u);
  assert.match(instructions, /Do not implement code/u);
});

test("build enforces correction and human review", () => {
  const instructions = skill("mat-build");
  assert.match(instructions, /`Software Engineer`/u);
  assert.match(instructions, /only one code-writing agent/u);
  assert.match(instructions, /Initial build/u);
  assert.match(instructions, /Correction pass/u);
  assert.match(instructions, /parent Feature Specification/u);
  assert.match(instructions, /indexed Feature state are both `In Progress`/u);
  assert.match(instructions, /Refuse a Feature in `Deployment`, `Retrospective`, or `Complete`/u);
  assert.match(instructions, /no different Task is active/u);
  assert.match(instructions, /required predecessors and declared dependencies are complete/u);
  assert.match(instructions, /starting Git commit/u);
  assert.match(instructions, /pre-existing staged, unstaged, and untracked paths/u);
  assert.match(instructions, /recover that original boundary from the Work Log/u);
  assert.match(instructions, /Never stash, reset, clean/u);
  assert.match(instructions, /completion status/u);
  assert.match(instructions, /deviations, assumptions, or non-obvious decisions/u);
  assert.match(instructions, /determine the changed files and diff independently/u);
  assert.match(instructions, /fresh Software Engineer session with no inherited conversation history/u);
  assert.match(instructions, /Lead Engineer evidence gate/u);
  assert.match(instructions, /\.\.\/mat-review\/SKILL\.md/u);
  assert.match(instructions, /`mat-review` owns Claude QA invocation/u);
  assert.match(instructions, /set the Active Task pointer/u);
  assert.match(instructions, /keeping it as the Active Task/u);
  assert.match(instructions, /`CORRECTIONS REQUIRED`/u);
  assert.match(instructions, /`BLOCKED`/u);
  assert.match(instructions, /do not automatically send the result to the Software Engineer/u);
  assert.match(instructions, /Mat supplies personal code-review feedback/u);
  assert.match(instructions, /reviewed file-state manifest/u);
  assert.match(instructions, /current `git hash-object` blob hash/u);
  assert.match(instructions, /detect implementation changes made after internal approval/u);
  assert.match(instructions, /Never mark the Task `Complete`/u);
  assert.match(instructions, /recommend `mat-next`/u);
  assert.match(instructions, /Do not begin another Task/u);
  assert.match(instructions, /clickable local-file link/u);
});

test("Claude QA bridge is read-only and reports usage", () => {
  const script = read(CLAUDE_QA_SCRIPT);
  assert.match(script, /--agent', 'qa-engineer/u);
  assert.match(script, /--permission-mode', 'plan/u);
  assert.match(script, /--no-session-persistence/u);
  assert.match(script, /totalCostUsd/u);
  assert.match(script, /permissionDenials/u);
  assert.match(script, /PreExistingPath/u);
  assert.match(script, /Paths already changed before this review boundary/u);
  assert.match(script, /preExistingPaths = \$preExistingPaths/u);
  assert.match(script, /exactly one supported recommendation line/u);
  assert.match(script, /& claude @claudeArguments \$prompt/u);
  assert.doesNotMatch(script, /RedirectStandardInput/u);
  assert.doesNotMatch(script, /RedirectStandardOutput/u);
  assert.match(script, /ReviewRequest/u);
  assert.match(script, /Consolidated QA Report/u);
  assert.match(script, /reportPath/u);
});

test("Claude QA bridge accepts a mocked formal review and persists its report", { skip: process.platform !== "win32" }, (t) => {
  const repo = makeRepo(t);
  run("git", ["-C", repo, "config", "user.email", "tests@example.com"]);
  run("git", ["-C", repo, "config", "user.name", "Skill Tests"]);
  writeFileSync(join(repo, "example.txt"), "baseline\n", "utf8");
  assert.equal(run("git", ["-C", repo, "add", "example.txt"]).status, 0);
  assert.equal(run("git", ["-C", repo, "commit", "-q", "-m", "baseline"]).status, 0);
  writeFileSync(join(repo, "example.txt"), "changed\n", "utf8");

  const taskDirectory = join(repo, ".mat", "features", "0001-example", "tasks");
  mkdirSync(taskDirectory, { recursive: true });
  const taskPath = join(taskDirectory, "001-example.md");
  writeFileSync(taskPath, "# Task 001: Example\n", "utf8");

  const fakeBin = join(repo, "fake-bin");
  mkdirSync(fakeBin);
  const capturedArguments = join(repo, "claude-arguments.txt");
  writeFileSync(
    join(fakeBin, "claude.ps1"),
    [
      "[System.IO.File]::WriteAllText($env:MAT_FAKE_CLAUDE_ARGS, ($args -join \"`n\"))",
      "$response = @{",
      "  is_error = $false",
      "  subtype = 'success'",
      "  result = \"No findings.`n`nACCEPT\"",
      "  duration_ms = 10",
      "  total_cost_usd = 0.01",
      "  permission_denials = @()",
      "  modelUsage = @{}",
      "}",
      "$response | ConvertTo-Json -Compress",
      "",
    ].join("\n"),
    "utf8",
  );

  const result = spawnSync(
    "powershell.exe",
    [
      "-NoProfile",
      "-ExecutionPolicy",
      "Bypass",
      "-File",
      CLAUDE_QA_SCRIPT,
      "-RepositoryPath",
      repo,
      "-TaskPath",
      taskPath,
      "-ReviewRequest",
      "Review the current example change.",
      "-PreExistingPath",
      "pre-existing.txt",
      "-DiffBase",
      "HEAD",
    ],
    {
      cwd: repo,
      encoding: "utf8",
      windowsHide: true,
      env: {
        ...process.env,
        PATH: `${fakeBin}${delimiter}${process.env.PATH ?? ""}`,
        MAT_FAKE_CLAUDE_ARGS: capturedArguments,
      },
    },
  );

  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.equal(output.status, "success");
  assert.equal(output.recommendation, "ACCEPT");
  assert.deepEqual(output.metadata.preExistingPaths, ["pre-existing.txt"]);
  assert.equal(output.metadata.diffBase, "HEAD");
  assert.equal(existsSync(output.metadata.reportPath), true);
  assert.match(read(output.metadata.reportPath), /# Consolidated QA Report: 001-example/u);
  assert.match(read(output.metadata.reportPath), /No findings\./u);
  const argumentsText = read(capturedArguments);
  assert.match(argumentsText, /Paths already changed before this review boundary/u);
  assert.match(argumentsText, /pre-existing\.txt/u);
});

test("review has ranked evidence and one recommendation", () => {
  const instructions = skill("mat-review");
  assert.match(instructions, /`qa-engineer`/u);
  assert.match(instructions, /run_claude_qa\.ps1/u);
  assert.match(instructions, /Claude Sonnet at high effort/u);
  assert.match(instructions, /Claude Opus at high effort only/u);
  assert.match(instructions, /bounded one-off change set/u);
  assert.match(instructions, /parent Feature Specification/u);
  assert.match(instructions, /persisted report path/u);
  assert.match(instructions, /use `HEAD` for current staged, unstaged, and untracked work/u);
  assert.match(instructions, /use a commit's parent/u);
  assert.match(instructions, /relevant merge base/u);
  assert.match(instructions, /pre-existing changed path list/u);
  assert.match(instructions, /classification \(`Blocking`, `Important`, or `Optional`\)/u);
  assert.match(instructions, /evidence/u);
  assert.match(instructions, /remain read-only/u);
  assert.match(instructions, /Return `BLOCKED` when/u);
  assert.match(instructions, /Return `CORRECTIONS REQUIRED` when/u);
  assert.match(instructions, /Return `APPROVED` only when/u);
  assert.match(instructions, /Claude `ACCEPT` does not force/u);
  assert.match(instructions, /creating an approved Task before implementing required corrections/u);
  assert.match(instructions, /End with exactly one final recommendation/u);
  assert.match(instructions, /`APPROVED`, `CORRECTIONS REQUIRED`, or `BLOCKED`/u);
});

test("next requires Mat approval and prepares deployment after the final Task", () => {
  const instructions = skill("mat-next");
  assert.match(instructions, /explicit `mat-next` invocation/u);
  assert.match(instructions, /completed personal code review and approves/u);
  assert.match(instructions, /Do not require a redundant approval message/u);
  assert.match(instructions, /`Review`/u);
  assert.match(instructions, /`Complete`/u);
  assert.match(instructions, /latest complete `mat-review` process returned `APPROVED`/u);
  assert.match(instructions, /reviewed file-state evidence/u);
  assert.match(instructions, /implementation still matches that evidence/u);
  assert.match(instructions, /includes feedback, a requested change, or uncertainty/u);
  assert.match(instructions, /parent Feature Specification/u);
  assert.match(instructions, /leave the Feature `In Progress`/u);
  assert.match(instructions, /first eligible `Ready` Task/u);
  assert.match(instructions, /predecessors and dependencies are complete/u);
  assert.match(instructions, /remaining Tasks are `Draft` or `Blocked`/u);
  assert.match(instructions, /every Feature Task is `Complete`/u);
  assert.match(instructions, /Move the Feature Specification and indexed Feature state from `In Progress` to `Deployment`/u);
  assert.match(instructions, /Active Task as `None`/u);
  assert.match(instructions, /Do not modify production code, tests, or user-facing project documentation/u);
  assert.match(instructions, /Never require a second consecutive `mat-next`/iu);
  assert.match(instructions, /Do not pause for a separate preview or confirmation/iu);
  assert.match(instructions, /find an existing open request/iu);
  assert.match(instructions, /ready for review, not draft/iu);
  assert.match(instructions, /Keep the Feature `Deployment`/iu);
  assert.match(instructions, /Never create a duplicate request, merge it, deploy/iu);
});

test("retrospective closes one Feature and routes ideas", () => {
  const instructions = skill("mat-retro");
  assert.match(instructions, /Feature Specification and indexed Feature state are both `Deployment`/u);
  assert.match(instructions, /merged, the Feature was deployed, and production validation succeeded/u);
  assert.match(instructions, /move the Feature Specification and indexed state from `Deployment` to `Retrospective`/u);
  assert.match(instructions, /every Feature Task is `Complete`/u);
  assert.match(instructions, /do not invent topics/u);
  assert.match(instructions, /Discuss one topic at a time/u);
  assert.match(instructions, /Apply before next Feature/u);
  assert.match(instructions, /Project-specific ideas go to `.mat\/IDEAS.md`/u);
  assert.match(instructions, /workflow-wide Idea Bin/u);
  assert.match(instructions, /Revisit when/u);
  assert.match(instructions, /move the Feature back to `In Progress`/u);
  assert.match(instructions, /Set the Feature Specification to `Complete`/u);
  assert.match(instructions, /remove the Feature's expanded group from Current Features/u);
  assert.match(instructions, /AI Feature workflow is complete/u);
});

test("retrospective resolves the canonical workflow Idea Bin", () => {
  const result = run("node", [RETRO_IDEA_SCRIPT]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(resolve(result.stdout.trim()), join(ROOT, "IDEAS.md"));
});

test("generated workflow requires Mat review before completion", () => {
  const workflow = read(join(MAT_SHARED, "templates", "WORKFLOW.md"));
  assert.match(workflow, /`mat-build` stops in `Review`/u);
  assert.match(workflow, /only an explicit `mat-next` invocation may transition/u);
  assert.match(workflow, /confirms Mat's personal review and approval/u);
  assert.match(workflow, /`mat-review` remains read-only/u);
  assert.match(workflow, /## Feature Lifecycle/u);
  assert.match(workflow, /moves it to `Deployment`/u);
  assert.match(workflow, /merge, deployment, and production validation/u);
});

test("canonical Task template has required sections", () => {
  const template = read(join(MAT_SHARED, "templates", "task-template.md"));
  const headings = [
    "Status",
    "Technical Outcome",
    "Relevant Code and Current Behavior",
    "Approved Approach",
    "Scope",
    "Non-Goals",
    "Technical Requirements",
    "Acceptance Criteria",
    "Representative Behavior",
    "Implementation Constraints",
    "Testing and Verification",
    "Documentation and Release Notes",
    "Dependencies",
    "Open Questions",
    "Work Log",
  ];
  for (const heading of headings) {
    assert.match(template, new RegExp(`## ${heading}`, "u"));
  }
});

test("canonical Feature template is shareable and task-ready", () => {
  const template = read(join(MAT_SHARED, "templates", "feature-template.md"));
  const headings = [
    "Status",
    "Executive Summary",
    "Problem or Opportunity",
    "Desired Outcome",
    "Users and Stakeholders",
    "Current Behavior",
    "Proposed Behavior",
    "Scope",
    "Non-Goals",
    "Requirements and Business Rules",
    "User Flow",
    "Data, Permissions, and Integrations",
    "Edge Cases and Failure Behavior",
    "Constraints and Dependencies",
    "Success Criteria",
    "Testing and Validation Strategy",
    "Delivery and Release Considerations",
    "Decisions",
    "Open Questions",
  ];
  for (const heading of headings) {
    assert.match(template, new RegExp(`## ${heading}`, "u"));
  }
  assert.match(template, /Draft/u);
  assert.match(template, /Ready for Tasking/u);
  assert.match(template, /In Progress/u);
  assert.match(template, /Deployment/u);
  assert.match(template, /Retrospective/u);
  assert.match(template, /Complete/u);
  assert.match(template, /stakeholder communication/u);
});

test("canonical Task index groups globally numbered work by feature", () => {
  const index = read(join(MAT_SHARED, "templates", "TASKS.md"));
  const structure = read(join(MAT_SHARED, "references", "project-structure.md"));
  assert.match(index, /## Active Task/u);
  assert.match(index, /## Quick Todos/u);
  assert.match(index, /## Current Features/u);
  assert.match(index, /## Completed Features/u);
  assert.doesNotMatch(index, /## Ready Tasks|## Future Tasks|## Completed Tasks/u);
  assert.match(structure, /features\/FFFF-feature-name\/FEATURE\.md/u);
  assert.match(structure, /features\/FFFF-feature-name\/tasks\/NNN-short-task-name\.md/u);
  assert.match(structure, /such as `0001-user-authentication`/u);
  assert.match(structure, /Feature numbers and Task numbers are independently, globally sequential/u);
  assert.match(structure, /Never reuse, fill a gap in, or renumber/u);
  assert.match(structure, /plain checkboxes/u);
  assert.match(structure, /never receive Feature or Task identifiers or separate files/u);
});

test("workflow keeps Quick Todos deliberately lightweight", () => {
  const rules = read(join(MAT_SHARED, "references", "workflow-rules.md"));
  const workflow = read(join(MAT_SHARED, "templates", "WORKFLOW.md"));
  for (const content of [rules, workflow]) {
    assert.match(content, /Quick Todos/u);
    assert.match(content, /small, unambiguous, localized/u);
    assert.match(content, /do not block/u);
    assert.match(content, /Software Engineer/u);
    assert.match(content, /targeted verification/u);
    assert.match(content, /Claude QA is optional/u);
    assert.match(content, /promote/u);
  }
});

test("canonical retrospective and Idea Bin templates preserve follow-up", () => {
  const retrospective = read(join(MAT_SHARED, "templates", "retrospective-template.md"));
  const ideas = read(join(MAT_SHARED, "templates", "IDEAS.md"));
  assert.match(retrospective, /## Recorded Observations/u);
  assert.match(retrospective, /## Decision Log/u);
  assert.match(retrospective, /## Ideas Routed/u);
  assert.match(retrospective, /## Delivery Outcome/u);
  assert.match(retrospective, /Collecting/u);
  assert.match(ideas, /## Active Ideas/u);
  assert.match(ideas, /## Closed Ideas/u);
  assert.match(ideas, /Revisit/u);
});

test("owned workflow has no Python source or documentation dependencies", () => {
  const pythonFiles = walkFiles(ROOT).filter((path) => extname(path) === ".py");
  assert.deepEqual(pythonFiles, []);
  assert.doesNotMatch(read(join(ROOT, "README.md")), /python|quick_validate|pyyaml/iu);
  assert.doesNotMatch(read(join(ROOT, "AGENTS.md")), /python|quick_validate|pyyaml/iu);
});
