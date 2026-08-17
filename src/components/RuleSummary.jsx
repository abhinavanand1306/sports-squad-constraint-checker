const RULE_PRESENTATION = [
  ['squadSize', 'Exactly 7 players'],
  ['goalkeeperCount', 'Exactly 1 goalkeeper'],
  ['minimumDefenders', 'At least 2 defenders'],
  ['minimumForwards', 'At least 2 forwards'],
  ['playerAvailability', 'All selected players available'],
  ['year2CohortLimit', 'YEAR_2 maximum 4'],
  ['year3CohortLimit', 'YEAR_3 maximum 4'],
];

function RuleSummary({ ruleStates }) {
  return (
    <section className="panel" aria-labelledby="rules-title">
      <div className="panel-heading compact">
        <div>
          <p className="panel-kicker">Live checks</p>
          <h2 id="rules-title">Rule summary</h2>
        </div>
      </div>

      <ul className="rule-list">
        {RULE_PRESENTATION.map(([key, label]) => {
          const passes = ruleStates[key];

          return (
            <li key={key} className={passes ? 'rule-pass' : 'rule-fail'}>
              <span>{label}</span>
              <strong>{passes ? 'Pass' : 'Fail'}</strong>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default RuleSummary;
