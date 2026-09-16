import "./App.scss";
import { apps } from "./apps/registry";
import Desktop from "./os/Desktop";
import { WindowsProvider } from "./os/state/windows";

/**
 * Composition root. Deliberately thin: everything visual lives under Desktop,
 * so the shell can be restyled without touching state wiring.
 */
function App() {
  return (
    <WindowsProvider apps={apps}>
      <Desktop />
    </WindowsProvider>
  );
}

export default App;
