// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: 2026 Gamma Sublang <gamma@sublang.ai>

//! Verifies the specs tree against specs/meta.md: the Spex linter's
//! structure, ID, and citation rules, plus checks the linter does not make
//! (meta-6, meta-25, meta-27, meta-33).
//!
//! Requires the Spex CLI (`spex` on PATH, or `SPEX_BIN`).

use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;

fn root() -> &'static Path {
    Path::new(env!("CARGO_MANIFEST_DIR"))
}

fn spec_files() -> Vec<PathBuf> {
    let mut files = Vec::new();
    let mut stack = vec![root().join("specs")];
    while let Some(dir) = stack.pop() {
        for entry in fs::read_dir(dir).unwrap() {
            let path = entry.unwrap().path();
            if path.is_dir() {
                stack.push(path);
            } else if path.extension().is_some_and(|e| e == "md") {
                files.push(path);
            }
        }
    }
    files.sort();
    files
}

fn rel(path: &Path) -> String {
    path.strip_prefix(root()).unwrap().to_string_lossy().into_owned()
}

/// Lines outside fenced code blocks, with 1-based line numbers.
fn prose_lines(text: &str) -> Vec<(usize, &str)> {
    let mut fenced = false;
    text.lines()
        .enumerate()
        .filter_map(|(i, line)| {
            if line.trim_start().starts_with("```") {
                fenced = !fenced;
                return None;
            }
            (!fenced).then_some((i + 1, line))
        })
        .collect()
}

/// meta-1, meta-4, meta-5, meta-9, meta-10, meta-11, meta-14, meta-16,
/// meta-18, meta-19, meta-20, meta-22, meta-29, meta-30, meta-31: the Spex
/// linter reports no problem on the specs tree.
#[test]
fn spex_lint_reports_no_problems() {
    let spex = std::env::var("SPEX_BIN").unwrap_or_else(|_| "spex".into());
    let out = Command::new(&spex)
        .current_dir(root())
        .arg("lint")
        .output()
        .unwrap_or_else(|e| panic!("cannot run `{spex} lint`: {e}"));
    let stdout = String::from_utf8_lossy(&out.stdout);
    assert!(out.status.success(), "spex lint failed:\n{stdout}{}", String::from_utf8_lossy(&out.stderr));
    assert!(stdout.contains("no problems found"), "spex lint reported:\n{stdout}");
}

/// meta-25: one sentence per line outside lists, tables, and diagrams.
#[test]
fn meta_25_one_sentence_per_line() {
    let mut bad = Vec::new();
    for path in spec_files() {
        let text = fs::read_to_string(&path).unwrap();
        for (n, line) in prose_lines(&text) {
            let t = line.trim_start();
            let exempt = t.starts_with(['-', '*', '|', '#', '<', '>'])
                || t.split_once(". ").is_some_and(|(num, _)| num.chars().all(|c| c.is_ascii_digit()));
            if exempt {
                continue;
            }
            let cleaned = t.replace("e.g.", "eg").replace("i.e.", "ie").replace("etc.", "etc");
            let chars: Vec<char> = cleaned.chars().collect();
            let second_sentence = chars.windows(3).any(|w| {
                matches!(w[0], '.' | '!' | '?') && w[1] == ' ' && w[2].is_ascii_uppercase()
            });
            if second_sentence {
                bad.push(format!("{}:{n}: {line}", rel(&path)));
            }
        }
    }
    assert!(bad.is_empty(), "lines with more than one sentence: {bad:#?}");
}

/// meta-27: the declared authoring language is English, and spec content is
/// written in it (no CJK script).
#[test]
fn meta_27_spec_content_uses_declared_language() {
    let meta = fs::read_to_string(root().join("specs/meta.md")).unwrap();
    let declared: Vec<&str> = meta
        .lines()
        .filter_map(|l| l.strip_prefix("Authoring language: "))
        .collect();
    assert_eq!(declared, vec!["en"]);
    let cjk = |c: char| matches!(c as u32, 0x3040..=0x30FF | 0x3400..=0x9FFF | 0xAC00..=0xD7AF | 0xFF00..=0xFFEF);
    let bad: Vec<String> = spec_files()
        .iter()
        .flat_map(|p| {
            let text = fs::read_to_string(p).unwrap();
            text.lines()
                .enumerate()
                .filter(|(_, l)| l.chars().any(cjk))
                .map(|(i, l)| format!("{}:{}: {l}", rel(p), i + 1))
                .collect::<Vec<_>>()
        })
        .collect();
    assert!(bad.is_empty(), "non-English spec content: {bad:#?}");
}

/// meta-33: each package's Verification section cites every behavior item of
/// that package.
#[test]
fn meta_33_every_behavior_is_verified() {
    let mut unverified = Vec::new();
    for path in spec_files().into_iter().filter(|p| rel(p).starts_with("specs/packages/")) {
        let text = fs::read_to_string(&path).unwrap();
        let mut section = String::new();
        let mut behaviors = Vec::new();
        let mut verification = String::new();
        for line in text.lines() {
            if let Some(h) = line.strip_prefix("## ") {
                section = h.trim().to_owned();
            } else if let Some(id) = line.strip_prefix("### ") {
                if section.ends_with("Behavior") {
                    behaviors.push(id.trim().to_owned());
                }
            } else if section == "Verification" {
                verification.push_str(line);
                verification.push('\n');
            }
        }
        for id in behaviors {
            if !verification.contains(&format!("[[{id}](#{id})]")) {
                unverified.push(format!("{}: {id}", rel(&path)));
            }
        }
    }
    assert!(unverified.is_empty(), "behaviors no Verification item cites: {unverified:?}");
}

/// meta-6: each spec item states its requirement as a GEARS statement whose
/// `shall` clause carries the required behavior.
#[test]
fn meta_6_items_state_a_shall_requirement() {
    let mut bad = Vec::new();
    for path in spec_files() {
        let text = fs::read_to_string(&path).unwrap();
        let mut lines = text.lines().peekable();
        while let Some(line) = lines.next() {
            let Some(id) = line.strip_prefix("### ") else { continue };
            let id = id.trim();
            let is_item = id.rsplit_once('-').is_some_and(|(pack, n)| {
                !pack.is_empty() && n.chars().all(|c| c.is_ascii_digit()) && !n.is_empty()
            });
            if !is_item {
                continue;
            }
            while lines.peek().is_some_and(|l| l.trim().is_empty()) {
                lines.next();
            }
            let statement = lines.next().unwrap_or("");
            if !statement.contains(" shall ") {
                bad.push(format!("{}: {id}: {statement}", rel(&path)));
            }
        }
    }
    assert!(bad.is_empty(), "items without a `shall` statement: {bad:#?}");
}
