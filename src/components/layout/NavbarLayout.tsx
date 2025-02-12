import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../navigation/Navbar";
import Sidebar from "../navigation/Sidebar";

const NavbarLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    return (
        <div className="h-screen flex flex-col w-screen">
            {/* Navbar */}
            <Navbar toggleSidebar={toggleSidebar} />

            {/* Sidebar and Main Content */}
            <div className="flex flex-1 h-full w-full">
                {isSidebarOpen && <Sidebar />}
                {/* Main Content */}
                <div className="flex bg-gray-50 w-full">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default NavbarLayout;
