import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./auth/login";
import { StickyNavbar } from "./components/StickyNavbar";
//import "./App.css";

function AppContent() {
  const location = useLocation();

  const hideNavbarPaths = ["/login"];
  return (
    <>
      {/* Conditionally render StickyNavbar based on the path */}
      {!hideNavbarPaths.includes(location.pathname) && <StickyNavbar />}

      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
