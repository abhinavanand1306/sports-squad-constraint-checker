import { BUILT_IN_SELECTED_IDS, ROSTER } from './data/roster.js';

function App() {
  return (
    <main className="foundation-screen">
      <p className="eyebrow">Stage 1 foundation</p>
      <h1>Sports Squad Constraint Checker</h1>
      <p>The application foundation and fixed squad data are ready.</p>
      <dl className="fixture-summary">
        <div>
          <dt>Roster players</dt>
          <dd>{ROSTER.length}</dd>
        </div>
        <div>
          <dt>Built-in selection</dt>
          <dd>{BUILT_IN_SELECTED_IDS.length}</dd>
        </div>
      </dl>
    </main>
  );
}

export default App;

