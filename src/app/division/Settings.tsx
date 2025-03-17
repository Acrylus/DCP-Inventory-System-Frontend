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
import { Card, CardBody } from "@material-tailwind/react";
import { changePassword } from "../../lib/user-api/changePassword";
import { useAuth } from "../../store/AuthStore";

interface Municipality {
    municipalityId: number;
    name: string;
    division: Division;
}

interface School {
    schoolRecordId: number;
    name: string;
    division: Division;
    district: District;
    classification?: string;
    schoolId?: string;
    address?: string;
    landline?: string;
    schoolHead?: string;
    schoolHeadNumber?: string;
    schoolHeadEmail?: string;
    propertyCustodian?: string;
    propertyCustodianNumber?: string;
    propertyCustodianEmail?: string;
    energized?: boolean;
    energizedRemarks?: boolean;
    localGridSupply?: boolean;
    connectivity?: boolean;
    smart?: boolean;
    globe?: boolean;
    digitalNetwork?: boolean;
    am?: boolean;
    fm?: boolean;
    tv?: boolean;
    cable?: boolean;
    ntcRemark?: string;
    designation?: string;
    previousStation?: string;
    coordinators?: any[];
    schoolBatchList?: any[];
}

interface District {
    districtId: number;
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

interface User {
    userId: number;
    division: Division | null;
    district: District | null;
    school: School | null;
    username: string;
    email: string;
    userType: string;
}

export interface ChangePasswordPayload {
    userId: number;
    oldPassword: string;
    newPassword: string;
}

const Settings = () => {
    const [activeTab, setActiveTab] = useState("Profile");
    const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
    const [loading, setLoading] = useState(false);
    const { userInfo, updateUserInfo } = useUserInfo();
    const { auth } = useAuth();

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

    const handleChangePassword = async () => {
        if (!auth.token) {
            alert("User not authenticated. Please log in.");
            return;
        }

        try {
            const payload: ChangePasswordPayload = {
                userId: 1,
                oldPassword: "@Password123",
                newPassword: "ZairenGwapa@123",
            };
            await changePassword(payload, auth.token);
            alert("Password changed successfully!");
        } catch (error: any) {
            alert(`Failed to change password: ${error.message}`);
        }
    };

    const handleInputChange = (
        field: keyof User | string,
        value: string | boolean
    ) => {
        if (!userInfo) return;

        // Clone the userInfo object to avoid direct state mutation
        const updatedUserInfo = { ...userInfo };

        // Check if the field is a string and supports nested field updates
        if (typeof field === "string") {
            // Handle top-level fields directly
            if (field in updatedUserInfo) {
                (updatedUserInfo as any)[field] = value;
            }
            // Handle nested fields safely for Division
            else if (
                field.startsWith("division.") &&
                updatedUserInfo.division
            ) {
                const subField = field.replace(
                    "division.",
                    ""
                ) as keyof Division;
                updatedUserInfo.division = {
                    ...updatedUserInfo.division,
                    [subField]: value,
                };
            }
            // Handle nested fields safely for District
            else if (
                field.startsWith("district.") &&
                updatedUserInfo.district
            ) {
                const subField = field.replace(
                    "district.",
                    ""
                ) as keyof District;
                updatedUserInfo.district = {
                    ...updatedUserInfo.district,
                    [subField]: value,
                };
            }
            // Handle nested fields safely for School
            else if (field.startsWith("school.") && updatedUserInfo.school) {
                const subField = field.replace("school.", "") as keyof School;
                updatedUserInfo.school = {
                    ...updatedUserInfo.school,
                    [subField]: value,
                };
            }
        }

        updateUserInfo(updatedUserInfo);
    };

    const data = [
        {
            label: "Profile",
            value: "Profile",
            icon: UserCircleIcon,
            content: (
                <Card
                    shadow={true}
                    className="w-full max-w-6xl bg-white rounded-xl shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg"
                    placeholder=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                >
                    <CardBody
                        className="p-6"
                        placeholder=""
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                    >
                        {/* User Profile Section */}
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            User Profile
                        </h2>
                        <div className="grid grid-cols-2 gap-6">
                            {[
                                {
                                    label: "Username",
                                    value: userInfo?.username || "",
                                },
                                {
                                    label: "Email",
                                    value: userInfo?.email || "",
                                },
                            ].map((field, index) => (
                                <div key={index} className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">
                                        {field.label}
                                    </label>
                                    <input
                                        type="text"
                                        value={field.value}
                                        readOnly
                                        className="h-10 w-full rounded-md border border-gray-300 px-4 text-gray-700 bg-gray-100"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Division Section */}
                        {userInfo?.division && (
                            <>
                                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-6">
                                    Division
                                </h2>
                                <div className="grid grid-cols-2 gap-6">
                                    {[
                                        {
                                            label: "Division",
                                            value: userInfo.division.division,
                                        },
                                        {
                                            label: "Title",
                                            value: userInfo.division.title,
                                        },
                                        {
                                            label: "SDS Name",
                                            value: userInfo.division.sdsName,
                                        },
                                        {
                                            label: "ITO Name",
                                            value: userInfo.division.itoName,
                                        },
                                    ].map((field, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-col"
                                        >
                                            <label className="text-sm font-medium text-gray-600 mb-1">
                                                {field.label}
                                            </label>
                                            <input
                                                type="text"
                                                value={field.value}
                                                readOnly
                                                className="h-10 w-full rounded-md border border-gray-300 px-4 text-gray-700 bg-gray-100"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* District Section */}
                        {userInfo?.district && (
                            <>
                                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-6">
                                    District
                                </h2>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="flex flex-col">
                                        <label className="text-sm font-medium text-gray-600 mb-1">
                                            District
                                        </label>
                                        <input
                                            type="text"
                                            value={userInfo.district.name}
                                            readOnly
                                            className="h-10 w-full rounded-md border border-gray-300 px-4 text-gray-700 bg-gray-100"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* School Section */}
                        {userInfo?.school && (
                            <>
                                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-6">
                                    School
                                </h2>
                                <div className="grid grid-cols-2 gap-6">
                                    {[
                                        {
                                            label: "School Name",
                                            value: userInfo.school.name,
                                        },
                                        {
                                            label: "Address",
                                            value:
                                                userInfo.school.address || "",
                                        },
                                        {
                                            label: "School Head",
                                            value:
                                                userInfo.school.schoolHead ||
                                                "",
                                        },
                                        {
                                            label: "Classification",
                                            value:
                                                userInfo.school
                                                    .classification || "",
                                        },
                                        {
                                            label: "Landline",
                                            value:
                                                userInfo.school.landline || "",
                                        },
                                        {
                                            label: "Designation",
                                            value:
                                                userInfo.school.designation ||
                                                "",
                                        },
                                    ].map((field, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-col"
                                        >
                                            <label className="text-sm font-medium text-gray-600 mb-1">
                                                {field.label}
                                            </label>
                                            <input
                                                type="text"
                                                value={field.value}
                                                readOnly
                                                className="h-10 w-full rounded-md border border-gray-300 px-4 text-gray-700 bg-gray-100"
                                            />
                                        </div>
                                    ))}
                                </div>
                                {/* School Checkboxes */}
                                <div className="grid grid-cols-2 gap-6 mt-4">
                                    {[
                                        {
                                            label: "Connectivity",
                                            value: userInfo.school.connectivity,
                                        },
                                        {
                                            label: "Smart",
                                            value: userInfo.school.smart,
                                        },
                                        {
                                            label: "Globe",
                                            value: userInfo.school.globe,
                                        },
                                        {
                                            label: "TV Access",
                                            value: userInfo.school.tv,
                                        },
                                        {
                                            label: "Local Grid Supply",
                                            value: userInfo.school
                                                .localGridSupply,
                                        },
                                    ].map((checkbox, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center"
                                        >
                                            <label className="text-sm font-medium text-gray-600 mr-2">
                                                {checkbox.label}:
                                            </label>
                                            <input
                                                type="checkbox"
                                                checked={Boolean(
                                                    checkbox.value
                                                )}
                                                readOnly
                                                className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </CardBody>
                </Card>
            ),
        },
        {
            label: "Municipality",
            value: "Municipality",
            icon: Square3Stack3DIcon,
            content: (
                <Card
                    className="w-full max-w-4xl bg-white rounded-xl shadow-md overflow-hidden"
                    placeholder=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                >
                    <CardBody
                        className="p-6"
                        placeholder=""
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                    >
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">
                            Municipalities List
                        </h2>
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <div className="w-full max-h-96 overflow-y-auto">
                                <table className="w-full text-left border border-separate border-slate-200 rounded-md">
                                    <thead>
                                        <tr className="bg-slate-100 text-gray-700">
                                            <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                ID
                                            </th>
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
                                                key={
                                                    municipality.municipalityId
                                                }
                                                className="h-12 px-6 text-sm font-medium border border-slate-300 hover:bg-emerald-100"
                                            >
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {
                                                        municipality.municipalityId
                                                    }
                                                </td>
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
                    </CardBody>
                </Card>
            ),
        },
        {
            label: "Password",
            value: "Password",
            icon: Cog6ToothIcon,
            content: (
                <div className="p-4 bg-gray-50 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Change Password
                    </h3>
                    <div className="space-y-4">
                        {/* Current Password Input */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600 mb-1">
                                Current Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter current password"
                                className="h-10 w-full rounded-md border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                                onChange={(e) =>
                                    handleInputChange(
                                        "oldPassword",
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        {/* New Password Input */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600 mb-1">
                                New Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter new password"
                                className="h-10 w-full rounded-md border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                                onChange={(e) =>
                                    handleInputChange(
                                        "newPassword",
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        {/* Confirm New Password Input */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600 mb-1">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                className="h-10 w-full rounded-md border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                                onChange={(e) =>
                                    handleInputChange(
                                        "confirmNewPassword",
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        {/* Change Password Button */}
                        <button
                            onClick={handleChangePassword}
                            className="mt-4 w-full h-10 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Change Password
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
