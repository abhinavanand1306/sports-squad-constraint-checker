# SI26_P07 — Sports Squad Constraint Checker
## Structured Requirements Specification (Business / Systems Analysis)

**Source of truth:** the supplied problem statement "SI26_P07: Sports Squad Constraint Checker — AI-Assisted Coding Interview Problem" only.
**Classification key:** EXPLICIT = directly stated · INFERENCE = logically implied · ASSUMPTION = not established by the source.

---

### 1. Objective

| ID | Classification | Requirement | Source Evidence / Rationale |
|---|---|---|---|
| OBJ-001 | EXPLICIT | Provide a compact Sports Squad Constraint Checker that validates a manually selected seven-player squad against a fixed local roster. | "Build a compact Sports Squad Constraint Checker … validate a manually selected seven-player squad against a fixed local roster." |
| OBJ-002 | EXPLICIT | Show every squad rule that is satisfied or violated for the current selection. | "show every squad rule that is satisfied or violated." |
| OBJ-003 | EXPLICIT | Serve students organising an inter-hostel futsal match; the tool validates the user's selection only. | "for students organizing an inter-hostel futsal match"; "The tool validates the user's selection only." |

---

### 2. Actors

| ID | Classification | Actor | Role / Interaction | Source Evidence / Rationale |
|---|---|---|---|---|
| ACT-001 | EXPLICIT | Student user (squad organiser) | Selects and deselects players, triggers Validate Squad, uses sample/reset controls, reads counts, rule summary and validation message. | "for students organizing an inter-hostel futsal match"; "validates the user's selection"; "selection controls, a Validate Squad action … sample/reset controls." |
| ACT-002 | INFERENCE | Checker (the system itself) | Evaluates rules, computes counts, produces ordered violations and overall status. | The source assigns rule evaluation and reporting behaviour to the tool ("The checker must report rules only"), implying the system acts as the evaluating agent; no human evaluator is described. |
| ACT-003 | EXPLICIT | Candidate / developer | Uses AI coding assistants, produces the plan, prompts, design summary and test evidence. Outside the system boundary. | "Use AI coding assistants. Before implementation, create a short plan …" |
| ACT-004 | EXPLICIT | Evaluator / interviewer | Reviews the plan, prompting strategy, design constraints, testing, and requests live modifications. Outside the system boundary. | "How You'll Be Evaluated"; "Be prepared to implement one small modification." |
| ACT-005 | ASSUMPTION | Single local, unauthenticated user | Missing information: the source never describes user identity, roles, permissions or multi-user behaviour, and explicitly excludes accounts. A single-user model would have to be assumed for any interaction design. | "it does not manage matches, tournaments, accounts, or bookings" — exclusion of accounts does not by itself establish a user model. |

---

### 3. Functional Requirements

| ID | Classification | Requirement | Source Evidence / Rationale |
|---|---|---|---|
| FR-001 | EXPLICIT | Load the fixed local roster of nine rows (S01–S09) with Player ID, Student, Position, Cohort, Availability, Selected. | "Load this local roster …" followed by the nine-row table. |
| FR-002 | EXPLICIT | Preserve roster order in the selection display. | "Preserve roster order in the selection display." |
| FR-003 | EXPLICIT | Allow the user to manually select and deselect roster players. | "validate a manually selected seven-player squad"; "selection controls"; "deselect only S07." |
| FR-004 | EXPLICIT | Provide a Validate Squad action. | "a Validate Squad action." |
| FR-005 | EXPLICIT | Load the built-in S01–S07 selection in one action. | "Load the built-in selection in one action"; "select S01 through S07 as the built-in squad." |
| FR-006 | EXPLICIT | Provide a Reset action that restores the fixed roster and the built-in S01–S07 selection. | "Reset restores the fixed roster and the built-in S01 through S07 selection." |
| FR-007 | EXPLICIT | Compute and display squad size for the current selection. | "show … squad size 7"; "show squad size 6." |
| FR-008 | EXPLICIT | Compute and display position counts for goalkeeper, defender, forward and utility. | "position and cohort counts"; "position counts 1 goalkeeper, 2 defenders, 2 forwards, and 2 utility players." |
| FR-009 | EXPLICIT | Compute and display cohort counts for YEAR_2 and YEAR_3. | "cohort counts 4 for YEAR_2 and 3 for YEAR_3." |
| FR-010 | EXPLICIT | Display a rule summary giving the state of each squad rule. | "a rule summary"; "show every squad rule that is satisfied or violated." |
| FR-011 | EXPLICIT | Display an overall validation message: VALID when there are no violations, otherwise INVALID with the complete ordered violation list. | "Show VALID only when there are no violations; otherwise show INVALID with the complete ordered list." |
| FR-012 | EXPLICIT | Evaluate every squad rule independently and report every violation (no short-circuiting on first failure). | "Evaluate every squad rule independently and list every violation." |
| FR-013 | EXPLICIT | Order violations as: SQUAD_SIZE_MUST_BE_7, GOALKEEPER_COUNT_MUST_BE_1, MINIMUM_DEFENDERS_NOT_MET, MINIMUM_FORWARDS_NOT_MET, PLAYER_UNAVAILABLE entries, then COHORT_LIMIT_EXCEEDED entries. | "Use this order: …" (contract bullet 4). |
| FR-014 | EXPLICIT | Emit one `PLAYER_UNAVAILABLE: <ID>` per unavailable selected player, in roster order. | "one PLAYER_UNAVAILABLE: <ID> per unavailable selection in roster order." |
| FR-015 | EXPLICIT | Emit one `COHORT_LIMIT_EXCEEDED: <cohort> has <count>, maximum 4` per exceeded cohort, in YEAR_2 then YEAR_3 order. | "then one COHORT_LIMIT_EXCEEDED: <cohort> has <count>, maximum 4 per exceeded cohort in YEAR_2, YEAR_3 order." |
| FR-016 | EXPLICIT | On an unknown or repeated selected ID, report INVALID_SELECTION_REFERENCE and clear earlier rule results and counts. | "An unknown or repeated selected ID reports INVALID_SELECTION_REFERENCE and clears earlier rule results and counts." |
| FR-017 | EXPLICIT | Ensure counts and individual rule states always describe the current selection, never a previous validation. | "Counts and individual rule states must always describe the current selection, not a previous validation." |
| FR-018 | EXPLICIT | Keep roster selection, counts, ordered violations, overall status and sample/reset actions synchronised. | "Keep the roster selection, counts, ordered violations, overall status, and sample/reset actions synchronized." |
| FR-019 | EXPLICIT | Support a selection of fewer than seven players without blocking the selection. | Acceptance criterion: "Reset, then deselect only S07; show squad size 6 and exactly SQUAD_SIZE_MUST_BE_7." |
| FR-020 | INFERENCE | Allow selection of roster players outside the built-in squad, including a player whose availability is UNAVAILABLE. | The mandated demonstration requires replacing S07 with S08, and S08 is UNAVAILABLE and not part of the built-in selection; the replacement is impossible unless such selection is permitted. |
| FR-021 | EXPLICIT (optional) | Optionally provide a compact visual formation view driven by the same selected-player and position data. | "Optional: Add a compact visual formation view driven by the same selected-player and position data." |

---

### 4. Business Rules

| ID | Classification | Rule | Source Evidence / Rationale |
|---|---|---|---|
| BR-001 | EXPLICIT | A valid squad has exactly 7 distinct selected players. | "A valid squad has exactly 7 distinct selected players." |
| BR-002 | EXPLICIT | A valid squad has exactly 1 selected goalkeeper. | "exactly 1 selected goalkeeper." |
| BR-003 | EXPLICIT | A valid squad has at least 2 selected defenders. | "at least 2 selected defenders." |
| BR-004 | EXPLICIT | A valid squad has at least 2 selected forwards. | "at least 2 selected forwards." |
| BR-005 | EXPLICIT | A valid squad contains no selected unavailable player. | "no selected unavailable player." |
| BR-006 | EXPLICIT | A valid squad has no more than 4 selected players from either cohort. | "no more than 4 selected players from either cohort." |
| BR-007 | EXPLICIT | A cohort count of exactly 4 is permitted; only counts above 4 are violations. | "no more than 4"; "maximum 4"; acceptance criterion names "the cohort limit of exactly 4." |
| BR-008 | EXPLICIT | UTILITY players count toward squad size and cohort totals but not toward defender or forward minimums. | "UTILITY players count toward squad size and cohort totals but not defender or forward minimums." |
| BR-009 | EXPLICIT | Selected player IDs are roster references and must be distinct. | "Treat the selected player IDs as roster references, and require them to be distinct." |
| BR-010 | EXPLICIT | Each roster row has one unique non-blank player ID, one position from GOALKEEPER / DEFENDER / FORWARD / UTILITY, one cohort from YEAR_2 / YEAR_3, and availability AVAILABLE or UNAVAILABLE. | Contract bullet 1. |
| BR-011 | EXPLICIT | Status is VALID only when there are zero violations; otherwise INVALID with the complete ordered list. | "Show VALID only when there are no violations." |
| BR-012 | EXPLICIT | Rule evaluation is independent per rule; all violations are reported together in the fixed order. | "Evaluate every squad rule independently and list every violation. Use this order …" |
| BR-013 | EXPLICIT | The checker reports rules only and must never generate or recommend a replacement squad. | "The checker must report rules only and must never generate or recommend a replacement squad." |
| BR-014 | INFERENCE | Whenever exactly 7 players are selected, at least one cohort necessarily holds 4 or more players, because the roster defines only two cohorts. | Derived from BR-001 and BR-010: 7 players distributed over two cohorts forces a maximum cohort count of at least 4. Relevant to boundary testing; not a stated rule. |

---

### 5. UI Requirements

| ID | Classification | Requirement | Source Evidence / Rationale |
|---|---|---|---|
| UI-001 | EXPLICIT | Use one attractive primary screen or report. | "Use one attractive primary screen or report." |
| UI-002 | EXPLICIT | Display the local roster. | "with the local roster." |
| UI-003 | EXPLICIT | Provide selection controls. | "selection controls." |
| UI-004 | EXPLICIT | Provide a Validate Squad action control. | "a Validate Squad action." |
| UI-005 | EXPLICIT | Display position counts and cohort counts. | "position and cohort counts." |
| UI-006 | EXPLICIT | Display a rule summary. | "a rule summary." |
| UI-007 | EXPLICIT | Display a validation message. | "a validation message." |
| UI-008 | EXPLICIT | Provide sample and reset controls. | "sample/reset controls." |
| UI-009 | EXPLICIT | Display the selection in roster order. | "Preserve roster order in the selection display." |
| UI-010 | EXPLICIT | If delivered as a CLI, produce a clear visual or tabular report. | "or a CLI that produces a clear visual or tabular report." |
| UI-011 | EXPLICIT (optional) | Optional compact visual formation view. | "Optional: Add a compact visual formation view." |
| UI-012 | INFERENCE | The interface must not prevent selection of UNAVAILABLE roster players. | PLAYER_UNAVAILABLE violations and the mandated S07→S08 replacement can only occur if unavailable players are selectable. |

---

### 6. Validation Rules

| ID | Classification | Rule | Source Evidence / Rationale |
|---|---|---|---|
| VAL-001 | EXPLICIT | Every selected ID must resolve to an existing roster row. | "An unknown … selected ID reports INVALID_SELECTION_REFERENCE." |
| VAL-002 | EXPLICIT | Selected IDs must be distinct (no repeats). | "require them to be distinct"; "repeated selected ID reports INVALID_SELECTION_REFERENCE." |
| VAL-003 | EXPLICIT | Selected count must equal 7. | "exactly 7 distinct selected players." |
| VAL-004 | EXPLICIT | Selected goalkeeper count must equal 1. | "exactly 1 selected goalkeeper." |
| VAL-005 | EXPLICIT | Selected defender count must be at least 2. | "at least 2 selected defenders." |
| VAL-006 | EXPLICIT | Selected forward count must be at least 2. | "at least 2 selected forwards." |
| VAL-007 | EXPLICIT | No selected player may have availability UNAVAILABLE. | "no selected unavailable player." |
| VAL-008 | EXPLICIT | Each cohort's selected count must be at most 4. | "no more than 4 selected players from either cohort." |
| VAL-009 | ASSUMPTION | Roster data integrity (unique non-blank IDs, valid position, cohort and availability values) would have to be assumed rather than validated at load. | Missing information: the source states these as properties of the fixed roster (contract bullet 1) but never states that the tool checks them or defines behaviour if they fail. Since the roster is fixed and supplied, an assumption of well-formed data is required to proceed. |

---

### 7. Error Conditions

| ID | Classification | Condition | Expected Behavior if Explicit | Source Evidence / Rationale |
|---|---|---|---|---|
| ERR-001 | EXPLICIT | Selected ID not present in the roster. | Report INVALID_SELECTION_REFERENCE; clear earlier rule results and counts. | Contract bullet 2. |
| ERR-002 | EXPLICIT | Selected ID repeated within the selection. | Report INVALID_SELECTION_REFERENCE; clear earlier rule results and counts. | Contract bullet 2. |
| ERR-003 | EXPLICIT | Selected count is not 7. | Emit SQUAD_SIZE_MUST_BE_7 (position 1 in the ordered list). | Contract bullet 4 order list. |
| ERR-004 | EXPLICIT | Selected goalkeeper count is not 1. | Emit GOALKEEPER_COUNT_MUST_BE_1 (position 2). | Contract bullet 4. |
| ERR-005 | EXPLICIT | Fewer than 2 selected defenders. | Emit MINIMUM_DEFENDERS_NOT_MET (position 3). | Contract bullet 4. |
| ERR-006 | EXPLICIT | Fewer than 2 selected forwards. | Emit MINIMUM_FORWARDS_NOT_MET (position 4). | Contract bullet 4. |
| ERR-007 | EXPLICIT | A selected player is UNAVAILABLE. | Emit `PLAYER_UNAVAILABLE: <ID>` once per such player, in roster order (position 5 block). | Contract bullet 4; demonstration requires `PLAYER_UNAVAILABLE: S08`. |
| ERR-008 | EXPLICIT | A cohort's selected count exceeds 4. | Emit `COHORT_LIMIT_EXCEEDED: <cohort> has <count>, maximum 4` per exceeded cohort, YEAR_2 before YEAR_3 (final block). | Contract bullet 4; demonstration requires `COHORT_LIMIT_EXCEEDED: YEAR_2 has 5, maximum 4`. |

---

### 8. Explicit Constraints

| ID | Classification | Constraint | Source Evidence / Rationale |
|---|---|---|---|
| CON-001 | EXPLICIT | The roster is fixed and local, consisting of exactly the nine supplied rows. | "a fixed local roster"; "Load this local roster." |
| CON-002 | EXPLICIT | The solution uses one primary screen or report. | "Use one attractive primary screen or report." |
| CON-003 | EXPLICIT | The delivery medium is open to the implementer: browser, desktop or mobile tools, spreadsheet or notebook, or CLI. | "You may use a browser, desktop or mobile tools, a spreadsheet or notebook, or a CLI …" |
| CON-004 | EXPLICIT | The tool must be compact. | "Build a compact Sports Squad Constraint Checker." (Term undefined — see AMB-002.) |
| CON-005 | EXPLICIT | The tool must not optimise, select, rank or recommend a squad. | "it must not optimize, select, rank, or recommend a squad." |
| CON-006 | EXPLICIT | The tool must never generate or recommend a replacement squad. | "must never generate or recommend a replacement squad." |
| CON-007 | EXPLICIT | Violation ordering and message formats are fixed as specified. | Contract bullet 4; demonstration text specifying exact violation strings. |
| CON-008 | EXPLICIT | AI coding assistants must be used. | "Use AI coding assistants." |
| CON-009 | EXPLICIT | A short plan of 3–5 ordered steps with useful checkpoints must be created before implementation. | "Before implementation, create a short plan with 3–5 ordered steps and useful checkpoints." |
| CON-010 | EXPLICIT | The candidate must be able to present the plan, explain changes to it, share prompts, summarise the design, and show test evidence. | "Be prepared to present that plan, explain any changes …, share relevant prompts, summarize your design, and show test evidence." |
| CON-011 | EXPLICIT | The environment must be kept ready for one small live modification, possibly a second. | "Be prepared to implement one small modification, and possibly a second if time permits." |
| CON-012 | EXPLICIT | Focused checks must cover the valid baseline, the S07-to-S08 replacement, the six-player case, and the cohort limit of exactly 4. | "include focused checks for the valid baseline, the S07-to-S08 replacement, the six-player case, and the cohort limit of exactly 4." |

---

### 9. Acceptance Criteria

| ID | Classification | Acceptance Criterion | Related Requirement IDs | Source Evidence / Rationale |
|---|---|---|---|---|
| AC-001 | EXPLICIT | Loading the built-in selection in one action yields status VALID, squad size 7, position counts 1 goalkeeper / 2 defenders / 2 forwards / 2 utility, and cohort counts YEAR_2 = 4, YEAR_3 = 3. | FR-005, FR-007, FR-008, FR-009, FR-011 | Acceptance criterion 1. |
| AC-002 | EXPLICIT | Replacing only S07 with S08 yields status INVALID listing exactly `PLAYER_UNAVAILABLE: S08` followed by `COHORT_LIMIT_EXCEEDED: YEAR_2 has 5, maximum 4`, with size, goalkeeper, defender and forward checks still satisfied. | FR-011, FR-013, FR-014, FR-015, BR-005, BR-006 | Acceptance criterion 2 and the one-change demonstration paragraph. |
| AC-003 | EXPLICIT | After Reset, deselecting only S07 yields squad size 6 and exactly `SQUAD_SIZE_MUST_BE_7` with no additional violation. | FR-006, FR-007, FR-019, ERR-003 | Acceptance criterion 3. |
| AC-004 | EXPLICIT | A further Reset restores the original valid counts and rule states, retaining no earlier invalid message. | FR-006, FR-017 | Acceptance criterion 4. |
| AC-005 | EXPLICIT | Roster selection, counts, ordered violations, overall status and sample/reset actions remain synchronised. | FR-017, FR-018 | Acceptance criterion 5. |
| AC-006 | EXPLICIT | Focused checks exist for the valid baseline, the S07-to-S08 replacement, the six-player case, and the cohort limit of exactly 4. | CON-012, BR-007 | Acceptance criterion 5 (second clause). |
| AC-007 | EXPLICIT (optional) | If provided, the compact visual formation view is driven by the same selected-player and position data. | FR-021, UI-011 | Optional acceptance criterion. |

---

### 10. Out-of-Scope Functionality

| ID | Classification | Item | Source Evidence / Rationale |
|---|---|---|---|
| OOS-001 | EXPLICIT | Optimising, selecting, ranking or recommending a squad. | "it must not optimize, select, rank, or recommend a squad." |
| OOS-002 | EXPLICIT | Match management. | "it does not manage matches …" |
| OOS-003 | EXPLICIT | Tournament management. | "… tournaments …" |
| OOS-004 | EXPLICIT | Account management. | "… accounts …" |
| OOS-005 | EXPLICIT | Booking management. | "… or bookings." |
| OOS-006 | EXPLICIT | Generating or recommending a replacement squad. | "must never generate or recommend a replacement squad." |
| OOS-007 | INFERENCE | Editing, adding or removing roster rows. | The roster is described as fixed, is loaded from a supplied table, and Reset restores it; no requirement describes roster modification. Treated as out of scope by implication, not by explicit statement. |

---

### 11. Ambiguities / Missing Information

| ID | Issue | Why It Matters | Clarification Question |
|---|---|---|---|
| AMB-001 | "attractive" primary screen is undefined. | Affects UI acceptance and evaluation; not objectively testable as written. | What specific criteria determine that the primary screen is "attractive"? |
| AMB-002 | "compact" tool is undefined. | Affects scope and effort boundaries. | What measurable limit (screens, files, features, lines) defines "compact"? |
| AMB-003 | Validation trigger conflicts: an explicit Validate Squad action is required, yet counts and rule states "must always describe the current selection" and all elements must stay "synchronized". | Determines whether results recompute live on every selection change or only on the Validate action, and what is displayed between a change and the next validation. | Are counts, rule states and violations recomputed immediately on every selection change, or only when Validate Squad is invoked? |
| AMB-004 | INVALID_SELECTION_REFERENCE's relationship to the overall status is unspecified. | The VALID/INVALID rule is defined only in terms of squad-rule violations; the reference error is defined separately and clears rule results. | When INVALID_SELECTION_REFERENCE occurs, what overall status is shown, and is the code displayed inside the ordered violation list or as a separate message? |
| AMB-005 | The workflow that could produce an unknown or repeated selected ID is undescribed, given selection is made from a fixed nine-row roster via selection controls. | Determines whether free-text or import-based ID entry is required at all, or whether this contract applies only to an internal selection input. | Through which input path can a user submit an unknown or repeated player ID? |
| AMB-006 | "clears earlier rule results and counts" does not define the resulting display state. | Affects what the user sees for counts and rule summary during the error state. | When results and counts are cleared, are they shown as blank, zero, or hidden entirely? |
| AMB-007 | The rule summary must show rules that are satisfied as well as violated, but no labels, codes or format for satisfied states are given. | Only violation codes are specified; satisfied-state presentation is undefined but required by AC-002 ("checks remain satisfied"). | What text or indicator represents a satisfied rule in the rule summary? |
| AMB-008 | Behaviour when more than 7 players are selected is unspecified beyond the size rule. | Determines whether the UI caps selection at 7 or permits larger selections that then fail SQUAD_SIZE_MUST_BE_7. | May the user select more than seven players, and if so does only SQUAD_SIZE_MUST_BE_7 fire? |
| AMB-009 | Behaviour with zero selected players is unspecified. | Edge case affecting counts display, goalkeeper/defender/forward violations and status. | With an empty selection, which violations are expected and in what order? |
| AMB-010 | Whether UNAVAILABLE players are visually distinguished or restricted in the selection controls is unspecified. | Affects UI design and the ability to perform the mandated S07-to-S08 demonstration. | Should UNAVAILABLE players be marked, disabled, or presented identically to available players? |
| AMB-011 | "sample/reset controls" may denote one control or two, and the sample action overlaps with Reset since both load S01–S07. | Affects the control set and AC-001 vs AC-003/AC-004 test steps. | Are "sample" and "reset" separate controls, and if so how does sample behaviour differ from reset? |
| AMB-012 | Exact rendering of violation strings is unspecified (whether the literal codes shown are the displayed text or internal identifiers). | AC-002 requires exact output; display wording must be pinned down for testing. | Must violation codes be displayed verbatim as written, or may they be rendered as human-readable text? |
| AMB-013 | The overall status vocabulary is given as VALID / INVALID, but placement and formatting relative to the rule summary is unspecified. | Affects UI acceptance and test assertions. | Where must the VALID/INVALID message appear relative to the counts and the violation list? |
| AMB-014 | Persistence of state between sessions is not mentioned. | Determines whether selections survive reload or restart. | Must the current selection persist across sessions, or always start from the built-in selection? |
| AMB-015 | Whether roster contract properties (unique non-blank IDs, valid position/cohort/availability values) are validated at load, and the behaviour if violated, is unspecified. | The roster is fixed, so failure may be impossible in practice, but the contract is stated as a requirement. | Must the tool validate the roster itself, and what should happen if a roster row breaches the contract? |
| AMB-016 | The optional formation view has no stated effect on acceptance or evaluation weighting. | Affects prioritisation of effort. | Does omitting the optional formation view affect acceptance in any way? |
| AMB-017 | "focused checks" is not defined as automated tests versus manual verification steps. | Affects the form of required test evidence. | Must the focused checks be automated tests, or is documented manual evidence sufficient? |
| AMB-018 | Whether a "position count" display must always include UTILITY as a separate line is implied by AC-001 but not stated in the contracts. | Affects the counts panel layout. | Must utility players be shown as a distinct position count at all times? |

---

### 12. Analysis Summary

| Metric | Count |
|---|---|
| EXPLICIT items | 91 |
| INFERENCE items | 5 |
| ASSUMPTION items | 2 |
| Ambiguities / missing information | 18 |
| Total classified requirement items | 98 |

**Category breakdown (EXPLICIT / INFERENCE / ASSUMPTION):**
Objective 3/0/0 · Actors 3/1/1 · Functional 20/1/0 · Business Rules 13/1/0 · UI 11/1/0 · Validation 8/0/1 · Errors 8/0/0 · Constraints 12/0/0 · Acceptance Criteria 7/0/0 · Out-of-Scope 6/1/0

**Detected requirement conflicts:**

1. **CONFLICT-001 — Validation trigger.** An explicit `Validate Squad` action (FR-004) implies on-demand evaluation, while FR-017 ("counts and individual rule states must always describe the current selection") and FR-018 (synchronisation of selection, counts, violations and status) imply continuous recalculation. Both interpretations are materially different in behaviour. Not resolved — see AMB-003.
2. **CONFLICT-002 — Clearing versus always-current.** FR-016 requires that an invalid selection reference *clears* counts and earlier rule results, while FR-017 requires that counts always describe the current selection. The cleared state is not described as a valid description of the current selection. Not resolved — see AMB-004 and AMB-006.
3. **Potential tension (not a conflict).** OBJ-002 requires showing every rule "satisfied or violated", while BR-011 defines the message as VALID or INVALID plus violations only. These are reconcilable if the rule summary (UI-006) and the validation message (UI-007) are distinct elements, but the source does not state this explicitly — see AMB-007.

**Internal consistency note (no requirement derived):** the worked examples in the source are arithmetically consistent with the stated rules — the built-in S01–S07 selection produces the stated counts, the S07→S08 replacement produces exactly the two stated violations, and the S01–S06 case produces only the size violation.

**Categories with no supported items:** None — every category yielded at least one supported item.
