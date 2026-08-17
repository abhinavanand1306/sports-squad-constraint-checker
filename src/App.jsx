import { useState } from 'react';
import Controls from './components/Controls.jsx';
import CountsPanel from './components/CountsPanel.jsx';
import RosterTable from './components/RosterTable.jsx';
import RuleSummary from './components/RuleSummary.jsx';
import ValidationPanel from './components/ValidationPanel.jsx';
import { BUILT_IN_SELECTED_IDS, ROSTER } from './data/roster.js';
import { validateSquad } from './domain/validateSquad.js';

function App() {
  const [selectedIds, setSelectedIds] = useState(() => [
    ...BUILT_IN_SELECTED_IDS,
  ]);
  const [hasValidatedCurrentSelection, setHasValidatedCurrentSelection] =
    useState(false);

  const validationResult = validateSquad(ROSTER, selectedIds);
  const hasReferenceError = 'referenceError' in validationResult;

  function handlePlayerToggle(playerId) {
    setSelectedIds((currentIds) =>
      currentIds.includes(playerId)
        ? currentIds.filter((id) => id !== playerId)
        : [...currentIds, playerId],
    );
    setHasValidatedCurrentSelection(false);
  }

  function handleValidate() {
    setHasValidatedCurrentSelection(true);
  }

  function handleLoadSample() {
    setSelectedIds([...BUILT_IN_SELECTED_IDS]);
    setHasValidatedCurrentSelection(true);
  }

  function handleReset() {
    setSelectedIds([...BUILT_IN_SELECTED_IDS]);
    setHasValidatedCurrentSelection(false);
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Squad selection workspace</p>
          <h1>Sports Squad Constraint Checker</h1>
          <p className="app-intro">
            Select any combination of players, review the live rule checks, and
            validate the complete squad when you are ready.
          </p>
        </div>
        <div className="selection-total" aria-live="polite">
          <span>Currently selected</span>
          <strong>{selectedIds.length}</strong>
        </div>
      </header>

      <Controls
        onLoadSample={handleLoadSample}
        onReset={handleReset}
        onValidate={handleValidate}
      />

      <main className="workspace-grid">
        <RosterTable
          roster={ROSTER}
          selectedIds={selectedIds}
          onToggle={handlePlayerToggle}
        />

        <aside className="analysis-stack" aria-label="Squad analysis">
          {hasReferenceError ? (
            <section className="panel reference-error" role="alert">
              <p className="panel-kicker">Selection error</p>
              <h2>Unable to analyse this selection</h2>
              <code>{validationResult.referenceError}</code>
            </section>
          ) : (
            <>
              <CountsPanel counts={validationResult.counts} />
              <RuleSummary ruleStates={validationResult.ruleStates} />
              <ValidationPanel
                isVisible={hasValidatedCurrentSelection}
                status={validationResult.status}
                violations={validationResult.violations}
              />
            </>
          )}
        </aside>
      </main>
    </div>
  );
}

export default App;
