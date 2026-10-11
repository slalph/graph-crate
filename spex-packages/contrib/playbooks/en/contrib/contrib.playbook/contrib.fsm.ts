// FSM object artifact compiled from ./contrib.gears.md by gears2fsm.
// It declares only the machine, its actor contracts, and typed inputs; the
// linked runtime supplies the `player` actor implementation.

import { assign, fromPromise, setup } from 'xstate';

// ---------------------------------------------------------------------------
// Identities
// ---------------------------------------------------------------------------

/** Canonical lowercase local ids of the source roles Contributor and Maintainer. */
export type ContribRole = 'contributor' | 'maintainer';

/** One role-id array per parallel group; CONTRIB declares no parallel group. */
export const concurrentRoleSets: readonly (readonly ContribRole[])[] = [];

/** Delegated-player working leaves (CONTRIB-1 through CONTRIB-7). */
export type WorkingStateId =
  | 'implement'
  | 'reviewImplementation'
  | 'addressFindings'
  | 'reviewFix'
  | 'reviewRejection'
  | 'openPullRequest'
  | 'openDraftPullRequest';

/** Working leaves that may suspend for, and resume from, a Boss reply. */
export type ResumableStateId = WorkingStateId;

/** Root `BOSS_INTERRUPT` targets. */
export type JumpableStateId = WorkingStateId;

export type ContribSourceItem =
  | 'CONTRIB-1'
  | 'CONTRIB-2'
  | 'CONTRIB-3'
  | 'CONTRIB-4'
  | 'CONTRIB-5'
  | 'CONTRIB-6'
  | 'CONTRIB-7';

/** Contributor's accepted outcome of its latest commit-making step. */
export type ContributorOutcome = 'committed' | 'fixed' | 'rejectedAll';

/** Review round whose Maintainer verdict is the latest accepted one. */
export type ReviewRound = 1 | 2;

/** Maintainer's latest accepted review verdict. */
export type ReviewVerdict = 'hasFindings' | 'noFindings';

/** Terminal outcome the workflow returns to its caller. */
export type ContribCompletion = 'opened' | 'openedDraft' | 'blocked' | 'notOpened';

// ---------------------------------------------------------------------------
// Boss-reply suspension (scalar form: one active player task at a time)
// ---------------------------------------------------------------------------

export interface PendingBossQuestion {
  readonly questionId: ResumableStateId;
  readonly resumeStateId: ResumableStateId;
  readonly sourceItem: ContribSourceItem;
  readonly asker: { readonly kind: 'role'; readonly roleId: ContribRole };
  readonly question: string;
}

// ---------------------------------------------------------------------------
// Delegated player actor contract
// ---------------------------------------------------------------------------

interface PlayerInputBase {
  /** The source item's full final prompt, verbatim. */
  readonly prompt: string;
  /** This state's local result contract: guard name → description. */
  readonly result: Readonly<Record<string, string>>;
  /** `<caller-input>`: the caller's issue number or request, with context. */
  readonly callerInput?: string;
  readonly pendingBossQuestion?: PendingBossQuestion;
  readonly bossReply?: string;
}

export interface ImplementPlayerInput extends PlayerInputBase {
  readonly stateId: 'implement';
  readonly role: 'contributor';
  readonly sourceItem: 'CONTRIB-1';
}

export interface ReviewImplementationPlayerInput extends PlayerInputBase {
  readonly stateId: 'reviewImplementation';
  readonly role: 'maintainer';
  readonly sourceItem: 'CONTRIB-2';
  /** `<branch>`: the branch Contributor created for the change. */
  readonly branch?: string;
  /** `<latest-commit>`: the receipt-owned implementation commit. */
  readonly latestCommit?: string;
  /** `<contributor-output>`: Contributor's verbatim implementation report. */
  readonly contributorOutput?: string;
}

export interface AddressFindingsPlayerInput extends PlayerInputBase {
  readonly stateId: 'addressFindings';
  readonly role: 'contributor';
  readonly sourceItem: 'CONTRIB-3';
  /** `<branch>`: the branch Contributor created for the change. */
  readonly branch?: string;
  /** `<maintainer-output>`: Maintainer's verbatim round-1 findings. */
  readonly maintainerOutput?: string;
}

export interface ReviewFixPlayerInput extends PlayerInputBase {
  readonly stateId: 'reviewFix';
  readonly role: 'maintainer';
  readonly sourceItem: 'CONTRIB-4';
  /** `<branch>`: the branch Contributor created for the change. */
  readonly branch?: string;
  /** `<latest-commit>`: the receipt-owned fix commit. */
  readonly latestCommit?: string;
  /** `<contributor-output>`: Contributor's verbatim dispositions report. */
  readonly contributorOutput?: string;
}

export interface ReviewRejectionPlayerInput extends PlayerInputBase {
  readonly stateId: 'reviewRejection';
  readonly role: 'maintainer';
  readonly sourceItem: 'CONTRIB-5';
  /** `<branch>`: the branch Contributor created for the change. */
  readonly branch?: string;
  /** `<contributor-output>`: Contributor's verbatim rejection reasoning. */
  readonly contributorOutput?: string;
}

export interface OpenPullRequestPlayerInput extends PlayerInputBase {
  readonly stateId: 'openPullRequest';
  readonly role: 'contributor';
  readonly sourceItem: 'CONTRIB-6';
  /** `<branch>`: the branch Contributor created for the change. */
  readonly branch?: string;
}

export interface OpenDraftPullRequestPlayerInput extends PlayerInputBase {
  readonly stateId: 'openDraftPullRequest';
  readonly role: 'contributor';
  readonly sourceItem: 'CONTRIB-7';
  /** `<branch>`: the branch Contributor created for the change. */
  readonly branch?: string;
  /** `<maintainer-output>`: Maintainer's verbatim round-2 open findings. */
  readonly maintainerOutput?: string;
}

export type PlayerInput =
  | ImplementPlayerInput
  | ReviewImplementationPlayerInput
  | AddressFindingsPlayerInput
  | ReviewFixPlayerInput
  | ReviewRejectionPlayerInput
  | OpenPullRequestPlayerInput
  | OpenDraftPullRequestPlayerInput;

export type NeedsBossReplyOutput = {
  readonly guard: 'needsBossReply';
  readonly question: string;
};

/** Contributor outcomes (CONTRIB-1, CONTRIB-3, CONTRIB-6, CONTRIB-7). */
export type ContributorOutput =
  | {
      readonly guard: 'committed';
      readonly contributorOutput: string;
      readonly branch: string;
      /** Effect-owned: the runtime fills it from the repository receipt. */
      readonly latestCommit: string;
    }
  | { readonly guard: 'blocked'; readonly contributorOutput: string }
  | {
      readonly guard: 'fixed';
      readonly contributorOutput: string;
      /** Effect-owned: the runtime fills it from the repository receipt. */
      readonly latestCommit: string;
    }
  | { readonly guard: 'rejectedAll'; readonly contributorOutput: string }
  | {
      readonly guard: 'opened';
      readonly pullRequestUrl: string;
      readonly branch: string;
    }
  | {
      readonly guard: 'openedDraft';
      readonly pullRequestUrl: string;
      readonly branch: string;
    }
  | { readonly guard: 'notOpened'; readonly contributorOutput: string }
  | NeedsBossReplyOutput;

/** Maintainer outcomes (CONTRIB-2, CONTRIB-4, CONTRIB-5). */
export type MaintainerOutput =
  | { readonly guard: 'hasFindings'; readonly maintainerOutput: string }
  | { readonly guard: 'noFindings' }
  | NeedsBossReplyOutput;

export type PlayerOutput = ContributorOutput | MaintainerOutput;

type PlayerGuard = PlayerOutput['guard'];

export interface ErrorRecord {
  readonly name: string;
  readonly message: string;
  readonly stack?: string;
}

// ---------------------------------------------------------------------------
// Machine input, context, events, and output
// ---------------------------------------------------------------------------

/** Terminal result returned to the caller, derived from typed context. */
export type ContribOutput =
  | {
      readonly status: 'opened';
      readonly pullRequestUrl: string;
      readonly branch: string;
    }
  | {
      readonly status: 'openedDraft';
      readonly pullRequestUrl: string;
      readonly branch: string;
      /** The pull request is a draft with open findings. */
      readonly draftWithOpenFindings: true;
    }
  | {
      readonly status: 'blocked';
      /** Contributor's verbatim report of why the change cannot be completed. */
      readonly contributorOutput: string;
    }
  | {
      readonly status: 'notOpened';
      /** Contributor's verbatim report of the push or gh error. */
      readonly contributorOutput: string;
    };

/** The machine reads no input: the caller input arrives on `START_CONTRIB`. */
export type ContribInput = Readonly<Record<never, never>>;

export interface ContribContext {
  /** `<caller-input>`: the caller's issue number or request, with context. */
  readonly callerInput?: string;
  /** `<branch>`: the branch Contributor created and reported. */
  readonly branch?: string;
  /** `<latest-commit>`: the accepted, receipt-owned latest Contributor commit. */
  readonly latestCommit?: string;
  /** `<contributor-output>`: Contributor's latest verbatim final text. */
  readonly contributorOutput?: string;
  /** `<maintainer-output>`: Maintainer's latest verbatim findings. */
  readonly maintainerOutput?: string;
  readonly contributorOutcome?: ContributorOutcome;
  readonly reviewRound?: ReviewRound;
  readonly reviewVerdict?: ReviewVerdict;
  readonly pullRequestUrl?: string;
  readonly completion?: ContribCompletion;
  readonly lastError?: ErrorRecord;
  readonly pendingBossQuestion?: PendingBossQuestion;
  readonly bossReply?: string;
}

export type ContribEvent =
  | { readonly type: 'START_CONTRIB'; readonly callerInput: string }
  | { readonly type: 'BOSS_INTERRUPT'; readonly targetId: JumpableStateId }
  | {
      readonly type: 'BOSS_REPLY';
      readonly answer: string;
      readonly questionId?: ResumableStateId;
    };

// ---------------------------------------------------------------------------
// Prompts and result contracts (verbatim from contrib.gears.md)
// ---------------------------------------------------------------------------

const IMPLEMENT_PROMPT = [
  "Implement this request as one small, reviewable change.",
  "If it gives an issue number, read the issue with gh issue view first.",
  "Read specs/ and the code the change touches before editing anything.",
  "Create a new branch from the current main branch, named for the issue: its number followed by a short slug of its title; for a request without an issue, a short slug of the request.",
  "Implement the change with tests that cover it, and update specs/ and documentation where behaviour changes.",
  "Keep to the issue's scope: no unrelated refactors, formatting churn, or drive-by fixes.",
  "Run cargo test; it must pass before you commit.",
  "Make exactly one commit on that branch, with a clear message that explains what changed and why and references the issue.",
  "Report the branch name, the commit, a short summary of the change, and the cargo test result.",
  "If the request is ambiguous in a way that changes what you would build, ask the maintainer one question before changing files.",
  "If you cannot make cargo test pass or cannot complete the change within the issue's scope, do not commit; report why.",
  "",
  "> Request: <caller-input>",
].join('\n');

const REVIEW_IMPLEMENTATION_PROMPT = [
  "Review this commit as the maintainer on the reviewer rotation would, against the request and the issue it references.",
  "Check correctness, tests that cover the change, no changes unrelated to the issue, and documentation updated where behaviour changed.",
  "Number your findings, and raise only what should block merging — not style or equally valid alternatives.",
  "Rely on the Contributor's reported cargo test result unless you have reason to doubt it.",
  "Do not edit files or commit; report findings only.",
  "If you have no findings, say plainly that the commit is ready for a pull request.",
  "",
  "> Request: <caller-input>",
  "> Branch: <branch>",
  "> Commit: <latest-commit>",
  "> Contributor output: <contributor-output>",
].join('\n');

const ADDRESS_FINDINGS_PROMPT = [
  "Address each numbered finding: fix it, or reject it with reasoning that cites the code or test output.",
  "Keep every fix within the issue's scope.",
  "Run cargo test; it must pass before you commit.",
  "If you fix any finding, make one new commit on the same branch with a clear message that references the issue and the findings it fixes; never amend or rewrite an existing commit.",
  "If you reject every finding, change nothing and make no commit.",
  "Report your disposition of every finding and the cargo test result.",
  "",
  "> Request: <caller-input>",
  "> Branch: <branch>",
  "> Maintainer findings: <maintainer-output>",
].join('\n');

const REVIEW_FIX_PROMPT = [
  "This is the second and final review round for this branch.",
  "Read the fix commit and the Contributor's dispositions, and review the branch as it now stands.",
  "For each earlier finding, say whether it is resolved; accept a rejection that is well reasoned.",
  "Keep the earlier numbering, and number any new finding after it; raise a new finding only if it should block merging.",
  "Do not edit files or commit; report findings only.",
  "If no findings remain open, say plainly that the branch is ready for a pull request.",
  "",
  "> Request: <caller-input>",
  "> Branch: <branch>",
  "> Fix commit: <latest-commit>",
  "> Contributor output: <contributor-output>",
].join('\n');

const REVIEW_REJECTION_PROMPT = [
  "This is the second and final review round for this branch.",
  "The Contributor rejected every finding and made no new commit; read the reasoning.",
  "For each finding, accept the rejection if it is well reasoned, or keep the finding open and say why.",
  "Keep the earlier numbering.",
  "Do not edit files or commit; report findings only.",
  "If no findings remain open, say plainly that the branch is ready for a pull request.",
  "",
  "> Request: <caller-input>",
  "> Branch: <branch>",
  "> Contributor output: <contributor-output>",
].join('\n');

const OPEN_PULL_REQUEST_PROMPT = [
  "The review passed with no open findings.",
  "Push the branch to origin and open a pull request against main with gh.",
  "Write a description that summarizes the change and how it was tested, and link the issue so that merging closes it.",
  "Do not change or commit anything.",
  "Report the pull request URL and the branch name.",
  "If the push or gh fails, report the error and do not retry more than once.",
  "",
  "> Request: <caller-input>",
  "> Branch: <branch>",
].join('\n');

const OPEN_DRAFT_PULL_REQUEST_PROMPT = [
  "The review rounds are used up and findings remain open.",
  "Do not change or commit anything.",
  "Push the branch to origin and open a draft pull request against main with gh.",
  "Write a description that summarizes the change and how it was tested, links the issue, and lists every open finding under an \"Open findings\" heading.",
  "Report the pull request URL, the branch name, and that the pull request is a draft with open findings.",
  "If the push or gh fails, report the error and do not retry more than once.",
  "",
  "> Request: <caller-input>",
  "> Branch: <branch>",
  "> Open findings: <maintainer-output>",
].join('\n');

const NEEDS_BOSS_REPLY_DESCRIPTION =
  "The acting agent's prose surfaces a clarifying question for Boss that the agent cannot answer alone. Output shall include `question: <verbatim question text from the acting agent's prose>`.";

const IMPLEMENT_RESULT = {
  committed:
    "Contributor made one commit on a new branch named for the issue, with cargo test passing; the outcome does not depend on finding numbering or any fixed presentation format of Contributor's reply. Output shall include `contributorOutput: <verbatim final text>`, `branch: <branch name>`, and `latestCommit: <commit identity>`.",
  blocked:
    "Contributor made no commit and reported why the change cannot be completed; the outcome does not depend on finding numbering or any fixed presentation format of Contributor's reply. The workflow ends and returns that report to the caller. Output shall include `contributorOutput: <verbatim final text>`.",
  needsBossReply: NEEDS_BOSS_REPLY_DESCRIPTION,
} as const;

const REVIEW_IMPLEMENTATION_RESULT = {
  hasFindings:
    "Maintainer raised one or more numbered findings; a progress report, status update, or promise of a later result supports no review outcome, and the outcome does not depend on finding numbering or any fixed presentation format of Maintainer's reply. Output shall include `maintainerOutput: <verbatim final text>`.",
  noFindings:
    "Maintainer affirmatively reported that the commit is ready and raised no findings; a progress report, status update, or promise of a later result supports no review outcome, and the outcome does not depend on finding numbering or any fixed presentation format of Maintainer's reply.",
  needsBossReply: NEEDS_BOSS_REPLY_DESCRIPTION,
} as const;

const ADDRESS_FINDINGS_RESULT = {
  fixed:
    "Contributor made one new commit on the same branch with cargo test passing; the outcome does not depend on finding numbering or any fixed presentation format of Contributor's reply. Output shall include `contributorOutput: <verbatim final text>` and `latestCommit: <commit identity>`.",
  rejectedAll:
    "Contributor rejected every finding with reasoning, changed nothing, and made no commit; the outcome does not depend on finding numbering or any fixed presentation format of Contributor's reply. Output shall include `contributorOutput: <verbatim final text>`.",
  needsBossReply: NEEDS_BOSS_REPLY_DESCRIPTION,
} as const;

const REVIEW_FIX_RESULT = {
  hasFindings:
    "Maintainer reported one or more findings still open; a progress report, status update, or promise of a later result supports no review outcome, and the outcome does not depend on finding numbering or any fixed presentation format of Maintainer's reply. Output shall include `maintainerOutput: <verbatim final text>`.",
  noFindings:
    "Maintainer affirmatively reported that no findings remain open and the branch is ready; a progress report, status update, or promise of a later result supports no review outcome, and the outcome does not depend on finding numbering or any fixed presentation format of Maintainer's reply.",
  needsBossReply: NEEDS_BOSS_REPLY_DESCRIPTION,
} as const;

const REVIEW_REJECTION_RESULT = {
  hasFindings:
    "Maintainer kept one or more findings open; a progress report, status update, or promise of a later result supports no review outcome, and the outcome does not depend on finding numbering or any fixed presentation format of Maintainer's reply. Output shall include `maintainerOutput: <verbatim final text>`.",
  noFindings:
    "Maintainer affirmatively reported that no findings remain open and the branch is ready; a progress report, status update, or promise of a later result supports no review outcome, and the outcome does not depend on finding numbering or any fixed presentation format of Maintainer's reply.",
  needsBossReply: NEEDS_BOSS_REPLY_DESCRIPTION,
} as const;

const OPEN_PULL_REQUEST_RESULT = {
  opened:
    "Contributor pushed the branch and opened a ready pull request; the outcome does not depend on finding numbering or any fixed presentation format of Contributor's reply. The workflow ends and returns the pull request URL and the branch name to the caller. Output shall include `pullRequestUrl: <pull request URL>` and `branch: <branch name>`.",
  notOpened:
    "Contributor could not push the branch or open the pull request and reported the error; the outcome does not depend on finding numbering or any fixed presentation format of Contributor's reply. The workflow ends and returns that report to the caller. Output shall include `contributorOutput: <verbatim final text>`.",
  needsBossReply: NEEDS_BOSS_REPLY_DESCRIPTION,
} as const;

const OPEN_DRAFT_PULL_REQUEST_RESULT = {
  openedDraft:
    "Contributor pushed the branch and opened a draft pull request listing the open findings; the outcome does not depend on finding numbering or any fixed presentation format of Contributor's reply. The workflow ends and returns the pull request URL, the branch name, and the fact that the pull request is a draft with open findings to the caller. Output shall include `pullRequestUrl: <pull request URL>` and `branch: <branch name>`.",
  notOpened:
    "Contributor could not push the branch or open the draft pull request and reported the error; the outcome does not depend on finding numbering or any fixed presentation format of Contributor's reply. The workflow ends and returns that report to the caller. Output shall include `contributorOutput: <verbatim final text>`.",
  needsBossReply: NEEDS_BOSS_REPLY_DESCRIPTION,
} as const;

const STATE_DESCRIPTIONS = {
  ready: 'Waiting for the caller to give an issue number or a request.',
  implement:
    'Contributor implements the request on a new branch with one commit and cargo test passing.',
  reviewImplementation:
    "Maintainer reviews the Contributor's implementation commit in review round 1.",
  addressFindings:
    "Contributor fixes or rejects each of Maintainer's round-1 findings, committing any fixes in one new commit.",
  reviewFix:
    "Maintainer reviews the Contributor's fix commit and dispositions in review round 2, the final round.",
  reviewRejection:
    "Maintainer reviews the Contributor's rejection of every finding in review round 2, the final round.",
  openPullRequest:
    'Contributor pushes the branch and opens a ready pull request after a review with no open findings.',
  openDraftPullRequest:
    'Contributor pushes the branch and opens a draft pull request listing the findings still open after review round 2.',
  awaitBossReply: "Waiting for Boss to answer the acting agent's question.",
  failed:
    'CONTRIB parked after a failure and waits for the caller to give the issue number or request again.',
  prOpened:
    'CONTRIB completed: Contributor pushed the branch and opened a ready pull request; the workflow returns the pull request URL and the branch name.',
  draftPrOpened:
    'CONTRIB completed: Contributor pushed the branch and opened a draft pull request listing the findings still open after the review rounds; the workflow returns the pull request URL, the branch name, and the fact that the pull request is a draft with open findings.',
  implementationBlocked:
    "CONTRIB failed: Contributor made no commit and reported why the change cannot be completed; the workflow returns that report to the caller.",
  prNotOpened:
    "CONTRIB failed: Contributor could not push the branch or open the ready or draft pull request and reported the error; the workflow returns that report to the caller.",
} as const;

type StateKey = keyof typeof STATE_DESCRIPTIONS;

type FinalStateKey =
  | 'prOpened'
  | 'draftPrOpened'
  | 'implementationBlocked'
  | 'prNotOpened';

const RESUME_METADATA = {
  implement: { sourceItem: 'CONTRIB-1', role: 'contributor' },
  reviewImplementation: { sourceItem: 'CONTRIB-2', role: 'maintainer' },
  addressFindings: { sourceItem: 'CONTRIB-3', role: 'contributor' },
  reviewFix: { sourceItem: 'CONTRIB-4', role: 'maintainer' },
  reviewRejection: { sourceItem: 'CONTRIB-5', role: 'maintainer' },
  openPullRequest: { sourceItem: 'CONTRIB-6', role: 'contributor' },
  openDraftPullRequest: { sourceItem: 'CONTRIB-7', role: 'contributor' },
} as const satisfies Record<
  ResumableStateId,
  { readonly sourceItem: ContribSourceItem; readonly role: ContribRole }
>;

// ---------------------------------------------------------------------------
// Structural helpers
// ---------------------------------------------------------------------------

const isRecord = (
  value: unknown,
): value is Readonly<Record<string, unknown>> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const doneOutputOf = (event: unknown): unknown =>
  isRecord(event) ? event.output : undefined;

const actorErrorOf = (event: unknown): unknown =>
  isRecord(event) ? event.error : undefined;

/** Narrows a player done event to the declared player output contract. */
function playerOutputOf(event: unknown): PlayerOutput | undefined {
  const output = doneOutputOf(event);
  if (!isRecord(output)) return undefined;
  switch (output.guard) {
    case 'committed':
      return isNonEmptyString(output.contributorOutput) &&
        isNonEmptyString(output.branch) &&
        isNonEmptyString(output.latestCommit)
        ? {
            guard: 'committed',
            contributorOutput: output.contributorOutput,
            branch: output.branch,
            latestCommit: output.latestCommit,
          }
        : undefined;
    case 'blocked':
      return isNonEmptyString(output.contributorOutput)
        ? { guard: 'blocked', contributorOutput: output.contributorOutput }
        : undefined;
    case 'hasFindings':
      return isNonEmptyString(output.maintainerOutput)
        ? { guard: 'hasFindings', maintainerOutput: output.maintainerOutput }
        : undefined;
    case 'noFindings':
      return { guard: 'noFindings' };
    case 'fixed':
      return isNonEmptyString(output.contributorOutput) &&
        isNonEmptyString(output.latestCommit)
        ? {
            guard: 'fixed',
            contributorOutput: output.contributorOutput,
            latestCommit: output.latestCommit,
          }
        : undefined;
    case 'rejectedAll':
      return isNonEmptyString(output.contributorOutput)
        ? { guard: 'rejectedAll', contributorOutput: output.contributorOutput }
        : undefined;
    case 'opened':
    case 'openedDraft':
      return isNonEmptyString(output.pullRequestUrl) &&
        isNonEmptyString(output.branch)
        ? {
            guard: output.guard,
            pullRequestUrl: output.pullRequestUrl,
            branch: output.branch,
          }
        : undefined;
    case 'notOpened':
      return isNonEmptyString(output.contributorOutput)
        ? { guard: 'notOpened', contributorOutput: output.contributorOutput }
        : undefined;
    case 'needsBossReply':
      return isNonEmptyString(output.question)
        ? { guard: 'needsBossReply', question: output.question }
        : undefined;
    default:
      return undefined;
  }
}

/** Every per-run context field a fresh `START_CONTRIB` resets. */
const RUN_FIELDS = [
  'callerInput',
  'branch',
  'latestCommit',
  'contributorOutput',
  'maintainerOutput',
  'contributorOutcome',
  'reviewRound',
  'reviewVerdict',
  'pullRequestUrl',
  'completion',
  'lastError',
  'pendingBossQuestion',
  'bossReply',
] as const satisfies readonly (keyof ContribContext)[];

/**
 * Clears only the listed fields that are currently present, so an assign
 * never creates a new own property whose value is `undefined`.
 */
function cleared<const K extends keyof ContribContext>(
  context: ContribContext,
  keys: readonly K[],
): { [P in K]?: undefined } {
  const update: { [P in K]?: undefined } = {};
  for (const key of keys) {
    if (context[key] !== undefined) update[key] = undefined;
  }
  return update;
}

/** Normalizes any thrown or malformed value to a JSON-safe error record. */
function errorRecord(value: unknown): ErrorRecord {
  if (value instanceof Error) {
    return {
      name: value.name || 'Error',
      message: value.message,
      ...(typeof value.stack === 'string' ? { stack: value.stack } : {}),
    };
  }
  if (isRecord(value) && typeof value.message === 'string') {
    return {
      name: isNonEmptyString(value.name) ? value.name : 'Error',
      message: value.message,
    };
  }
  return { name: 'Error', message: String(value) };
}

// ---------------------------------------------------------------------------
// Guards
// ---------------------------------------------------------------------------

type EventArgs = { readonly event: unknown };
type MachineArgs = {
  readonly context: ContribContext;
  readonly event: ContribEvent;
};

const acceptsOutcome =
  (outcome: PlayerGuard) =>
  ({ event }: EventArgs): boolean =>
    playerOutputOf(event)?.guard === outcome;

// The entry guard validates the text the current event supplies, before the
// entry action copies it into context.
const validStartContrib = ({ event }: MachineArgs): boolean =>
  event.type === 'START_CONTRIB' && isNonEmptyString(event.callerInput);

const repliesToPendingQuestion = ({ context, event }: MachineArgs): boolean =>
  event.type === 'BOSS_REPLY' &&
  context.pendingBossQuestion !== undefined &&
  (event.questionId === undefined ||
    event.questionId === context.pendingBossQuestion.questionId);

const emptyBossReply = (args: MachineArgs): boolean =>
  repliesToPendingQuestion(args) &&
  args.event.type === 'BOSS_REPLY' &&
  !isNonEmptyString(args.event.answer);

/**
 * Typed context each jumpable working leaf needs to be entered safely.
 *
 * Every routing field below (`contributorOutcome`, `reviewRound`,
 * `reviewVerdict`) is set only by an accepted outcome after `startContrib`
 * stored the validated non-empty `callerInput`, and `startContrib` resets them
 * all, so a set routing field already establishes `<caller-input>`; each
 * guard then checks the routing field plus the target's other relayed values.
 */
const INTERRUPT_PRECONDITIONS = {
  implement: (context: ContribContext) => isNonEmptyString(context.callerInput),
  reviewImplementation: (context: ContribContext) =>
    context.contributorOutcome === 'committed' &&
    isNonEmptyString(context.branch) &&
    isNonEmptyString(context.latestCommit) &&
    isNonEmptyString(context.contributorOutput),
  addressFindings: (context: ContribContext) =>
    context.reviewRound === 1 &&
    context.reviewVerdict === 'hasFindings' &&
    isNonEmptyString(context.branch) &&
    isNonEmptyString(context.maintainerOutput),
  reviewFix: (context: ContribContext) =>
    context.contributorOutcome === 'fixed' &&
    isNonEmptyString(context.branch) &&
    isNonEmptyString(context.latestCommit) &&
    isNonEmptyString(context.contributorOutput),
  reviewRejection: (context: ContribContext) =>
    context.contributorOutcome === 'rejectedAll' &&
    isNonEmptyString(context.branch) &&
    isNonEmptyString(context.contributorOutput),
  openPullRequest: (context: ContribContext) =>
    context.reviewVerdict === 'noFindings' &&
    isNonEmptyString(context.branch),
  openDraftPullRequest: (context: ContribContext) =>
    context.reviewRound === 2 &&
    context.reviewVerdict === 'hasFindings' &&
    isNonEmptyString(context.branch) &&
    isNonEmptyString(context.maintainerOutput),
} as const satisfies Record<
  JumpableStateId,
  (context: ContribContext) => boolean
>;

// ---------------------------------------------------------------------------
// Transition helpers
// ---------------------------------------------------------------------------

/** One guarded root transition per jumpable state. */
function bossInterrupts<const Ids extends readonly JumpableStateId[]>(
  ids: Ids,
) {
  return ids.map((id) => ({
    guard: ({ context, event }: MachineArgs) =>
      event.type === 'BOSS_INTERRUPT' &&
      event.targetId === id &&
      INTERRUPT_PRECONDITIONS[id](context),
    target: `#${id}` as const,
    reenter: true,
    actions: 'resetForInterrupt' as const,
  }));
}

/** One guarded `BOSS_REPLY` resume transition per suspended working leaf. */
function resumableStates<const Ids extends readonly ResumableStateId[]>(
  ids: Ids,
) {
  return ids.map((id) => ({
    guard: (args: MachineArgs) =>
      repliesToPendingQuestion(args) &&
      args.event.type === 'BOSS_REPLY' &&
      isNonEmptyString(args.event.answer) &&
      args.context.pendingBossQuestion?.resumeStateId === id,
    target: `#${id}` as const,
    reenter: true,
    actions: 'rememberBossReply' as const,
  }));
}

const bossReplyFields = (context: ContribContext) => ({
  ...(context.pendingBossQuestion !== undefined
    ? { pendingBossQuestion: context.pendingBossQuestion }
    : {}),
  ...(context.bossReply !== undefined ? { bossReply: context.bossReply } : {}),
});

const callerInputField = (context: ContribContext) =>
  context.callerInput !== undefined ? { callerInput: context.callerInput } : {};

const branchField = (context: ContribContext) =>
  context.branch !== undefined ? { branch: context.branch } : {};

const latestCommitField = (context: ContribContext) =>
  context.latestCommit !== undefined
    ? { latestCommit: context.latestCommit }
    : {};

const contributorOutputField = (context: ContribContext) =>
  context.contributorOutput !== undefined
    ? { contributorOutput: context.contributorOutput }
    : {};

const maintainerOutputField = (context: ContribContext) =>
  context.maintainerOutput !== undefined
    ? { maintainerOutput: context.maintainerOutput }
    : {};

const acceptedOutcome = (
  source: WorkingStateId,
  target: StateKey,
  outcome: PlayerGuard,
) =>
  ({
    type: 'playbook.acceptedOutcome',
    params: { source, target, acceptedOutcome: outcome },
  }) as const;

/** Maintainer affirmed no open findings: Contributor opens a ready PR (CONTRIB-6). */
const noFindingsArm = (
  source: 'reviewImplementation' | 'reviewFix' | 'reviewRejection',
  round: ReviewRound,
) =>
  ({
    guard: 'acceptNoFindings',
    target: '#openPullRequest',
    actions: [
      acceptedOutcome(source, 'openPullRequest', 'noFindings'),
      { type: 'rememberReviewPassed', params: { round } },
      'clearBossReplyContext',
    ],
  }) as const;

/** Findings remain open after the final round: Contributor opens a draft PR (CONTRIB-7). */
const roundTwoHasFindingsArm = (source: 'reviewFix' | 'reviewRejection') =>
  ({
    guard: 'acceptHasFindings',
    target: '#openDraftPullRequest',
    actions: [
      acceptedOutcome(source, 'openDraftPullRequest', 'hasFindings'),
      { type: 'rememberFindings', params: { round: 2 } },
      'clearBossReplyContext',
    ],
  }) as const;

/** Contributor could not push or open the pull request: the workflow fails. */
const notOpenedArm = (source: 'openPullRequest' | 'openDraftPullRequest') =>
  ({
    guard: 'acceptNotOpened',
    target: '#prNotOpened',
    actions: [
      acceptedOutcome(source, 'prNotOpened', 'notOpened'),
      'rememberNotOpened',
      'clearBossReplyContext',
    ],
  }) as const;

const suspendArm = (source: WorkingStateId) =>
  ({
    guard: 'acceptNeedsBossReply',
    target: '#awaitBossReply',
    actions: [
      acceptedOutcome(source, 'awaitBossReply', 'needsBossReply'),
      { type: 'setPendingBossQuestion', params: { resumeStateId: source } },
    ],
  }) as const;

const malformedPlayerOutputArm = {
  target: '#failed',
  actions: ['rememberMalformedPlayerOutput', 'clearBossReplyContext'],
} as const;

const playerOnError = {
  target: '#failed',
  actions: ['rememberActorError', 'clearBossReplyContext'],
} as const;

const startContribArm = {
  guard: 'validStartContrib',
  target: '#implement',
  actions: 'startContrib',
} as const;

const meta = (stateId: Exclude<StateKey, FinalStateKey>, role?: ContribRole) => ({
  playbook: {
    stateId,
    description: STATE_DESCRIPTIONS[stateId],
    ...(role === undefined ? {} : { role }),
  },
});

const finalMeta = (stateId: FinalStateKey, terminal: 'success' | 'failure') => ({
  playbook: {
    stateId,
    description: STATE_DESCRIPTIONS[stateId],
    terminal,
  },
});

// ---------------------------------------------------------------------------
// Machine
// ---------------------------------------------------------------------------

export const contribMachine = setup({
  types: {
    context: {} as ContribContext,
    events: {} as ContribEvent,
    input: {} as ContribInput,
    output: {} as ContribOutput,
  },
  actors: {
    player: fromPromise<PlayerOutput, PlayerInput>(async () => {
      throw new Error('player actor must be provided by the runner');
    }),
  },
  actions: {
    'playbook.acceptedOutcome': (
      _args,
      _params: {
        readonly source: string;
        readonly target: string;
        readonly acceptedOutcome: string;
      },
    ) => undefined,
    startContrib: assign(({ context, event }) =>
      event.type === 'START_CONTRIB'
        ? { ...cleared(context, RUN_FIELDS), callerInput: event.callerInput }
        : {},
    ),
    resetForInterrupt: assign(({ context }) =>
      cleared(context, ['lastError', 'pendingBossQuestion', 'bossReply']),
    ),
    rememberImplementation: assign(({ context, event }) => {
      const output = playerOutputOf(event);
      return output?.guard === 'committed'
        ? {
            ...cleared(context, [
              'maintainerOutput',
              'reviewRound',
              'reviewVerdict',
              'lastError',
            ]),
            contributorOutput: output.contributorOutput,
            branch: output.branch,
            latestCommit: output.latestCommit,
            contributorOutcome: 'committed' as const,
          }
        : {};
    }),
    rememberBlocked: assign(({ context, event }) => {
      const output = playerOutputOf(event);
      return output?.guard === 'blocked'
        ? {
            ...cleared(context, ['lastError']),
            contributorOutput: output.contributorOutput,
            completion: 'blocked' as const,
          }
        : {};
    }),
    rememberFindings: assign(
      ({ context, event }, params: { readonly round: ReviewRound }) => {
        const output = playerOutputOf(event);
        return output?.guard === 'hasFindings'
          ? {
              ...cleared(context, ['lastError']),
              maintainerOutput: output.maintainerOutput,
              reviewRound: params.round,
              reviewVerdict: 'hasFindings' as const,
            }
          : {};
      },
    ),
    rememberReviewPassed: assign(
      ({ context, event }, params: { readonly round: ReviewRound }) =>
        playerOutputOf(event)?.guard === 'noFindings'
          ? {
              ...cleared(context, ['lastError']),
              reviewRound: params.round,
              reviewVerdict: 'noFindings' as const,
            }
          : {},
    ),
    rememberContributorDisposition: assign(({ context, event }) => {
      const output = playerOutputOf(event);
      if (output?.guard === 'fixed') {
        return {
          ...cleared(context, ['lastError']),
          contributorOutput: output.contributorOutput,
          latestCommit: output.latestCommit,
          contributorOutcome: 'fixed' as const,
        };
      }
      if (output?.guard === 'rejectedAll') {
        return {
          ...cleared(context, ['lastError']),
          contributorOutput: output.contributorOutput,
          contributorOutcome: 'rejectedAll' as const,
        };
      }
      return {};
    }),
    rememberPullRequest: assign(({ context, event }) => {
      const output = playerOutputOf(event);
      return output?.guard === 'opened' || output?.guard === 'openedDraft'
        ? {
            ...cleared(context, ['lastError']),
            pullRequestUrl: output.pullRequestUrl,
            branch: output.branch,
            completion: output.guard,
          }
        : {};
    }),
    rememberNotOpened: assign(({ context, event }) => {
      const output = playerOutputOf(event);
      return output?.guard === 'notOpened'
        ? {
            ...cleared(context, ['lastError']),
            contributorOutput: output.contributorOutput,
            completion: 'notOpened' as const,
          }
        : {};
    }),
    setPendingBossQuestion: assign(
      (
        { context, event },
        params: { readonly resumeStateId: ResumableStateId },
      ) => {
        const output = playerOutputOf(event);
        if (output?.guard !== 'needsBossReply') return {};
        const metadata = RESUME_METADATA[params.resumeStateId];
        const pendingBossQuestion: PendingBossQuestion = {
          questionId: params.resumeStateId,
          resumeStateId: params.resumeStateId,
          sourceItem: metadata.sourceItem,
          asker: { kind: 'role', roleId: metadata.role },
          question: output.question,
        };
        return {
          ...cleared(context, ['bossReply', 'lastError']),
          pendingBossQuestion,
        };
      },
    ),
    rememberBossReply: assign(({ event }) =>
      event.type === 'BOSS_REPLY' ? { bossReply: event.answer } : {},
    ),
    clearBossReplyContext: assign(({ context }) =>
      cleared(context, ['pendingBossQuestion', 'bossReply']),
    ),
    rememberActorError: assign(({ event }) => ({
      lastError: errorRecord(actorErrorOf(event)),
    })),
    rememberMalformedPlayerOutput: assign(({ event }) => {
      const output = doneOutputOf(event);
      return {
        lastError: {
          name: 'MalformedPlayerOutput',
          message:
            isRecord(output) && output.guard === 'needsBossReply'
              ? 'Player output declared needsBossReply without a question.'
              : 'Player output did not match an outcome declared for the working state.',
        },
      };
    }),
    rememberMalformedBossReply: assign({
      lastError: {
        name: 'MalformedBossReply',
        message: 'BOSS_REPLY carried an empty answer.',
      },
    }),
  },
  guards: {
    acceptCommitted: acceptsOutcome('committed'),
    acceptBlocked: acceptsOutcome('blocked'),
    acceptHasFindings: acceptsOutcome('hasFindings'),
    acceptNoFindings: acceptsOutcome('noFindings'),
    acceptFixed: acceptsOutcome('fixed'),
    acceptRejectedAll: acceptsOutcome('rejectedAll'),
    acceptOpened: acceptsOutcome('opened'),
    acceptOpenedDraft: acceptsOutcome('openedDraft'),
    acceptNotOpened: acceptsOutcome('notOpened'),
    acceptNeedsBossReply: acceptsOutcome('needsBossReply'),
    validStartContrib,
    emptyBossReply,
  },
}).createMachine({
  id: 'contrib',
  initial: 'ready',
  context: {},
  output: ({ context }): ContribOutput => {
    switch (context.completion) {
      case 'opened':
      case 'openedDraft':
        if (
          !isNonEmptyString(context.pullRequestUrl) ||
          !isNonEmptyString(context.branch)
        ) {
          throw new Error(
            'CONTRIB opened a pull request without its URL and branch name',
          );
        }
        return context.completion === 'opened'
          ? {
              status: 'opened',
              pullRequestUrl: context.pullRequestUrl,
              branch: context.branch,
            }
          : {
              status: 'openedDraft',
              pullRequestUrl: context.pullRequestUrl,
              branch: context.branch,
              draftWithOpenFindings: true,
            };
      case 'blocked':
      case 'notOpened':
        if (!isNonEmptyString(context.contributorOutput)) {
          throw new Error("CONTRIB failed without the Contributor's report");
        }
        return {
          status: context.completion,
          contributorOutput: context.contributorOutput,
        };
      default:
        throw new Error('CONTRIB reached a final state without a recorded completion');
    }
  },
  on: {
    BOSS_INTERRUPT: bossInterrupts([
      'implement',
      'reviewImplementation',
      'addressFindings',
      'reviewFix',
      'reviewRejection',
      'openPullRequest',
      'openDraftPullRequest',
    ] as const),
  },
  states: {
    ready: {
      id: 'ready',
      tags: 'playbook.parked',
      description: STATE_DESCRIPTIONS.ready,
      meta: meta('ready'),
      on: {
        START_CONTRIB: startContribArm,
      },
    },
    implement: {
      id: 'implement',
      tags: 'playbook.busy',
      description: STATE_DESCRIPTIONS.implement,
      meta: meta('implement', 'contributor'),
      invoke: {
        src: 'player',
        input: ({ context }): ImplementPlayerInput => ({
          stateId: 'implement',
          role: 'contributor',
          sourceItem: 'CONTRIB-1',
          prompt: IMPLEMENT_PROMPT,
          result: IMPLEMENT_RESULT,
          ...callerInputField(context),
          ...bossReplyFields(context),
        }),
        onDone: [
          {
            guard: 'acceptCommitted',
            target: '#reviewImplementation',
            actions: [
              acceptedOutcome('implement', 'reviewImplementation', 'committed'),
              'rememberImplementation',
              'clearBossReplyContext',
            ],
          },
          {
            guard: 'acceptBlocked',
            target: '#implementationBlocked',
            actions: [
              acceptedOutcome('implement', 'implementationBlocked', 'blocked'),
              'rememberBlocked',
              'clearBossReplyContext',
            ],
          },
          suspendArm('implement'),
          malformedPlayerOutputArm,
        ],
        onError: playerOnError,
      },
    },
    reviewImplementation: {
      id: 'reviewImplementation',
      tags: 'playbook.busy',
      description: STATE_DESCRIPTIONS.reviewImplementation,
      meta: meta('reviewImplementation', 'maintainer'),
      invoke: {
        src: 'player',
        input: ({ context }): ReviewImplementationPlayerInput => ({
          stateId: 'reviewImplementation',
          role: 'maintainer',
          sourceItem: 'CONTRIB-2',
          prompt: REVIEW_IMPLEMENTATION_PROMPT,
          result: REVIEW_IMPLEMENTATION_RESULT,
          ...callerInputField(context),
          ...branchField(context),
          ...latestCommitField(context),
          ...contributorOutputField(context),
          ...bossReplyFields(context),
        }),
        onDone: [
          {
            guard: 'acceptHasFindings',
            target: '#addressFindings',
            actions: [
              acceptedOutcome('reviewImplementation', 'addressFindings', 'hasFindings'),
              { type: 'rememberFindings', params: { round: 1 } },
              'clearBossReplyContext',
            ],
          },
          noFindingsArm('reviewImplementation', 1),
          suspendArm('reviewImplementation'),
          malformedPlayerOutputArm,
        ],
        onError: playerOnError,
      },
    },
    addressFindings: {
      id: 'addressFindings',
      tags: 'playbook.busy',
      description: STATE_DESCRIPTIONS.addressFindings,
      meta: meta('addressFindings', 'contributor'),
      invoke: {
        src: 'player',
        input: ({ context }): AddressFindingsPlayerInput => ({
          stateId: 'addressFindings',
          role: 'contributor',
          sourceItem: 'CONTRIB-3',
          prompt: ADDRESS_FINDINGS_PROMPT,
          result: ADDRESS_FINDINGS_RESULT,
          ...callerInputField(context),
          ...branchField(context),
          ...maintainerOutputField(context),
          ...bossReplyFields(context),
        }),
        onDone: [
          {
            guard: 'acceptFixed',
            target: '#reviewFix',
            actions: [
              acceptedOutcome('addressFindings', 'reviewFix', 'fixed'),
              'rememberContributorDisposition',
              'clearBossReplyContext',
            ],
          },
          {
            guard: 'acceptRejectedAll',
            target: '#reviewRejection',
            actions: [
              acceptedOutcome('addressFindings', 'reviewRejection', 'rejectedAll'),
              'rememberContributorDisposition',
              'clearBossReplyContext',
            ],
          },
          suspendArm('addressFindings'),
          malformedPlayerOutputArm,
        ],
        onError: playerOnError,
      },
    },
    reviewFix: {
      id: 'reviewFix',
      tags: 'playbook.busy',
      description: STATE_DESCRIPTIONS.reviewFix,
      meta: meta('reviewFix', 'maintainer'),
      invoke: {
        src: 'player',
        input: ({ context }): ReviewFixPlayerInput => ({
          stateId: 'reviewFix',
          role: 'maintainer',
          sourceItem: 'CONTRIB-4',
          prompt: REVIEW_FIX_PROMPT,
          result: REVIEW_FIX_RESULT,
          ...callerInputField(context),
          ...branchField(context),
          ...latestCommitField(context),
          ...contributorOutputField(context),
          ...bossReplyFields(context),
        }),
        onDone: [
          roundTwoHasFindingsArm('reviewFix'),
          noFindingsArm('reviewFix', 2),
          suspendArm('reviewFix'),
          malformedPlayerOutputArm,
        ],
        onError: playerOnError,
      },
    },
    reviewRejection: {
      id: 'reviewRejection',
      tags: 'playbook.busy',
      description: STATE_DESCRIPTIONS.reviewRejection,
      meta: meta('reviewRejection', 'maintainer'),
      invoke: {
        src: 'player',
        input: ({ context }): ReviewRejectionPlayerInput => ({
          stateId: 'reviewRejection',
          role: 'maintainer',
          sourceItem: 'CONTRIB-5',
          prompt: REVIEW_REJECTION_PROMPT,
          result: REVIEW_REJECTION_RESULT,
          ...callerInputField(context),
          ...branchField(context),
          ...contributorOutputField(context),
          ...bossReplyFields(context),
        }),
        onDone: [
          roundTwoHasFindingsArm('reviewRejection'),
          noFindingsArm('reviewRejection', 2),
          suspendArm('reviewRejection'),
          malformedPlayerOutputArm,
        ],
        onError: playerOnError,
      },
    },
    openPullRequest: {
      id: 'openPullRequest',
      tags: 'playbook.busy',
      description: STATE_DESCRIPTIONS.openPullRequest,
      meta: meta('openPullRequest', 'contributor'),
      invoke: {
        src: 'player',
        input: ({ context }): OpenPullRequestPlayerInput => ({
          stateId: 'openPullRequest',
          role: 'contributor',
          sourceItem: 'CONTRIB-6',
          prompt: OPEN_PULL_REQUEST_PROMPT,
          result: OPEN_PULL_REQUEST_RESULT,
          ...callerInputField(context),
          ...branchField(context),
          ...bossReplyFields(context),
        }),
        onDone: [
          {
            guard: 'acceptOpened',
            target: '#prOpened',
            actions: [
              acceptedOutcome('openPullRequest', 'prOpened', 'opened'),
              'rememberPullRequest',
              'clearBossReplyContext',
            ],
          },
          notOpenedArm('openPullRequest'),
          suspendArm('openPullRequest'),
          malformedPlayerOutputArm,
        ],
        onError: playerOnError,
      },
    },
    openDraftPullRequest: {
      id: 'openDraftPullRequest',
      tags: 'playbook.busy',
      description: STATE_DESCRIPTIONS.openDraftPullRequest,
      meta: meta('openDraftPullRequest', 'contributor'),
      invoke: {
        src: 'player',
        input: ({ context }): OpenDraftPullRequestPlayerInput => ({
          stateId: 'openDraftPullRequest',
          role: 'contributor',
          sourceItem: 'CONTRIB-7',
          prompt: OPEN_DRAFT_PULL_REQUEST_PROMPT,
          result: OPEN_DRAFT_PULL_REQUEST_RESULT,
          ...callerInputField(context),
          ...branchField(context),
          ...maintainerOutputField(context),
          ...bossReplyFields(context),
        }),
        onDone: [
          {
            guard: 'acceptOpenedDraft',
            target: '#draftPrOpened',
            actions: [
              acceptedOutcome('openDraftPullRequest', 'draftPrOpened', 'openedDraft'),
              'rememberPullRequest',
              'clearBossReplyContext',
            ],
          },
          notOpenedArm('openDraftPullRequest'),
          suspendArm('openDraftPullRequest'),
          malformedPlayerOutputArm,
        ],
        onError: playerOnError,
      },
    },
    awaitBossReply: {
      id: 'awaitBossReply',
      tags: 'playbook.parked',
      description: STATE_DESCRIPTIONS.awaitBossReply,
      meta: meta('awaitBossReply'),
      on: {
        BOSS_REPLY: [
          {
            guard: 'emptyBossReply',
            target: 'failed',
            actions: ['rememberMalformedBossReply', 'clearBossReplyContext'],
          },
          ...resumableStates([
            'implement',
            'reviewImplementation',
            'addressFindings',
            'reviewFix',
            'reviewRejection',
            'openPullRequest',
            'openDraftPullRequest',
          ] as const),
        ],
        START_CONTRIB: startContribArm,
      },
    },
    failed: {
      id: 'failed',
      tags: 'playbook.parked',
      description: STATE_DESCRIPTIONS.failed,
      meta: meta('failed'),
      on: {
        START_CONTRIB: startContribArm,
      },
    },
    prOpened: {
      id: 'prOpened',
      type: 'final',
      description: STATE_DESCRIPTIONS.prOpened,
      meta: finalMeta('prOpened', 'success'),
    },
    draftPrOpened: {
      id: 'draftPrOpened',
      type: 'final',
      description: STATE_DESCRIPTIONS.draftPrOpened,
      meta: finalMeta('draftPrOpened', 'success'),
    },
    implementationBlocked: {
      id: 'implementationBlocked',
      type: 'final',
      description: STATE_DESCRIPTIONS.implementationBlocked,
      meta: finalMeta('implementationBlocked', 'failure'),
    },
    prNotOpened: {
      id: 'prNotOpened',
      type: 'final',
      description: STATE_DESCRIPTIONS.prNotOpened,
      meta: finalMeta('prNotOpened', 'failure'),
    },
  },
});

export default contribMachine;
