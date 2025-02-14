import depedLogo from "../../assets/images/deped logo 1.png";

function Navbar({ toggleSidebar }: { toggleSidebar: () => void }) {
    return (
        <nav className="top-0 left-0 w-full bg-gray-800 shadow-md z-50">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="flex flex-1 items-center justify-start gap-5 sm:items-center sm:justify-start">
                        <div className="flex items-center">
                            <button
                                type="button"
                                onClick={toggleSidebar} // Triggers Sidebar visibility
                                className="relative bg-gray-800 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-none focus:ring-inset"
                                aria-label="Toggle sidebar"
                            >
                                <svg
                                    className="size-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="white"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="flex shrink-0 h-8 w-8 items-center text-white border rounded-full">
                            <img
                                className="h-auto w-auto"
                                src={depedLogo}
                                alt="DepEd Logo"
                            />
                        </div>
                        {/* Desktop Menu */}
                        <div className="hidden sm:block">
                            <div className="flex space-x-4">
                                {[
                                    "DepEd Computerization Program Inventory System",
                                ].map((item, index) => (
                                    <a
                                        key={index}
                                        href="#"
                                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                                    >
                                        {item}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side - User Menu */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        {/* Notification Icon */}
                        <button
                            type="button"
                            className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
                        >
                            <span className="sr-only">View notifications</span>
                            <svg
                                className="size-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                                />
                            </svg>
                        </button>

                        {/* User Menu */}
                        <div className="relative ml-3">
                            <a
                                href="/profile"
                                className="relative inline-flex items-center justify-center w-10 h-10 text-lg text-white border-2 border-white rounded-full"
                            >
                                {" "}
                                CP{" "}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
