import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
    // Sidebar state
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    return (
        <div className="flex">
            {/* Sidebar Component */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main Content Area */}
            <div className="flex-1">
                {/* Navbar with Sidebar Toggle */}
                <Navbar toggleSidebar={toggleSidebar} />

                {/* Dashboard Content */}
                <div className="p-6">
                    <h1 className="text-2xl font-bold">
                        Welcome to your Dashboard
                    </h1>
                    {/* Add additional dashboard sections here */}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
