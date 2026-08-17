import { describe, expect, it } from 'vitest';
import { BUILT_IN_SELECTED_IDS, ROSTER } from '../src/data/roster.js';
import { validateSquad } from '../src/domain/validateSquad.js';

function createPlayer(
  id,
  position,
  cohort,
  availability = 'AVAILABLE',
) {
  return { id, student: id, position, cohort, availability };
}

describe('validateSquad', () => {
  it('A. returns the expected valid baseline analysis', () => {
    const result = validateSquad(ROSTER, BUILT_IN_SELECTED_IDS);

    expect(result.status).toBe('VALID');
    expect(result.selectedPlayers.map((player) => player.id)).toEqual([
      'S01',
      'S02',
      'S03',
      'S04',
      'S05',
      'S06',
      'S07',
    ]);
    expect(result.counts).toEqual({
      squadSize: 7,
      positions: {
        GOALKEEPER: 1,
        DEFENDER: 2,
        FORWARD: 2,
        UTILITY: 2,
      },
      cohorts: {
        YEAR_2: 4,
        YEAR_3: 3,
      },
    });
    expect(result.ruleStates).toEqual({
      squadSize: true,
      goalkeeperCount: true,
      minimumDefenders: true,
      minimumForwards: true,
      playerAvailability: true,
      year2CohortLimit: true,
      year3CohortLimit: true,
    });
    expect(result.violations).toEqual([]);
  });

  it('B. reports exactly the S07 to S08 replacement violations', () => {
    const result = validateSquad(ROSTER, [
      'S01',
      'S02',
      'S03',
      'S04',
      'S05',
      'S06',
      'S08',
    ]);

    expect(result.status).toBe('INVALID');
    expect(result.violations).toEqual([
      'PLAYER_UNAVAILABLE: S08',
      'COHORT_LIMIT_EXCEEDED: YEAR_2 has 5, maximum 4',
    ]);
    expect(result.ruleStates).toMatchObject({
      squadSize: true,
      goalkeeperCount: true,
      minimumDefenders: true,
      minimumForwards: true,
    });
  });

  it('C. reports only the squad-size violation for S01 through S06', () => {
    const result = validateSquad(ROSTER, [
      'S01',
      'S02',
      'S03',
      'S04',
      'S05',
      'S06',
    ]);

    expect(result.counts.squadSize).toBe(6);
    expect(result.violations).toEqual(['SQUAD_SIZE_MUST_BE_7']);
  });

  it('D. permits a cohort count of four and rejects a count of five', () => {
    const atBoundary = validateSquad(ROSTER, BUILT_IN_SELECTED_IDS);
    const aboveBoundary = validateSquad(ROSTER, [
      'S01',
      'S02',
      'S03',
      'S04',
      'S05',
      'S06',
      'S08',
    ]);

    expect(atBoundary.counts.cohorts.YEAR_2).toBe(4);
    expect(atBoundary.ruleStates.year2CohortLimit).toBe(true);
    expect(
      atBoundary.violations.some((violation) =>
        violation.startsWith('COHORT_LIMIT_EXCEEDED'),
      ),
    ).toBe(false);

    expect(aboveBoundary.counts.cohorts.YEAR_2).toBe(5);
    expect(aboveBoundary.ruleStates.year2CohortLimit).toBe(false);
    expect(aboveBoundary.violations).toContain(
      'COHORT_LIMIT_EXCEEDED: YEAR_2 has 5, maximum 4',
    );
  });

  it('E. returns only the reference error for an unknown selected ID', () => {
    const result = validateSquad(ROSTER, [
      ...BUILT_IN_SELECTED_IDS,
      'S99',
    ]);

    expect(result).toEqual({
      referenceError: 'INVALID_SELECTION_REFERENCE',
    });
    expect(result).not.toHaveProperty('counts');
    expect(result).not.toHaveProperty('ruleStates');
  });

  it('F. returns only the reference error for a repeated selected ID', () => {
    const result = validateSquad(ROSTER, [
      'S01',
      'S01',
      'S02',
      'S03',
      'S04',
      'S05',
      'S06',
    ]);

    expect(result).toEqual({
      referenceError: 'INVALID_SELECTION_REFERENCE',
    });
  });

  it('G. reports a missing goalkeeper', () => {
    const result = validateSquad(ROSTER, [
      'S02',
      'S03',
      'S04',
      'S05',
      'S06',
      'S07',
      'S08',
    ]);

    expect(result.ruleStates.goalkeeperCount).toBe(false);
    expect(result.violations).toEqual([
      'GOALKEEPER_COUNT_MUST_BE_1',
      'PLAYER_UNAVAILABLE: S08',
    ]);
  });

  it('H. reports more than one goalkeeper', () => {
    const result = validateSquad(ROSTER, [
      'S01',
      'S02',
      'S03',
      'S04',
      'S05',
      'S06',
      'S09',
    ]);

    expect(result.counts.positions.GOALKEEPER).toBe(2);
    expect(result.ruleStates.goalkeeperCount).toBe(false);
    expect(result.violations).toEqual(['GOALKEEPER_COUNT_MUST_BE_1']);
  });

  it('I. reports an insufficient defender count', () => {
    const result = validateSquad(ROSTER, [
      'S01',
      'S02',
      'S04',
      'S05',
      'S06',
      'S07',
      'S08',
    ]);

    expect(result.counts.positions.DEFENDER).toBe(1);
    expect(result.ruleStates.minimumDefenders).toBe(false);
    expect(result.violations).toEqual([
      'MINIMUM_DEFENDERS_NOT_MET',
      'PLAYER_UNAVAILABLE: S08',
      'COHORT_LIMIT_EXCEEDED: YEAR_2 has 5, maximum 4',
    ]);
  });

  it('J. reports an insufficient forward count', () => {
    const result = validateSquad(ROSTER, [
      'S01',
      'S02',
      'S03',
      'S04',
      'S06',
      'S07',
      'S09',
    ]);

    expect(result.counts.positions.FORWARD).toBe(1);
    expect(result.ruleStates.minimumForwards).toBe(false);
    expect(result.violations).toEqual([
      'GOALKEEPER_COUNT_MUST_BE_1',
      'MINIMUM_FORWARDS_NOT_MET',
    ]);
  });

  it('K. reports every simultaneous violation in explicit contract order', () => {
    const customRoster = [
      createPlayer('P01', 'DEFENDER', 'YEAR_2'),
      createPlayer('P02', 'FORWARD', 'YEAR_2', 'UNAVAILABLE'),
      createPlayer('P03', 'UTILITY', 'YEAR_2'),
      createPlayer('P04', 'UTILITY', 'YEAR_2'),
      createPlayer('P05', 'UTILITY', 'YEAR_2'),
      createPlayer('P06', 'UTILITY', 'YEAR_3'),
      createPlayer('P07', 'UTILITY', 'YEAR_3'),
      createPlayer('P08', 'UTILITY', 'YEAR_3', 'UNAVAILABLE'),
      createPlayer('P09', 'UTILITY', 'YEAR_3'),
      createPlayer('P10', 'UTILITY', 'YEAR_3'),
    ];
    const selectedIds = customRoster.map((player) => player.id).reverse();

    const result = validateSquad(customRoster, selectedIds);

    expect(result.violations).toEqual([
      'SQUAD_SIZE_MUST_BE_7',
      'GOALKEEPER_COUNT_MUST_BE_1',
      'MINIMUM_DEFENDERS_NOT_MET',
      'MINIMUM_FORWARDS_NOT_MET',
      'PLAYER_UNAVAILABLE: P02',
      'PLAYER_UNAVAILABLE: P08',
      'COHORT_LIMIT_EXCEEDED: YEAR_2 has 5, maximum 4',
      'COHORT_LIMIT_EXCEEDED: YEAR_3 has 5, maximum 4',
    ]);
    expect(result.ruleStates).toEqual({
      squadSize: false,
      goalkeeperCount: false,
      minimumDefenders: false,
      minimumForwards: false,
      playerAvailability: false,
      year2CohortLimit: false,
      year3CohortLimit: false,
    });
    expect(result.status).toBe('INVALID');
  });

  it('L. orders unavailable players by roster order without mutating inputs', () => {
    const customRoster = Object.freeze(
      [
        createPlayer('U01', 'GOALKEEPER', 'YEAR_2'),
        createPlayer('U02', 'DEFENDER', 'YEAR_2', 'UNAVAILABLE'),
        createPlayer('U03', 'DEFENDER', 'YEAR_3'),
        createPlayer('U04', 'FORWARD', 'YEAR_2'),
        createPlayer('U05', 'FORWARD', 'YEAR_3', 'UNAVAILABLE'),
        createPlayer('U06', 'UTILITY', 'YEAR_2'),
        createPlayer('U07', 'UTILITY', 'YEAR_3'),
      ].map(Object.freeze),
    );
    const selectedIds = Object.freeze([
      'U07',
      'U06',
      'U05',
      'U04',
      'U03',
      'U02',
      'U01',
    ]);

    const result = validateSquad(customRoster, selectedIds);

    expect(result.selectedPlayers.map((player) => player.id)).toEqual([
      'U01',
      'U02',
      'U03',
      'U04',
      'U05',
      'U06',
      'U07',
    ]);
    expect(result.violations).toEqual([
      'PLAYER_UNAVAILABLE: U02',
      'PLAYER_UNAVAILABLE: U05',
    ]);
    expect(selectedIds).toEqual([
      'U07',
      'U06',
      'U05',
      'U04',
      'U03',
      'U02',
      'U01',
    ]);
  });
});
