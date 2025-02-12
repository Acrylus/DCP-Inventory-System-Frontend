import { useState, useEffect } from "react";
import {
    Navbar,
    Collapse,
    Typography,
    Button,
    IconButton,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import depedLogo from "../../assets/images/deped logo 1.png"; // ✅ Fix Vite import issue

export function LandingNavbar() {
    const [openNav, setOpenNav] = useState<boolean>(false); // ✅ Explicitly type useState
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 960) setOpenNav(false); // Close menu when resizing to desktop size
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const navList = (
        <ul className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-6">
            {/* Add navigation links here if needed */}
        </ul>
    );

    return (
        <div>
            {/* Fixed Navbar */}
            <Navbar
                color="white"
                placeholder={undefined} // ✅ Fix TS error
                onPointerEnterCapture={undefined} // ✅ Fix TS error
                onPointerLeaveCapture={undefined} // ✅ Fix TS error
                className="fixed top-0 left-0 z-50 w-full bg-white px-4 py-3 lg:px-8 lg:py-4 shadow-md"
                role="navigation"
            >
                <div className="flex items-center justify-between w-full">
                    {/* Logo and Title */}
                    <div className="flex items-center gap-3">
                        <img
                            src={depedLogo}
                            alt="DepEd Logo"
                            className="h-10 w-10"
                        />
                        <Typography
                            as="a"
                            href="/"
                            className="text-xl font-semibold text-blue-gray-900 cursor-pointer"
                            placeholder={undefined} // ✅ Fix TS warning
                            onPointerEnterCapture={undefined} // ✅ Fix TS warning
                            onPointerLeaveCapture={undefined} // ✅ Fix TS warning
                        >
                            DepEd Cebu Province Division
                        </Typography>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-4">
                        {navList}
                        {/* Buttons */}
                        <Button
                            variant="gradient"
                            size="md"
                            onClick={() => navigate("/login")}
                            color="yellow" // ✅ Fix TS error
                            ripple={true} // ✅ Fix TS error
                            placeholder={undefined} // ✅ Fix TS error
                            onPointerEnterCapture={undefined} // ✅ Fix TS error
                            onPointerLeaveCapture={undefined} // ✅ Fix TS error
                        >
                            Log In
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <IconButton
                        variant="text"
                        className="lg:hidden"
                        onClick={() => setOpenNav(!openNav)}
                        aria-label="Toggle navigation menu"
                        color="gray" // ✅ Fix TS error
                        ripple={true} // ✅ Fix TS error
                        placeholder={undefined} // ✅ Fix TS error
                        onPointerEnterCapture={undefined} // ✅ Fix TS error
                        onPointerLeaveCapture={undefined} // ✅ Fix TS error
                    >
                        {openNav ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="h-6 w-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="h-6 w-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        )}
                    </IconButton>
                </div>

                {/* Mobile Navigation */}
                <Collapse open={openNav}>
                    {navList}
                    {/* Buttons in Mobile */}
                    <div className="flex flex-col gap-2 mt-4 lg:hidden">
                        <Button
                            variant="text"
                            size="sm"
                            fullWidth
                            color="gray" // ✅ Fix TS error
                            ripple={true} // ✅ Fix TS error
                            placeholder={undefined} // ✅ Fix TS error
                            onPointerEnterCapture={undefined} // ✅ Fix TS error
                            onPointerLeaveCapture={undefined} // ✅ Fix TS error
                            onClick={() => navigate("/login")}
                        >
                            Log In
                        </Button>
                    </div>
                </Collapse>
            </Navbar>
        </div>
    );
}
