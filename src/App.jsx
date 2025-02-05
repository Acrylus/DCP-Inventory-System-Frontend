import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { StickyNavbar } from "./components/StickyNavbar";
import Login from "./auth/login";

// Separate Component for Conditional Rendering
function AppContent() {
    const location = useLocation();

    // List of paths where Navbar should NOT be displayed
    const hideNavbarPaths = ["/login"];

    return (
        <>
            {/* Render Navbar only if the current path is NOT in the hideNavbarPaths list */}
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
