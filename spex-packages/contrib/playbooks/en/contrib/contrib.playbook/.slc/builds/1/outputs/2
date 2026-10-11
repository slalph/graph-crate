# Contrib

Roles:

- Contributor
- Maintainer

The caller is a maintainer who supplies an issue number or a request, with any relevant context.
`contrib` implements the change on its own branch with one commit, has it reviewed in at most two review rounds, and ends by opening a pull request.
Review round 1 reviews the Contributor's implementation commit; review round 2 reviews the Contributor's response to the round-1 findings and is the last round.
Captain shall use the repository-effect receipt as the authoritative identity of every commit the Contributor makes.
No transition shall depend on finding numbering or any fixed presentation format of either player's reply.

### CONTRIB-1

When the caller gives an issue number or a request, with the repository-effect receipt as the authoritative identity of any commit Contributor makes, Captain shall prompt Contributor:

> Implement this request as one small, reviewable change.
> If it gives an issue number, read the issue with gh issue view first.
> Read specs/ and the code the change touches before editing anything.
> Create a new branch from the current main branch, named for the issue: its number followed by a short slug of its title; for a request without an issue, a short slug of the request.
> Implement the change with tests that cover it, and update specs/ and documentation where behaviour changes.
> Keep to the issue's scope: no unrelated refactors, formatting churn, or drive-by fixes.
> Run cargo test; it must pass before you commit.
> Make exactly one commit on that branch, with a clear message that explains what changed and why and references the issue.
> Report the branch name, the commit, a short summary of the change, and the cargo test result.
> If the request is ambiguous in a way that changes what you would build, ask the maintainer one question before changing files.
> If you cannot make cargo test pass or cannot complete the change within the issue's scope, do not commit; report why.
>
> > Request: <caller-input>

Results:
- `committed`: Contributor made one commit on a new branch named for the issue, with cargo test passing; the outcome does not depend on finding numbering or any fixed presentation format of Contributor's reply. Output shall include `contributorOutput: <verbatim final text>`, `branch: <branch name>`, and `latestCommit: <commit identity>`.
- `blocked`: Contributor made no commit and reported why the change cannot be completed; the outcome does not depend on finding numbering or any fixed presentation format of Contributor's reply. The workflow ends and returns that report to the caller. Output shall include `contributorOutput: <verbatim final text>`.

### CONTRIB-2

When Contributor has made the implementation commit, at review round 1, Captain shall prompt Maintainer:

> Review this commit as the maintainer on the reviewer rotation would, against the request and the issue it references.
> Check correctness, tests that cover the change, no changes unrelated to the issue, and documentation updated where behaviour changed.
> Number your findings, and raise only what should block merging — not style or equally valid alternatives.
> Rely on the Contributor's reported cargo test result unless you have reason to doubt it.
> Do not edit files or commit; report findings only.
> If you have no findings, say plainly that the commit is ready for a pull request.
>
> > Request: <caller-input>
> > Branch: <branch>
> > Commit: <latest-commit>
> > Contributor output: <contributor-output>

Results:
- `hasFindings`: Maintainer raised one or more numbered findings; a progress report, status update, or promise of a later result supports no review outcome, and the outcome does not depend on finding numbering or any fixed presentation format of Maintainer's reply. Output shall include `maintainerOutput: <verbatim final text>`.
- `noFindings`: Maintainer affirmatively reported that the commit is ready and raised no findings; a progress report, status update, or promise of a later result supports no review outcome, and the outcome does not depend on finding numbering or any fixed presentation format of Maintainer's reply.

### CONTRIB-3

When Maintainer raises findings at review round 1, with the repository-effect receipt as the authoritative identity of any commit Contributor makes, Captain shall prompt Contributor:

> Address each numbered finding: fix it, or reject it with reasoning that cites the code or test output.
> Keep every fix within the issue's scope.
> Run cargo test; it must pass before you commit.
> If you fix any finding, make one new commit on the same branch with a clear message that references the issue and the findings it fixes; never amend or rewrite an existing commit.
> If you reject every finding, change nothing and make no commit.
> Report your disposition of every finding and the cargo test result.
>
> > Request: <caller-input>
> > Branch: <branch>
> > Maintainer findings: <maintainer-output>

Results:
- `fixed`: Contributor made one new commit on the same branch with cargo test passing; the outcome does not depend on finding numbering or any fixed presentation format of Contributor's reply. Output shall include `contributorOutput: <verbatim final text>` and `latestCommit: <commit identity>`.
- `rejectedAll`: Contributor rejected every finding with reasoning, changed nothing, and made no commit; the outcome does not depend on finding numbering or any fixed presentation format of Contributor's reply. Output shall include `contributorOutput: <verbatim final text>`.

### CONTRIB-4

When Contributor has made a fix commit, at review round 2, Captain shall prompt Maintainer:

> This is the second and final review round for this branch.
> Read the fix commit and the Contributor's dispositions, and review the branch as it now stands.
> For each earlier finding, say whether it is resolved; accept a rejection that is well reasoned.
> Keep the earlier numbering, and number any new finding after it; raise a new finding only if it should block merging.
> Do not edit files or commit; report findings only.
> If no findings remain open, say plainly that the branch is ready for a pull request.
>
> > Request: <caller-input>
> > Branch: <branch>
> > Fix commit: <latest-commit>
> > Contributor output: <contributor-output>

Results:
- `hasFindings`: Maintainer reported one or more findings still open; a progress report, status update, or promise of a later result supports no review outcome, and the outcome does not depend on finding numbering or any fixed presentation format of Maintainer's reply. Output shall include `maintainerOutput: <verbatim final text>`.
- `noFindings`: Maintainer affirmatively reported that no findings remain open and the branch is ready; a progress report, status update, or promise of a later result supports no review outcome, and the outcome does not depend on finding numbering or any fixed presentation format of Maintainer's reply.

### CONTRIB-5

When Contributor rejects every finding and makes no commit, at review round 2, Captain shall prompt Maintainer:

> This is the second and final review round for this branch.
> The Contributor rejected every finding and made no new commit; read the reasoning.
> For each finding, accept the rejection if it is well reasoned, or keep the finding open and say why.
> Keep the earlier numbering.
> Do not edit files or commit; report findings only.
> If no findings remain open, say plainly that the branch is ready for a pull request.
>
> > Request: <caller-input>
> > Branch: <branch>
> > Contributor output: <contributor-output>

Results:
- `hasFindings`: Maintainer kept one or more findings open; a progress report, status update, or promise of a later result supports no review outcome, and the outcome does not depend on finding numbering or any fixed presentation format of Maintainer's reply. Output shall include `maintainerOutput: <verbatim final text>`.
- `noFindings`: Maintainer affirmatively reported that no findings remain open and the branch is ready; a progress report, status update, or promise of a later result supports no review outcome, and the outcome does not depend on finding numbering or any fixed presentation format of Maintainer's reply.

### CONTRIB-6

When Maintainer reports no findings at review round 1 or review round 2, Captain shall prompt Contributor:

> The review passed with no open findings.
> Push the branch to origin and open a pull request against main with gh.
> Write a description that summarizes the change and how it was tested, and link the issue so that merging closes it.
> Do not change or commit anything.
> Report the pull request URL and the branch name.
> If the push or gh fails, report the error and do not retry more than once.
>
> > Request: <caller-input>
> > Branch: <branch>

Results:
- `opened`: Contributor pushed the branch and opened a ready pull request; the outcome does not depend on finding numbering or any fixed presentation format of Contributor's reply. The workflow ends and returns the pull request URL and the branch name to the caller. Output shall include `pullRequestUrl: <pull request URL>` and `branch: <branch name>`.
- `notOpened`: Contributor could not push the branch or open the pull request and reported the error; the outcome does not depend on finding numbering or any fixed presentation format of Contributor's reply. The workflow ends and returns that report to the caller. Output shall include `contributorOutput: <verbatim final text>`.

### CONTRIB-7

When Maintainer reports findings still open at review round 2, Captain shall prompt Contributor:

> The review rounds are used up and findings remain open.
> Do not change or commit anything.
> Push the branch to origin and open a draft pull request against main with gh.
> Write a description that summarizes the change and how it was tested, links the issue, and lists every open finding under an "Open findings" heading.
> Report the pull request URL, the branch name, and that the pull request is a draft with open findings.
> If the push or gh fails, report the error and do not retry more than once.
>
> > Request: <caller-input>
> > Branch: <branch>
> > Open findings: <maintainer-output>

Results:
- `openedDraft`: Contributor pushed the branch and opened a draft pull request listing the open findings; the outcome does not depend on finding numbering or any fixed presentation format of Contributor's reply. The workflow ends and returns the pull request URL, the branch name, and the fact that the pull request is a draft with open findings to the caller. Output shall include `pullRequestUrl: <pull request URL>` and `branch: <branch name>`.
- `notOpened`: Contributor could not push the branch or open the draft pull request and reported the error; the outcome does not depend on finding numbering or any fixed presentation format of Contributor's reply. The workflow ends and returns that report to the caller. Output shall include `contributorOutput: <verbatim final text>`.
