// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import App from '../src/App.jsx';
import { BUILT_IN_SELECTED_IDS, ROSTER } from '../src/data/roster.js';

const BASELINE_COUNTS = {
  GOALKEEPER: 1,
  DEFENDER: 2,
  FORWARD: 2,
  UTILITY: 2,
  YEAR_2: 4,
  YEAR_3: 3,
};

const RULE_LABELS = [
  'Exactly 7 players',
  'Exactly 1 goalkeeper',
  'At least 2 defenders',
  'At least 2 forwards',
  'All selected players available',
  'YEAR_2 maximum 4',
  'YEAR_3 maximum 4',
];

afterEach(() => {
  cleanup();
});

function getPlayerCheckbox(playerId) {
  const player = ROSTER.find(({ id }) => id === playerId);

  return screen.getByRole('checkbox', {
    name: `Select ${player.id}, ${player.student}`,
  });
}

function expectBaselineSelection() {
  for (const player of ROSTER) {
    const checkbox = getPlayerCheckbox(player.id);
    const shouldBeSelected = BUILT_IN_SELECTED_IDS.includes(player.id);

    if (shouldBeSelected) {
      expect(checkbox).toBeChecked();
    } else {
      expect(checkbox).not.toBeChecked();
    }
  }
}

function expectCount(label, count) {
  const labelElement = screen.getByText(label, { selector: 'dt' });
  expect(labelElement.nextElementSibling).toHaveTextContent(String(count));
}

function expectSquadSize(count) {
  expect(
    screen.getByLabelText(`${count} players selected`),
  ).toHaveTextContent(String(count));
}

function expectRuleState(label, state) {
  const rule = screen.getByText(label).closest('li');
  expect(rule).toHaveTextContent(state);
}

function expectAllRulesPass() {
  for (const label of RULE_LABELS) {
    expectRuleState(label, 'Pass');
  }
}

function expectBaselineCounts() {
  expectSquadSize(7);

  for (const [label, count] of Object.entries(BASELINE_COUNTS)) {
    expectCount(label, count);
  }
}

function expectExplicitVerdictHidden() {
  expect(
    screen.queryByRole('heading', { name: /^(VALID|INVALID)$/ }),
  ).not.toBeInTheDocument();
}

function expectVerdict(status) {
  expect(
    within(screen.getByRole('status')).getByRole('heading', { name: status }),
  ).toBeInTheDocument();
}

async function createS07ToS08Selection(user) {
  await user.click(getPlayerCheckbox('S07'));
  await user.click(getPlayerCheckbox('S08'));
}

describe('Sports Squad Constraint Checker UI', () => {
  it('renders the complete accessible baseline with live counts and passing rules', () => {
    render(<App />);

    expect(
      screen.getByRole('table', {
        name: 'Fixed player roster and squad selection',
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')).toHaveLength(9);
    expectBaselineSelection();
    expectBaselineCounts();
    expectAllRulesPass();
    expectExplicitVerdictHidden();

    const s08Checkbox = getPlayerCheckbox('S08');
    expect(s08Checkbox).toBeEnabled();
    expect(within(s08Checkbox.closest('tr')).getByText('UNAVAILABLE')).toBeVisible();
  });

  it('reveals VALID for the built-in squad without changing its counts', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Validate Squad' }));

    expectVerdict('VALID');
    expect(screen.queryByLabelText('Squad violations')).not.toBeInTheDocument();
    expectBaselineCounts();
  });

  it('reports the exact ordered S07 to S08 violations after live checks update', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Validate Squad' }));
    expectVerdict('VALID');

    await createS07ToS08Selection(user);

    expectExplicitVerdictHidden();
    expectSquadSize(7);
    expectCount('GOALKEEPER', 1);
    expectCount('DEFENDER', 2);
    expectCount('FORWARD', 3);
    expectCount('UTILITY', 1);
    expectCount('YEAR_2', 5);
    expectCount('YEAR_3', 2);
    expectRuleState('Exactly 7 players', 'Pass');
    expectRuleState('Exactly 1 goalkeeper', 'Pass');
    expectRuleState('At least 2 defenders', 'Pass');
    expectRuleState('At least 2 forwards', 'Pass');
    expectRuleState('All selected players available', 'Fail');
    expectRuleState('YEAR_2 maximum 4', 'Fail');

    await user.click(screen.getByRole('button', { name: 'Validate Squad' }));

    expectVerdict('INVALID');
    expect(
      within(screen.getByLabelText('Squad violations'))
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual([
      'PLAYER_UNAVAILABLE: S08',
      'COHORT_LIMIT_EXCEEDED: YEAR_2 has 5, maximum 4',
    ]);
  });

  it('reports only the squad-size violation for the six-player case', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(getPlayerCheckbox('S07'));
    expectSquadSize(6);

    await user.click(screen.getByRole('button', { name: 'Validate Squad' }));

    expectVerdict('INVALID');
    expect(
      within(screen.getByLabelText('Squad violations'))
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(['SQUAD_SIZE_MUST_BE_7']);
  });

  it('clears a stale verdict and updates live analysis after selection changes', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Validate Squad' }));
    expectVerdict('VALID');

    await user.click(getPlayerCheckbox('S07'));

    expectExplicitVerdictHidden();
    expectSquadSize(6);
    expectCount('UTILITY', 1);
    expectCount('YEAR_3', 2);
    expectRuleState('Exactly 7 players', 'Fail');

    await user.click(screen.getByRole('button', { name: 'Validate Squad' }));

    expectVerdict('INVALID');
    expect(screen.getByText('SQUAD_SIZE_MUST_BE_7')).toBeInTheDocument();
  });

  it('loads the valid sample and removes prior invalid output', async () => {
    const user = userEvent.setup();
    render(<App />);

    await createS07ToS08Selection(user);
    await user.click(screen.getByRole('button', { name: 'Validate Squad' }));
    expectVerdict('INVALID');

    await user.click(screen.getByRole('button', { name: 'Load Sample' }));

    expectBaselineSelection();
    expectBaselineCounts();
    expectAllRulesPass();
    expectVerdict('VALID');
    expect(screen.queryByLabelText('Squad violations')).not.toBeInTheDocument();
    expect(screen.queryByText('PLAYER_UNAVAILABLE: S08')).not.toBeInTheDocument();
  });

  it('resets the baseline and hides all prior explicit validation output', async () => {
    const user = userEvent.setup();
    render(<App />);

    await createS07ToS08Selection(user);
    await user.click(screen.getByRole('button', { name: 'Validate Squad' }));
    expectVerdict('INVALID');

    await user.click(screen.getByRole('button', { name: 'Reset' }));

    expectBaselineSelection();
    expectBaselineCounts();
    expectAllRulesPass();
    expectExplicitVerdictHidden();
    expect(screen.queryByLabelText('Squad violations')).not.toBeInTheDocument();
    expect(screen.queryByText('PLAYER_UNAVAILABLE: S08')).not.toBeInTheDocument();
  });

  it('allows more than seven players to be selected and reports the invalid squad', async () => {
    const user = userEvent.setup();
    render(<App />);

    const s08Checkbox = getPlayerCheckbox('S08');
    expect(s08Checkbox).not.toBeDisabled();
    await user.click(s08Checkbox);

    expect(s08Checkbox).toBeChecked();
    expectSquadSize(8);
    expectRuleState('Exactly 7 players', 'Fail');

    await user.click(screen.getByRole('button', { name: 'Validate Squad' }));

    expectVerdict('INVALID');
    expect(screen.getByText('SQUAD_SIZE_MUST_BE_7')).toBeInTheDocument();
  });
});
