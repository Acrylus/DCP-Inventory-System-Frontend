import React from "react";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
            {/* Header */}
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-800">
                    Welcome to DepEd Computerization Program Inventory
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                    Streamline your inventory management with ease.
                </p>
            </header>

            {/* Navigation Links */}
            <div className="flex gap-4">
                <Link
                    to="/login"
                    className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow hover:bg-blue-600"
                >
                    Login
                </Link>
                <Link
                    to="/dashboard"
                    className="px-6 py-3 bg-green-500 text-white font-medium rounded-lg shadow hover:bg-green-600"
                >
                    Go to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default LandingPage;
