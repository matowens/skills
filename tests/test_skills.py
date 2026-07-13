from __future__ import annotations

import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SKILLS = ("mat-init", "mat-refresh", "mat-discover", "mat-task", "mat-build", "mat-review")
APPROVED_SKILLS = frozenset(SKILLS)
INIT_SCRIPT = ROOT / "mat-init" / "scripts" / "init_project.py"
MAT_SHARED = ROOT / "mat-init" / "support" / "mat-shared"
REQUIRED_PROJECT_FILES = (
    ".mat/AGENTS.md",
    ".mat/CONTEXT.md",
    ".mat/WORKFLOW.md",
    ".mat/TASKS.md",
    ".mat/tasks/_template.md",
)


def run(*args: str, cwd: Path | None = None) -> subprocess.CompletedProcess[str]:
    return subprocess.run(args, cwd=cwd, text=True, capture_output=True, check=False)


class InitFixtureTests(unittest.TestCase):
    def make_repo(self) -> tuple[tempfile.TemporaryDirectory[str], Path]:
        temporary = tempfile.TemporaryDirectory()
        repo = Path(temporary.name)
        result = run("git", "init", "-q", str(repo))
        self.assertEqual(0, result.returncode, result.stderr)
        return temporary, repo

    def invoke(self, repo: Path, *extra: str) -> subprocess.CompletedProcess[str]:
        return run(sys.executable, str(INIT_SCRIPT), "--repo", str(repo), *extra)

    def test_initializes_repo_without_root_agents_and_stays_untracked(self) -> None:
        temporary, repo = self.make_repo()
        self.addCleanup(temporary.cleanup)
        result = self.invoke(repo)
        self.assertEqual(0, result.returncode, result.stderr)
        self.assertFalse((repo / "AGENTS.md").exists())
        for relative in REQUIRED_PROJECT_FILES:
            self.assertTrue((repo / relative).is_file(), relative)
        status = run("git", "status", "--short", "--untracked-files=all", cwd=repo)
        self.assertNotIn(".mat", status.stdout)
        ignored = run("git", "check-ignore", "-q", ".mat/AGENTS.md", cwd=repo)
        self.assertEqual(0, ignored.returncode)

    def test_preserves_existing_root_agents(self) -> None:
        temporary, repo = self.make_repo()
        self.addCleanup(temporary.cleanup)
        original = "# Existing repository instructions\nDo not replace me.\n"
        (repo / "AGENTS.md").write_text(original, encoding="utf-8")
        result = self.invoke(repo)
        self.assertEqual(0, result.returncode, result.stderr)
        self.assertEqual(original, (repo / "AGENTS.md").read_text(encoding="utf-8"))

    def test_appends_to_existing_exclude_once(self) -> None:
        temporary, repo = self.make_repo()
        self.addCleanup(temporary.cleanup)
        exclude = repo / ".git" / "info" / "exclude"
        exclude.write_text("*.private\n", encoding="utf-8")
        result = self.invoke(repo)
        self.assertEqual(0, result.returncode, result.stderr)
        content = exclude.read_text(encoding="utf-8")
        self.assertIn("*.private\n", content)
        self.assertEqual(1, content.splitlines().count(".mat/"))

    def test_creates_missing_exclude(self) -> None:
        temporary, repo = self.make_repo()
        self.addCleanup(temporary.cleanup)
        exclude = repo / ".git" / "info" / "exclude"
        exclude.unlink()
        result = self.invoke(repo)
        self.assertEqual(0, result.returncode, result.stderr)
        self.assertIn(".mat/", exclude.read_text(encoding="utf-8").splitlines())

    def test_existing_mat_stops_without_overwrite(self) -> None:
        temporary, repo = self.make_repo()
        self.addCleanup(temporary.cleanup)
        mat = repo / ".mat"
        mat.mkdir()
        context = mat / "CONTEXT.md"
        context.write_text("custom content", encoding="utf-8")
        result = self.invoke(repo)
        self.assertNotEqual(0, result.returncode)
        self.assertIn("mat-refresh skill", result.stderr)
        self.assertEqual("custom content", context.read_text(encoding="utf-8"))
        self.assertFalse((mat / "AGENTS.md").exists())

    def test_resume_incomplete_adds_only_missing_files(self) -> None:
        temporary, repo = self.make_repo()
        self.addCleanup(temporary.cleanup)
        mat = repo / ".mat"
        mat.mkdir()
        context = mat / "CONTEXT.md"
        context.write_text("custom content", encoding="utf-8")
        result = self.invoke(repo, "--resume-incomplete")
        self.assertEqual(0, result.returncode, result.stderr)
        self.assertEqual("custom content", context.read_text(encoding="utf-8"))
        self.assertTrue((mat / "AGENTS.md").is_file())


class SkillContractTests(unittest.TestCase):
    def skill(self, name: str) -> str:
        return (ROOT / name / "SKILL.md").read_text(encoding="utf-8")

    def test_all_skills_are_explicit_and_scaffolded(self) -> None:
        for name in SKILLS:
            with self.subTest(skill=name):
                skill = self.skill(name)
                metadata = (ROOT / name / "agents" / "openai.yaml").read_text(encoding="utf-8")
                self.assertIn(f"name: {name}", skill)
                self.assertIn(name, metadata)
                self.assertIn("allow_implicit_invocation: false", metadata)
                self.assertNotIn("TODO", skill)

    def test_exactly_six_approved_skills_exist(self) -> None:
        skill_files = tuple(ROOT.rglob("SKILL.md"))
        self.assertEqual(6, len(skill_files))
        discovered = {path.parent.relative_to(ROOT).as_posix() for path in skill_files}
        self.assertEqual(APPROVED_SKILLS, discovered)

    def test_only_approved_skill_directories_contain_skill_metadata(self) -> None:
        for name in APPROVED_SKILLS:
            self.assertTrue((ROOT / name / "SKILL.md").is_file())
            self.assertTrue((ROOT / name / "agents" / "openai.yaml").is_file())
        metadata_roots = {
            path.parents[1].relative_to(ROOT).as_posix()
            for path in ROOT.rglob("agents/openai.yaml")
        }
        self.assertEqual(APPROVED_SKILLS, metadata_roots)

    def test_mat_shared_is_support_only_and_not_discoverable(self) -> None:
        self.assertTrue(MAT_SHARED.is_dir())
        self.assertFalse((ROOT / "mat-shared").exists())
        self.assertEqual([], list(MAT_SHARED.rglob("SKILL.md")))
        self.assertEqual([], list(MAT_SHARED.rglob("openai.yaml")))
        self.assertTrue((MAT_SHARED / "references").is_dir())
        self.assertTrue((MAT_SHARED / "templates").is_dir())

    def test_no_unsupported_mat_invocation_prefix_remains(self) -> None:
        forbidden = "$" + "mat-"
        for path in ROOT.rglob("*"):
            if not path.is_file() or ".git" in path.parts:
                continue
            try:
                content = path.read_text(encoding="utf-8")
            except UnicodeDecodeError:
                continue
            self.assertNotIn(forbidden, content, str(path))

    def test_refresh_preserves_customized_content(self) -> None:
        skill = self.skill("mat-refresh")
        self.assertIn("Do not modify populated files before presenting this plan", skill)
        self.assertIn("Never blindly replace", skill)
        self.assertIn("Preserve project-specific facts", skill)
        self.assertIn("missing files or sections", skill)
        self.assertIn("all existing Task files", skill)
        self.assertIn("workflow_version: 1", skill)

    def test_discovery_is_conversational_and_read_only(self) -> None:
        skill = self.skill("mat-discover")
        self.assertIn("Do not create or update a Task Specification", skill)
        self.assertIn("modify code", skill)
        self.assertIn("Software Engineer or QA Engineer", skill)
        self.assertIn("Ask small, coherent groups", skill)

    def test_task_contract_is_numbered_and_draft_when_ambiguous(self) -> None:
        skill = self.skill("mat-task")
        self.assertIn("Write exactly one Task", skill)
        self.assertIn("NNN-short-task-name.md", skill)
        self.assertIn("never fill a gap", skill)
        self.assertIn("never reuse or renumber", skill)
        self.assertIn("Otherwise mark it `Draft`", skill)
        self.assertIn("Do not implement code", skill)

    def test_build_enforces_agents_correction_and_review(self) -> None:
        skill = self.skill("mat-build")
        self.assertIn("`Software Engineer`", skill)
        self.assertIn("`QA Engineer`", skill)
        self.assertIn("only one code-writing agent", skill)
        self.assertIn("correction loop", skill)
        self.assertIn("../mat-review/SKILL.md", skill)
        self.assertIn("Do not mark the Task complete", skill)
        self.assertIn("explicit approval before committing", skill)

    def test_review_has_ranked_evidence_and_one_recommendation(self) -> None:
        skill = self.skill("mat-review")
        self.assertIn("classification (`Blocking`, `Important`, or `Optional`)", skill)
        self.assertIn("evidence", skill)
        self.assertIn("remain read-only", skill)
        self.assertIn("End with exactly one final recommendation", skill)
        self.assertIn("`APPROVED`, `CORRECTIONS REQUIRED`, or `BLOCKED`", skill)

    def test_canonical_task_template_has_required_sections(self) -> None:
        template = (MAT_SHARED / "templates" / "task-template.md").read_text(
            encoding="utf-8"
        )
        headings = (
            "Status", "Summary", "Problem", "Desired Outcome", "Context", "Scope",
            "Non-Goals", "Requirements", "Acceptance Criteria", "Edge Cases",
            "Implementation Constraints", "Testing Expectations", "Documentation Expectations",
            "Release Considerations", "Open Questions", "Work Log",
        )
        for heading in headings:
            self.assertIn(f"## {heading}", template)


if __name__ == "__main__":
    unittest.main()
