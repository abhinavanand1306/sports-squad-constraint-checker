const POSITION_LABELS = [
  ['GOALKEEPER', 'GOALKEEPER'],
  ['DEFENDER', 'DEFENDER'],
  ['FORWARD', 'FORWARD'],
  ['UTILITY', 'UTILITY'],
];

const COHORT_LABELS = [
  ['YEAR_2', 'YEAR_2'],
  ['YEAR_3', 'YEAR_3'],
];

function CountList({ items, values }) {
  return (
    <dl className="count-list">
      {items.map(([key, label]) => (
        <div key={key}>
          <dt>{label}</dt>
          <dd>{values[key]}</dd>
        </div>
      ))}
    </dl>
  );
}

function CountsPanel({ counts }) {
  return (
    <section className="panel counts-panel" aria-labelledby="counts-title">
      <div className="panel-heading compact">
        <div>
          <p className="panel-kicker">Live counts</p>
          <h2 id="counts-title">Current selection</h2>
        </div>
        <div className="squad-count" aria-label={`${counts.squadSize} players selected`}>
          <strong>{counts.squadSize}</strong>
          <span>Squad</span>
        </div>
      </div>

      <div className="count-group">
        <h3>Positions</h3>
        <CountList items={POSITION_LABELS} values={counts.positions} />
      </div>

      <div className="count-group">
        <h3>Cohorts</h3>
        <CountList items={COHORT_LABELS} values={counts.cohorts} />
      </div>
    </section>
  );
}

export default CountsPanel;
