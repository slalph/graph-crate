// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: 2026 Gamma Sublang <gamma@sublang.ai>

//! Verifies specs/packages/licensing.md against this repository's files:
//! the scope and detector rules (licensing-6, licensing-7), the header checks
//! (licensing-3, licensing-4), upstream preservation (licensing-8), and the
//! project's own header format (licensing-9).
//!
//! Requires `git` and the Spex CLI (`spex` on PATH, or `SPEX_BIN`); the
//! upstream headers come from running `spex scaffold` in a temporary repo.

use std::collections::BTreeMap;
use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;
use std::sync::OnceLock;

const PROJECT_LICENSE: &str = "Apache-2.0";
const PROJECT_HOLDER: &str = "Gamma Sublang <gamma@sublang.ai>";

fn root() -> &'static Path {
    Path::new(env!("CARGO_MANIFEST_DIR"))
}

fn run(cmd: &mut Command) -> String {
    let out = cmd
        .output()
        .unwrap_or_else(|e| panic!("cannot run {cmd:?}: {e}"));
    assert!(
        out.status.success(),
        "{cmd:?} failed: {}",
        String::from_utf8_lossy(&out.stderr)
    );
    String::from_utf8(out.stdout).expect("utf-8 output")
}

fn git(args: &[&str]) -> String {
    run(Command::new("git").current_dir(root()).args(args))
}

/// Files that are git-tracked or `git add`-able (untracked, not ignored).
fn candidate_files() -> Vec<String> {
    let mut files: Vec<String> = git(&["ls-files"])
        .lines()
        .chain(git(&["ls-files", "--others", "--exclude-standard"]).lines())
        .map(str::to_owned)
        .filter(|p| root().join(p).is_file())
        .collect();
    files.sort();
    files.dedup();
    files
}

#[derive(Clone, Copy, Debug, PartialEq)]
enum Syntax {
    Slash,
    Hash,
    Html,
}

impl Syntax {
    fn line(self, text: &str) -> String {
        match self {
            Syntax::Slash => format!("// {text}"),
            Syntax::Hash => format!("# {text}"),
            Syntax::Html => format!("<!-- {text} -->"),
        }
    }
}

#[derive(Debug, PartialEq)]
enum Scope {
    In(Syntax),
    NoCommentSyntax,
    Configuration,
    GeneratedOrVendor,
    Legal,
}

/// The licensing scope of licensing-6, applied to a repo-relative path.
fn classify(path: &str, bytes: &[u8]) -> Scope {
    let parts: Vec<&str> = path.split('/').collect();
    let base = *parts.last().unwrap();
    let upper = base.to_ascii_uppercase();

    const VENDOR_DIRS: [&str; 6] = ["dist", "node_modules", "vendor", "target", "spex-packages", ".slc"];
    if parts[..parts.len() - 1].iter().any(|d| VENDOR_DIRS.contains(d)) {
        return Scope::GeneratedOrVendor;
    }
    if parts[0] == "LICENSES"
        || ["LICENSE", "LICENCE", "COPYING", "NOTICE"].iter().any(|p| upper.starts_with(p))
    {
        return Scope::Legal;
    }
    const CONFIG: [&str; 8] = [
        ".gitignore",
        ".gitattributes",
        ".editorconfig",
        "settings.json",
        "AGENTS.md",
        "CLAUDE.md",
        "GEMINI.md",
        "Cargo.toml",
    ];
    if CONFIG.contains(&base)
        || path.starts_with(".github/workflows/")
        || base.ends_with(".lock")
        || base == "package-lock.json"
    {
        return Scope::Configuration;
    }
    if bytes.contains(&0) {
        return Scope::NoCommentSyntax;
    }
    match base.rsplit_once('.').map(|(_, ext)| ext) {
        Some("rs" | "ts" | "js" | "mjs" | "cjs") => Scope::In(Syntax::Slash),
        Some("toml" | "yaml" | "yml" | "sh" | "py") => Scope::In(Syntax::Hash),
        Some("md") => Scope::In(Syntax::Html),
        _ => Scope::NoCommentSyntax,
    }
}

/// The license-file detector of licensing-7, applied to a root entry name.
fn is_license_entry(name: &str, is_dir: bool) -> bool {
    if is_dir {
        return name == "LICENSES";
    }
    ["LICENSE", "LICENCE", "COPYING"].iter().any(|stem| {
        name == *stem
            || name
                .strip_prefix(stem)
                .is_some_and(|rest| rest.starts_with('.') || rest.starts_with('-'))
    })
}

fn root_license_entries(dir: &Path) -> Vec<String> {
    let mut found: Vec<String> = fs::read_dir(dir)
        .unwrap()
        .map(|e| e.unwrap())
        .filter(|e| is_license_entry(&e.file_name().to_string_lossy(), e.path().is_dir()))
        .map(|e| e.file_name().to_string_lossy().into_owned())
        .collect();
    found.sort();
    found
}

/// The first comment block after any shebang.
fn first_comment_block(text: &str, syntax: Syntax) -> Vec<String> {
    let mut lines = text.lines().peekable();
    if lines.peek().is_some_and(|l| l.starts_with("#!")) {
        lines.next();
    }
    let mut block = Vec::new();
    let mut open = false;
    for line in lines {
        let t = line.trim_start();
        let is_comment = match syntax {
            Syntax::Slash => t.starts_with("//"),
            Syntax::Hash => t.starts_with('#'),
            Syntax::Html => {
                let starts = open || t.starts_with("<!--");
                if starts {
                    open = !t.contains("-->");
                }
                starts
            }
        };
        if !is_comment {
            break;
        }
        block.push(line.to_owned());
    }
    block
}

fn spdx_lines(block: &[String]) -> Vec<String> {
    block.iter().filter(|l| l.contains("SPDX-")).cloned().collect()
}

struct InScopeFile {
    path: String,
    syntax: Syntax,
    text: String,
}

fn in_scope_files() -> Vec<InScopeFile> {
    candidate_files()
        .into_iter()
        .filter_map(|path| {
            let bytes = fs::read(root().join(&path)).unwrap();
            match classify(&path, &bytes) {
                Scope::In(syntax) => Some(InScopeFile {
                    path,
                    syntax,
                    text: String::from_utf8(bytes).expect("in-scope file is utf-8"),
                }),
                _ => None,
            }
        })
        .collect()
}

/// Upstream SPDX lines by repo-relative path, from a real `spex scaffold`.
fn upstream_spdx() -> &'static BTreeMap<String, Vec<String>> {
    static UPSTREAM: OnceLock<BTreeMap<String, Vec<String>>> = OnceLock::new();
    UPSTREAM.get_or_init(|| {
        let spex = std::env::var("SPEX_BIN").unwrap_or_else(|_| "spex".into());
        let dir = std::env::temp_dir().join(format!("graph-crate-scaffold-{}", std::process::id()));
        let _ = fs::remove_dir_all(&dir);
        fs::create_dir_all(&dir).unwrap();
        run(Command::new("git").current_dir(&dir).args(["init", "-q", "."]));
        run(Command::new(&spex).current_dir(&dir).args(["scaffold", "."]));
        let mut map = BTreeMap::new();
        let mut stack: Vec<PathBuf> = vec![dir.clone()];
        while let Some(p) = stack.pop() {
            for entry in fs::read_dir(&p).unwrap() {
                let path = entry.unwrap().path();
                if path.file_name().is_some_and(|n| n == ".git") {
                    continue;
                }
                if path.is_dir() {
                    stack.push(path);
                    continue;
                }
                let rel = path.strip_prefix(&dir).unwrap().to_string_lossy().replace('\\', "/");
                let bytes = fs::read(&path).unwrap();
                if let Scope::In(syntax) = classify(&rel, &bytes) {
                    let lines = spdx_lines(&first_comment_block(&String::from_utf8_lossy(&bytes), syntax));
                    if !lines.is_empty() {
                        map.insert(rel, lines);
                    }
                }
            }
        }
        let _ = fs::remove_dir_all(&dir);
        assert!(!map.is_empty(), "spex scaffold produced no upstream SPDX lines");
        map
    })
}

/// licensing-6: the scope excludes exactly the four categories, and
/// everything else with comment syntax is in scope.
#[test]
fn licensing_6_scope_excludes_exactly_the_listed_categories() {
    // The rule on the spec's named examples and their categories.
    for (path, expected) in [
        ("data.json", Scope::NoCommentSyntax),
        ("logo.png", Scope::NoCommentSyntax),
        (".gitignore", Scope::Configuration),
        (".editorconfig", Scope::Configuration),
        (".vscode/settings.json", Scope::Configuration),
        ("AGENTS.md", Scope::Configuration),
        (".github/workflows/ci.yml", Scope::Configuration),
        ("Cargo.lock", Scope::Configuration),
        ("dist/app.js", Scope::GeneratedOrVendor),
        ("node_modules/x/index.js", Scope::GeneratedOrVendor),
        ("vendor/lib.rs", Scope::GeneratedOrVendor),
        ("LICENSE", Scope::Legal),
        ("LICENSES/MIT.txt", Scope::Legal),
        ("src/lib.rs", Scope::In(Syntax::Slash)),
        ("scripts/x.sh", Scope::In(Syntax::Hash)),
        ("docs/guide.md", Scope::In(Syntax::Html)),
    ] {
        let bytes: &[u8] = if path.ends_with(".png") { b"\x89PNG\0" } else { b"x" };
        assert_eq!(classify(path, bytes), expected, "{path}");
    }

    // The rule on this repository: every candidate file is classified, and
    // the crate's sources, tests, and specs are in scope.
    let in_scope: Vec<String> = in_scope_files().into_iter().map(|f| f.path).collect();
    for required in ["src/lib.rs", "tests/shortest_path.rs", "specs/packages/graph.md", "specs/meta.md"] {
        assert!(in_scope.iter().any(|p| p == required), "{required} must be in scope");
    }
    for excluded in ["Cargo.lock", ".gitignore", "AGENTS.md", "LICENSE", "spex-packages/contrib/meta.yaml"] {
        assert!(!in_scope.iter().any(|p| p == excluded), "{excluded} must be out of scope");
    }
}

/// licensing-7: the detector recognizes each listed pattern, and finds this
/// project's root license.
#[test]
fn licensing_7_detector_recognizes_license_patterns() {
    for name in [
        "LICENSE", "LICENSE.txt", "LICENSE.md", "COPYING", "LICENSE-CONTENT", "LICENSE-APACHE",
        "LICENCE", "LICENCE.txt",
    ] {
        assert!(is_license_entry(name, false), "{name} must be recognized");
    }
    assert!(is_license_entry("LICENSES", true), "LICENSES/ must be recognized");
    for name in ["README.md", "LICENSES", "license-notes.md", "MYLICENSE"] {
        assert!(!is_license_entry(name, false), "{name} must not be recognized");
    }

    // On real directories, including a REUSE-style LICENSES/ folder.
    let dir = std::env::temp_dir().join(format!("graph-crate-detector-{}", std::process::id()));
    let _ = fs::remove_dir_all(&dir);
    fs::create_dir_all(dir.join("LICENSES")).unwrap();
    fs::write(dir.join("LICENCE.txt"), "x").unwrap();
    fs::write(dir.join("README.md"), "x").unwrap();
    let found = root_license_entries(&dir);
    let _ = fs::remove_dir_all(&dir);
    assert_eq!(found, vec!["LICENCE.txt".to_owned(), "LICENSES".to_owned()]);

    assert_eq!(root_license_entries(root()), vec!["LICENSE".to_owned()]);
}

/// licensing-3: every in-scope file carries `SPDX-FileCopyrightText` in its
/// first comment block after any shebang (licensing-1).
#[test]
fn licensing_3_in_scope_files_carry_copyright_header() {
    let files = in_scope_files();
    assert!(!files.is_empty());
    let missing: Vec<&str> = files
        .iter()
        .filter(|f| {
            !first_comment_block(&f.text, f.syntax)
                .iter()
                .any(|l| l.contains("SPDX-FileCopyrightText:"))
        })
        .map(|f| f.path.as_str())
        .collect();
    assert!(missing.is_empty(), "missing SPDX-FileCopyrightText: {missing:?}");
}

/// licensing-4: with a root license recognized (licensing-7), every in-scope
/// file carries `SPDX-License-Identifier` in its first comment block after
/// any shebang (licensing-2).
#[test]
fn licensing_4_in_scope_files_carry_license_header() {
    assert!(!root_license_entries(root()).is_empty(), "no root license detected");
    let files = in_scope_files();
    assert!(!files.is_empty());
    let missing: Vec<&str> = files
        .iter()
        .filter(|f| {
            !first_comment_block(&f.text, f.syntax)
                .iter()
                .any(|l| l.contains("SPDX-License-Identifier:"))
        })
        .map(|f| f.path.as_str())
        .collect();
    assert!(missing.is_empty(), "missing SPDX-License-Identifier: {missing:?}");
}

/// licensing-8 (licensing-5): files copied from the upstream Spex scaffold
/// keep every upstream SPDX line byte for byte, with no project data added,
/// although the project's copyright holder differs from upstream's.
#[test]
fn licensing_8_upstream_spdx_lines_are_preserved() {
    let upstream = upstream_spdx();
    let mut checked = 0;
    for (path, lines) in upstream {
        let full = root().join(path);
        if !full.is_file() {
            continue;
        }
        let Scope::In(syntax) = classify(path, lines[0].as_bytes()) else { continue };
        let text = fs::read_to_string(full).unwrap();
        let here = spdx_lines(&first_comment_block(&text, syntax));
        assert_eq!(&here, lines, "{path}: upstream SPDX lines must be preserved unmodified");
        assert!(
            !here.iter().any(|l| l.contains(PROJECT_HOLDER)),
            "{path}: project data must not replace or supplement upstream lines"
        );
        checked += 1;
    }
    assert!(checked > 0, "no upstream-derived file found to check");
    // The precondition that makes preservation observable: upstream data
    // differs from the project's own.
    assert!(upstream.values().flatten().all(|l| !l.contains(PROJECT_HOLDER)));
}

fn first_inclusion_year(path: &str) -> String {
    let log = git(&["log", "--follow", "--diff-filter=A", "--format=%ad", "--date=format:%Y", "--", path]);
    match log.lines().last() {
        Some(year) => year.to_owned(),
        // Not yet committed: first inclusion is now.
        None => run(Command::new("date").arg("+%Y")).trim().to_owned(),
    }
}

/// licensing-9: files with no upstream SPDX lines name the project's own
/// license and holder, with the first-inclusion year, in native syntax.
#[test]
fn licensing_9_own_files_use_project_license_and_holder() {
    let upstream = upstream_spdx();
    let mut checked = 0;
    for f in in_scope_files() {
        if upstream.contains_key(&f.path) {
            continue;
        }
        let year = first_inclusion_year(&f.path);
        let expected = vec![
            f.syntax.line(&format!("SPDX-License-Identifier: {PROJECT_LICENSE}")),
            f.syntax.line(&format!("SPDX-FileCopyrightText: {year} {PROJECT_HOLDER}")),
        ];
        let here = spdx_lines(&first_comment_block(&f.text, f.syntax));
        assert_eq!(here, expected, "{}: project SPDX lines", f.path);
        checked += 1;
    }
    assert!(checked > 0, "no project-authored file found to check");

    // The rule itself names the project's values, with no `<...>` placeholder.
    let spec = fs::read_to_string(root().join("specs/packages/licensing.md")).unwrap();
    let item = spec
        .split("### licensing-9")
        .nth(1)
        .and_then(|s| s.split("\n## ").next())
        .expect("licensing-9 item");
    assert!(item.contains(PROJECT_HOLDER) && item.contains(PROJECT_LICENSE));
    let placeholder = item
        .split('<')
        .skip(1)
        .filter_map(|s| s.split_once('>').map(|(inner, _)| inner))
        // Skip emails, HTML comment delimiters, and the rule's own `<...>`.
        .find(|inner| !inner.contains('@') && !inner.starts_with("!--") && *inner != "...");
    assert_eq!(placeholder, None, "licensing-9 leaves a <...> placeholder");
}
