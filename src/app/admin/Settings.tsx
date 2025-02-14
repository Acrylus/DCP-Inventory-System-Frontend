import React, { useState } from "react";
import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
} from "@material-tailwind/react";
import {
    Cog6ToothIcon,
    UserCircleIcon,
    Square3Stack3DIcon,
} from "@heroicons/react/24/solid";

const Settings = () => {
    // ✅ Use State to Track Active Tab
    const [activeTab, setActiveTab] = useState("Profile");

    const data = [
        {
            label: "Profile",
            value: "Profile",
            icon: UserCircleIcon,
            content: (
                <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-800">
                        General Settings
                    </h2>
                    <p className="text-sm text-gray-600 mt-2">
                        Configure your general settings such as preferences,
                        themes, and notifications.
                    </p>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Theme
                        </label>
                        <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-emerald-300">
                            <option>Light</option>
                            <option>Dark</option>
                        </select>
                    </div>
                </div>
            ),
        },
        {
            label: "Municipality",
            value: "Municipality",
            icon: Square3Stack3DIcon,
            content: (
                <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-800">
                        Account Settings
                    </h2>
                    <p className="text-sm text-gray-600 mt-2">
                        Manage your account details, change your password, and
                        update profile information.
                    </p>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-emerald-300"
                            placeholder="Enter your email"
                        />
                    </div>
                </div>
            ),
        },
        {
            label: "Password",
            value: "Password",
            icon: Cog6ToothIcon,
            content: (
                <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-800">
                        Security Settings
                    </h2>
                    <p className="text-sm text-gray-600 mt-2">
                        Enhance security by enabling two-factor authentication,
                        managing devices, and more.
                    </p>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Two-Factor Authentication
                        </label>
                        <button className="mt-2 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600">
                            Enable 2FA
                        </button>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <Tabs value={activeTab} onChange={(val: any) => setActiveTab(val)}>
                <TabsHeader
                    className="sticky top-0 z-10 bg-gray-100 shadow-md p-1 max-w-xlg mx-auto rounded-xl flex justify-center "
                    placeholder=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                >
                    {data.map(({ label, value, icon }) => (
                        <Tab
                            key={value}
                            value={value}
                            placeholder=""
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                        >
                            <div className="flex items-center gap-2 text-gray-800 w-full">
                                {/* ✅ Always Show Icon */}
                                {React.createElement(icon, {
                                    className: "w-5 h-5",
                                })}
                                {/* ✅ Hide Text on Mobile (sm:hidden), Show on Larger Screens */}
                                <span className="hidden sm:block">{label}</span>
                            </div>
                        </Tab>
                    ))}
                </TabsHeader>

                <TabsBody
                    className="p-4"
                    placeholder=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                >
                    {data.map(({ value, content }) => (
                        <TabPanel key={value} value={value}>
                            {content}
                        </TabPanel>
                    ))}
                </TabsBody>
            </Tabs>
        </div>
    );
};

export default Settings;
