import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Auth from "./Auth";
import { GlobalMessage } from "./GlobalMessage";

function App(): JSX.Element {
  return (
    <>
      <GlobalMessage />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </>
  );
}

export default App;
