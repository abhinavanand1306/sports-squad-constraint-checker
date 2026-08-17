# Product Requirements Document
## SI26_P07 — Sports Squad Constraint Checker

**Primary source of truth:** Mini BRD — SI26_P07 Sports Squad Constraint Checker.
**Scope of this document:** what the product must do and how users experience it. Architecture, technology and implementation design are out of scope by intent.
**Traceability:** every requirement carries a BRD reference. Requirements marked **[INFERRED]** are logically implied by the BRD but not directly stated there; they are listed separately from supported requirements and cross-referenced in §12.

---

## 1. Product Overview

The Sports Squad Constraint Checker is a compact single-screen product that lets a student organiser assemble a seven-player futsal squad from a fixed nine-player roster and immediately see which squad composition rules the selection satisfies and which it breaks.

The product is a reporting instrument. It evaluates the organiser's own selection and reports outcomes; it never chooses, ranks, optimises or replaces players. Decision authority remains entirely with the organiser.
*Trace: BRD §1, §2 Objectives 1–4.*

---

## 2. Product Goals

| ID | Goal | Trace |
|---|---|---|
| G-1 | Let an organiser validate a manually chosen squad against the fixed roster in a single, compact experience. | BRD Obj-1 |
| G-2 | Make the outcome of every squad rule visible — satisfied as well as violated — for the current selection. | BRD Obj-2 |
| G-3 | Surface all breaches simultaneously, so a selection that breaks several rules is never reported as breaking only one. | BRD KBR-3, BSC-2 |
| G-4 | Keep the product strictly report-only: no squad is proposed, ranked or replaced. | BRD Obj-4 |
| G-5 | Guarantee that what the organiser sees always describes their current selection, never a stale result. | BRD KBR-7 |

---

## 3. Target Users / Actors

| Actor | Relationship to product | Needs the product must serve | Trace |
|---|---|---|---|
| **Student organiser** (primary user) | Selects and deselects players, requests validation, uses sample and reset, reads counts, rule summary and verdict. | Know whether the chosen squad is acceptable; know precisely which rules fail and why; retain full control over who is picked. | BRD §3 (ACT-001) |
| Developer | Builds the product under the delivery constraints. Outside the product boundary; not a product user. | — | BRD §3 (ACT-003) |
| Evaluator | Reviews plan, design and test evidence; may request live modifications. Outside the product boundary; not a product user. | — | BRD §3 (ACT-004) |

**Assumption carried from the BRD:** a single local, unauthenticated user. No roles, permissions or multi-user behaviour are defined. *(BRD §9, ACT-005)*

---

## 4. In Scope / Out of Scope

### 4.1 In Scope

| Capability | Product scope | Trace |
|---|---|---|
| C1 Roster presentation | Show the fixed nine-player roster with player, position, cohort and availability, in roster order. | BRD C1 |
| C2 Manual squad selection | Free selection and deselection, including fewer than seven players and players marked unavailable. | BRD C2 |
| C3 Squad validation | Evaluate all rules independently against the current selection. | BRD C3 |
| C4 Composition metrics | Squad size, position counts, cohort counts. | BRD C4 |
| C5 Rule outcome reporting | Overall verdict, per-rule summary, complete ordered violation list. | BRD C5 |
| C6 Selection integrity handling | Report unknown or repeated player references as a selection-reference error. | BRD C6 |
| C7 Result currency | Displayed information always describes the current selection and stays mutually consistent. | BRD C7 |
| C8 Sample and reset | One-action load of the built-in squad; reset restores roster and built-in selection. | BRD C8 |
| C9 Formation view *(optional)* | Optional compact visual formation view driven by the same selection and position data. | BRD C9 |

### 4.2 Out of Scope

| Excluded | Trace |
|---|---|
| Optimising, selecting, ranking or recommending a squad. | BRD §5 |
| Generating or recommending a replacement squad when violations occur. | BRD §5 |
| Match management. | BRD §5 |
| Tournament management. | BRD §5 |
| Account management. | BRD §5 |
| Booking management. | BRD §5 |
| Editing, adding or removing roster entries. *(Excluded by implication in the source.)* | BRD §5 |

---

## 5. User Flows / Core Use Cases

**UC-1 — Start from the built-in squad.** The organiser loads the built-in seven-player selection in one action. The product shows the roster with that selection marked, the composition metrics, the per-rule summary and the overall verdict. *(BRD C8, KBR-8, BSC-1)*

**UC-2 — Adjust the squad.** The organiser selects or deselects roster players, including substituting one player for another or removing a player entirely. The product accepts any selection, including selections that will fail rules. *(BRD C2, KBR-2)*

**UC-3 — Validate and read the outcome.** The organiser obtains the validation result for the current selection: a VALID verdict, or an INVALID verdict accompanied by the complete ordered list of violations, alongside the counts and per-rule states that explain it. *(BRD C3, C5, KBR-3, KBR-5, KBR-6)*
> **Flagged (OQ-1):** whether this outcome appears continuously as the selection changes, or only on an explicit validation request, is unresolved in the BRD. The flow is written to be neutral between the two.

**UC-4 — Recover the baseline.** The organiser resets. The roster and the built-in selection are restored, and no earlier result or message remains visible. *(BRD C8, KBR-8, BSC-4)*

**UC-5 — Encounter a selection-reference error.** Where an unknown or repeated player reference reaches the product, it is reported as a selection-reference error rather than partially evaluated, and the previously shown rule results and counts are cleared. *(BRD C6, KBR-9)*
> **Flagged (OQ-3):** the BRD does not establish how such a reference can arise through the organiser's controls, so this flow may not be user-facing at all.

**UC-6 — View the formation** *(optional)*. Where provided, the organiser sees a compact formation view reflecting the same selection and position data as the rest of the screen. *(BRD C9, BSC-7)*

---

## 6. Functional Requirements

### 6.1 Roster and selection

| ID | Requirement | Trace |
|---|---|---|
| FR-001 | The product shall present the fixed roster of nine players with each player's identifier, name, position, cohort and availability. | BRD C1 |
| FR-002 | The product shall display the roster and the selection in roster order at all times. | BRD C1, KBR-1 |
| FR-003 | The product shall allow the organiser to select and deselect any roster player. | BRD C2, KBR-2 |
| FR-004 | The product shall accept a selection of fewer than seven players without blocking the action. | BRD C2, BSC-3 |
| FR-005 | The product shall allow selection of players marked unavailable, so that availability breaches are reported rather than prevented. | BRD C2, BSC-2 |
| FR-006 | The product shall not restrict the organiser's selection to valid squads, and shall not complete, alter or suggest any part of the selection. | BRD KBR-2, Obj-4 |

### 6.2 Validation and evaluation

| ID | Requirement | Trace |
|---|---|---|
| FR-007 | The product shall evaluate every squad rule independently against the current selection. | BRD C3, KBR-3 |
| FR-008 | The product shall report all violations together and shall not stop evaluating at the first failure. | BRD KBR-3, G-3 |
| FR-009 | The product shall determine the overall verdict as VALID only when no violation exists, and INVALID otherwise. | BRD KBR-5, BR-011 |
| FR-010 | The product shall report one violation entry per unavailable selected player, in roster order. | BRD KBR-4 |
| FR-011 | The product shall report one violation entry per breached cohort, YEAR_2 before YEAR_3. | BRD KBR-4 |
| FR-012 | The product shall present violations in a fixed, prescribed order and prescribed message format. | BRD KBR-4 |
| FR-013 **[INFERRED]** | Where FR-012 requires a fixed order, the ordering is taken as: squad size, goalkeeper count, defender minimum, forward minimum, unavailable players, then cohort limits — matching the rule ordering in BRD §7. The BRD refers to a prescribed sequence without enumerating it. | BRD KBR-4, §7; see OQ-9 |

### 6.3 Metrics and reporting

| ID | Requirement | Trace |
|---|---|---|
| FR-014 | The product shall display the current squad size. | BRD C4, KBR-6 |
| FR-015 | The product shall display position counts for goalkeeper, defender, forward and utility players. | BRD C4, BSC-1 |
| FR-016 | The product shall display cohort counts for YEAR_2 and YEAR_3. | BRD C4, BSC-1 |
| FR-017 | The product shall display a per-rule summary showing the state of every squad rule, including those that are satisfied. | BRD C5, Obj-2, G-2 |
| FR-018 | The product shall display the overall verdict together with the complete ordered violation list whenever the verdict is INVALID. | BRD KBR-5 |
| FR-019 | The product shall display composition metrics alongside the verdict so the organiser can see what drove it. | BRD KBR-6 |

### 6.4 State currency and integrity

| ID | Requirement | Trace |
|---|---|---|
| FR-020 | Counts, per-rule states, violations and the overall verdict shall always describe the current selection and never a previous validation. | BRD C7, KBR-7 |
| FR-021 | The roster selection, counts, violation list, verdict and the sample/reset actions shall remain mutually consistent at all times. | BRD C7, BSC-5 |
| FR-022 | The product shall detect a selected player reference that is unknown or repeated and report it as a selection-reference error. | BRD C6, KBR-9 |
| FR-023 | On a selection-reference error, the product shall clear the previously shown rule results and counts rather than evaluating a partial selection. | BRD C6, KBR-9 |

### 6.5 Sample and reset

| ID | Requirement | Trace |
|---|---|---|
| FR-024 | The product shall load the built-in seven-player selection in a single action. | BRD C8, KBR-8 |
| FR-025 | The product shall provide a reset that restores both the fixed roster and the built-in selection. | BRD C8, KBR-8 |
| FR-026 | After reset, no earlier verdict, violation or message shall remain visible. | BRD KBR-8, BSC-4 |

### 6.6 Optional

| ID | Requirement | Trace |
|---|---|---|
| FR-027 *(optional)* | The product may provide a compact visual formation view; if provided, it shall be driven by the same selection and position data as the rest of the product. | BRD C9, BSC-7 |

---

## 7. Business Rules

Rule identifiers are preserved from the BRD for traceability.

### 7.1 Squad validity — a squad is valid only when all hold

| ID | Rule |
|---|---|
| BR-001 | Exactly 7 distinct selected players. |
| BR-002 | Exactly 1 selected goalkeeper. |
| BR-003 | At least 2 selected defenders. |
| BR-004 | At least 2 selected forwards. |
| BR-005 | No selected player is unavailable. |
| BR-006 | No more than 4 selected players from either cohort. |
| BR-007 | A cohort count of exactly 4 is permitted; only counts above 4 are breaches. |
| BR-008 | Utility players count toward squad size and cohort totals, but not toward the defender or forward minimums. |
| BR-009 | Selected player references are roster references and must be distinct. |

### 7.2 Reporting behaviour

| ID | Rule |
|---|---|
| BR-011 | VALID only when there are zero violations; otherwise INVALID with the complete ordered list. |
| BR-012 | Each rule is evaluated independently; all violations are reported together in the fixed order. |
| BR-013 | The product reports rule outcomes only and never generates or recommends a replacement squad. |

**Boundary note (BR-014, inference recorded in the BRD):** with exactly 7 players drawn from only two cohorts, at least one cohort always holds 4 or more players. The cohort ceiling of exactly 4 is therefore the critical boundary and must be exercised in testing.

---

## 8. UI / Interaction Requirements

Stated only where needed to support the specified experience. No visual design, layout or technology is prescribed.

| ID | Requirement | Trace |
|---|---|---|
| UX-001 | The product presents a single primary screen or report. | BRD §9 (CON-002) |
| UX-002 | The roster is visible with each player's selection state clearly indicated, in roster order. | BRD C1, FR-002 |
| UX-003 | Selection and deselection are directly available to the organiser from the roster presentation. | BRD C2 |
| UX-004 | Composition metrics, the per-rule summary and the overall verdict are all available on the primary screen. | BRD C4, C5, KBR-6 |
| UX-005 | The violation list is presented as an ordered list, in the prescribed sequence. | BRD KBR-4 |
| UX-006 | Sample-load and reset actions are available to the organiser. | BRD C8 |
| UX-007 | The verdict is presented unambiguously as either VALID or INVALID. | BRD KBR-5 |
| UX-008 **[INFERRED]** | Unavailable players remain selectable through the interface, since availability breaches must be reportable. | BRD C2, FR-005 |

> **Flagged:** how satisfied rules are labelled (OQ-4), whether sample and reset are one control or two (OQ-5), and what "attractive" and "compact" require (OQ-7) are unresolved in the BRD and are not specified here.

---

## 9. Validation and Error Handling

### 9.1 Selection validation

| ID | Condition | Expected product behaviour | Trace |
|---|---|---|---|
| VE-001 | A selected reference does not exist in the roster. | Report a selection-reference error; clear prior rule results and counts; do not evaluate squad rules against a partial selection. | BRD C6, KBR-9 |
| VE-002 | A selected reference is repeated. | As VE-001. | BRD C6, BR-009 |

### 9.2 Rule violations

Rule violations are expected product outputs, not errors. Each is reported as a violation entry within the ordered list, and the verdict becomes INVALID.

| ID | Condition | Reported as | Trace |
|---|---|---|---|
| VE-003 | Selected count is not 7. | Squad-size violation. | BR-001 |
| VE-004 | Selected goalkeeper count is not 1. | Goalkeeper-count violation. | BR-002 |
| VE-005 | Fewer than 2 selected defenders. | Defender-minimum violation. | BR-003 |
| VE-006 | Fewer than 2 selected forwards. | Forward-minimum violation. | BR-004 |
| VE-007 | A selected player is unavailable. | One unavailable-player violation per such player, in roster order. | BR-005, FR-010 |
| VE-008 | A cohort's selected count exceeds 4. | One cohort-limit violation per breached cohort, YEAR_2 before YEAR_3. | BR-006, FR-011 |

### 9.3 Unspecified behaviour — flagged, not designed

| Gap | Status |
|---|---|
| Verdict shown, and presentation of cleared counts, during a selection-reference error. | Unresolved — OQ-2 |
| Behaviour for a selection of more than seven players, and for an empty selection. | Unresolved — OQ-6 |
| Roster data integrity is assumed, not validated. | Assumption — BRD §9 (VAL-009) |

---

## 10. Acceptance Criteria

All criteria are observable from the product's output.

| ID | Acceptance criterion | Covers | Trace |
|---|---|---|---|
| AC-001 | Loading the built-in squad in one action yields verdict VALID, squad size 7, position counts of 1 goalkeeper, 2 defenders, 2 forwards and 2 utility players, and cohort counts of 4 (YEAR_2) and 3 (YEAR_3). | FR-014 to FR-019, FR-024 | BRD BSC-1 |
| AC-002 | Substituting S07 with S08 — one change only — yields verdict INVALID listing exactly the unavailable-player violation for S08 followed by the cohort-limit violation for YEAR_2, while the size, goalkeeper, defender and forward checks remain shown as satisfied. | FR-007 to FR-012, FR-017 | BRD BSC-2 |
| AC-003 | Deselecting one player from the baseline squad yields squad size 6 and exactly one violation — the squad-size violation — with no additional violation reported. | FR-004, FR-008, FR-014 | BRD BSC-3 |
| AC-004 | Reset restores the original valid counts and rule states, with no earlier invalid verdict, violation or message remaining visible. | FR-025, FR-026 | BRD BSC-4 |
| AC-005 | At every point of use, the roster selection, counts, violation list, verdict and sample/reset actions describe the same current selection. | FR-020, FR-021 | BRD BSC-5 |
| AC-006 | A cohort count of exactly 4 produces no cohort-limit violation; a count of 5 produces one. | BR-006, BR-007, FR-011 | BRD BSC-6, BR-007 |
| AC-007 | Focused checks exist for the valid baseline, the S07-to-S08 substitution, the six-player case, and the cohort limit of exactly 4. | All above | BRD BSC-6 |
| AC-008 | The product produces no squad suggestion, ranking, optimisation or replacement under any selection, including invalid ones. | FR-006, BR-013 | BRD Obj-4, §5 |
| AC-009 | Where an unknown or repeated reference occurs, a selection-reference error is reported and prior rule results and counts are cleared. | FR-022, FR-023 | BRD KBR-9 |
| AC-010 *(optional)* | Where the formation view is provided, it reflects the same selection and position data shown elsewhere on the screen. | FR-027 | BRD BSC-7 |

---

## 11. Constraints / Assumptions

**Product constraints**

| Constraint | Trace |
|---|---|
| The roster is fixed and local, comprising exactly nine entries. | BRD §9 (CON-001) |
| The product occupies one primary screen or report. | BRD §9 (CON-002) |
| The product must be compact. *(Term undefined — OQ-7.)* | BRD §9 (CON-004) |
| The product must not optimise, select, rank or recommend a squad, and must never generate a replacement squad. | BRD §9 (CON-005, CON-006) |
| Violation ordering and message formats are fixed. | BRD §9 (CON-007) |
| The delivery medium is left open and is not specified by this document. | BRD §9 (CON-003) |

**Assumptions carried from the BRD**

- A single local, unauthenticated user; no roles, permissions or multi-user behaviour.
- Roster data is well formed and is assumed rather than verified by the product.
- Unavailable and non-baseline players are selectable.
- Roster maintenance is out of scope by implication rather than explicit exclusion.

*Delivery-process constraints in BRD §9 (use of AI assistants, the pre-implementation plan, presentation of prompts and test evidence, readiness for live modification) govern how the work is produced and evaluated, not what the product does. They are noted here and not restated as product requirements.*

---

## 12. Open Questions

Unresolved from the BRD. OQ-1 and OQ-2 are recorded there as requirement conflicts and block product decisions.

| ID | Question | Product impact | Trace |
|---|---|---|---|
| OQ-1 | Are counts, rule states and violations recomputed on every selection change, or only when validation is explicitly requested? | Determines the core interaction model and what the organiser sees between changing a selection and validating it. UC-3 is deliberately neutral pending resolution. | BRD OQ-1 |
| OQ-2 | On a selection-reference error, what verdict is shown and how are the cleared counts and rule results presented? | Undefined user-visible state; FR-023 cannot be fully specified without it. | BRD OQ-2 |
| OQ-3 | Through which input path could an unknown or repeated reference arise, given selection is from a fixed nine-row roster? | Determines whether UC-5, FR-022 and FR-023 are user-facing at all. | BRD OQ-3 |
| OQ-4 | How is a satisfied rule represented in the per-rule summary? | FR-017 and AC-002 depend on a defined satisfied-state representation. | BRD OQ-4 |
| OQ-5 | Are sample and reset one control or two, and how do they differ if both load the same baseline? | Affects the control set in UX-006 and the steps in AC-001 and AC-004. | BRD OQ-5 |
| OQ-6 | Is selecting more than seven players permitted, and what is expected for an empty selection? | Undefined edge behaviour at both ends of the selection range. | BRD OQ-6 |
| OQ-7 | What criteria define "attractive" and "compact"? | Both carry acceptance weight but are not testable as written. | BRD OQ-7 |
| OQ-8 | Must the current selection persist between sessions? | Affects expected state on return to the product. | BRD OQ-8 |
| OQ-9 | What is the exact prescribed violation ordering and the exact prescribed message wording? | The BRD requires a fixed order and fixed formats but does not restate them; FR-013 is inferred from the BRD's rule ordering and must be confirmed against the underlying specification before AC-002 can be asserted verbatim. | BRD KBR-4, §7 |

---

**Verification note:** every requirement in §6 to §10 carries a BRD reference. The two requirements not directly stated in the BRD — FR-013 and UX-008 — are marked **[INFERRED]** and raised in §12 (OQ-9) and §6.2 respectively. No feature, user, workflow or rule beyond the BRD's scope has been introduced.
