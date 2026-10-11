// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: 2026 Gamma Sublang <gamma@sublang.ai>

//! Verifies the specs tree against the specs/meta.md items that `spex lint`
//! does not check: meta-7, meta-8, meta-12, meta-13, meta-15, meta-21,
//! meta-23, meta-24, meta-28, meta-32, meta-34, and meta-35.
//!
//! Each test checks the mechanically decidable part of its item on this
//! repository. Where the rule has no instance here (meta-12, meta-35), the
//! checker also runs on constructed fixtures, so that it is shown to reject
//! violations.
//!
//! Requires `git` and the Spex CLI (`spex` on PATH, or `SPEX_BIN`).

use std::collections::{BTreeMap, BTreeSet};
use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;

fn root() -> &'static Path {
    Path::new(env!("CARGO_MANIFEST_DIR"))
}

fn rel(path: &Path) -> String {
    path.strip_prefix(root()).unwrap_or(path).to_string_lossy().replace('\\', "/")
}

fn md_files(dir: &Path) -> Vec<PathBuf> {
    let mut files = Vec::new();
    let mut stack = vec![dir.to_path_buf()];
    while let Some(d) = stack.pop() {
        let Ok(entries) = fs::read_dir(&d) else { continue };
        for entry in entries {
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

fn package_files() -> Vec<PathBuf> {
    md_files(&root().join("specs/packages"))
}

/// Files that contain spec items: meta.md and the packages.
fn item_files() -> Vec<PathBuf> {
    let mut files = vec![root().join("specs/meta.md")];
    files.extend(package_files());
    files
}

fn pack_of(path: &Path) -> String {
    path.file_stem().unwrap().to_string_lossy().into_owned()
}

fn is_item_id(id: &str) -> bool {
    id.rsplit_once('-').is_some_and(|(pack, n)| {
        !pack.is_empty() && !n.is_empty() && n.chars().all(|c| c.is_ascii_digit())
    })
}

#[derive(Debug, Clone)]
struct Item {
    file: String,
    pack: String,
    id: String,
    section: String,
    /// The GEARS statement: the first non-empty line of the item.
    statement: String,
    /// Everything under the item heading, attachments included.
    body: String,
}

/// `## ` sections of a Markdown text, outside code fences.
fn sections(text: &str) -> Vec<(String, String)> {
    let mut out: Vec<(String, String)> = Vec::new();
    let mut fenced = false;
    for line in text.lines() {
        if line.trim_start().starts_with("```") {
            fenced = !fenced;
        }
        if !fenced {
            if let Some(h) = line.strip_prefix("## ") {
                out.push((h.trim().to_owned(), String::new()));
                continue;
            }
        }
        if let Some((_, body)) = out.last_mut() {
            body.push_str(line);
            body.push('\n');
        }
    }
    out
}

fn section<'a>(text: &'a str, name: &str) -> Option<String> {
    sections(text).into_iter().find(|(h, _)| h == name).map(|(_, b)| b)
}

fn items_in(path: &Path) -> Vec<Item> {
    let text = fs::read_to_string(path).unwrap();
    let mut items: Vec<Item> = Vec::new();
    let mut current_section = String::new();
    let mut fenced = false;
    let mut open: Option<Item> = None;
    for line in text.lines() {
        if line.trim_start().starts_with("```") {
            fenced = !fenced;
        }
        let heading = !fenced && (line.starts_with("## ") || line.starts_with("### "));
        if heading {
            if let Some(item) = open.take() {
                items.push(item);
            }
            if let Some(h) = line.strip_prefix("## ") {
                current_section = h.trim().to_owned();
            } else if let Some(id) = line.strip_prefix("### ").map(str::trim) {
                if is_item_id(id) {
                    open = Some(Item {
                        file: rel(path),
                        pack: pack_of(path),
                        id: id.to_owned(),
                        section: current_section.clone(),
                        statement: String::new(),
                        body: String::new(),
                    });
                }
            }
            continue;
        }
        if let Some(item) = open.as_mut() {
            if item.statement.is_empty() && !line.trim().is_empty() {
                item.statement = line.trim().to_owned();
            }
            item.body.push_str(line);
            item.body.push('\n');
        }
    }
    if let Some(item) = open {
        items.push(item);
    }
    items
}

fn all_items() -> Vec<Item> {
    item_files().iter().flat_map(|p| items_in(p)).collect()
}

/// Markdown links `[text](url)` as (start, end, text, url) byte ranges.
fn links(text: &str) -> Vec<(usize, usize, String, String)> {
    let mut out = Vec::new();
    let mut from = 0;
    while let Some(mid) = text[from..].find("](").map(|i| i + from) {
        let Some(open) = text[..mid].rfind('[') else { from = mid + 2; continue };
        let Some(close) = text[mid + 2..].find(')').map(|i| i + mid + 2) else { break };
        out.push((open, close + 1, text[open + 1..mid].to_owned(), text[mid + 2..close].to_owned()));
        from = close + 1;
    }
    out
}

/// The text with citations `[[x](u)]` removed, other links reduced to their
/// text, and code spans replaced by a placeholder word.
fn plain(text: &str) -> String {
    let mut s = text.to_owned();
    while let Some(start) = s.find("[[") {
        let Some(end) = s[start..].find(")]").map(|i| i + start + 2) else { break };
        s.replace_range(start..end, "");
    }
    for (start, end, t, _) in links(&s).into_iter().rev() {
        s.replace_range(start..end, &t);
    }
    let mut out = String::new();
    let mut in_code = false;
    for c in s.chars() {
        if c == '`' {
            if !in_code {
                out.push_str("code");
            }
            in_code = !in_code;
        } else if !in_code {
            out.push(c);
        }
    }
    out
}

fn spex() -> String {
    std::env::var("SPEX_BIN").unwrap_or_else(|_| "spex".into())
}

fn run(cmd: &mut Command) -> String {
    let out = cmd.output().unwrap_or_else(|e| panic!("cannot run {cmd:?}: {e}"));
    assert!(out.status.success(), "{cmd:?} failed: {}", String::from_utf8_lossy(&out.stderr));
    String::from_utf8(out.stdout).unwrap()
}

fn temp_dir(tag: &str) -> PathBuf {
    let dir = std::env::temp_dir().join(format!("graph-crate-{tag}-{}", std::process::id()));
    let _ = fs::remove_dir_all(&dir);
    fs::create_dir_all(&dir).unwrap();
    dir
}

fn copy_tree(from: &Path, to: &Path) {
    fs::create_dir_all(to).unwrap();
    for entry in fs::read_dir(from).unwrap() {
        let path = entry.unwrap().path();
        let dest = to.join(path.file_name().unwrap());
        if path.is_dir() {
            copy_tree(&path, &dest);
        } else {
            fs::copy(&path, &dest).unwrap();
        }
    }
}

// ---------------------------------------------------------------- meta-7

/// meta-7: each test item maps Given to Where/While, When to its one When
/// trigger, and Then to its `shall` clause, in GEARS clause order.
#[test]
fn meta_7_test_items_map_gwt_to_gears_clauses() {
    let tests: Vec<Item> = all_items().into_iter().filter(|i| i.section == "Verification").collect();
    assert!(!tests.is_empty());
    let mut bad = Vec::new();
    for t in &tests {
        let s = plain(&t.statement).to_lowercase();
        let at = |kw: &str| -> Option<usize> {
            if s.starts_with(&format!("{kw} ")) {
                Some(0)
            } else {
                s.find(&format!(", {kw} "))
            }
        };
        let triggers = s.matches(", when ").count() + usize::from(s.starts_with("when "));
        let order: Vec<(&str, usize)> = ["where", "while", "when"]
            .into_iter()
            .filter_map(|kw| at(kw).map(|p| (kw, p)))
            .chain(s.find(" shall ").map(|p| ("shall", p)))
            .collect();
        let mut problems = Vec::new();
        if triggers != 1 {
            problems.push(format!("{triggers} When triggers, expected 1"));
        }
        if !order.iter().any(|(k, _)| *k == "shall") {
            problems.push("no shall clause".into());
        }
        if order.windows(2).any(|w| w[0].1 >= w[1].1) {
            problems.push(format!("clauses out of order: {order:?}"));
        }
        if s.starts_with("given ") || s.contains(", then ") || s.contains(" then the ") {
            problems.push("uses GWT keywords instead of GEARS clauses".into());
        }
        if !problems.is_empty() {
            bad.push(format!("{}: {}: {problems:?}", t.file, t.id));
        }
    }
    assert!(bad.is_empty(), "{bad:#?}");
}

// ---------------------------------------------------------------- meta-8

/// meta-8: every mention of another spec item or DR inside an item is an
/// explicit citation, never a bare ID.
#[test]
fn meta_8_items_cite_every_reliance() {
    let items = all_items();
    let mut ids: Vec<String> = items.iter().map(|i| i.id.clone()).collect();
    for dr in md_files(&root().join("specs/decisions")) {
        let num: String = pack_of(&dr).chars().take_while(char::is_ascii_digit).collect();
        ids.push(format!("DR-{num}"));
    }
    let mut bad = Vec::new();
    for item in &items {
        let b = item.body.as_str();
        for id in &ids {
            let mut from = 0;
            while let Some(pos) = b[from..].find(id.as_str()).map(|p| p + from) {
                from = pos + id.len();
                let before = b[..pos].chars().last();
                let after = &b[pos + id.len()..];
                let boundary_before = !before.is_some_and(|c| c.is_ascii_alphanumeric() || c == '-');
                let boundary_after = !after.chars().next().is_some_and(|c| c.is_ascii_alphanumeric());
                if !(boundary_before && boundary_after) {
                    continue;
                }
                let as_link_text = before == Some('[') && after.starts_with("](");
                let as_anchor = before == Some('#');
                if !(as_link_text || as_anchor) {
                    bad.push(format!("{}: {} mentions {id} without citing it", item.file, item.id));
                }
            }
        }
    }
    assert!(bad.is_empty(), "{bad:#?}");
}

// ---------------------------------------------------------------- meta-12

/// Item IDs by file basename (a file's identity, meta-10, meta-31).
fn ids_by_basename(files: impl IntoIterator<Item = (String, String)>) -> BTreeMap<String, BTreeSet<String>> {
    let mut map: BTreeMap<String, BTreeSet<String>> = BTreeMap::new();
    let dir = temp_dir("ids");
    for (path, text) in files {
        let base = path.rsplit('/').next().unwrap().to_owned();
        let tmp = dir.join(&base);
        fs::write(&tmp, text).unwrap();
        map.entry(base).or_default().extend(items_in(&tmp).into_iter().map(|i| i.id));
    }
    let _ = fs::remove_dir_all(&dir);
    map
}

/// IDs present in any tagged (released) specs tree but missing from the
/// working tree's file of the same basename.
fn released_id_violations(repo: &Path) -> Vec<String> {
    let git = |args: &[&str]| run(Command::new("git").current_dir(repo).args(args));
    let current = ids_by_basename(
        md_files(&repo.join("specs"))
            .into_iter()
            .map(|p| (p.to_string_lossy().into_owned(), fs::read_to_string(&p).unwrap())),
    );
    let mut bad = Vec::new();
    for tag in git(&["tag", "--list"]).lines() {
        let released = ids_by_basename(
            git(&["ls-tree", "-r", "--name-only", tag, "--", "specs"])
                .lines()
                .filter(|p| p.ends_with(".md"))
                .map(|p| (p.to_owned(), git(&["show", &format!("{tag}:{p}")]))),
        );
        for (base, ids) in released {
            for id in ids {
                if !current.get(&base).is_some_and(|now| now.contains(&id)) {
                    bad.push(format!("{tag}: {base}: released {id} is gone or renumbered"));
                }
            }
        }
    }
    bad
}

/// meta-12: every item ID in a released (tagged) specs tree is still bound
/// in the current tree; checked on this repo and on a fixture repo.
#[test]
fn meta_12_released_ids_stay_bound() {
    assert_eq!(released_id_violations(root()), Vec::<String>::new());

    // Fixture: release x-1 and x-2, then move, keep, and finally drop x-2.
    let dir = temp_dir("meta12");
    let git = |args: &[&str]| {
        run(Command::new("git")
            .current_dir(&dir)
            .args(["-c", "user.name=t", "-c", "user.email=t@t", "-c", "commit.gpgsign=false", "-c", "tag.gpgsign=false"])
            .args(args))
    };
    let pkg = |ids: &[&str]| -> String {
        ids.iter().map(|id| format!("### {id}\n\nThe system shall act.\n\n")).collect()
    };
    git(&["init", "-q", "."]);
    fs::create_dir_all(dir.join("specs/packages")).unwrap();
    fs::write(dir.join("specs/packages/x.md"), pkg(&["x-1", "x-2"])).unwrap();
    git(&["add", "-A"]);
    git(&["commit", "-qm", "release"]);
    git(&["tag", "v0.1.0"]);
    assert!(released_id_violations(&dir).is_empty(), "unchanged tree");

    // Moving the file into a collection keeps its identity (meta-31).
    fs::create_dir_all(dir.join("specs/packages/coll")).unwrap();
    fs::rename(dir.join("specs/packages/x.md"), dir.join("specs/packages/coll/x.md")).unwrap();
    assert!(released_id_violations(&dir).is_empty(), "moved file");

    // An added item is fine; a dropped released ID is not.
    fs::write(dir.join("specs/packages/coll/x.md"), pkg(&["x-1", "x-3"])).unwrap();
    let bad = released_id_violations(&dir);
    let _ = fs::remove_dir_all(&dir);
    assert_eq!(bad, vec!["v0.1.0: x.md: released x-2 is gone or renumbered".to_owned()]);
}

// ---------------------------------------------------------------- meta-13

/// meta-13: each package has an Intent, defines only items of its own pack,
/// and reaches into a peer only through that peer's External Behavior.
#[test]
fn meta_13_packages_define_closed_subject_sets() {
    let items = all_items();
    let section_of: BTreeMap<(String, String), String> = items
        .iter()
        .map(|i| ((i.pack.clone(), i.id.clone()), i.section.clone()))
        .collect();
    let mut bad = Vec::new();
    for path in package_files() {
        let pack = pack_of(&path);
        let text = fs::read_to_string(&path).unwrap();
        let intent = section(&text, "Intent").unwrap_or_default();
        if plain(&intent).trim().is_empty() {
            bad.push(format!("{}: no Intent", rel(&path)));
        }
        for line in text.lines() {
            if let Some(h) = line.strip_prefix("### ") {
                let h = h.trim();
                if h.rsplit_once('-').map(|(p, _)| p) != Some(pack.as_str()) && is_item_id(h) {
                    bad.push(format!("{}: defines foreign item {h}", rel(&path)));
                }
            }
        }
        for (_, _, _, url) in links(&text) {
            let Some((file, anchor)) = url.split_once('#') else { continue };
            if file.is_empty() || !file.ends_with(".md") {
                continue;
            }
            let peer = file.rsplit('/').next().unwrap().trim_end_matches(".md").to_owned();
            if peer == pack || peer == "meta" {
                continue;
            }
            match section_of.get(&(peer.clone(), anchor.to_owned())) {
                Some(s) if s == "External Behavior" => {}
                other => bad.push(format!("{}: cites {peer}#{anchor} in {other:?}", rel(&path))),
            }
        }
    }
    assert!(bad.is_empty(), "{bad:#?}");
}

// ---------------------------------------------------------------- meta-15

/// meta-15: with every citation stripped, no package sentence is left
/// pointing at a link (a dangling `see`/`per`/`in`/... before punctuation),
/// and no package relies on a non-citation link to another file.
#[test]
fn meta_15_packages_stand_alone_without_links() {
    const DANGLING: [&str; 10] = ["see", "per", "in", "by", "of", "to", "from", "under", "following", "below"];
    let mut bad = Vec::new();
    for path in package_files() {
        let text = fs::read_to_string(&path).unwrap();
        let mut fenced = false;
        for (n, line) in text.lines().enumerate() {
            if line.trim_start().starts_with("```") {
                fenced = !fenced;
            }
            if fenced || line.starts_with('#') || line.starts_with("[") {
                continue;
            }
            for (_, _, t, url) in links(line) {
                let citation = is_item_id(&t) || t.starts_with("DR-") || t.chars().all(|c| c.is_ascii_digit());
                if !citation && !url.starts_with("http") {
                    bad.push(format!("{}:{}: non-citation link [{t}]({url})", rel(&path), n + 1));
                }
            }
            let s = plain(line).to_lowercase();
            let words: Vec<&str> = s.split_whitespace().collect();
            for w in words.windows(2) {
                let ends_clause = w[1].starts_with([',', '.', ';', ':']);
                if DANGLING.contains(&w[0]) && ends_clause {
                    bad.push(format!("{}:{}: `{} {}` relies on a stripped citation", rel(&path), n + 1, w[0], w[1]));
                }
            }
            if let Some(last) = words.last() {
                if DANGLING.contains(&last.trim_end_matches([',', '.', ';', ':'])) && last.ends_with(['.', ':', ',']) {
                    bad.push(format!("{}:{}: ends on `{last}`", rel(&path), n + 1));
                }
            }
        }
    }
    assert!(bad.is_empty(), "{bad:#?}");
}

// ---------------------------------------------------------------- meta-21

/// meta-21: no spec test item specifies a unit test, and every package test
/// item is realized by an integration or system test under `tests/`.
#[test]
fn meta_21_spec_tests_are_integration_or_system() {
    let tests: Vec<Item> = all_items()
        .into_iter()
        .filter(|i| i.section == "Verification" && i.pack != "meta")
        .collect();
    assert!(!tests.is_empty());
    let sources: Vec<(String, String)> = fs::read_dir(root().join("tests"))
        .unwrap()
        .map(|e| e.unwrap().path())
        .filter(|p| p.extension().is_some_and(|e| e == "rs") && pack_of(p) != "spec_rules")
        .map(|p| (rel(&p), fs::read_to_string(&p).unwrap()))
        .collect();
    let mut bad = Vec::new();
    for t in &tests {
        let lower = t.body.to_lowercase();
        for marker in ["unit test", "#[cfg(test)]", "private function", "internal function"] {
            if lower.contains(marker) {
                bad.push(format!("{}: {} specifies `{marker}`", t.file, t.id));
            }
        }
        let realized = sources.iter().any(|(_, src)| {
            src.match_indices(t.id.as_str()).any(|(p, _)| {
                !src[p + t.id.len()..].starts_with(|c: char| c.is_ascii_digit())
            })
        });
        if !realized {
            bad.push(format!("{}: {} has no test under tests/", t.file, t.id));
        }
    }
    assert!(bad.is_empty(), "{bad:#?}");
}

// ---------------------------------------------------------------- meta-23

fn link_targets_in_section(map: &str, name: &str) -> Vec<String> {
    let body = section(map, name).unwrap_or_default();
    links(&body).into_iter().map(|(_, _, _, u)| u).collect()
}

/// meta-23: map.md indexes each DR and each package exactly once, and
/// nothing an agent does not need to find a file (no IRs, no item anchors).
#[test]
fn meta_23_map_indexes_only_needed_files() {
    let specs = root().join("specs");
    let map = fs::read_to_string(specs.join("map.md")).unwrap();
    let mut bad = Vec::new();

    let expect = |dir: &str| -> Vec<String> {
        let mut v: Vec<String> = md_files(&specs.join(dir))
            .iter()
            .map(|p| p.strip_prefix(&specs).unwrap().to_string_lossy().replace('\\', "/"))
            .collect();
        v.sort();
        v
    };
    for (heading, dir) in [("Decisions", "decisions"), ("Packages", "packages")] {
        let mut targets = link_targets_in_section(&map, heading);
        targets.retain(|t| t != &format!("{}.md", heading.to_lowercase()));
        let mut uniq = targets.clone();
        uniq.sort();
        uniq.dedup();
        if uniq.len() != targets.len() {
            bad.push(format!("{heading}: duplicate rows {targets:?}"));
        }
        if uniq != expect(dir) {
            bad.push(format!("{heading}: indexes {uniq:?}, files are {:?}", expect(dir)));
        }
    }
    for (_, _, t, url) in links(&map) {
        if url.contains('#') || url.starts_with("intents/") || url.contains("/intents/") {
            bad.push(format!("map links [{t}]({url}), which no agent needs to find a file"));
        }
        if !url.starts_with("http") && !specs.join(url.split('#').next().unwrap()).exists() {
            bad.push(format!("map links missing file {url}"));
        }
    }
    assert!(bad.is_empty(), "{bad:#?}");
}

// ---------------------------------------------------------------- meta-24

/// meta-24: each DR states decisions, not implementation details (no code
/// in a programming language, no paths into the implementation), and is
/// cited by the specs it gives context to.
#[test]
fn meta_24_drs_record_decisions_not_implementation() {
    const CODE_LANGS: [&str; 12] = ["rust", "rs", "ts", "typescript", "js", "javascript", "py", "python", "sh", "bash", "go", "java"];
    const IMPL_MARKERS: [&str; 7] = ["src/", "tests/", "Cargo.toml", ".rs`", ".ts`", ".js`", ".py`"];
    let drs = md_files(&root().join("specs/decisions"));
    assert!(!drs.is_empty());
    let citing: Vec<String> = item_files()
        .iter()
        .chain(md_files(&root().join("specs/decisions")).iter())
        .map(|p| fs::read_to_string(p).unwrap())
        .collect();
    let mut bad = Vec::new();
    for dr in &drs {
        let text = fs::read_to_string(dr).unwrap();
        for line in text.lines() {
            if let Some(lang) = line.trim_start().strip_prefix("```") {
                if CODE_LANGS.contains(&lang.trim()) {
                    bad.push(format!("{}: {lang} code block", rel(dr)));
                }
            }
            for m in IMPL_MARKERS {
                if line.contains(m) {
                    bad.push(format!("{}: implementation detail `{m}`: {line}", rel(dr)));
                }
            }
        }
        let file = dr.file_name().unwrap().to_string_lossy().into_owned();
        let cited = citing
            .iter()
            .filter(|t| *t != &text)
            .any(|t| links(t).iter().any(|(_, _, _, u)| u.ends_with(&file)));
        if !cited {
            bad.push(format!("{}: cited by no spec file", rel(dr)));
        }
    }
    assert!(bad.is_empty(), "{bad:#?}");
}

// ---------------------------------------------------------------- meta-28

/// meta-28: deleting every IR loses no spec: the specs tree still lints
/// clean, no IR defines a spec item or a section beyond meta-5's, and every
/// spec item an IR's Verification names is verified by a package test item.
#[test]
fn meta_28_irs_are_disposable() {
    let irs = md_files(&root().join("specs/intents"));
    let items = all_items();
    let mut bad = Vec::new();

    // Delete the IRs in a copy of the tree and lint it.
    let dir = temp_dir("meta28");
    copy_tree(&root().join("specs"), &dir.join("specs"));
    for ir in md_files(&dir.join("specs/intents")) {
        fs::remove_file(ir).unwrap();
    }
    let out = Command::new(spex()).arg("lint").arg(&dir).output().expect("spex runs");
    let stdout = String::from_utf8_lossy(&out.stdout).into_owned();
    let _ = fs::remove_dir_all(&dir);
    if !out.status.success() || !stdout.contains("no problems found") {
        bad.push(format!("specs without IRs fail lint:\n{stdout}"));
    }

    // The behaviors that some package test item cites.
    let verified: BTreeSet<String> = items
        .iter()
        .filter(|i| i.section == "Verification")
        .flat_map(|i| links(&i.body).into_iter().map(|(_, _, t, _)| t))
        .collect();
    let by_id: BTreeMap<&str, &Item> = items.iter().map(|i| (i.id.as_str(), i)).collect();

    for ir in &irs {
        let text = fs::read_to_string(ir).unwrap();
        for (h, _) in sections(&text) {
            if !["Status", "Intent", "Deliverables", "Tasks", "Verification"].contains(&h.as_str()) {
                bad.push(format!("{}: section `{h}` beyond meta-5", rel(ir)));
            }
        }
        if text.lines().any(|l| l.strip_prefix("### ").is_some_and(|h| is_item_id(h.trim()))) {
            bad.push(format!("{}: defines a spec item", rel(ir)));
        }
        let verification = section(&text, "Verification").unwrap_or_default();
        for (id, item) in &by_id {
            let named = verification.match_indices(id).any(|(p, _)| {
                let before = verification[..p].chars().last();
                let after = verification[p + id.len()..].chars().next();
                !before.is_some_and(|c| c.is_ascii_alphanumeric() || c == '-')
                    && !after.is_some_and(|c| c.is_ascii_alphanumeric())
            });
            if named && item.section != "Verification" && !verified.contains(*id) {
                bad.push(format!(
                    "{}: Verification checks {id}, which no {} test item verifies; deleting the IR loses that check",
                    rel(ir),
                    item.pack
                ));
            }
        }
    }
    assert!(bad.is_empty(), "{bad:#?}");
}

// ---------------------------------------------------------------- meta-32

/// meta-32: no spec test item prescribes a substitute, and the tests that
/// realize them run the real behaviors: no mocking dependency or test
/// double in `tests/`, and the git and licensing audits invoke real `git`
/// and real `spex`.
#[test]
fn meta_32_tests_run_real_behaviors() {
    const SUBSTITUTES: [&str; 6] = ["mock", "stub", "fake", "test double", "simulat", "substitut"];
    let mut bad = Vec::new();
    for t in all_items().into_iter().filter(|i| i.section == "Verification" && i.pack != "meta") {
        let lower = t.body.to_lowercase();
        for s in SUBSTITUTES {
            if lower.contains(s) {
                bad.push(format!("{}: {} prescribes `{s}`", t.file, t.id));
            }
        }
    }
    let cargo = fs::read_to_string(root().join("Cargo.toml")).unwrap();
    for s in ["mockall", "mockito", "faux", "wiremock"] {
        if cargo.contains(s) {
            bad.push(format!("Cargo.toml depends on {s}"));
        }
    }
    // This file names the substitutes it looks for, so it is skipped.
    let sources: BTreeMap<String, String> = fs::read_dir(root().join("tests"))
        .unwrap()
        .map(|e| e.unwrap().path())
        .filter(|p| p.extension().is_some_and(|e| e == "rs") && pack_of(p) != "spec_rules")
        .map(|p| (pack_of(&p), fs::read_to_string(&p).unwrap()))
        .collect();
    for (name, src) in &sources {
        let lower = src.to_lowercase();
        for s in SUBSTITUTES {
            if lower.contains(s) {
                bad.push(format!("tests/{name}.rs uses `{s}`"));
            }
        }
    }
    for (name, needle) in [
        ("git_conventions", "Command::new(\"git\")"),
        ("licensing_headers", "Command::new(\"git\")"),
        ("licensing_headers", "SPEX_BIN"),
        ("graph_spec", "use graph_crate::"),
        ("shortest_path", "use graph_crate::"),
    ] {
        if !sources.get(name).is_some_and(|s| s.contains(needle)) {
            bad.push(format!("tests/{name}.rs does not run the real behavior via `{needle}`"));
        }
    }
    assert!(bad.is_empty(), "{bad:#?}");
}

// ---------------------------------------------------------------- meta-34

/// Public items declared in `src/lib.rs`, outside the unit-test module.
fn public_api() -> BTreeSet<String> {
    let src = fs::read_to_string(root().join("src/lib.rs")).unwrap();
    let code = src.split("#[cfg(test)]").next().unwrap();
    code.lines()
        .filter_map(|l| {
            let l = l.trim_start();
            ["pub fn ", "pub struct ", "pub type ", "pub enum ", "pub trait ", "pub const ", "pub static ", "pub mod "]
                .iter()
                .find_map(|kw| l.strip_prefix(kw))
                .map(|rest| rest.split(|c: char| !(c.is_alphanumeric() || c == '_')).next().unwrap().to_owned())
        })
        .collect()
}

/// meta-34: no requirement is stated twice across the specs, and the graph
/// package is exact for the crate: every public item of `graph_crate` is a
/// subject the package names, and every API its Intent lists exists.
#[test]
fn meta_34_packages_are_complete_and_exact() {
    let mut bad = Vec::new();
    let mut seen: BTreeMap<String, String> = BTreeMap::new();
    for item in all_items() {
        let norm = plain(&item.statement).to_lowercase().split_whitespace().collect::<Vec<_>>().join(" ");
        if let Some(prev) = seen.insert(norm, item.id.clone()) {
            bad.push(format!("{} restates {prev}", item.id));
        }
    }

    let spec = fs::read_to_string(root().join("specs/packages/graph.md")).unwrap();
    let named: BTreeSet<String> = spec
        .split('`')
        .skip(1)
        .step_by(2)
        .flat_map(|code| code.split(|c: char| !(c.is_alphanumeric() || c == '_')).map(str::to_owned).collect::<Vec<_>>())
        .collect();
    let api = public_api();
    for name in &api {
        if !named.contains(name) {
            bad.push(format!("public `{name}` is not named by graph.md"));
        }
    }
    let intent = section(&spec, "Intent").unwrap();
    for name in intent.split('`').skip(1).step_by(2) {
        let last = name.rsplit("::").next().unwrap();
        if !api.contains(last) {
            bad.push(format!("graph.md Intent lists `{name}`, which the crate does not export"));
        }
    }
    assert!(!api.is_empty());
    assert!(bad.is_empty(), "{bad:#?}");
}

// ---------------------------------------------------------------- meta-35

/// Problems with the DR change links of meta-35 in a decisions directory.
fn dr_change_problems(dir: &Path) -> Vec<String> {
    const RECIPROCAL: [(&str, &str); 4] = [
        ("Superseded by", "Supersedes"),
        ("Supersedes", "Superseded by"),
        ("Amended by", "Amends"),
        ("Amends", "Amended by"),
    ];
    let status: BTreeMap<String, String> = md_files(dir)
        .iter()
        .map(|p| {
            let name = p.file_name().unwrap().to_string_lossy().into_owned();
            (name, section(&fs::read_to_string(p).unwrap(), "Status").unwrap_or_default())
        })
        .collect();
    let mut bad = Vec::new();
    for (file, st) in &status {
        for line in st.lines() {
            for (kw, back) in RECIPROCAL {
                if !line.contains(kw) {
                    continue;
                }
                let targets: Vec<String> = links(line).into_iter().map(|(_, _, _, u)| u).collect();
                if targets.is_empty() {
                    bad.push(format!("{file}: `{kw}` names no linked DR"));
                }
                for t in targets {
                    let t = t.rsplit('/').next().unwrap().to_owned();
                    match status.get(&t) {
                        None => bad.push(format!("{file}: `{kw}` links missing {t}")),
                        Some(other) => {
                            let linked_back = other
                                .lines()
                                .any(|l| l.contains(back) && links(l).iter().any(|(_, _, _, u)| u.ends_with(file.as_str())));
                            if !linked_back {
                                bad.push(format!("{file}: {t} does not link back with `{back}`"));
                            }
                        }
                    }
                }
                if kw.starts_with("Amend") {
                    let rest = plain(line).replace(kw, "");
                    if rest.split_whitespace().filter(|w| w.chars().any(char::is_alphanumeric)).count() < 2 {
                        bad.push(format!("{file}: `{kw}` states no affected scope"));
                    }
                }
            }
        }
        if st.contains("Superseded by") && st.contains("Accepted") {
            bad.push(format!("{file}: superseded but still Accepted"));
        }
        if st.contains("Amended by") && !st.contains("Accepted") {
            bad.push(format!("{file}: amended but no longer Accepted"));
        }
    }
    bad
}

/// meta-35: changed DRs are linked both ways in their Status sections,
/// with the affected scope; checked on this repo and on fixtures.
#[test]
fn meta_35_dr_changes_link_both_records() {
    assert_eq!(dr_change_problems(&root().join("specs/decisions")), Vec::<String>::new());

    let dir = temp_dir("meta35");
    let write = |a: &str, b: &str| {
        let dr = |s: &str| format!("# DR\n\n## Status\n\n{s}\n\n## Context\n\nc\n");
        fs::write(dir.join("000-a.md"), dr(a)).unwrap();
        fs::write(dir.join("001-b.md"), dr(b)).unwrap();
        dr_change_problems(&dir)
    };
    let ok_supersede = write("Superseded by [DR-001](001-b.md)", "Accepted\n\nSupersedes [DR-000](000-a.md)");
    let ok_amend = write(
        "Accepted\n\nAmended by [DR-001](001-b.md) for the citation format",
        "Accepted\n\nAmends [DR-000](000-a.md) for the citation format",
    );
    let no_backlink = write("Superseded by [DR-001](001-b.md)", "Accepted");
    let still_accepted = write("Accepted\n\nSuperseded by [DR-001](001-b.md)", "Accepted\n\nSupersedes [DR-000](000-a.md)");
    let no_scope = write("Accepted\n\nAmended by [DR-001](001-b.md)", "Accepted\n\nAmends [DR-000](000-a.md)");
    let _ = fs::remove_dir_all(&dir);

    assert!(ok_supersede.is_empty(), "{ok_supersede:?}");
    assert!(ok_amend.is_empty(), "{ok_amend:?}");
    assert!(no_backlink.iter().any(|p| p.contains("does not link back")), "{no_backlink:?}");
    assert!(still_accepted.iter().any(|p| p.contains("still Accepted")), "{still_accepted:?}");
    assert!(no_scope.iter().any(|p| p.contains("no affected scope")), "{no_scope:?}");
}
