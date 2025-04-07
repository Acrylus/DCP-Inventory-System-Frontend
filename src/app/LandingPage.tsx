import React from "react";
import logo from "../assets/images/deped logo 1.png";

const LandingPage: React.FC = () => {
    return (
        <div className="relative flex flex-col items-center justify-center h-screen bg-gray-50 overflow-hidden">
            {/* Background Circle - Behind the Text */}
            <div className="absolute left-1/2 top-1/8 transform -translate-x-1/2 w-[800px] h-[800px] bg-blue-400 rounded-full opacity-50 blur-3xl -z-0"></div>
            <img
                src={logo}
                alt="DepEd Logo"
                className="absolute left-[50%] top-1/8 w-[800px] opacity-80 z-1"
            />
            <header className="absolute left-[15%] top-[30%] text-left z-2 max-w-lg">
                <h1 className="text-4xl font-bold text-[#9D3F04]">
                    Welcome to DepEd Computerization Program Inventory
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                    Streamline your inventory management with ease.
                </p>
            </header>

            <div className="absolute  w-0 h-0 border-l-[80px] border-l-transparent border-b-[120px] border-b-blue-500 border-r-[80px] border-r-transparent rotate-12"></div>
        </div>
    );
};

export default LandingPage;
