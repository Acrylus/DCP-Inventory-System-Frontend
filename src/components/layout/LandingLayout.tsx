import React from "react";
import { Outlet } from "react-router-dom";
import { LandingNavbar } from "../../components/navigation/LandingNavbar";

const LandingLayout: React.FC = () => {
    return (
        <div className="flex flex-col h-screen">
            {/* Landing Navbar */}
            <div className="w-full bg-blue-500 fixed top-0 left-0 z-10">
                <LandingNavbar />
            </div>

            {/* Render the child route */}
            <div className="flex-1 bg-gray-50">
                {/* Add padding to prevent overlap with the Navbar */}
                <Outlet />
            </div>
        </div>
    );
};

export default LandingLayout;
