// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: 2026 Gamma Sublang <gamma@sublang.ai>

//! Verifies git-6 in specs/packages/git.md: audits prepared commits against
//! git-1 through git-5.
//!
//! Audited commits: every non-merge commit reachable from HEAD, plus, when
//! `GIT_AUDIT_MESSAGE_FILE` names a file, the pending AI-assisted commit
//! whose message is in that file and whose changes are staged.
//! Requires `git` and a full (non-shallow) clone.

use std::process::{Command, Stdio};
use std::io::Write;

const TYPES: [&str; 10] = [
    "feat", "fix", "docs", "style", "refactor", "test", "ci", "build", "perf", "chore",
];
const ROLES: [&str; 3] = ["coder", "reviewer", "maintainer"];
const AI_EMAIL: &str = "<cligent@sublang.ai>";

fn git_stdin(args: &[&str], stdin: Option<&str>) -> String {
    let mut child = Command::new("git")
        .current_dir(env!("CARGO_MANIFEST_DIR"))
        .args(args)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .expect("git is runnable");
    if let Some(input) = stdin {
        child.stdin.take().unwrap().write_all(input.as_bytes()).unwrap();
    }
    drop(child.stdin.take());
    let out = child.wait_with_output().unwrap();
    assert!(out.status.success(), "git {args:?}: {}", String::from_utf8_lossy(&out.stderr));
    String::from_utf8(out.stdout).unwrap()
}

fn git(args: &[&str]) -> String {
    git_stdin(args, None)
}

struct Audited {
    label: String,
    message: String,
    /// Paths of intent records whose deliverables this commit checks off.
    realized_irs: Vec<String>,
    ai_assisted_known: bool,
}

/// Intent records with a deliverable checkbox newly checked in `diff`.
fn realized_irs(diff: &str) -> Vec<String> {
    let mut irs = Vec::new();
    let mut current = None;
    for line in diff.lines() {
        if let Some(path) = line.strip_prefix("+++ b/") {
            current = Some(path.to_owned());
        } else if line.starts_with("+- [x]") || line.starts_with("+- [X]") {
            if let Some(p) = &current {
                if !irs.contains(p) {
                    irs.push(p.clone());
                }
            }
        }
    }
    irs
}

fn audited_commits() -> Vec<Audited> {
    let mut all: Vec<Audited> = git(&["rev-list", "--no-merges", "HEAD"])
        .lines()
        .map(|rev| Audited {
            label: rev[..7].to_owned(),
            message: git(&["log", "-1", "--format=%B", rev]),
            realized_irs: realized_irs(&git(&["show", "--format=", "-U0", rev, "--", "specs/intents/"])),
            ai_assisted_known: false,
        })
        .collect();
    if let Ok(path) = std::env::var("GIT_AUDIT_MESSAGE_FILE") {
        all.push(Audited {
            label: "pending".into(),
            message: std::fs::read_to_string(&path).expect("GIT_AUDIT_MESSAGE_FILE is readable"),
            realized_irs: realized_irs(&git(&["diff", "--cached", "-U0", "--", "specs/intents/"])),
            ai_assisted_known: true,
        });
    }
    assert!(!all.is_empty());
    all
}

fn subject(message: &str) -> &str {
    message.lines().next().unwrap_or("")
}

/// Body lines: everything after the subject's blank separator line.
fn body(message: &str) -> Vec<&str> {
    let lines: Vec<&str> = message.trim_end().lines().collect();
    if lines.len() > 2 {
        lines[2..].to_vec()
    } else {
        Vec::new()
    }
}

/// Checks `<type>(<scope>)<!>: <subject>`; returns the `<subject>` part.
fn check_subject(line: &str) -> Result<&str, String> {
    let (head, text) = line.split_once(": ").ok_or("no `: ` separator")?;
    let head = head.strip_suffix('!').unwrap_or(head);
    let ty = match head.split_once('(') {
        Some((ty, scope)) => {
            let scope = scope.strip_suffix(')').ok_or("unclosed scope")?;
            if scope.is_empty() || scope.contains(['(', ')', ' ']) {
                return Err(format!("bad scope `{scope}`"));
            }
            ty
        }
        None => head,
    };
    if !TYPES.contains(&ty) {
        return Err(format!("type `{ty}` not allowed"));
    }
    if text.is_empty() || text.chars().count() > 50 {
        return Err(format!("subject length {} not in 1..=50", text.chars().count()));
    }
    if text.ends_with('.') {
        return Err("trailing period".into());
    }
    let first = text.split_whitespace().next().unwrap_or("").to_ascii_lowercase();
    let non_imperative = first.ends_with("ed")
        || first.ends_with("ing")
        || (first.ends_with('s') && !["ss", "us", "is"].iter().any(|e| first.ends_with(e)));
    if non_imperative {
        return Err(format!("`{first}` is not imperative"));
    }
    Ok(text)
}

fn check_co_author(value: &str) -> Result<(), String> {
    let rest = value.strip_suffix(AI_EMAIL).and_then(|r| r.strip_suffix(' '));
    let rest = rest.ok_or(format!("`{value}` does not end with {AI_EMAIL}"))?;
    let (model, role) = rest
        .strip_suffix(')')
        .and_then(|r| r.rsplit_once(" ("))
        .ok_or(format!("`{value}` lacks ` (<role>)`"))?;
    if model.trim().is_empty() {
        return Err(format!("`{value}` lacks a model"));
    }
    if !ROLES.contains(&role) {
        return Err(format!("role `{role}` not allowed"));
    }
    Ok(())
}

/// git-6 / git-1: the audited commit records the configured identity.
#[test]
fn git_6_commit_records_configured_identity() {
    let name = git(&["config", "user.name"]).trim().to_owned();
    let email = git(&["config", "user.email"]).trim().to_owned();
    assert!(!name.is_empty() && !email.is_empty(), "user.name and user.email must be configured");
    let configured = format!("{name} <{email}>");

    // The latest committed, prepared commit (merges made by a hosting
    // service are not prepared by the commit workflow).
    let head = git(&["rev-list", "--no-merges", "-1", "HEAD"]);
    let ident = git(&["log", "-1", "--format=%an <%ae>%n%cn <%ce>", head.trim()]);
    let ident: Vec<&str> = ident.lines().collect();
    assert_eq!(ident, vec![&configured[..], &configured[..]], "author/committer of {}", head.trim());

    // The pending commit: the identity Git will record for it.
    if std::env::var("GIT_AUDIT_MESSAGE_FILE").is_ok() {
        for var in ["GIT_AUTHOR_IDENT", "GIT_COMMITTER_IDENT"] {
            let ident = git(&["var", var]);
            assert!(
                ident.starts_with(&format!("{configured} ")),
                "pending {var} `{}` is not {configured}",
                ident.trim()
            );
        }
    }
}

/// git-6 / git-2: each subject follows `<type>(<scope>)<!>: <subject>`.
#[test]
fn git_6_subject_follows_conventional_format() {
    let bad: Vec<String> = audited_commits()
        .iter()
        .filter_map(|c| check_subject(subject(&c.message)).err().map(|e| format!("{}: {e}", c.label)))
        .collect();
    assert!(bad.is_empty(), "{bad:?}");

    // The checker itself accepts and rejects the format's cases.
    for ok in ["feat: add x", "fix(graph): handle y", "refactor(api)!: drop z"] {
        assert!(check_subject(ok).is_ok(), "{ok}");
    }
    for bad in ["Add x", "feature: add x", "fix: add x.", "fix: added x", "fix(): add x",
                "fix: add a subject that is clearly much longer than fifty chars"] {
        assert!(check_subject(bad).is_err(), "{bad}");
    }
}

/// git-6 / git-3: any body is separated by a blank line and wrapped at 72.
#[test]
fn git_6_body_is_wrapped_at_72() {
    let mut bad = Vec::new();
    for c in audited_commits() {
        let lines: Vec<&str> = c.message.trim_end().lines().collect();
        if lines.len() > 1 && !lines[1].is_empty() {
            bad.push(format!("{}: no blank line after subject", c.label));
        }
        for line in body(&c.message) {
            if line.chars().count() > 72 {
                bad.push(format!("{}: {} chars: {line}", c.label, line.chars().count()));
            }
        }
    }
    assert!(bad.is_empty(), "{bad:?}");
}

/// git-6 / git-4: every `Co-authored-by` line sits in Git's parsed trailer
/// block in the prescribed format; a known AI-assisted commit has at least one.
#[test]
fn git_6_ai_co_author_trailers() {
    let mut bad = Vec::new();
    for c in audited_commits() {
        let parsed = git_stdin(&["interpret-trailers", "--parse"], Some(&c.message));
        let parsed_lines: Vec<&str> = parsed.lines().collect();
        let mentioned: Vec<&str> = c
            .message
            .lines()
            .filter(|l| l.to_ascii_lowercase().starts_with("co-authored-by"))
            .collect();
        for line in &mentioned {
            if !parsed_lines.contains(line) {
                bad.push(format!("{}: `{line}` is not in the final trailer block", c.label));
            }
        }
        let values: Vec<&str> = parsed_lines
            .iter()
            .filter_map(|l| l.split_once(": "))
            .filter(|(k, _)| k.eq_ignore_ascii_case("co-authored-by"))
            .map(|(k, v)| {
                if k != "Co-authored-by" {
                    bad.push(format!("{}: trailer key `{k}`", c.label));
                }
                v
            })
            .collect();
        for v in &values {
            if let Err(e) = check_co_author(v) {
                bad.push(format!("{}: {e}", c.label));
            }
        }
        if c.ai_assisted_known && values.is_empty() {
            bad.push(format!("{}: AI-assisted commit has no Co-authored-by trailer", c.label));
        }
    }
    assert!(bad.is_empty(), "{bad:?}");

    // A trailer separated by a blank line is not in Git's trailer block.
    let split = "fix: x\n\nBody.\n\nCo-authored-by: A (coder) <cligent@sublang.ai>\n\nSigned-off-by: B <b@x>\n";
    let parsed = git_stdin(&["interpret-trailers", "--parse"], Some(split));
    assert!(!parsed.contains("Co-authored-by"), "stranded trailer must not parse");
    for v in ["GPT-6 Sol (coder) <cligent@sublang.ai>", "Claude Opus 5.5 (reviewer) <cligent@sublang.ai>"] {
        assert!(check_co_author(v).is_ok(), "{v}");
    }
    for v in ["Claude <noreply@anthropic.com>", "X (tester) <cligent@sublang.ai>", " (coder) <cligent@sublang.ai>"] {
        assert!(check_co_author(v).is_err(), "{v}");
    }
}

/// git-6 / git-5: a commit that checks off an intent record's deliverables
/// references that record by its bare `IR-<N>` ID.
#[test]
fn git_6_intent_commits_reference_ir_id() {
    let mut bad = Vec::new();
    for c in audited_commits() {
        for path in &c.realized_irs {
            let file = path.rsplit('/').next().unwrap();
            let num: String = file.chars().take_while(char::is_ascii_digit).collect();
            let id = format!("IR-{num}");
            let referenced = c.message.split(|ch: char| !(ch.is_ascii_alphanumeric() || ch == '-'))
                .any(|w| w == id);
            if !referenced {
                bad.push(format!("{}: checks off {path} without referencing {id}", c.label));
            }
        }
    }
    assert!(bad.is_empty(), "{bad:?}");
}
