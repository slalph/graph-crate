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
- `SR` = `tests/spec_rules.rs`
- `UT` = `src/lib.rs::tests` (unit) and `DT` = the doc-test in `src/lib.rs`

## Summary

| Package | Items | Covered | Partial | Uncovered |
| --- | --- | --- | --- | --- |
| graph | 6 | 6 | 0 | 0 |
| git | 6 | 0 | 6 | 0 |
| licensing | 9 | 0 | 9 | 0 |
| meta | 31 | 6 | 25 | 0 |
| **Total** | **52** | **12** | **40** | **0** |

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
| git-1 | GC `git_6_commit_records_configured_identity` | ✅ | Partial | Asserts that `user.name` and `user.email` are configured and are the author and committer of the latest non-merge commit. For the pending commit, asserts that `git var GIT_AUTHOR_IDENT`/`GIT_COMMITTER_IDENT` resolve to them. Reporting the values, and refusing to commit when one is missing, belong to the agent commit workflow, which has no executable implementation in this repo |
| git-2 | GC `git_6_subject_follows_conventional_format` | ✅ | Partial | Type, scope, `!`, length, and no trailing period are exact; imperative mood is a heuristic on the first word |
| git-3 | GC `git_6_body_is_wrapped_at_72` | ✅ | Partial | Wrapping at 72 and the blank separator line are asserted; "what and why rather than how" and "bullets if clearer" are editorial judgments |
| git-4 | GC `git_6_ai_co_author_trailers` | ✅ | Partial | Every `Co-authored-by` line must be in Git's parsed trailer block, in the prescribed format; whether a past commit was AI-assisted is not recorded, so a required trailer's presence is asserted only for the pending, known AI-assisted commit |
| git-5 | GC `git_6_intent_commits_reference_ir_id` | ✅ | Partial | "Realizes a recorded intent" is detected as checking off an IR deliverable; no commit in history does so yet (IR-000 is Pending), so the history check is vacuous |
| git-6 | GC all five `git_6_*` tests | ✅ ✅ ✅ ✅ ✅ | Partial | Implements each audit assertion, limited as stated for git-1 to git-5 |

## licensing (`specs/packages/licensing.md`)

| Item | Tests | Result | Coverage | Gap |
| --- | --- | --- | --- | --- |
| licensing-1 | LH `licensing_3_in_scope_files_carry_copyright_header` | ❌ | Partial | Fails: `spex-packages/contrib/playbooks/en/contrib/contrib.md` has no `SPDX-FileCopyrightText`. The verdict depends on the licensing scope, which only the test implements (licensing-6). The scope reads `Cargo.toml`, `meta.yaml`, `CLAUDE.md`, and `GEMINI.md` as configuration, and `spex-packages/contrib` as the team's own package with only its slc/esbuild build output generated |
| licensing-2 | LH `licensing_4_in_scope_files_carry_license_header` | ❌ | Partial | Fails: `contrib.md` has no `SPDX-License-Identifier`. The verdict depends on the licensing scope, which only the test implements (licensing-6). The scope reads `Cargo.toml`, `meta.yaml`, `CLAUDE.md`, and `GEMINI.md` as configuration, and `spex-packages/contrib` as the team's own package with only its slc/esbuild build output generated |
| licensing-3 | LH `licensing_3_in_scope_files_carry_copyright_header` | ❌ | Partial | Fails on `contrib.md`, as for licensing-1; same scope dependency |
| licensing-4 | LH `licensing_4_in_scope_files_carry_license_header` | ❌ | Partial | Fails on `contrib.md`, as for licensing-2; same scope dependency |
| licensing-5 | LH `licensing_8_upstream_spdx_lines_are_preserved` | ✅ | Partial | Byte-for-byte preservation is asserted against a real `spex scaffold` for the upstream-derived files (upstream holder differs from the project's); no file in the repo has an upstream license that differs from the project's or is missing an upstream line, and inclusion preparation is an agent action with no executable implementation to run on a fixture |
| licensing-6 | LH `licensing_6_scope_excludes_exactly_the_listed_categories` | ✅ | Partial | The scope rule is encoded in the test and applied to the spec's examples and to this repo. Generated content is recognized by `.slc`/`.slc-verify` directories, esbuild bundles (`*.bundle.mjs`, `*.registry.mjs`), targets named in a Spex build manifest, and a `Generated by` marker. Package manifests (`Cargo.toml`, `meta.yaml`) and agent instruction files (`CLAUDE.md`, `GEMINI.md`) are read as configuration. No separate implementation of the classifier exists to exercise |
| licensing-7 | LH `licensing_7_detector_recognizes_license_patterns`, `licensing_4_in_scope_files_carry_license_header` | ✅ ✅ | Partial | Same as licensing-6: the detector exists only in the test, which checks every listed pattern and detects this repo's `LICENSE` |
| licensing-8 | LH `licensing_8_upstream_spdx_lines_are_preserved` | ✅ | Partial | Same gap as licensing-5: the "project license differs" precondition does not occur in this repo |
| licensing-9 | LH `licensing_9_own_files_use_project_license_and_holder` | ❌ | Partial | Fails: `contrib.md` carries no SPDX lines, so it does not name the project's license and holder. Same scope dependency as licensing-1. The spec itself has no Verification item for licensing-9 (see meta-33 and meta-28) |

## meta (`specs/meta.md`)

| Item | Tests | Result | Coverage | Gap |
| --- | --- | --- | --- | --- |
| meta-1 | ST `spex_lint_reports_no_problems` | ✅ | Partial | Lint rejects unknown entries, missing `map.md`/`meta.md`, and bad file names; it does not require the three subdirectories to exist |
| meta-23 | SR `meta_23_map_indexes_only_needed_files` | ✅ | Partial | Asserts that `map.md` indexes every DR and package file exactly once, links only existing files, and links no IR or item anchor; minimality and concision of spec content are editorial judgments |
| meta-25 | ST `meta_25_one_sentence_per_line` | ✅ | Partial | Sentence boundaries are detected heuristically (`. `/`! `/`? ` followed by a capital letter) |
| meta-4 | ST `spex_lint_reports_no_problems` | ✅ | Covered | — |
| meta-5 | ST `spex_lint_reports_no_problems` | ✅ | Partial | Lint checks section presence; checkboxes, numbered tasks, and one-commit sizing are not checked |
| meta-22 | ST `spex_lint_reports_no_problems` | ✅ | Covered | — |
| meta-24 | SR `meta_24_drs_record_decisions_not_implementation` | ✅ | Partial | Asserts that no DR holds programming-language code blocks or paths into the implementation (`src/`, `tests/`, `Cargo.toml`, source files), and that each DR is cited by another spec file; whether a DR suffices to audit its items is a judgment |
| meta-35 | SR `meta_35_dr_changes_link_both_records` | ✅ | Partial | Asserts that `Superseded by`/`Supersedes` and `Amended by`/`Amends` link both DRs' Status sections, that an amendment states its scope, that a superseded DR is no longer Accepted, and that an amended one still is. DR-000 is the only DR and is unchanged, so the repo check is vacuous; the checker rejects fixtures with a missing backlink, a superseded DR still Accepted, and an amendment without scope. Whether a change is substantive is a judgment |
| meta-28 | SR `meta_28_irs_are_disposable` | ❌ | Partial | Fails: IR-000's Verification checks that licensing-9 has no `<...>` placeholder, but no licensing test item verifies licensing-9, so deleting IR-000 loses that check. Also asserts that the specs tree lints clean with every IR deleted, and that no IR defines a spec item or a section beyond meta-5's; whether IR prose holds design content is a judgment |
| meta-6 | ST `meta_6_items_state_a_shall_requirement` | ✅ | Partial | Asserts each item states a `shall` requirement; GEARS clause order and natural-English punctuation are not parsed |
| meta-7 | SR `meta_7_test_items_map_gwt_to_gears_clauses` | ✅ | Partial | Asserts that each test item has exactly one When trigger and a `shall` clause, in Where, While, When, `shall` order, with no Given/Then keywords; whether the clause contents map to Given and Then is a judgment |
| meta-8 | SR `meta_8_items_cite_every_reliance` | ✅ | Partial | Asserts that every mention of a spec item or DR ID inside an item is a citation link; reliance expressed without naming an ID (e.g., "the licensing scope") is not detectable |
| meta-29 | ST `spex_lint_reports_no_problems` | ✅ | Partial | Lint warns on extra sentences in an item; "one requirement" is semantic |
| meta-13 | SR `meta_13_packages_define_closed_subject_sets` | ✅ | Partial | Asserts that each package has an Intent, defines only its own pack's items, and cites peers only at External Behavior items; whether the subject set is closed and the intent shared is a judgment |
| meta-34 | SR `meta_34_packages_are_complete_and_exact` | ✅ | Partial | Asserts that no two items state the same requirement (normalized exact match), that every public item declared in `src/lib.rs` is named by `graph.md`, and that every API the graph Intent lists exists. Not checked: reworded duplicates, gaps in `git` and `licensing` (which have no executable implementation), and derived trait impls (`Debug`, `Clone`, `Default` on `Graph`, which `graph.md` does not mention) |
| meta-9 | ST `spex_lint_reports_no_problems` | ✅ | Partial | Lint applies package rules to files under `packages/`; it does not require a package file to contain items |
| meta-30 | ST `spex_lint_reports_no_problems` | ✅ | Covered | — |
| meta-10 | ST `spex_lint_reports_no_problems` | ✅ | Covered | — |
| meta-11 | ST `spex_lint_reports_no_problems` | ✅ | Partial | Lint checks the ID form and uniqueness; "the lowest positive N not assigned or reserved" is not checked |
| meta-12 | SR `meta_12_released_ids_stay_bound` | ✅ | Partial | Asserts that every item ID in each tagged specs tree still exists in the current file with the same basename. The repo has no tag, so the repo check is vacuous; on a fixture repo the checker accepts a moved file and an added item and rejects a dropped released ID. Whether an evolved item keeps its concern is a judgment |
| meta-14 | ST `spex_lint_reports_no_problems` | ✅ | Partial | Lint rejects internal, prose, and metadata-line citations; binding "at the exact phrase" is a judgment |
| meta-15 | SR `meta_15_packages_stand_alone_without_links` | ✅ | Partial | With citations stripped, asserts that no package line is left dangling on a preposition before punctuation and that no package relies on a non-citation link to another file; whether a package reads in full without links is a judgment |
| meta-31 | ST `spex_lint_reports_no_problems` | ✅ | Partial | Lint checks kebab-case collection names; no collection subdirectory exists, so the rule is vacuous here |
| meta-21 | SR `meta_21_spec_tests_are_integration_or_system` | ✅ | Partial | Asserts that no package test item mentions unit tests or private or internal functions, and that each is realized by a test under `tests/` (integration or system); whether an item's scope is unit-sized is a judgment |
| meta-32 | SR `meta_32_tests_run_real_behaviors` | ✅ | Partial | Asserts that no package test item prescribes a substitute, that `tests/` has no mocking dependency or test double, and that the graph, git, and licensing tests run the real crate, `git`, and `spex`. The licensing scope and detector exist only in the tests (licensing-6, licensing-7), which this check does not detect |
| meta-33 | ST `meta_33_every_behavior_is_verified` | ❌ | Partial | Fails: no Verification item in `licensing.md` cites licensing-9. The test checks for a same-package citation, the identification meta-20 prescribes; whether the citing item really verifies the behavior is a judgment |
| meta-16 | ST `spex_lint_reports_no_problems` | ✅ | Covered | — |
| meta-18 | ST `spex_lint_reports_no_problems` | ✅ | Covered | — |
| meta-19 | ST `spex_lint_reports_no_problems` | ✅ | Partial | Lint requires each marker to resolve to a URL entry and flags unused entries; whether the source is authoritative is a judgment |
| meta-20 | ST `spex_lint_reports_no_problems` | ✅ | Partial | Lint requires same-package inline citations; whether a test cites every behavior it verifies is a judgment |
| meta-27 | ST `meta_27_spec_content_uses_declared_language` | ✅ | Partial | The marker is checked exactly; English authoring is approximated by the absence of CJK script |
