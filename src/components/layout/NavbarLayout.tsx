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
        <div className="h-screen flex flex-col w-[100%]">
            <Navbar toggleSidebar={toggleSidebar} />

            <div className="flex flex-1 h-[90%] w-full">
                {isSidebarOpen && <Sidebar />}
                <div className="flex w-full">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default NavbarLayout;
