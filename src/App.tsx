import "./App.css";
import { Routes, Route } from "react-router";
import Signin from "./pages/sign-in";
import AuthContextProvider from "./context/auth";
import Dashboard from "./pages/dashboard";

function App() {
  return (
    <AuthContextProvider>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </AuthContextProvider>
  );
}

export default App;
