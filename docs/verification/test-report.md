<!-- SPDX-License-Identifier: Apache-2.0 -->
<!-- SPDX-FileCopyrightText: 2026 Gamma Sublang <gamma@sublang.ai> -->

# Test Report

Verification of the `main` branch of graph-crate against every spec item under `specs/`.
Per-item mapping and coverage: [traceability-matrix.md](traceability-matrix.md).

## What ran

Each recorded run used the tree of the commit that carries this report, with all its changes staged, and audited that pending commit:

```sh
GIT_AUDIT_MESSAGE_FILE=<prepared commit message> cargo test --no-fail-fast
```

With `GIT_AUDIT_MESSAGE_FILE` set, `tests/git_conventions.rs` audits committed history and the pending commit's message, staged diff, and identity (`git var`).
Without it, the same tests audit committed history only.

Environment: macOS 27.0.1, rustc and cargo 1.96.1, git 2.54.0, Spex CLI 3.0.0 (`spex`), Node v25.5.0.

| Suite | Kind | Tests | Passed | Failed | Ignored |
| --- | --- | --- | --- | --- | --- |
| `src/lib.rs` unit tests | unit (implementation) | 8 | 8 | 0 | 0 |
| `tests/git_conventions.rs` (new) | system (git history) | 5 | 5 | 0 | 0 |
| `tests/graph_spec.rs` (new) | integration (public API) | 5 | 5 | 0 | 0 |
| `tests/licensing_headers.rs` (new) | system (repo files) | 6 | 3 | 3 | 0 |
| `tests/shortest_path.rs` | integration (public API) | 1 | 1 | 0 | 0 |
| `tests/spec_tree.rs` (new) | system (specs tree, incl. `spex lint`) | 5 | 4 | 1 | 0 |
| Doc-tests | doc example | 1 | 1 | 0 | 0 |
| **Total** | | **31** | **27** | **4** | **0** |

New tests: 21 in 4 files; existing tests: 10.
Before verification the suite had 10 tests, all passing.

## Failures

### Missing SPDX headers on `contrib.md`

Three tests fail on the same file:

- `licensing_headers::licensing_3_in_scope_files_carry_copyright_header`
- `licensing_headers::licensing_4_in_scope_files_carry_license_header`
- `licensing_headers::licensing_9_own_files_use_project_license_and_holder`

```text
missing SPDX-FileCopyrightText: ["spex-packages/contrib/playbooks/en/contrib/contrib.md"]
missing SPDX-License-Identifier: ["spex-packages/contrib/playbooks/en/contrib/contrib.md"]
left: []
right: ["<!-- SPDX-License-Identifier: Apache-2.0 -->", "<!-- SPDX-FileCopyrightText: 2026 Gamma Sublang <gamma@sublang.ai> -->"]
```

`spex-packages/contrib` is the team's own Spex playbook package (added in `c481b23`, published under the workshop org with `license: Apache-2.0` in `e2bf88a`).
Its build output is excluded as generated content (licensing-6), but `contrib.md`, the hand-written playbook source, is in scope.
It has comment syntax and carries no SPDX lines, which violates licensing-1, licensing-2, and licensing-9.
Fixing it is left to the package owner.
Adding the header changes the source hash that `.slc/builds/1/manifest.json` records, so the package needs a rebuild.

### `spec_tree::meta_33_every_behavior_is_verified`

```text
behaviors no Verification item cites: ["specs/packages/licensing.md: licensing-9"]
```

meta-33 requires each package's Verification section to verify every behavior in that package.
`licensing.md` has External Behavior item licensing-9, but none of licensing-3, licensing-4, or licensing-8 cites it.
This is a defect in the specs.
Suggested fix, left to the spec owner: add a Verification item to `licensing.md` that cites licensing-9 (IR-000's Verification section already describes the check).

No other test failed.

## Coverage

52 spec items: 12 Covered, 28 Partial, 12 Uncovered.
Every item in `graph`, `git`, and `licensing` maps to at least one executable test.

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

- git-1 to git-6: the commit workflow is an agent process, so the tests audit what it produces (commits and the pending commit) but cannot drive it.
  Imperative mood, "what and why", and AI assistance of past commits are not mechanically decidable.
- licensing-1 to licensing-4 and licensing-9: the verdicts depend on the licensing scope, which only the test implements.
- licensing-5 and licensing-8: no file has an upstream license that differs from the project's, and inclusion preparation has no executable implementation to run on a fixture.
- licensing-6 and licensing-7: the scope rule and the license-file detector exist only inside the test, which applies them to the spec's examples and to this repo.
- meta items checked by `spex lint` or by a heuristic, or (meta-33) by citation presence alone, as listed in the matrix.

## Interpretations and observations

- **Licensing scope** (licensing-6):
  - `Cargo.toml` and the Spex package manifest `meta.yaml` count as configuration, and so do `CLAUDE.md` and `GEMINI.md`, like `AGENTS.md`.
  - In `spex-packages/contrib`, generated content is detected by: the `.slc`/`.slc-verify` build directories, esbuild bundles, the targets named in `.slc/builds/*/manifest.json`, and files marked `Generated by` (e.g., `contrib.ts`, `*.test.ts`, `contrib.registry.ts`).
  - Read as in scope instead, `Cargo.toml` and `meta.yaml` would also fail licensing-3 and licensing-4.
- **Merge commit** `5e70f1c` (`Merge pull request #2 ...`) was made by the hosting service and does not follow the git-2 subject format.
  The git audit skips merge commits (`--no-merges`), since git.md does not say whether service-generated merges are in scope.
- **Identity audit** (git-1) compares the latest non-merge commit with the local `git config`, so it only holds where that commit's author runs the suite.
- **Tool dependencies**: `licensing_headers` and `spec_tree` need the Spex CLI (`spex` on PATH or `SPEX_BIN`), and the git and licensing tests need a full git clone.
  These tests fail, rather than skip, when either is missing.
- **Fault detection** was spot-checked by temporary mutations, reverted before the recorded run:
  - making `add_edge` one-directional failed `graph_3` and `graph_5`;
  - ignoring out-of-range `add_edge` failed `graph_1` and `graph_4`;
  - an untracked header-less `.md` failed `licensing_3`, `_4`, and `_9`;
  - a malformed pending message failed three `git_6_*` tests;
  - overriding `GIT_AUTHOR_NAME` failed `git_6_commit_records_configured_identity`.
