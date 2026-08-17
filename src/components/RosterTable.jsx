function RosterTable({ roster, selectedIds, onToggle }) {
  const selectedIdSet = new Set(selectedIds);

  return (
    <section className="panel roster-panel" aria-labelledby="roster-title">
      <div className="panel-heading">
        <div>
          <p className="panel-kicker">Fixed roster</p>
          <h2 id="roster-title">Choose your squad</h2>
        </div>
        <p>Unavailable players remain selectable so invalid squads can be tested.</p>
      </div>

      <div className="table-scroll">
        <table>
          <caption className="visually-hidden">
            Fixed player roster and squad selection
          </caption>
          <thead>
            <tr>
              <th scope="col">Select</th>
              <th scope="col">Player ID</th>
              <th scope="col">Student name</th>
              <th scope="col">Position</th>
              <th scope="col">Cohort</th>
              <th scope="col">Availability</th>
            </tr>
          </thead>
          <tbody>
            {roster.map((player) => {
              const isSelected = selectedIdSet.has(player.id);
              const isUnavailable = player.availability === 'UNAVAILABLE';

              return (
                <tr
                  key={player.id}
                  className={[
                    'roster-row',
                    isSelected ? 'is-selected' : '',
                    isUnavailable ? 'is-unavailable' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <td>
                    <label className="selection-control">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggle(player.id)}
                      />
                      <span className="visually-hidden">
                        Select {player.id}, {player.student}
                      </span>
                    </label>
                  </td>
                  <td>
                    <strong>{player.id}</strong>
                  </td>
                  <td>{player.student}</td>
                  <td>
                    <span className="data-chip">{player.position}</span>
                  </td>
                  <td>{player.cohort}</td>
                  <td>
                    <span
                      className={`availability ${
                        isUnavailable ? 'unavailable' : 'available'
                      }`}
                    >
                      {player.availability}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default RosterTable;
