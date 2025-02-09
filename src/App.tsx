import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./auth/login";
import { StickyNavbar } from "./components/StickyNavbar";
import Dashboard from "./admin/dashboard";
//import "./App.css";

function AppContent() {
    const location = useLocation();

    const hideNavbarPaths = ["/login", "/dashboard"];
    return (
        <>
            {/* Conditionally render StickyNavbar based on the path */}
            {!hideNavbarPaths.includes(location.pathname) && <StickyNavbar />}

            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
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
