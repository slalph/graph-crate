<!-- SPDX-License-Identifier: Apache-2.0 -->
<!-- SPDX-FileCopyrightText: 2026 Gamma Sublang <gamma@sublang.ai> -->

# Traceability Matrix

Maps every spec item under `specs/` to the tests that exercise it, with each test's result from the run recorded in [test-report.md](test-report.md).

## Legend

| Coverage | Meaning |
| --- | --- |
| Covered | Executable tests assert the item's whole requirement |
| Partial | Executable tests assert part of the requirement; the gap is stated |
| Uncovered | No executable test; the reason is stated |

Results: ✅ passed, ❌ failed.
All tests run with `cargo test`; the Spex linter runs inside `spec_tree::spex_lint_reports_no_problems`.
`src/lib.rs::tests::*` are the implementation's unit tests (meta-21) and are listed as supporting evidence only; each Covered item also has an integration test.

Test paths:

- `GS` = `tests/graph_spec.rs`
- `SP` = `tests/shortest_path.rs`
- `GC` = `tests/git_conventions.rs`
- `LH` = `tests/licensing_headers.rs`
- `ST` = `tests/spec_tree.rs`
- `UT` = `src/lib.rs::tests` (unit) and `DT` = the doc-test in `src/lib.rs`

## Summary

| Package | Items | Covered | Partial | Uncovered |
| --- | --- | --- | --- | --- |
| graph | 6 | 6 | 0 | 0 |
| git | 6 | 0 | 6 | 0 |
| licensing | 9 | 5 | 4 | 0 |
| meta | 31 | 8 | 11 | 12 |
| **Total** | **52** | **19** | **21** | **12** |

## graph (`specs/packages/graph.md`)

| Item | Tests | Result | Coverage | Gap |
| --- | --- | --- | --- | --- |
| graph-1 | GS `graph_1_new_graph_is_empty`; SP `shortest_path_through_public_api` | ✅ ✅ | Covered | — |
| graph-2 | GS `graph_2_add_node_returns_consecutive_ids`; SP `shortest_path_through_public_api`; UT `add_node_assigns_consecutive_ids` | ✅ ✅ ✅ | Covered | — |
| graph-3 | GS `graph_3_add_edge_connects_both_ways`; SP `shortest_path_through_public_api`; UT `edges_are_undirected` | ✅ ✅ ✅ | Covered | — |
| graph-4 | GS `graph_4_add_edge_with_unknown_node_panics`; SP `shortest_path_through_public_api`; UT `add_edge_to_unknown_node_panics` | ✅ ✅ ✅ | Covered | — |
| graph-5 | GS `graph_5_shortest_path_cases`; SP `shortest_path_through_public_api`; UT `path_to_self_is_single_node`, `picks_shortest_of_several_paths`, `handles_cycles_and_self_loops`, `unreachable_returns_none`, `unknown_node_returns_none`; DT `src/lib.rs - (line 8)` | ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ | Covered | — |
| graph-6 | SP `shortest_path_through_public_api` | ✅ | Covered | — |

## git (`specs/packages/git.md`)

| Item | Tests | Result | Coverage | Gap |
| --- | --- | --- | --- | --- |
| git-1 | GC `git_6_commit_records_configured_identity` | ✅ | Partial | Asserts that `user.name` and `user.email` are configured and recorded on the latest prepared commit; reporting the values and refusing to commit when one is missing belong to the agent commit workflow, which has no executable implementation in this repo |
| git-2 | GC `git_6_subject_follows_conventional_format` | ✅ | Partial | Type, scope, `!`, length, and no trailing period are exact; imperative mood is a heuristic on the first word |
| git-3 | GC `git_6_body_is_wrapped_at_72` | ✅ | Partial | Wrapping at 72 and the blank separator line are asserted; "what and why rather than how" and "bullets if clearer" are editorial judgments |
| git-4 | GC `git_6_ai_co_author_trailers` | ✅ | Partial | Every `Co-authored-by` line must be in Git's parsed trailer block, in the prescribed format; whether a past commit was AI-assisted is not recorded, so a required trailer's presence is asserted only for the pending, known AI-assisted commit |
| git-5 | GC `git_6_intent_commits_reference_ir_id` | ✅ | Partial | "Realizes a recorded intent" is detected as checking off an IR deliverable; no commit in history does so yet (IR-000 is Pending), so the history check is vacuous |
| git-6 | GC all five `git_6_*` tests | ✅ ✅ ✅ ✅ ✅ | Partial | Implements each audit assertion, limited as stated for git-1 to git-5 |

## licensing (`specs/packages/licensing.md`)

| Item | Tests | Result | Coverage | Gap |
| --- | --- | --- | --- | --- |
| licensing-1 | LH `licensing_3_in_scope_files_carry_copyright_header` | ✅ | Covered | — |
| licensing-2 | LH `licensing_4_in_scope_files_carry_license_header` | ✅ | Covered | — |
| licensing-3 | LH `licensing_3_in_scope_files_carry_copyright_header` | ✅ | Covered | — |
| licensing-4 | LH `licensing_4_in_scope_files_carry_license_header` | ✅ | Covered | — |
| licensing-5 | LH `licensing_8_upstream_spdx_lines_are_preserved` | ✅ | Partial | Byte-for-byte preservation is asserted against a real `spex scaffold` for the upstream-derived files (upstream holder differs from the project's); no file in the repo has an upstream license that differs from the project's or is missing an upstream line, and inclusion preparation is an agent action with no executable implementation to run on a fixture |
| licensing-6 | LH `licensing_6_scope_excludes_exactly_the_listed_categories` | ✅ | Partial | The scope rule is encoded in the test and applied to the spec's examples and to this repo; no separate implementation of the classifier exists to exercise |
| licensing-7 | LH `licensing_7_detector_recognizes_license_patterns`, `licensing_4_in_scope_files_carry_license_header` | ✅ ✅ | Partial | Same as licensing-6: the detector exists only in the test, which checks every listed pattern and detects this repo's `LICENSE` |
| licensing-8 | LH `licensing_8_upstream_spdx_lines_are_preserved` | ✅ | Partial | Same gap as licensing-5: the "project license differs" precondition does not occur in this repo |
| licensing-9 | LH `licensing_9_own_files_use_project_license_and_holder` | ✅ | Covered | — (the spec itself has no Verification item for licensing-9; see meta-33) |

## meta (`specs/meta.md`)

| Item | Tests | Result | Coverage | Gap |
| --- | --- | --- | --- | --- |
| meta-1 | ST `spex_lint_reports_no_problems` | ✅ | Partial | Lint rejects unknown entries, missing `map.md`/`meta.md`, and bad file names; it does not require the three subdirectories to exist |
| meta-23 | — | — | Uncovered | Minimality and concision are editorial judgments |
| meta-25 | ST `meta_25_one_sentence_per_line` | ✅ | Partial | Sentence boundaries are detected heuristically (`. `/`! `/`? ` followed by a capital letter) |
| meta-4 | ST `spex_lint_reports_no_problems` | ✅ | Covered | — |
| meta-5 | ST `spex_lint_reports_no_problems` | ✅ | Partial | Lint checks section presence; checkboxes, numbered tasks, and one-commit sizing are not checked |
| meta-22 | ST `spex_lint_reports_no_problems` | ✅ | Covered | — |
| meta-24 | — | — | Uncovered | Whether a DR holds decisions rather than implementation details is an editorial judgment |
| meta-35 | — | — | Uncovered | No accepted DR has been changed; the rule governs future DR changes and has no observable instance |
| meta-28 | — | — | Uncovered | Disposability of an IR is an editorial judgment |
| meta-6 | ST `meta_6_items_state_a_shall_requirement` | ✅ | Partial | Asserts each item states a `shall` requirement; GEARS clause order and natural-English punctuation are not parsed |
| meta-7 | — | — | Uncovered | Whether a test case "can be expressed" in GWT is a judgment |
| meta-8 | — | — | Uncovered | Whether every reliance is cited is a semantic judgment; lint checks only the citation form (meta-16) |
| meta-29 | ST `spex_lint_reports_no_problems` | ✅ | Partial | Lint warns on extra sentences in an item; "one requirement" is semantic |
| meta-13 | — | — | Uncovered | Closedness and shared intent of a package are judgments |
| meta-34 | — | — | Uncovered | Completeness and exactness of a package are judgments |
| meta-9 | ST `spex_lint_reports_no_problems` | ✅ | Partial | Lint applies package rules to files under `packages/`; it does not require a package file to contain items |
| meta-30 | ST `spex_lint_reports_no_problems` | ✅ | Covered | — |
| meta-10 | ST `spex_lint_reports_no_problems` | ✅ | Covered | — |
| meta-11 | ST `spex_lint_reports_no_problems` | ✅ | Partial | Lint checks the ID form and uniqueness; "the lowest positive N not assigned or reserved" is not checked |
| meta-12 | — | — | Uncovered | No public release exists (no tags), so no released ID can be checked |
| meta-14 | ST `spex_lint_reports_no_problems` | ✅ | Partial | Lint rejects internal, prose, and metadata-line citations; binding "at the exact phrase" is a judgment |
| meta-15 | — | — | Uncovered | Readability without following links is a judgment |
| meta-31 | ST `spex_lint_reports_no_problems` | ✅ | Partial | Lint checks kebab-case collection names; no collection subdirectory exists, so the rule is vacuous here |
| meta-21 | — | — | Uncovered | Whether a spec test item specifies a unit test is a judgment |
| meta-32 | — | — | Uncovered | Preferring real behaviors over substitutes is a judgment |
| meta-33 | ST `meta_33_every_behavior_is_verified` | ❌ | Covered | Fails: no Verification item in `licensing.md` cites licensing-9 |
| meta-16 | ST `spex_lint_reports_no_problems` | ✅ | Covered | — |
| meta-18 | ST `spex_lint_reports_no_problems` | ✅ | Covered | — |
| meta-19 | ST `spex_lint_reports_no_problems` | ✅ | Covered | — |
| meta-20 | ST `spex_lint_reports_no_problems` | ✅ | Partial | Lint requires same-package inline citations; whether a test cites every behavior it verifies is a judgment |
| meta-27 | ST `meta_27_spec_content_uses_declared_language` | ✅ | Partial | The marker is checked exactly; English authoring is approximated by the absence of CJK script |
