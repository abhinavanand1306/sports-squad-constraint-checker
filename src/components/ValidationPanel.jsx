function ValidationPanel({ isVisible, status, violations }) {
  if (!isVisible) {
    return (
      <section className="panel verdict-panel verdict-pending" aria-labelledby="verdict-title">
        <p className="panel-kicker">Explicit result</p>
        <h2 id="verdict-title">Ready to validate</h2>
        <p>
          Counts and rule checks are current. Select Validate Squad to reveal
          this selection&apos;s verdict.
        </p>
      </section>
    );
  }

  const isValid = status === 'VALID';

  return (
    <section
      className={`panel verdict-panel ${isValid ? 'verdict-valid' : 'verdict-invalid'}`}
      aria-labelledby="verdict-title"
      aria-live="polite"
    >
      <p className="panel-kicker">Validation result</p>
      <h2 id="verdict-title">{status}</h2>
      {isValid ? (
        <p>All squad rules are satisfied.</p>
      ) : (
        <ol className="violation-list">
          {violations.map((violation) => (
            <li key={violation}>{violation}</li>
          ))}
        </ol>
      )}
    </section>
  );
}

export default ValidationPanel;
