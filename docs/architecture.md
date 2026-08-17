# Sports Squad Constraint Checker — Recommended Technical Architecture

## 1. Architecture Summary

**Recommended approach:** Build a small **client-only React application** with a **pure JavaScript validation function**.

Do **not** use:

- Express/backend
- MongoDB/database
- React Router
- Redux or another global state library
- Authentication
- API/data-fetching libraries
- Large UI frameworks
- Generic rule-engine abstractions

The application should have three simple architectural parts:

```text
Fixed roster/configuration
        ↓
React selection state
        ↓
Pure validateSquad()
        ↓
Counts + rule states + violations + status
        ↓
Single-screen React UI
```

This architecture is deliberately optimized for:

1. Simplicity
2. Ease of testing
3. Ease of explaining every decision in the interview
4. Ease of making a small live modification
5. Minimal dependencies
6. No over-engineering

The original problem statement is the source of truth. The architecture below is designed only to satisfy the required Sports Squad Constraint Checker behavior.

---

# 2. Recommended Technology Stack and Why

## 2.1 Technology Decision Matrix

| Technology | Decision | Reason |
|---|---|---|
| React | Use | Familiar, simple component model, easy synchronization between selection and derived output |
| JavaScript | Use | Fully sufficient for the small deterministic domain |
| Vite / minimal React setup | Use | Fast local startup and minimal configuration |
| Plain CSS | Use | Enough for one attractive compact screen without a UI framework |
| Vitest | Use | Simple unit testing for pure JavaScript validation logic |
| React Testing Library | Use | Useful for a small number of UI interaction/integration tests |
| Express | Do not use | There is no server responsibility |
| MongoDB | Do not use | No persistence requirement exists |
| React Router | Do not use | The problem requires one primary screen |
| Redux / Zustand | Do not use | Application state is extremely small |
| Authentication | Do not use | Accounts are explicitly out of scope |
| Axios / TanStack Query | Do not use | There is no API |
| Formik / React Hook Form | Do not use | Nine fixed roster controls do not justify a form framework |
| Material UI / large UI library | Prefer not to use | Unnecessary dependency for one compact screen |
| Generic rules engine | Do not use | The rule set is small, fixed, and easier to explain directly |

---

## 2.2 Why React?

React is **not required** by the problem statement. A vanilla HTML/JavaScript solution could solve the problem.

React is still recommended because:

- it is already familiar to the developer;
- several parts of the UI depend on the same selection;
- components make the screen easier to organize;
- React naturally re-renders counts and rule states when selection changes;
- live UI changes during the interview are easy;
- business logic can remain separate from presentation logic.

A useful interview answer is:

> React was not technically necessary. I selected it because I am comfortable with it and because the application contains several synchronized UI views driven by the same selection state. I deliberately did not add the rest of the MERN stack because the problem does not require it.

---

# 3. Technologies and Components to Deliberately Avoid

## 3.1 Express / Node Backend — Do Not Use

The roster is explicitly fixed and local.

There is no:

- remote data source;
- account system;
- shared multi-user state;
- server-side business process;
- persistence requirement.

This would be unnecessary:

```text
React → HTTP → Express → static roster array
```

This is sufficient:

```text
React → static roster array
```

Using Express would add:

- API routes;
- request/response handling;
- server startup;
- network failure possibilities;
- CORS/deployment concerns;
- extra code to explain.

None of those solve a requirement.

---

## 3.2 MongoDB — Do Not Use

There is nothing meaningful to persist.

The roster is fixed and roster maintenance is outside the scope.

Adding MongoDB would require:

- schema/model definitions;
- database setup;
- connection handling;
- CRUD APIs;
- deployment configuration;
- database error handling.

This would be over-engineering.

---

## 3.3 React Router — Do Not Use

The product requires **one primary screen or report**.

There are no independent routes such as:

```text
/home
/players
/validation
/settings
```

Everything belongs on one page.

---

## 3.4 Redux / Zustand / Global State Management — Do Not Use

The application has only one important mutable business value:

```text
selected player IDs
```

Using Redux would create unnecessary concepts such as:

```text
store
actions
reducers
selectors
provider
```

For this scope, local React state is easier to understand and defend.

---

## 3.5 Authentication — Do Not Use

Accounts are explicitly outside scope.

Authentication would introduce functionality that is not required.

---

## 3.6 API/Data Fetching Libraries — Do Not Use

Do not add:

- Axios
- TanStack Query
- SWR

There is no backend or API to call.

---

## 3.7 Form Libraries — Do Not Use

Do not add:

- Formik
- React Hook Form

The interface contains a small fixed roster and simple selection controls.

Native React event handling is sufficient.

---

## 3.8 Large UI Frameworks — Prefer Not to Use

Avoid unnecessary dependencies such as Material UI unless there is a very strong reason.

Plain CSS is enough for:

- roster table/card design;
- selected state;
- status badges;
- counts;
- rule summary;
- validation output.

The goal is an attractive **compact** interface, not a reusable enterprise design system.

---

## 3.9 Generic Rules Engine — Do Not Use

Avoid architectures such as:

```text
RuleFactory
RuleRegistry
RuleStrategy
RuleExecutor
ValidationPipeline
```

There are only a small number of fixed rules.

A direct, explicit validation function is:

- easier to read;
- easier to test;
- easier to explain;
- easier to change live.

---

# 4. High-Level Architecture

The application should use a simple functional core with a React presentation shell.

```text
┌─────────────────────────────────────┐
│              React UI               │
│                                     │
│  Roster          Counts             │
│  Selection       Rule Summary       │
│  Controls        Validation Result  │
└───────────────────┬─────────────────┘
                    │
                selectedIds
                    │
                    ▼
┌─────────────────────────────────────┐
│         Pure Validation Core        │
│                                     │
│  reference validation               │
│  selected-player resolution         │
│  count calculation                  │
│  independent rule evaluation        │
│  ordered violation construction     │
│  VALID / INVALID calculation        │
└───────────────────┬─────────────────┘
                    │
                    ▼
┌─────────────────────────────────────┐
│          Static roster data         │
│       S01 ... S09 + baseline        │
└─────────────────────────────────────┘
```

There should be only three main architectural areas:

1. **Static roster/configuration**
2. **Pure validation/domain logic**
3. **React UI**

Do not add:

- repositories;
- services;
- controllers;
- models;
- API layers;
- persistence layers.

The difficult part of the assignment is deterministic rule evaluation, not data access.

---

# 5. Application Data Flow

Normal interaction:

```text
User selects/deselects a player
            ↓
React updates selectedIds
            ↓
selectedIds + fixed roster
            ↓
validateSquad(...)
            ↓
Current validation analysis
            ↓
Counts
Rule states
Violations
Status
            ↓
React renders the current state
```

There is no:

```text
API request
database call
async loading
cache
server synchronization
```

This makes the application deterministic and easy to debug.

---

# 6. Resolve the Validate Squad vs Always-Current Requirement

There is a specification tension:

- a **Validate Squad** action is explicitly required;
- counts and individual rule states must always describe the **current** selection;
- earlier invalid results must not remain visible for a changed selection.

Recommended resolution:

## Counts and rule states

Compute them continuously from the current selection.

## Validate Squad button

Use the button to reveal or confirm the overall verdict:

```text
VALID
```

or:

```text
INVALID
+ complete ordered violations
```

If the user changes the selection after validation:

1. update the current selection immediately;
2. recompute current counts and rule states immediately;
3. hide the previous overall verdict/violation output;
4. require Validate Squad again to show the new overall result.

This ensures that a previous result is never shown as though it applies to the changed selection.

This interpretation preserves both:

- the required Validate Squad action;
- the no-stale-results requirement.

---

# 7. State Design

A major design goal should be to maintain **one source of truth**.

## 7.1 Store

### `selectedIds`

Conceptually:

```text
[
  "S01",
  "S02",
  "S03",
  "S04",
  "S05",
  "S06",
  "S07"
]
```

This is the main mutable business state.

### `hasValidatedCurrentSelection`

A small UI state indicating whether the current selection's verdict should be displayed.

That is enough.

---

## 7.2 Do Not Store Derived Values

Do not independently store:

```text
squadSize

goalkeeperCount
defenderCount
forwardCount
utilityCount

year2Count
year3Count

ruleStates
violations
status
```

All of these can be derived from:

```text
roster + selectedIds
```

A dangerous state design would be:

```text
selectedIds state
counts state
rule state
violations state
status state
```

These separate values can become inconsistent.

Preferred design:

```text
selectedIds
    ↓
validateSquad()
    ↓
everything else
```

This directly supports the requirement that:

- counts describe the current selection;
- rule states describe the current selection;
- violations correspond to the current selection;
- status corresponds to the current selection.

---

# 8. Fixed Roster State

Do **not** store the roster in React state.

The roster is fixed by the specification.

Use a static constant:

```text
ROSTER
```

rather than mutable state such as:

```text
roster / setRoster
```

Reset does not need to rebuild or fetch the roster.

Reset only needs to restore the built-in selected IDs.

Benefits:

- simpler;
- impossible for UI actions to accidentally modify roster data;
- easier reset behavior;
- easier testing.

---

# 9. Validation Engine Design

The validation engine should be the most important part of the architecture.

Use one pure function conceptually:

```text
validateSquad(roster, selectedIds)
```

It should have:

- no React dependencies;
- no DOM access;
- no browser API usage;
- no networking;
- no mutable global state.

The same inputs should always generate the same output.

This makes unit testing extremely simple.

---

# 10. Validation Engine Processing Steps

## Step 1 — Validate Selection References

Before applying squad rules, validate that:

```text
Every selected ID exists in the roster
```

and:

```text
Every selected ID is distinct
```

If either condition fails, return:

```text
INVALID_SELECTION_REFERENCE
```

and do not return previous counts or rule results.

Even though normal checkbox selection cannot create duplicates or unknown IDs, this validation must still exist because it is part of the explicit contract.

The important architectural decision is:

> Enforce reference integrity in the validation core without adding unnecessary free-text input to the UI.

---

## Step 2 — Resolve Selected Players in Roster Order

Do not rely on click order.

The user may click players in any order.

Instead, iterate over the fixed roster and select rows whose IDs appear in `selectedIds`.

Example:

```text
Roster:
S01
S02
S03
...
S09

selectedIds:
S08
S02
S01
```

Resolved selected players should still follow:

```text
S01
S02
S08
```

This automatically satisfies the requirement that unavailable-player violations appear in roster order.

---

## Step 3 — Calculate Counts Once

Calculate all composition metrics from the resolved selected players.

Conceptually:

```text
counts:
  squadSize

  positions:
    goalkeeper
    defender
    forward
    utility

  cohorts:
    YEAR_2
    YEAR_3
```

UTILITY players count toward:

```text
squad size
cohort totals
```

but do not count toward:

```text
defender minimum
forward minimum
```

The counting logic should run once per validation analysis and be reused by the rules.

---

## Step 4 — Evaluate Every Rule Independently

Evaluate:

```text
Exactly 7 players
Exactly 1 goalkeeper
At least 2 defenders
At least 2 forwards
No unavailable selected players
Maximum 4 players in each cohort
```

Do not short-circuit.

Incorrect design:

```text
if squad size is invalid:
    return
```

Correct design:

```text
evaluate squad size
evaluate goalkeeper rule
evaluate defender rule
evaluate forward rule
evaluate availability rule
evaluate cohort rule
```

All violations must be collected.

---

## Step 5 — Construct Violations in Explicit Required Order

Violation ordering is part of the contract.

Build violations deliberately in this order:

```text
1. SQUAD_SIZE_MUST_BE_7

2. GOALKEEPER_COUNT_MUST_BE_1

3. MINIMUM_DEFENDERS_NOT_MET

4. MINIMUM_FORWARDS_NOT_MET

5. PLAYER_UNAVAILABLE: <ID>
   one per unavailable player
   in roster order

6. COHORT_LIMIT_EXCEEDED: <cohort> has <count>, maximum 4
   YEAR_2 first
   YEAR_3 second
```

Do **not** generate violations and alphabetically sort afterward.

The function itself should append them in the required business order.

This is easier to verify and defend.

---

## Step 6 — Calculate Overall Status

After all rules are evaluated:

```text
0 violations
    ↓
VALID
```

```text
1 or more violations
    ↓
INVALID
```

The overall status should be derived from the violation result, not independently stored.

---

# 11. Suggested Validation Result Shape

Conceptually, normal validation analysis can return:

```text
counts
ruleStates
violations
status
```

For an invalid selection reference, return an explicit selection-reference error state instead of a partial rule evaluation.

Conceptually:

```text
referenceError:
  INVALID_SELECTION_REFERENCE
```

with counts and normal rule results absent/cleared.

Do not invent additional user-facing behavior that the specification does not define.

---

# 12. Recommended React Component Breakdown

Keep the component tree small.

```text
App
│
├── Controls
├── RosterTable
├── CountsPanel
├── RuleSummary
└── ValidationPanel
```

---

## 12.1 `App`

Responsibilities:

```text
selectedIds state
hasValidatedCurrentSelection state

toggle player selection

load built-in sample
reset

handle Validate Squad

obtain validation analysis
pass data to child components
```

`App` acts as the screen-level container.

Do not put low-level rule logic inside `App`.

---

## 12.2 `RosterTable`

Responsibilities:

- display all nine fixed roster players;
- preserve roster order;
- display:
  - player ID;
  - student;
  - position;
  - cohort;
  - availability;
  - selected state;
- allow select/deselect.

Unavailable players should remain selectable.

This is necessary because the required invalid demonstration specifically requires replacing S07 with unavailable S08.

The checker must **report** invalid selections rather than prevent the user from creating them.

---

## 12.3 `CountsPanel`

Read-only component.

Displays current metrics such as:

```text
Squad Size: 7

Goalkeeper: 1
Defender: 2
Forward: 2
Utility: 2

YEAR_2: 4
YEAR_3: 3
```

It should receive counts as props.

It should not calculate business rules.

---

## 12.4 `RuleSummary`

Displays each business rule and whether it is currently:

```text
Satisfied
```

or:

```text
Violated
```

Suggested rule summary entries:

```text
Squad size exactly 7
Exactly 1 goalkeeper
At least 2 defenders
At least 2 forwards
All selected players available
Maximum 4 players from each cohort
```

Again, this component should render rule state but not own the validation logic.

---

## 12.5 `ValidationPanel`

Displays the validation outcome.

Valid example:

```text
VALID
```

Invalid example:

```text
INVALID

PLAYER_UNAVAILABLE: S08
COHORT_LIMIT_EXCEEDED: YEAR_2 has 5, maximum 4
```

Exact violation strings should be rendered exactly according to the specification.

---

## 12.6 `Controls`

Contains the required actions:

```text
Load Sample
Validate Squad
Reset
```

The sample and reset actions may internally reuse the same built-in baseline constant rather than duplicating the selection array.

---

# 13. Components Not to Create

Do not create unnecessary components/architectural layers such as:

```text
DashboardPage
ValidationProvider
SquadContext
useSquadStore
SquadService
RosterRepository
ValidationController
RuleFactory
```

They would not have enough responsibility to justify their existence.

---

# 14. Recommended Folder Structure

Keep the project small enough that an interviewer can understand the codebase quickly.

```text
sports-squad-checker/
│
├── src/
│   │
│   ├── App.jsx
│   ├── app.css
│   │
│   ├── data/
│   │   └── roster.js
│   │
│   ├── domain/
│   │   └── validateSquad.js
│   │
│   └── components/
│       ├── Controls.jsx
│       ├── RosterTable.jsx
│       ├── CountsPanel.jsx
│       ├── RuleSummary.jsx
│       └── ValidationPanel.jsx
│
├── tests/
│   ├── validateSquad.test.js
│   └── App.test.jsx
│
├── package.json
└── README.md
```

Avoid folders such as:

```text
api/
services/
store/
reducers/
contexts/
pages/
routes/
models/
repositories/
controllers/
middleware/
```

unless a future requirement actually creates a responsibility for them.

---

# 15. Testing Strategy

The primary testing target is the **validation engine**, not React.

The domain rules are the core of the application.

---

## 15.1 Unit Tests — Validation Engine

### Test 1 — Built-In Valid Baseline

Selection:

```text
S01
S02
S03
S04
S05
S06
S07
```

Expected:

```text
VALID
```

Counts:

```text
size = 7

goalkeeper = 1
defender = 2
forward = 2
utility = 2

YEAR_2 = 4
YEAR_3 = 3
```

Violations:

```text
[]
```

This directly checks the required baseline acceptance case.

---

### Test 2 — Required S07 → S08 Replacement

Selection:

```text
S01
S02
S03
S04
S05
S06
S08
```

Expected status:

```text
INVALID
```

Expected violation list exactly:

```text
PLAYER_UNAVAILABLE: S08
COHORT_LIMIT_EXCEEDED: YEAR_2 has 5, maximum 4
```

No violations should appear for:

- squad size;
- goalkeeper count;
- defender minimum;
- forward minimum.

---

### Test 3 — Required Six-Player Case

Selection:

```text
S01
S02
S03
S04
S05
S06
```

Expected size:

```text
6
```

Expected violations exactly:

```text
SQUAD_SIZE_MUST_BE_7
```

There should be no additional violations.

---

### Test 4 — Cohort Boundary

Verify the exact boundary:

```text
4 players from a cohort
→ allowed
```

```text
5 players from a cohort
→ COHORT_LIMIT_EXCEEDED
```

This is an important boundary test.

---

### Test 5 — Unknown Selection Reference

Pass a selected ID not present in the roster, for example:

```text
S99
```

Expected:

```text
INVALID_SELECTION_REFERENCE
```

Counts and normal rule results should not be treated as valid partial output.

---

### Test 6 — Repeated Selection Reference

Example conceptual input:

```text
S01
S01
S02
...
```

Expected:

```text
INVALID_SELECTION_REFERENCE
```

---

### Test 7 — Multi-Violation Ordering

Create a selection that breaks several rules and confirm the violations are returned in the exact required order:

```text
SQUAD_SIZE_MUST_BE_7
GOALKEEPER_COUNT_MUST_BE_1
MINIMUM_DEFENDERS_NOT_MET
MINIMUM_FORWARDS_NOT_MET
PLAYER_UNAVAILABLE entries
COHORT_LIMIT_EXCEEDED entries
```

This verifies the contract rather than merely checking whether violations exist.

---

# 16. React Integration Tests

Only a few UI tests are necessary.

## Integration Test 1

Select/deselect a player.

Verify that current counts and rule states update for the new selection.

---

## Integration Test 2

Perform:

```text
S07 → S08
```

then Validate Squad.

Verify the UI shows exactly:

```text
INVALID

PLAYER_UNAVAILABLE: S08
COHORT_LIMIT_EXCEEDED: YEAR_2 has 5, maximum 4
```

---

## Integration Test 3

Create an invalid state.

Press Reset.

Verify:

- S01–S07 are selected;
- S08 and S09 are not selected;
- counts return to baseline;
- previous invalid output disappears;
- current rule states are valid.

---

# 17. Manual Test Evidence for the Interview

Save screenshots or output evidence for at least:

1. Built-in valid baseline
2. S07 → S08 invalid scenario
3. Six-player scenario
4. Reset back to valid baseline

This gives visible test evidence in addition to automated tests.

---

# 18. Testing Tools Not Required

Do not introduce:

- Cypress;
- Playwright;
- Selenium;
- test databases;
- HTTP mock servers.

They provide little value for a one-screen local deterministic application.

Vitest plus a small number of React Testing Library tests are sufficient.

---

# 19. Design Choices to Be Prepared to Defend

## Question: Why React for such a small problem?

Suggested answer:

> React was not required by the problem statement, but I chose it because I am already comfortable with it and several UI elements must remain synchronized with the same player selection. React gives me a simple component model and predictable re-rendering. I deliberately avoided adding the backend/database portions of MERN because there was no requirement for them.

---

## Question: Why no backend?

Suggested answer:

> The roster is explicitly fixed and local. There is no persistence, authentication, shared multi-user state, or server-side process, so a backend would add network and deployment complexity without solving a requirement.

---

## Question: Why no MongoDB?

Suggested answer:

> There is no data that needs to be created or persisted. The roster is fixed, and roster maintenance is outside scope, so introducing a database would add unnecessary complexity.

---

## Question: Why separate validation from the React components?

Suggested answer:

> The validation rules are the core business logic. Keeping them in a pure JavaScript function makes them independently testable and prevents presentation logic from affecting rule correctness. It also makes live rule changes easier because I know exactly where the business behavior lives.

---

## Question: Why don't you store counts in React state?

Suggested answer:

> Counts are fully derived from the selected player IDs. Storing both the selection and the counts would create multiple sources of truth and risk stale or inconsistent output. I store the selection once and derive everything else.

---

## Question: Why can the user select unavailable players?

Suggested answer:

> The product is a checker, not a squad-selection restrictor. The required demonstration specifically asks me to replace S07 with unavailable S08 and report PLAYER_UNAVAILABLE: S08, so unavailable players must remain selectable.

---

## Question: Why validate unknown or repeated IDs if checkboxes cannot create them?

Suggested answer:

> Because reference integrity is explicitly part of the domain contract. I enforce that rule at the validation boundary without inventing a free-text UI that the problem never requested.

---

## Question: Why not use a generic rules framework?

Suggested answer:

> There are only a handful of fixed rules. Explicit checks are easier to read, test, and modify than introducing abstraction layers designed for a large configurable rules system.

---

## Question: Why no persistence?

Suggested answer:

> Session persistence is not specified. Adding localStorage or a database would introduce behavior that is outside the required scope.

---

## Question: Why omit the optional formation view initially?

Suggested answer:

> It is explicitly optional. I would first prioritize the required validation behavior, exact output ordering, testing, and live-modification readiness. If the mandatory work is complete, the formation view can be added without changing the architecture.

---

# 20. Likely Live Modifications

The architecture should make small interview modifications localized and predictable.

These are examples of plausible modifications, not additional requirements.

---

## Modification 1 — Change Cohort Maximum

Example:

```text
maximum cohort size changes from 4 to 3
```

Change:

- cohort validation threshold;
- relevant rule description if necessary;
- unit tests.

No React architecture change.

No database migration.

No API change.

---

## Modification 2 — Change Squad Size

Example:

```text
squad size changes from 7 to 8
```

Change:

- squad-size rule;
- relevant text;
- tests.

Everything else remains unchanged.

---

## Modification 3 — Change Defender Requirement

Example:

```text
minimum defenders changes from 2 to 3
```

Change one rule and its tests.

---

## Modification 4 — Add a Utility Limit

Example:

```text
maximum 2 utility players
```

Add:

- one independent validation check;
- one rule-summary item;
- one violation message;
- tests.

No architectural restructuring is needed.

---

## Modification 5 — Change Violation Ordering

Only the violation-construction sequence inside the validation core changes.

The UI continues to render the returned list.

---

## Modification 6 — Add a Player to the Fixed Roster

Update static roster data.

Because the table and validator work from the roster array, they should automatically support the additional row.

---

## Modification 7 — Change the Built-In Sample Squad

Update only the baseline selected-ID constant.

Sample and Reset can reuse that constant.

---

## Modification 8 — Add the Optional Formation View

Add one read-only component:

```text
FormationView
```

It should receive the same selected-player and position data already used elsewhere.

Do not create another selection state for the formation.

Conceptually:

```text
selectedIds
    ↓
selectedPlayers
    ├── RosterTable
    ├── CountsPanel
    ├── RuleSummary
    └── FormationView
```

This preserves synchronization.

---

# 21. Final Architecture Summary

The solution should be described in the interview as:

> **A client-only React application with one source of mutable business state—the selected player IDs—and a pure JavaScript validation function that derives counts, rule states, ordered violations, and status from the fixed local roster.**

Architecture summary:

```text
                 FIXED ROSTER
                      │
                      │
                      ▼
USER ───────► selectedIds
                      │
                      ▼
              validateSquad()
                      │
           ┌──────────┼───────────┐
           ▼          ▼           ▼
        Counts     Rules      Violations
                                   │
                                   ▼
                              VALID/INVALID
           └──────────┬────────────┘
                      ▼
                  React UI
```

The deliberate architectural choices are:

```text
React                  YES
JavaScript             YES
Pure validation core   YES
Plain CSS              YES
Focused tests          YES

Express                 NO
MongoDB                 NO
Router                  NO
Redux                   NO
Authentication          NO
API layer               NO
Generic rule engine     NO
Large framework stack   NO
```

The most important engineering principle is:

> **Store the user's selection once. Derive everything else.**

This minimizes synchronization bugs and directly supports the requirement that counts, rule states, ordered violations, and status correspond to the current selection.

The second most important principle is:

> **Keep business rules outside the UI in one deterministic, testable validation function.**

That gives the application strong correctness, easy testing, easy explanation, and excellent live-modification capability without over-engineering.
