#!/usr/bin/env python3
"""Safely scaffold Mat's private project workflow."""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from pathlib import Path


TEMPLATE_FILES = {
    "AGENTS.md": "AGENTS.md",
    "CONTEXT.md": "CONTEXT.md",
    "WORKFLOW.md": "WORKFLOW.md",
    "TASKS.md": "TASKS.md",
    "tasks/_template.md": "task-template.md",
}


class InitError(RuntimeError):
    pass


def git(repo: Path, *args: str, check: bool = True) -> subprocess.CompletedProcess[str]:
    result = subprocess.run(
        ["git", "-C", str(repo), *args],
        text=True,
        capture_output=True,
        check=False,
    )
    if check and result.returncode:
        detail = result.stderr.strip() or result.stdout.strip()
        raise InitError(f"git {' '.join(args)} failed: {detail}")
    return result


def resolve_templates() -> Path:
    templates = Path(__file__).resolve().parents[1] / "support" / "mat-shared" / "templates"
    missing = [source for source in TEMPLATE_FILES.values() if not (templates / source).is_file()]
    if missing:
        raise InitError(f"canonical templates are missing: {', '.join(missing)}")
    return templates


def verify_main_worktree(repo: Path) -> None:
    if git(repo, "rev-parse", "--is-inside-work-tree", check=False).stdout.strip() != "true":
        raise InitError(f"not a Git working tree: {repo}")
    git_dir = Path(git(repo, "rev-parse", "--path-format=absolute", "--git-dir").stdout.strip()).resolve()
    common_dir = Path(
        git(repo, "rev-parse", "--path-format=absolute", "--git-common-dir").stdout.strip()
    ).resolve()
    if git_dir != common_dir:
        raise InitError("refusing to initialize from a linked Git worktree")


def add_local_exclusion(repo: Path) -> Path:
    relative = git(repo, "rev-parse", "--git-path", "info/exclude").stdout.strip()
    exclude = Path(relative)
    if not exclude.is_absolute():
        exclude = repo / exclude
    exclude = exclude.resolve()
    exclude.parent.mkdir(parents=True, exist_ok=True)
    existing = exclude.read_text(encoding="utf-8") if exclude.exists() else ""
    if ".mat/" not in existing.splitlines():
        separator = "" if not existing or existing.endswith(("\n", "\r")) else "\n"
        exclude.write_text(f"{existing}{separator}.mat/\n", encoding="utf-8")
    return exclude


def initialize(repo: Path, resume_incomplete: bool) -> list[Path]:
    repo = repo.resolve()
    verify_main_worktree(repo)
    templates = resolve_templates()
    target = repo / ".mat"
    if target.exists() and not resume_incomplete:
        raise InitError(".mat already exists; inspect it and use the mat-refresh skill")
    if target.exists() and not target.is_dir():
        raise InitError(".mat exists but is not a directory")

    created: list[Path] = []
    for destination_name, source_name in TEMPLATE_FILES.items():
        destination = target / destination_name
        if destination.exists():
            continue
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(templates / source_name, destination)
        created.append(destination)

    add_local_exclusion(repo)
    probe = target / "AGENTS.md"
    if git(repo, "check-ignore", "-q", str(probe), check=False).returncode != 0:
        raise InitError(f"Git does not ignore {probe}")
    return created


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", type=Path, default=Path.cwd(), help="repository root")
    parser.add_argument(
        "--resume-incomplete",
        action="store_true",
        help="create only missing canonical files in a clearly incomplete .mat directory",
    )
    args = parser.parse_args()
    try:
        created = initialize(args.repo, args.resume_incomplete)
    except InitError as error:
        print(f"error: {error}", file=sys.stderr)
        return 2
    for path in created:
        print(f"created: {path}")
    print("verified: .mat is ignored by Git")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
