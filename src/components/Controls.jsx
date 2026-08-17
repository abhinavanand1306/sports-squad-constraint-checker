function Controls({ onLoadSample, onValidate, onReset }) {
  return (
    <section className="controls" aria-label="Squad controls">
      <button className="button button-secondary" type="button" onClick={onLoadSample}>
        Load Sample
      </button>
      <button className="button button-primary" type="button" onClick={onValidate}>
        Validate Squad
      </button>
      <button className="button button-quiet" type="button" onClick={onReset}>
        Reset
      </button>
    </section>
  );
}

export default Controls;
