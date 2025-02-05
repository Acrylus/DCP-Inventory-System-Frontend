import React from "react";
import {
    Navbar,
    Collapse,
    Typography,
    Button,
    IconButton,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export function StickyNavbar() {
    const [openNav, setOpenNav] = React.useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 960) setOpenNav(false);
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
            <Navbar className="fixed top-0 left-0 z-50 w-full bg-white px-4 py-3 lg:px-8 lg:py-4 shadow-md">
                <div className="flex items-center justify-between">
                    {/* Logo and Title */}
                    <div className="flex items-center gap-3">
                        <img
                            src="src/assets/images/deped logo 1.png"
                            alt="DepEd Logo"
                            className="h-10 w-10"
                        />
                        <Typography
                            as="a"
                            href="#"
                            className="text-xl font-semibold text-blue-gray-900 cursor-pointer"
                        >
                            DepEd Cebu Province Division
                        </Typography>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-4">
                        {navList}
                        <Button
                            variant="text"
                            size="md"
                            onClick={() => navigate("/login")}
                        >
                            <span>Log In</span>
                        </Button>
                        <Button variant="gradient" size="md">
                            <span>Sign In</span>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <IconButton
                        variant="text"
                        className="lg:hidden"
                        onClick={() => setOpenNav(!openNav)}
                    >
                        {openNav ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
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
                    <div className="flex flex-col gap-2 mt-4 lg:hidden">
                        <Button variant="text" size="sm" fullWidth>
                            <span>Log In</span>
                        </Button>
                        <Button variant="gradient" size="sm" fullWidth>
                            <span>Sign In</span>
                        </Button>
                    </div>
                </Collapse>
            </Navbar>
        </div>
    );
}
