import React, { useState, useEffect } from "react";
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
import { getMunicipalities } from "../../lib/municipality-api/getAllMunicipality";
import { useUserInfo } from "../../store/UserInfoStore";

interface Municipality {
    municipalityId: number;
    name: string;
    division: Division;
}

interface Division {
    divisionId: number;
    division: string;
    title: string;
    sdsName: string;
    sdsPosition: string;
    itoName: string;
    itoEmail: string;
}

interface UserInfo {
    userId: number;
    divisionId: number | null;
    districtId: number | null;
    schoolId: number | null;
    username: string;
    email: string;
    userType: string;
}

const Settings = () => {
    const [activeTab, setActiveTab] = useState("Profile");
    const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
    const [loading, setLoading] = useState(false);
    const { userInfo } = useUserInfo();

    useEffect(() => {
        fetchSchools();
    }, []);

    const fetchSchools = async () => {
        setLoading(true);
        try {
            const data = await getMunicipalities();
            setMunicipalities(data);
        } catch (error) {
            console.error("Error fetching schools:", error);
        } finally {
            setLoading(false);
        }
    };

    const data = [
        {
            label: "Profile",
            value: "Profile",
            icon: UserCircleIcon,
            content: (
                <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-800">
                        User Profile
                    </h2>
                    {userInfo ? (
                        <div className="mt-4">
                            <p className="text-sm text-gray-600">
                                <strong>Username:</strong>{" "}
                                {userInfo.username || "N/A"}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                                <strong>Email:</strong>{" "}
                                {userInfo.email || "N/A"}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                                <strong>User Type:</strong>{" "}
                                {userInfo.userType || "N/A"}
                            </p>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-600 mt-2">
                            No user information available.
                        </p>
                    )}

                    <h2 className="text-lg font-bold text-gray-800 mt-6">
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
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">
                        Municipalities List
                    </h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="w-full overflow-x-auto mt-4">
                            <table className="w-full text-left border border-separate border-slate-200 rounded-md">
                                <thead>
                                    <tr className="bg-slate-100 text-gray-700">
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            Municipality Name
                                        </th>
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            Division
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {municipalities.map((municipality) => (
                                        <tr
                                            key={municipality.municipalityId}
                                            className="h-12 px-6 text-sm font-medium border border-slate-300 hover:bg-emerald-100"
                                        >
                                            <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                {municipality.name}
                                            </td>
                                            <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                {municipality.division
                                                    ?.division || "N/A"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
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
