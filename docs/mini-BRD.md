# Mini Business Requirements Document
## SI26_P07 — Sports Squad Constraint Checker

**Source of truth:** `requirements_final.md` (Structured Requirements Specification, SI26_P07).
**Purpose of this document:** state why the product exists and what it must achieve at a business level. Implementation, architecture and technology decisions are deliberately excluded.
**Traceability:** requirement IDs in parentheses refer to `requirements_final.md`.

---

## 1. Business Problem

Students organising an inter-hostel futsal match must assemble a seven-player squad from a fixed roster of nine players (FR-001, ACT-001). A squad is only acceptable if it simultaneously satisfies several independent composition rules — squad size, goalkeeper count, defender and forward minimums, player availability, and a per-cohort ceiling (BR-001 to BR-008).

The organiser makes this selection manually (OBJ-001). Nothing in the current situation gives them a consolidated, rule-by-rule view of which conditions their chosen squad meets and which it breaks; the need for such a view is the stated reason the product exists (OBJ-002). Because the rules interact — a single substitution can simultaneously introduce an unavailable player and breach a cohort ceiling (AC-002) — a partial or first-failure-only check is insufficient (BR-012).

*Flagged:* `requirements_final.md` documents the need for rule visibility but contains no evidence of current error rates, effort, or cost. The business problem is therefore stated qualitatively; no baseline pain metric is available.

---

## 2. Business Objective

| # | Objective | Trace |
|---|---|---|
| 1 | Provide a compact checker that validates a manually selected seven-player squad against the fixed roster. | OBJ-001 |
| 2 | Make every squad rule's outcome visible — satisfied as well as violated — for the current selection. | OBJ-002 |
| 3 | Serve the student organiser by validating their own selection, and only their own selection. | OBJ-003 |
| 4 | Remain strictly a reporting instrument: the product reports rule outcomes and never proposes, ranks or replaces a squad. | BR-013, CON-005, CON-006 |

Objective 4 is a defining characteristic of the product, not merely a limitation. The decision authority stays with the organiser; the product supplies rule transparency only.

---

## 3. Users / Stakeholders

| Stakeholder | Relationship to the product | Trace |
|---|---|---|
| Student user (squad organiser) | Primary user and beneficiary. Selects and deselects players, requests validation, uses sample and reset controls, and reads the counts, rule summary and validation message. | ACT-001 |
| Candidate / developer | Builds the product under the stated delivery constraints. Outside the product boundary. | ACT-003 |
| Evaluator / interviewer | Reviews the plan, prompting approach, design constraints, testing evidence, and requests live modifications. Outside the product boundary. | ACT-004 |

**Assumption flagged in source:** the user model is undefined. A single local, unauthenticated user has to be assumed, since account management is explicitly excluded but no user model is established (ACT-005).

---

## 4. In Scope

The following business capabilities are included.

| Capability | What it covers | Trace |
|---|---|---|
| **C1 — Roster presentation** | Present the fixed nine-player roster with its player, position, cohort and availability attributes, in roster order. | FR-001, FR-002, UI-002, UI-009 |
| **C2 — Manual squad selection** | Allow the organiser to select and deselect roster players freely, including selections of fewer than seven players and players marked unavailable. | FR-003, FR-019, FR-020, UI-003, UI-012 |
| **C3 — Squad validation** | Evaluate every squad rule independently against the current selection and report all outcomes together. | FR-004, FR-012, UI-004 |
| **C4 — Composition metrics** | Show squad size, position counts (goalkeeper, defender, forward, utility) and cohort counts (YEAR_2, YEAR_3). | FR-007, FR-008, FR-009, UI-005 |
| **C5 — Rule outcome reporting** | Show an overall VALID or INVALID status, a per-rule summary, and the complete list of violations in the prescribed order and wording. | FR-010, FR-011, FR-013, FR-014, FR-015, UI-006, UI-007 |
| **C6 — Selection integrity handling** | Detect an unknown or repeated selected player reference and report it as a selection-reference error. | FR-016, ERR-001, ERR-002 |
| **C7 — Result currency** | Guarantee that counts, rule states, violations and status always describe the current selection rather than any earlier validation, and remain mutually consistent. | FR-017, FR-018 |
| **C8 — Sample and reset** | Load the built-in seven-player selection in a single action, and restore the fixed roster and built-in selection on reset. | FR-005, FR-006, UI-008 |
| **C9 — Formation view (optional)** | An optional compact visual formation view driven by the same selection and position data. | FR-021, UI-011, AC-007 |

Capability C9 is the only optional item; C1–C8 are required.

---

## 5. Out of Scope

The following are explicitly excluded and must not be delivered.

| Excluded item | Trace |
|---|---|
| Optimising, selecting, ranking or recommending a squad. | OOS-001, CON-005 |
| Generating or recommending a replacement squad when violations occur. | OOS-006, CON-006 |
| Match management. | OOS-002 |
| Tournament management. | OOS-003 |
| Account management. | OOS-004 |
| Booking management. | OOS-005 |
| Editing, adding or removing roster entries — the roster is fixed and restored on reset. *(Excluded by implication in the source, not by explicit statement.)* | OOS-007, CON-001 |

---

## 6. Key Business Requirements

Consolidated to business level; detailed requirements remain in `requirements_final.md`.

- **KBR-1 — Fixed reference data.** The product operates against one fixed local roster of nine players and preserves its order wherever the selection is displayed. *(C1)*
- **KBR-2 — Organiser-controlled selection.** The squad is chosen entirely by the organiser. The product neither restricts the choice to valid squads nor completes it on the organiser's behalf. *(C2, Objective 4)*
- **KBR-3 — Complete rule evaluation.** All squad rules are evaluated independently and every violation is reported together; evaluation does not stop at the first failure. *(C3)*
- **KBR-4 — Deterministic reporting order and wording.** Violations are reported in the prescribed sequence, with one entry per unavailable selected player in roster order and one entry per breached cohort in YEAR_2 then YEAR_3 order, using the prescribed message formats. *(C5, CON-007)*
- **KBR-5 — Unambiguous overall verdict.** VALID is shown only when no violation exists; otherwise INVALID is shown together with the complete ordered violation list. *(C5, BR-011)*
- **KBR-6 — Visible composition metrics.** Squad size, position counts and cohort counts are shown alongside the verdict so the organiser can see what drove it. *(C4)*
- **KBR-7 — No stale results.** Counts, rule states, violations and status always describe the current selection, and all displayed elements stay consistent with one another. *(C7)*
- **KBR-8 — Predictable starting point.** The built-in seven-player selection can be loaded in one action, and reset returns both the roster and the selection to that baseline with no residual earlier result. *(C8)*
- **KBR-9 — Selection reference integrity.** An unknown or repeated player reference is reported as a selection-reference error rather than silently ignored or partially evaluated. *(C6)*

---

## 7. Business Rules

**Squad validity** — a squad is valid only when all of the following hold:

| Rule | Trace |
|---|---|
| Exactly 7 distinct selected players. | BR-001 |
| Exactly 1 selected goalkeeper. | BR-002 |
| At least 2 selected defenders. | BR-003 |
| At least 2 selected forwards. | BR-004 |
| No selected player is unavailable. | BR-005 |
| No more than 4 selected players from either cohort; a count of exactly 4 is permitted. | BR-006, BR-007 |
| Utility players count toward squad size and cohort totals, but not toward the defender or forward minimums. | BR-008 |
| Selected player references are roster references and must be distinct. | BR-009 |

**Reporting behaviour:**

| Rule | Trace |
|---|---|
| Status is VALID only when there are zero violations; otherwise INVALID with the complete ordered list. | BR-011 |
| Each rule is evaluated independently, and all violations are reported together in the fixed order. | BR-012 |
| The product reports rule outcomes only and never generates or recommends a replacement squad. | BR-013 |

*Inference noted in source (not a stated rule):* with exactly 7 players drawn from only two cohorts, at least one cohort always holds 4 or more players — making the cohort ceiling of exactly 4 the critical boundary condition (BR-014).

---

## 8. Business Success Criteria

Observable conditions demonstrating the product solves the stated problem:

| # | Condition | Trace |
|---|---|---|
| BSC-1 | The built-in squad loads in a single action and is reported VALID, with squad size 7, position counts of 1 goalkeeper, 2 defenders, 2 forwards and 2 utility players, and cohort counts of 4 (YEAR_2) and 3 (YEAR_3). | AC-001 |
| BSC-2 | Substituting S07 with S08 — a single change — is reported INVALID with exactly the unavailable-player and cohort-limit violations, while the size, goalkeeper, defender and forward checks remain shown as satisfied. This demonstrates that multiple independent breaches are surfaced together and that passing rules stay visible. | AC-002 |
| BSC-3 | Removing one player from the baseline squad produces squad size 6 and exactly one violation — the squad-size rule — with no additional violation reported. | AC-003 |
| BSC-4 | Reset restores the original valid counts and rule states, retaining no earlier invalid message. | AC-004 |
| BSC-5 | Roster selection, counts, ordered violations, overall status and the sample/reset actions remain synchronised throughout use. | AC-005 |
| BSC-6 | Focused checks exist for the valid baseline, the S07-to-S08 substitution, the six-player case, and the cohort limit of exactly 4. | AC-006, CON-012 |
| BSC-7 *(optional)* | Where the formation view is provided, it is driven by the same selection and position data as the rest of the product. | AC-007 |

---

## 9. Constraints / Assumptions

**Product constraints**

| Constraint | Trace |
|---|---|
| The roster is fixed and local, comprising exactly the nine supplied entries. | CON-001 |
| The product occupies one primary screen or report. | CON-002 |
| The product must be compact. *(Undefined term — see OQ-2.)* | CON-004 |
| The product must not optimise, select, rank or recommend a squad, and must never generate a replacement squad. | CON-005, CON-006 |
| Violation ordering and message formats are fixed as specified. | CON-007 |
| The delivery medium is left open to the implementer (browser, desktop or mobile, spreadsheet or notebook, or a command-line report). No medium is mandated by this document. | CON-003 |

**Delivery constraints (process, outside the product itself)**

| Constraint | Trace |
|---|---|
| AI coding assistants must be used. | CON-008 |
| A short plan of 3–5 ordered steps with checkpoints must precede implementation. | CON-009 |
| The plan, its changes, the prompts used, the design summary and test evidence must be presentable. | CON-010 |
| The environment must be ready for one small live modification, possibly a second. | CON-011 |

**Assumptions (recorded as assumptions in the source, not established facts)**

- A single local, unauthenticated user (ACT-005).
- Roster data is well formed — unique non-blank identifiers and valid position, cohort and availability values — and is assumed rather than verified (VAL-009).
- Unavailable and non-baseline players are selectable, since the mandated substitution demonstration requires it (FR-020, UI-012).
- Roster maintenance is out of scope by implication rather than explicit exclusion (OOS-007).

---

## 10. Open Questions

Unresolved in `requirements_final.md`; the first two are recorded there as requirement conflicts and should be settled before build.

| ID | Question | Business impact | Trace |
|---|---|---|---|
| OQ-1 | Are counts, rule states and violations recomputed on every selection change, or only when validation is explicitly requested? | Two materially different product behaviours; affects what the organiser sees between changing a selection and validating it. | AMB-003, CONFLICT-001 |
| OQ-2 | When a selection-reference error occurs, what overall status is shown, and how are the cleared counts and rule results presented? | The clearing rule and the always-current rule pull in opposite directions; the user-visible state is undefined. | AMB-004, AMB-006, CONFLICT-002 |
| OQ-3 | Through which input path could an unknown or repeated player reference arise, given selection is made from a fixed nine-row roster? | Determines whether this capability is user-facing at all. | AMB-005 |
| OQ-4 | How is a satisfied rule represented in the rule summary? | Only violation wording is defined, yet showing satisfied rules is a stated objective and a success criterion. | AMB-007 |
| OQ-5 | Are "sample" and "reset" one control or two, and how do they differ if both load the same baseline selection? | Affects the control set the organiser is given. | AMB-011 |
| OQ-6 | Is selecting more than seven players permitted, and what is expected for an empty selection? | Undefined edge behaviour at both ends of the selection range. | AMB-008, AMB-009 |
| OQ-7 | What criteria define "attractive" and "compact"? | Both terms carry acceptance weight but are not objectively testable as written. | AMB-001, AMB-002 |
| OQ-8 | Must the current selection persist between sessions? | Affects expected behaviour on return to the product. | AMB-014 |

A further ten ambiguities are catalogued in `requirements_final.md` (AMB-010, AMB-012, AMB-013, AMB-015 to AMB-018); they are presentation- or evidence-level and do not change the business intent stated above.
