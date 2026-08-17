const INVALID_SELECTION_REFERENCE = 'INVALID_SELECTION_REFERENCE';
const COHORTS_IN_VIOLATION_ORDER = Object.freeze(['YEAR_2', 'YEAR_3']);

export function validateSquad(roster, selectedIds) {
  const rosterIds = new Set(roster.map((player) => player.id));
  const uniqueSelectedIds = new Set(selectedIds);

  const hasRepeatedReference = uniqueSelectedIds.size !== selectedIds.length;
  const hasUnknownReference = selectedIds.some((id) => !rosterIds.has(id));

  if (hasRepeatedReference || hasUnknownReference) {
    return { referenceError: INVALID_SELECTION_REFERENCE };
  }

  const selectedPlayers = roster.filter((player) =>
    uniqueSelectedIds.has(player.id),
  );

  const counts = {
    squadSize: selectedPlayers.length,
    positions: {
      GOALKEEPER: 0,
      DEFENDER: 0,
      FORWARD: 0,
      UTILITY: 0,
    },
    cohorts: {
      YEAR_2: 0,
      YEAR_3: 0,
    },
  };

  const unavailablePlayers = [];

  for (const player of selectedPlayers) {
    counts.positions[player.position] += 1;
    counts.cohorts[player.cohort] += 1;

    if (player.availability === 'UNAVAILABLE') {
      unavailablePlayers.push(player);
    }
  }

  const ruleStates = {
    squadSize: counts.squadSize === 7,
    goalkeeperCount: counts.positions.GOALKEEPER === 1,
    minimumDefenders: counts.positions.DEFENDER >= 2,
    minimumForwards: counts.positions.FORWARD >= 2,
    playerAvailability: unavailablePlayers.length === 0,
    year2CohortLimit: counts.cohorts.YEAR_2 <= 4,
    year3CohortLimit: counts.cohorts.YEAR_3 <= 4,
  };

  const violations = [];

  if (!ruleStates.squadSize) {
    violations.push('SQUAD_SIZE_MUST_BE_7');
  }

  if (!ruleStates.goalkeeperCount) {
    violations.push('GOALKEEPER_COUNT_MUST_BE_1');
  }

  if (!ruleStates.minimumDefenders) {
    violations.push('MINIMUM_DEFENDERS_NOT_MET');
  }

  if (!ruleStates.minimumForwards) {
    violations.push('MINIMUM_FORWARDS_NOT_MET');
  }

  for (const player of unavailablePlayers) {
    violations.push(`PLAYER_UNAVAILABLE: ${player.id}`);
  }

  for (const cohort of COHORTS_IN_VIOLATION_ORDER) {
    const count = counts.cohorts[cohort];

    if (count > 4) {
      violations.push(
        `COHORT_LIMIT_EXCEEDED: ${cohort} has ${count}, maximum 4`,
      );
    }
  }

  return {
    selectedPlayers,
    counts,
    ruleStates,
    violations,
    status: violations.length === 0 ? 'VALID' : 'INVALID',
  };
}

