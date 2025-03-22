import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../navigation/Navbar";
import Sidebar from "../navigation/Sidebar";

const NavbarLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location]);

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
