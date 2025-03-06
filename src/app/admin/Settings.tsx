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

const Settings = () => {
    const [activeTab, setActiveTab] = useState("Profile");
    const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
    const [loading, setLoading] = useState(false);
    const { userInfo, updateUserInfo } = useUserInfo();

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
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            User Profile
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Basic User Information */}
                            {[
                                {
                                    label: "Username",
                                    field: "username",
                                    type: "text",
                                    value: userInfo?.username || "",
                                },
                                {
                                    label: "Email",
                                    field: "email",
                                    type: "email",
                                    value: userInfo?.email || "",
                                },
                                {
                                    label: "User Type",
                                    field: "userType",
                                    type: "text",
                                    value: userInfo?.userType || "",
                                },
                            ].map((field, index) => (
                                <div key={index} className="flex flex-col ">
                                    <label className="text-sm font-medium text-gray-600 mb-1">
                                        {field.label}
                                    </label>
                                    <input
                                        type={field.type}
                                        value={field.value}
                                        onChange={(e) =>
                                            handleInputChange(
                                                field.field,
                                                e.target.value
                                            )
                                        }
                                        className="h-10 w-full rounded-md border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400 transition-colors"
                                    />
                                </div>
                            ))}

                            {userInfo?.division && (
                                <>
                                    {[
                                        {
                                            label: "Division",
                                            field: "division.division",
                                            value: userInfo.division.division,
                                        },
                                        {
                                            label: "Title",
                                            field: "division.title",
                                            value: userInfo.division.title,
                                        },
                                        {
                                            label: "SDS Name",
                                            field: "division.sdsName",
                                            value: userInfo.division.sdsName,
                                        },
                                        {
                                            label: "ITO Name",
                                            field: "division.itoName",
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
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        field.field,
                                                        e.target.value
                                                    )
                                                }
                                                className="h-10 w-full rounded-md border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400 transition-colors"
                                            />
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* District Information */}
                            {userInfo?.district && (
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">
                                        District
                                    </label>
                                    <input
                                        type="text"
                                        value={userInfo.district.name}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "district.name",
                                                e.target.value
                                            )
                                        }
                                        className="h-10 w-full rounded-md border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400 transition-colors"
                                    />
                                </div>
                            )}

                            {/* School Information */}
                            {userInfo?.school && (
                                <>
                                    {[
                                        {
                                            label: "School Name",
                                            field: "school.name",
                                            value: userInfo.school.name,
                                        },
                                        {
                                            label: "Address",
                                            field: "school.address",
                                            value:
                                                userInfo.school.address || "",
                                        },
                                        {
                                            label: "School Head",
                                            field: "school.schoolHead",
                                            value:
                                                userInfo.school.schoolHead ||
                                                "",
                                        },
                                        {
                                            label: "Classification",
                                            field: "school.classification",
                                            value:
                                                userInfo.school
                                                    .classification || "",
                                        },
                                        {
                                            label: "Landline",
                                            field: "school.landline",
                                            value:
                                                userInfo.school.landline || "",
                                        },
                                        {
                                            label: "Designation",
                                            field: "school.designation",
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
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        field.field,
                                                        e.target.value
                                                    )
                                                }
                                                className="h-10 w-full rounded-md border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400 transition-colors"
                                            />
                                        </div>
                                    ))}

                                    {/* School Checkboxes */}
                                    {[
                                        {
                                            label: "Connectivity",
                                            field: "school.connectivity",
                                            value: userInfo.school.connectivity,
                                        },
                                        {
                                            label: "Smart",
                                            field: "school.smart",
                                            value: userInfo.school.smart,
                                        },
                                        {
                                            label: "Globe",
                                            field: "school.globe",
                                            value: userInfo.school.globe,
                                        },
                                        {
                                            label: "TV Access",
                                            field: "school.tv",
                                            value: userInfo.school.tv,
                                        },
                                        {
                                            label: "Local Grid Supply",
                                            field: "school.localGridSupply",
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
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        checkbox.field,
                                                        e.target.checked
                                                            ? "true"
                                                            : "false"
                                                    )
                                                }
                                                className="h-5 w-5 text-blue-600 focus:ring-blue-500 transition-colors"
                                            />
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </CardBody>
                </Card>
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
