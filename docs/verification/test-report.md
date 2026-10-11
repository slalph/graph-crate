<!-- SPDX-License-Identifier: Apache-2.0 -->
<!-- SPDX-FileCopyrightText: 2026 Gamma Sublang <gamma@sublang.ai> -->

# Test Report

Verification of the `main` branch of graph-crate against every spec item under `specs/`.
Per-item mapping and coverage: [traceability-matrix.md](traceability-matrix.md).

## What ran

The run used the tree of the commit that adds this report (parent `e2bf88a`), with all changes staged.

```sh
GIT_AUDIT_MESSAGE_FILE=<prepared commit message> cargo test --no-fail-fast
```

`GIT_AUDIT_MESSAGE_FILE` makes `tests/git_conventions.rs` also audit the pending commit's message and staged diff.
Without it, those tests audit committed history only.

Environment: macOS 27.0.1, rustc and cargo 1.96.1, git 2.54.0, Spex CLI 3.0.0 (`spex`), Node v25.5.0.

| Suite | Kind | Tests | Passed | Failed | Ignored |
| --- | --- | --- | --- | --- | --- |
| `src/lib.rs` unit tests | unit (implementation) | 8 | 8 | 0 | 0 |
| `tests/git_conventions.rs` (new) | system (git history) | 5 | 5 | 0 | 0 |
| `tests/graph_spec.rs` (new) | integration (public API) | 5 | 5 | 0 | 0 |
| `tests/licensing_headers.rs` (new) | system (repo files) | 6 | 6 | 0 | 0 |
| `tests/shortest_path.rs` | integration (public API) | 1 | 1 | 0 | 0 |
| `tests/spec_tree.rs` (new) | system (specs tree, incl. `spex lint`) | 5 | 4 | 1 | 0 |
| Doc-tests | doc example | 1 | 1 | 0 | 0 |
| **Total** | | **31** | **30** | **1** | **0** |

New tests: 21 in 4 files; existing tests: 10.

Before this change the suite had 10 tests, all passing.

## Failures

### `spec_tree::meta_33_every_behavior_is_verified`

```text
behaviors no Verification item cites: ["specs/packages/licensing.md: licensing-9"]
```

meta-33 requires each package's Verification section to verify every behavior in that package.
`licensing.md` has External Behavior item licensing-9 (project license and holder in native syntax), but none of licensing-3, licensing-4, or licensing-8 cites it.
This is a defect in the specs, not in the code: the behavior holds, as `licensing_headers::licensing_9_own_files_use_project_license_and_holder` passes.
Suggested fix, left to the spec owner: add a Verification item to `licensing.md` citing licensing-9 (the IR-000 Verification section already describes the check).

No other test failed.

## Coverage

52 spec items: 19 Covered, 21 Partial, 12 Uncovered.
Every item in `graph`, `git`, and `licensing` has at least one passing executable test.

### Uncovered items

| Item | Reason |
| --- | --- |
| meta-23 | Minimality and concision are editorial judgments |
| meta-24 | Whether a DR holds decisions, not implementation details, is an editorial judgment |
| meta-35 | No accepted DR has been changed; nothing observable to test |
| meta-28 | IR disposability is an editorial judgment |
| meta-7 | Whether a case "can be expressed" in GWT is a judgment |
| meta-8 | Whether every reliance is cited is semantic; lint checks only citation form |
| meta-13 | Package closedness and shared intent are judgments |
| meta-34 | Package completeness and exactness are judgments |
| meta-12 | No public release (no tags) exists to check ID stability against |
| meta-15 | Readability without links is a judgment |
| meta-21 | Whether a spec test item specifies a unit test is a judgment |
| meta-32 | Preferring real behaviors over substitutes is a judgment |

These items are review criteria for the specs themselves; they need a human or agent review, not a test.

### Partial items

The matrix states each gap; the main causes are:

- git-1 to git-6: the commit workflow is an agent process, so tests audit its output (commits) but cannot drive it; imperative mood, "what and why", and AI assistance of past commits are not mechanically decidable.
- licensing-5, licensing-8: the repo has no file whose upstream license differs from the project's, and inclusion preparation has no executable implementation to run on a fixture.
- licensing-6, licensing-7: the scope rule and license-file detector exist only inside the test, which applies them to the spec's examples and to this repo.
- meta items checked by `spex lint` or a heuristic, as listed in the matrix.

## Interpretations and observations

- **Licensing scope** (licensing-6): `Cargo.toml` is classed as configuration, `CLAUDE.md` and `GEMINI.md` as configuration like `AGENTS.md`, `spex-packages/` (an installed registry package) as vendor content, and `.slc/` build output as generated. None of these carries SPDX lines.
- **Merge commit** `5e70f1c` (`Merge pull request #2 ...`) was made by the hosting service and does not follow the git-2 subject format. The git audit skips merge commits (`--no-merges`), since git.md does not say whether service-generated merges are in scope.
- **Identity audit** (git-1) compares the latest non-merge commit with the local `git config`, so it only holds where that commit's author ran the suite.
- **Tool dependencies**: `licensing_headers` and `spec_tree` need the Spex CLI (`spex` on PATH or `SPEX_BIN`), and the git and licensing tests need a full git clone. These tests fail, rather than skip, when either is missing.
- **Fault detection** was spot-checked by temporary mutations, reverted before the run above:
  - making `add_edge` one-directional failed `graph_3` and `graph_5`;
  - ignoring out-of-range `add_edge` failed `graph_1` and `graph_4`;
  - an untracked header-less `.md` failed `licensing_3`, `_4`, and `_9`;
  - a malformed pending message failed three `git_6_*` tests.
