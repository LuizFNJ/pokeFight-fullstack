import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Auth from "./Auth";
import { GlobalMessage } from "./GlobalMessage";
import LanguageSwitcher from "./LanguageSwitcher";

function App(): JSX.Element {
  return (
    <>
      <GlobalMessage />

      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </>
  );
}

export default App;
