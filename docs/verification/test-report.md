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
| `tests/git_conventions.rs` | system (git history) | 5 | 5 | 0 | 0 |
| `tests/graph_spec.rs` | integration (public API) | 7 | 7 | 0 | 0 |
| `tests/licensing_headers.rs` | system (repo files) | 6 | 3 | 3 | 0 |
| `tests/shortest_path.rs` | integration (public API) | 1 | 1 | 0 | 0 |
| `tests/spec_rules.rs` | system (specs tree, git, `spex lint`) | 12 | 12 | 0 | 0 |
| `tests/spec_tree.rs` | system (specs tree, incl. `spex lint`) | 5 | 4 | 1 | 0 |
| `tests/traversal.rs` (new) | integration (public API) | 1 | 1 | 0 | 0 |
| Doc-tests | doc example | 1 | 1 | 0 | 0 |
| **Total** | | **46** | **42** | **4** | **0** |

New tests: 3 for the `bfs` and `dfs` traversals (graph-7 to graph-9): 2 in `tests/graph_spec.rs` and 1 in the new `tests/traversal.rs`.
Before this run the suite had 43 tests: 39 passed and 4 failed, the same 4 that fail below.
The first audit round led to rewritten tests for meta-13, meta-21, and meta-28, and to corrected gap statements for meta-13, meta-21, meta-28, and meta-32 (see [Audit corrections](#audit-corrections)).

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
Suggested fix, left to the spec owner: add a Verification item to `licensing.md` that cites licensing-9.
`licensing_9_own_files_use_project_license_and_holder` already checks the behavior; only the spec's test item is missing.

No other test failed.

## Coverage

55 spec items: 15 Covered, 40 Partial, 0 Uncovered.
Every spec item maps to at least one executable test, run in the recorded run.

### Uncovered items

None.
The 12 meta items that were Uncovered before (meta-7, meta-8, meta-12, meta-13, meta-15, meta-21, meta-23, meta-24, meta-28, meta-32, meta-34, meta-35) now each have a test in `tests/spec_rules.rs`.
Each test checks only the part of its rule that is mechanically decidable, so all 12 are rated Partial.
The matrix states what each one leaves to human or agent review.

### Partial items

The matrix states each gap; the main causes are:

- git-1 to git-6: the commit workflow is an agent process, so the tests audit what it produces (commits and the pending commit) but cannot drive it.
  Imperative mood, "what and why", and AI assistance of past commits are not mechanically decidable.
- licensing-1 to licensing-4 and licensing-9: the verdicts depend on the licensing scope, which only the test implements.
- licensing-5 and licensing-8: no file has an upstream license that differs from the project's, and inclusion preparation has no executable implementation to run on a fixture.
- licensing-6 and licensing-7: the scope rule and the license-file detector exist only inside the test, which applies them to the spec's examples and to this repo.
- meta items checked by `spex lint`, by a heuristic, or by structure alone.
  Their semantic parts (minimality, closedness, completeness, stand-alone readability, judgment of "substantive" or "unit-sized") need review, not a test.
- meta-12 and meta-35 have no instance in this repo (no release tag; DR-000 unchanged), so their repo checks are vacuous.
  Their checkers also run on constructed fixtures, where they reject the violations.

## Interpretations and observations

- **Licensing scope** (licensing-6):
  - `Cargo.toml` and the Spex package manifest `meta.yaml` count as configuration, and so do `CLAUDE.md` and `GEMINI.md`, like `AGENTS.md`.
  - In `spex-packages/contrib`, generated content is detected by: the `.slc`/`.slc-verify` build directories, esbuild bundles, the targets named in `.slc/builds/*/manifest.json`, and files marked `Generated by` (e.g., `contrib.ts`, `*.test.ts`, `contrib.registry.ts`).
  - Read as in scope instead, `Cargo.toml` and `meta.yaml` would also fail licensing-3 and licensing-4.
- **Merge commit** `5e70f1c` (`Merge pull request #2 ...`) was made by the hosting service and does not follow the git-2 subject format.
  The git audit skips merge commits (`--no-merges`), since git.md does not say whether service-generated merges are in scope.
- **Identity audit** (git-1) compares the latest non-merge commit with the local `git config`, so it only holds where that commit's author runs the suite.
- **Derived traits** (meta-34): `Graph` derives `Debug`, `Clone`, and `Default`, so `Graph::default()` and `clone()` are public behavior that `graph.md` does not mention.
  `meta_34_packages_are_complete_and_exact` checks declared public items only and does not flag this.
- **Audit corrections**<a id="audit-corrections"></a> (first audit round of commit `7f9938d`):
  - `meta_28` had failed by asserting that every spec item an IR's Verification names is verified by a package test item.
    meta-28 does not require that.
    IR-000's placeholder check on licensing-9 is a task-completion check, and `licensing_9_own_files_use_project_license_and_holder` already asserts it, so `7f9938d`'s claim that IR-000 holds the only check of licensing-9 was wrong.
    The test now asserts that no IR states its own behavior, and it passes.
  - `meta_13` had asserted only parts of meta-30, meta-11, and meta-14; it now checks that no subject is defined by two packages.
  - `meta_21` now requires the item ID to be mentioned in a test file that defines a `#[test]`.
  - The matrix now discloses that meta-21's realization check works by ID mention, and that meta-32 has no instance here and is checked by keyword proxies only.
- **Tool dependencies**: `licensing_headers`, `spec_tree`, and `spec_rules` need the Spex CLI (`spex` on PATH or `SPEX_BIN`), and the git, licensing, and `spec_rules` tests need a full git clone.
  These tests fail, rather than skip, when either is missing.
- **Fault detection** was spot-checked by temporary mutations, reverted before the recorded run:
  - making `add_edge` one-directional failed `graph_3` and `graph_5`;
  - ignoring out-of-range `add_edge` failed `graph_1` and `graph_4`;
  - an untracked header-less `.md` failed `licensing_3`, `_4`, and `_9`;
  - a malformed pending message failed three `git_6_*` tests;
  - overriding `GIT_AUTHOR_NAME` failed `git_6_commit_records_configured_identity`;
  - one spec mutation per new rule failed each corresponding `spec_rules` test (meta-12 and meta-35 by their fixtures):
    - a Given clause in graph-6 failed `meta_7`;
    - a bare `licensing-6` mention in licensing-1 failed `meta_8`;
    - a citation of git-6 (a Verification item) from graph-1 failed `meta_15` and, via `spex lint` on the IR-less copy, `meta_28`;
    - git-1 defining behavior of `the graph` failed `meta_13`;
    - dropping the `graph-6` mention from `tests/shortest_path.rs`, or its `#[test]`, failed `meta_21`;
    - a `shall` statement in IR-000, and a citation of an undefined item from it, each failed `meta_28`;
    - removing `git.md` from `map.md` failed `meta_23`;
    - a `src/lib.rs` path in DR-000 failed `meta_24`;
    - "mock" in git-6 failed `meta_32`;
    - an unspecified `pub fn` in `src/lib.rs`, and a restated graph-1 statement, each failed `meta_34`.
