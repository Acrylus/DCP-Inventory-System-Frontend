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
import { getDivisionById } from "../../lib/division-api/getDivision";
import { getSchoolById } from "../../lib/school-api/getSchool";
import { getSchoolContact } from "../../lib/schoolcontact-api/getSchooContactBySchoolId";
import { getSchoolEnergy } from "../../lib/schoolenergy-api/getSchoolEnergyBySchoolId";
import { getSchoolNTC } from "../../lib/schoolntc-api/getSchoolNTCBySchoolId";

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

interface District {
    districtId: number;
    division: Division;
    name: string;
}

interface School {
    schoolRecordId: number;
    division: Division;
    district: District;
    classification: string | null;
    schoolId: string;
    name: string;
    address: string;
    previousStation: string | null;
}

interface SchoolContact {
    schoolContactId: number;
    schoolRecordId: number;
    landline: string;
    schoolHead: string;
    schoolHeadNumber: string;
    schoolHeadEmail: string;
    designation: string;
    propertyCustodian: string;
    propertyCustodianNumber: string;
    propertyCustodianEmail: string;
}

interface SchoolEnergy {
    schoolEnergyId: number;
    schoolRecordId: number;
    energized: boolean;
    remarks: string;
    localGridSupply: boolean;
}

interface SchoolNTC {
    schoolNtcId: number;
    schoolRecordId: number;
    internet: boolean;
    pldt: boolean;
    globe: boolean;
    am: boolean;
    fm: boolean;
    tv: boolean;
    cable: boolean;
    remark: string;
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
    const { userInfo } = useUserInfo();
    const { auth } = useAuth();

    const [division, setDivision] = useState<Division | null>(null);
    const [school, setSchool] = useState<School | null>(null);
    const [schoolContacts, setSchoolContacts] = useState<SchoolContact | null>(
        null
    );
    const [schoolEnergy, setSchoolEnergy] = useState<SchoolEnergy | null>(null);
    const [schoolNTC, setSchoolNTC] = useState<SchoolNTC | null>(null);

    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    type PasswordField = "oldPassword" | "newPassword" | "confirmNewPassword";

    const handleInputChange = (field: PasswordField, value: string) => {
        setPasswordData((prev) => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (userInfo?.userType === "division") {
                    const divisionData = await getDivisionById(
                        userInfo.referenceId
                    );
                    setDivision(divisionData);
                } else if (userInfo?.userType === "school") {
                    const schoolData = await getSchoolById(
                        userInfo.referenceId
                    );
                    setSchool(schoolData);

                    if (schoolData) {
                        const schoolContactsData = await getSchoolContact(
                            schoolData.schoolRecordId
                        );
                        setSchoolContacts(schoolContactsData);

                        const schoolEnergyData = await getSchoolEnergy(
                            schoolData.schoolRecordId
                        );
                        setSchoolEnergy(schoolEnergyData);

                        const schoolNTCData = await getSchoolNTC(
                            schoolData.schoolRecordId
                        );
                        setSchoolNTC(schoolNTCData);
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (userInfo?.referenceId) {
            fetchData();
        }
    }, [userInfo?.userType, userInfo?.referenceId]);

    useEffect(() => {
        fetchMunicipalities();
    }, []);

    const fetchMunicipalities = async () => {
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
        if (!auth?.token || !auth?.userID) {
            alert("User not authenticated. Please log in.");
            return;
        }

        const { oldPassword, newPassword, confirmNewPassword } = passwordData;

        // Basic Validation
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            alert("All fields are required.");
            return;
        }
        if (newPassword.length < 8) {
            alert("New password must be at least 8 characters long.");
            return;
        }
        if (newPassword !== confirmNewPassword) {
            alert("New passwords do not match.");
            return;
        }

        try {
            const payload: ChangePasswordPayload = {
                userId: auth.userID, // Dynamically set user ID
                oldPassword,
                newPassword,
            };

            await changePassword(payload, auth.token);
            alert("Password changed successfully!");
            setPasswordData({
                oldPassword: "",
                newPassword: "",
                confirmNewPassword: "",
            }); // Reset fields
        } catch (error: any) {
            alert(`Failed to change password: ${error.message}`);
        }
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
                        {division && (
                            <>
                                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-6">
                                    Division
                                </h2>
                                <div className="grid grid-cols-2 gap-6">
                                    {[
                                        {
                                            label: "Division",
                                            value: division.division,
                                        },
                                        {
                                            label: "Title",
                                            value: division.title,
                                        },
                                        {
                                            label: "SDS Name",
                                            value: division.sdsName,
                                        },
                                        {
                                            label: "ITO Name",
                                            value: division.itoName,
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

                        {/* School Section */}
                        {school && (
                            <>
                                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-6">
                                    School
                                </h2>
                                <div className="grid grid-cols-2 gap-6">
                                    {[
                                        {
                                            label: "School Name",
                                            value: school.name,
                                        },
                                        {
                                            label: "Address",
                                            value: school.address ?? "",
                                        },
                                        {
                                            label: "School Head",
                                            value:
                                                schoolContacts?.schoolHead ??
                                                "",
                                        },
                                        {
                                            label: "School Head Number",
                                            value:
                                                schoolContacts?.schoolHeadNumber ??
                                                "",
                                        },
                                        {
                                            label: "School Head Email",
                                            value:
                                                schoolContacts?.schoolHeadEmail ??
                                                "",
                                        },
                                        {
                                            label: "School ID",
                                            value: school.schoolId,
                                        },
                                        {
                                            label: "Division",
                                            value: school.division.division,
                                        },
                                        {
                                            label: "District",
                                            value: school.district.name,
                                        },
                                        {
                                            label: "Classification",
                                            value: school.classification ?? "",
                                        },
                                        {
                                            label: "Previous Station",
                                            value: school.previousStation ?? "",
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

                                {/* School Contacts Section */}
                                {schoolContacts && (
                                    <>
                                        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-6">
                                            School Contacts
                                        </h2>
                                        <div className="grid grid-cols-2 gap-6">
                                            {[
                                                {
                                                    label: "Landline",
                                                    value: schoolContacts.landline,
                                                },
                                                {
                                                    label: "Designation",
                                                    value: schoolContacts.designation,
                                                },
                                                {
                                                    label: "Property Custodian",
                                                    value: schoolContacts.propertyCustodian,
                                                },
                                                {
                                                    label: "Property Custodian Number",
                                                    value: schoolContacts.propertyCustodianNumber,
                                                },
                                                {
                                                    label: "Property Custodian Email",
                                                    value: schoolContacts.propertyCustodianEmail,
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
                                                        value={
                                                            field.value ?? ""
                                                        }
                                                        readOnly
                                                        className="h-10 w-full rounded-md border border-gray-300 px-4 text-gray-700 bg-gray-100"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {/* School Energy Section */}
                                {schoolEnergy && (
                                    <>
                                        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-6">
                                            School Energy
                                        </h2>
                                        <div className="grid grid-cols-2 gap-6">
                                            {[
                                                {
                                                    label: "Energized",
                                                    value: schoolEnergy.energized
                                                        ? "Yes"
                                                        : "No",
                                                },
                                                {
                                                    label: "Local Grid Supply",
                                                    value: schoolEnergy.localGridSupply
                                                        ? "Yes"
                                                        : "No",
                                                },
                                                {
                                                    label: "Remarks",
                                                    value:
                                                        schoolEnergy.remarks ??
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
                                    </>
                                )}

                                {/* School NTC Section */}
                                {schoolNTC && (
                                    <>
                                        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-6">
                                            School NTC
                                        </h2>
                                        <div className="grid grid-cols-2 gap-6">
                                            {[
                                                {
                                                    label: "PLDT",
                                                    value: schoolNTC.pldt,
                                                },
                                                {
                                                    label: "Globe",
                                                    value: schoolNTC.globe,
                                                },
                                                {
                                                    label: "TV Access",
                                                    value: schoolNTC.tv,
                                                },
                                                {
                                                    label: "Internet",
                                                    value: schoolNTC.internet,
                                                },
                                                {
                                                    label: "AM",
                                                    value: schoolNTC.am,
                                                },
                                                {
                                                    label: "FM",
                                                    value: schoolNTC.fm,
                                                },
                                                {
                                                    label: "Cable",
                                                    value: schoolNTC.cable,
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
                                        <div className="mt-4">
                                            <label className="text-sm font-medium text-gray-600">
                                                Remarks
                                            </label>
                                            <input
                                                type="text"
                                                value={schoolNTC.remark ?? ""}
                                                readOnly
                                                className="h-10 w-full rounded-md border border-gray-300 px-4 text-gray-700 bg-gray-100"
                                            />
                                        </div>
                                    </>
                                )}
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
                    <form className="space-y-4" onSubmit={handleChangePassword}>
                        {[
                            {
                                label: "Current Password",
                                field: "oldPassword",
                                placeholder: "Enter current password",
                            },
                            {
                                label: "New Password",
                                field: "newPassword",
                                placeholder: "Enter new password",
                            },
                            {
                                label: "Confirm New Password",
                                field: "confirmNewPassword",
                                placeholder: "Confirm new password",
                            },
                        ].map(({ label, field, placeholder }) => (
                            <div key={field} className="flex flex-col">
                                <label
                                    htmlFor={field}
                                    className="text-sm font-medium text-gray-600 mb-1"
                                >
                                    {label}
                                </label>
                                <input
                                    id={field}
                                    type="password"
                                    placeholder={placeholder}
                                    className="h-10 w-full rounded-md border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                                    onChange={(e) =>
                                        handleInputChange(
                                            field as
                                                | "oldPassword"
                                                | "newPassword"
                                                | "confirmNewPassword",
                                            e.target.value
                                        )
                                    }
                                    aria-label={label}
                                />
                            </div>
                        ))}

                        {/* Change Password Button */}
                        <button
                            type="submit"
                            className="mt-4 w-full h-10 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Change Password
                        </button>
                    </form>
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
